from enum import Enum
from functools import lru_cache, partial

import click
import polars as pl
from pydantic import BaseModel, HttpUrl, field_validator


class ValueType(str, Enum):
    text = "text"
    number = "number"
    boolean = "boolean"
    resource = "resource"


class Resource(BaseModel):
    title: str
    description: str
    link: HttpUrl
    country_id: str


class Category(BaseModel):
    name: str


class Dataset(BaseModel):
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


def get_dataset(file: str) -> Dataset:
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
    return Dataset(**data)


def get_dataset_value(file: str) -> DatasetValues:
    df = pl.read_excel(
        file,
        sheet_name="Data",
    )
    df = df.group_by("ISO3").agg(pl.all())
    data_values = []
    for row in df.iter_rows(named=True):
        resources = []
        for name, link, description in zip(row["name"], row["link"], row["descrition"]):
            resources.append(
                Resource(
                    title=name,
                    link=link,
                    description=description,
                    country_id=row["ISO3"],
                )
            )
        data_values.append(
            DatasetValue(dataset= get_dataset(file),resources=resources, country_id=row["ISO3"])
        )
    return DatasetValues(dataset_values=data_values)


@click.command()
@click.argument("input", type=click.Path(exists=True))
@click.option("--output", "-o", type=click.Choice(["dataset", "values", "resource"]))
def main(input: str, output: str):
    match output:
        case "dataset":
            data = get_dataset(input)
            print(data.model_dump_json(indent=4))
        case "values":
            data = get_dataset_value(input)
            print(data.model_dump_json(indent=4))
        case "resource":
            data = get_resource(input)
            print(data.model_dump_json(indent=4))
        case _:
            raise ValueError(f"Invalid output: {output}")


if __name__ == "__main__":
    raise SystemExit(main())
