import logging
import os
from enum import Enum
from functools import lru_cache
from typing import Annotated

import httpx
import polars as pl
import typer
from pydantic import BaseModel, Field, HttpUrl, field_validator
from rich.logging import RichHandler

log = logging.getLogger(__name__)
log.addHandler(RichHandler())


class ValueType(str, Enum):
    text = "text"
    number = "number"
    boolean = "boolean"
    resource = "resource"


class Output(str, Enum):
    dataset = "dataset"
    values = "values"
    resources = "resources"


class Resource(BaseModel):
    id: int | None = None
    title: str = Field(serialization_alias="link_title")
    description: str
    link: HttpUrl = Field(serialization_alias="link_url")
    country_id: str = Field(exclude=True)


class Resources(BaseModel):
    resource: list[Resource]


class Category(BaseModel):
    name: str


class Dataset(BaseModel):
    id: int | None = None
    name: str
    category: Category | None = None
    description: str
    unit: str | None = None
    value_type: ValueType


class DatasetValue(BaseModel):
    dataset: Dataset
    country_id: str
    value_text: str | None = None
    value_number: float | None = None
    value_boolean: bool | None = None
    resources: list[Resource] | None = None


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
def get_country_to_iso3(file: str) -> dict[str, str]:
    """Get the ISO3 code of the country from the file."""
    df = pl.read_excel(
        file,
        sheet_name="_config",
        read_options={"has_header": False, "new_columns": ["field", "value"]},
    )
    return {row["country name"]: row["iso3"] for row in df.iter_rows()}


def country_to_iso3(file: str, country: str) -> str:
    return get_country_to_iso3(file)[country]


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


def get_dataset(file: str, use_id: bool = False) -> Dataset:
    df = pl.read_excel(
        file,
        sheet_name="Dataset Info",
        read_options={"has_header": False, "new_columns": ["field", "value"]},
    )
    data = {
        "name": df.select(pl.col("value").filter(pl.col("field") == "Name")).item(),
        "description": df.select(pl.col("value").filter(pl.col("field") == "Description")).item(),
        "value_type": ValueType.resource,
    }
    if use_id:
        _id = query_strapi_ids("datasets", "name").get(data["name"])
        if _id is None:
            log.error(f"Dataset \"{data['name']}\" not found in strapi")
        data["id"] = query_strapi_ids("datasets", "name").get(data["name"])
    return Dataset(**data)


def get_dataset_value(file: str, use_id: bool = False) -> DatasetValues:
    df = pl.read_excel(
        file,
        sheet_name="Data",
    )
    df = df.group_by("ISO3").agg(pl.all())
    data_values = []
    for row in df.iter_rows(named=True):
        resources = []
        for name, link, description in zip(row["name"], row["link"], row["descrition"]):
            resource = Resource(
                title=name, link=link, description=description, country_id=row["ISO3"]
            )
            if use_id:
                resource.id = query_strapi_ids("resources", "link_title").get(name)
            resources.append(resource)
        data_values.append(
            DatasetValue(
                dataset=get_dataset(file, use_id), resources=resources, country_id=row["ISO3"]
            )
        )
    return DatasetValues(dataset_values=data_values)


def main(
    input: Annotated[str, typer.Argument(...)],
    output: Annotated[Output, typer.Option("--output", "-o")],
    use_id: Annotated[
        bool,
        typer.Option(is_flag=True, help="Use db ids from strapi instead of full model"),
    ] = False,
):
    match output:
        case "dataset":
            data = get_dataset(input, use_id)
            print(data.model_dump_json(indent=4))
        case "values":
            data = get_dataset_value(input, use_id)
            if use_id:
                print(
                    data.model_dump_json(
                        indent=4,
                        include={
                            "dataset_values": {
                                "__all__": {"country_id", "resource", "dataset"},
                                "resource": {"__all__": {"id"}},
                                "dataset": {"__all__": {"id"}},
                            }
                        },
                    )
                )
            else:
                print(data.model_dump_json(indent=4))
        case "resources":
            data = get_dataset_value(input)
            resources = []
            for value in data.dataset_values:
                for resource in value.resources:
                    resources.append(resource)
            data = Resources(resource=resources)
            print(data.model_dump_json(indent=4, by_alias=True))
        case _:
            raise ValueError(f"Invalid output: {output}")


if __name__ == "__main__":
    typer.run(main)
