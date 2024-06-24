import logging
import os
import sys
from enum import Enum
from functools import lru_cache
from typing import Annotated, Any
from urllib.parse import urlparse

import httpx
import polars as pl
import typer
from pydantic import (
    BaseModel,
    Field,
    HttpUrl,
    SerializationInfo,
    SerializerFunctionWrapHandler,
    field_validator,
    model_serializer,
)
from rich.logging import RichHandler

log = logging.getLogger(__name__)
log.addHandler(RichHandler())


class ValueType(str, Enum):
    text = "text"
    number = "number"
    boolean = "boolean"
    resource = "resource"


class OutputType(str, Enum):
    dataset = "dataset"
    values = "values"
    resources = "resources"


class Resource(BaseModel):
    id: int | None = None
    title: str = Field(serialization_alias="link_title")
    description: str
    link: HttpUrl = Field(serialization_alias="link_url")
    country_id: str = Field(exclude=True)

    @field_validator("link", mode="wrap")
    @classmethod
    def validate_link(cls, v: str, handler) -> str:
        """Adds https scheme to link if not present and runs normal validation"""
        url = urlparse(v)
        if not url.scheme:
            log.warning("Link URL does not contain any scheme, adding https scheme.")
            v = url._replace(scheme="https").geturl()
        return handler(v)


class Resources(BaseModel):
    resource: list[Resource]

    @model_serializer(mode="wrap")
    def ser_model(
        self, handler: SerializerFunctionWrapHandler, info: SerializationInfo
    ) -> list[int] | Any:
        if info.context.get("use_id"):
            return [r.id for r in self.resource]
        else:
            return handler(self)


class Category(BaseModel):
    name: str


class Dataset(BaseModel):
    id: int | None = None
    name: str
    category: Category | None = None
    description: str
    unit: str | None = None
    value_type: ValueType

    @model_serializer(mode="wrap")
    def ser_model(
        self, handler: SerializerFunctionWrapHandler, info: SerializationInfo
    ) -> int | dict[str, Any]:
        if info.context.get("use_id"):
            return self.id
        else:
            return handler(self)


class DatasetValue(BaseModel):
    dataset: Dataset
    country_id: str | int = Field(serialization_alias="country")
    value_text: str | None = None
    value_number: float | None = None
    value_boolean: bool | None = None
    resources: Resources | None = None


class DatasetValues(BaseModel):
    dataset_values: list[DatasetValue]

    @field_validator("dataset_values")
    @classmethod
    def one_value_per_country(cls, v: list[DatasetValue]) -> list[DatasetValue]:
        country_ids = set()
        for value in v:
            if value.country_id in country_ids:
                raise ValueError(f"Duplicate country_id: {value.country_id}")
            country_ids.add(value.country_id)
        return v


@lru_cache
def query_strapi_ids(plural_api_id: str, field_name: str) -> dict[str, int]:
    """Get Strapi IDs for model"""
    res = httpx.get(
        f"https://staging.ccsa.dev-vizzuality.com/cms/api/{plural_api_id}",
        params={"pagination[pageSize]": 1000},
        headers={"Authorization": f"bearer {os.getenv('STRAPI_TOKEN')}"},
    )
    res.raise_for_status()
    ids = {e["attributes"][field_name]: e["id"] for e in res.json()["data"]}
    return ids


def get_dataset(
    file: str,
    value_type: ValueType,
    use_id: bool = False,
) -> Dataset:
    df = pl.read_excel(
        file,
        sheet_name="Dataset Info",
        read_options={"has_header": False, "new_columns": ["field", "value"]},
    )
    data = {
        "name": df.select(pl.col("value").filter(pl.col("field") == "Name")).item(),
        "description": df.select(pl.col("value").filter(pl.col("field") == "Description")).item(),
        "value_type": value_type,
    }
    if use_id:
        _id = query_strapi_ids("datasets", "name").get(data["name"])
        if _id is None:
            log.error(f"Dataset \"{data['name']}\" not found in strapi")
        data["id"] = _id
    return Dataset(**data)


def get_dataset_value(file: str, value_type: ValueType, use_id: bool = False) -> DatasetValues:
    df = pl.read_excel(
        file,
        sheet_name="Data",
    )
    if value_type == ValueType.resource:
        df = df.with_columns(pl.col("name").str.strip_chars())
    df = df.group_by("ISO3").agg(pl.all())
    data_values = []
    for row in df.iter_rows(named=True):
        resources = []
        value = None
        for name, link, description in zip(row["name"], row["link"], row["descrition"]):
            if value_type.value == ValueType.resource:
                resource = Resource(
                    title=name, link=link, description=description, country_id=row["ISO3"]
                )
                if use_id:
                    resource.id = query_strapi_ids("resources", "link_title").get(name)
                resources.append(resource)
            elif value_type == ValueType.number:
                value = int(row["name"][-1])
            elif value_type == ValueType.text:
                value = row["name"][-1]

        country = row["ISO3"]
        if use_id:
            country = query_strapi_ids("countries", "iso3")[country]

        data_values.append(
            DatasetValue(
                dataset=get_dataset(file, value_type, use_id),
                resources=Resources(resources=resources)
                if value_type.value == ValueType.resource
                else None,
                country_id=country,
                value_number=value if value_type == ValueType.number else None,
                value_text=value if value_type == ValueType.text else None,
            )
        )
    return DatasetValues(dataset_values=data_values)


def main(
    input: Annotated[str, typer.Argument()],
    output: Annotated[str, typer.Argument()],
    res_type: Annotated[OutputType, typer.Option("--res-type", "-t")],
    use_id: Annotated[
        bool,
        typer.Option(is_flag=True, help="Use db ids from strapi instead of full model"),
    ] = False,
    value_type: Annotated[ValueType, typer.Option("--value-type", "-v")] = ValueType.resource,
):
    match res_type:
        case "dataset":
            data = get_dataset(input, value_type, use_id)
            exclude = {}
        case "values":
            data = get_dataset_value(input, value_type, use_id)
            exclude = {}
        case "resources":
            all_data = get_dataset_value(input, value_type, use_id)
            resources_unique = []
            seen = set()
            # deduplicate the resources (based on name) to create the strapi entries
            # for Resource. Then DatasetValues can be related with n existing resources
            # via id. (the triple loop is because of the nesting in the models)
            for value in all_data.dataset_values:
                for resources in value.resources:
                    for resource in resources[1]:
                        if resource.title in seen:
                            continue
                        else:
                            resources_unique.append(resource)
                            seen.add(resource.title)
            data = Resources(resource=resources_unique)
            exclude = {"resource": {"__all__": {"id"}}}
        case _:
            raise ValueError(f"Invalid output: {res_type}")

    with open(output, "w") as f:
        f = sys.stdout if output == "-" else f
        f.write(
            data.model_dump_json(
                context={"use_id": use_id}, indent=4, by_alias=True, exclude=exclude
            )
        )


if __name__ == "__main__":
    typer.run(main)
