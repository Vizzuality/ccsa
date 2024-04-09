from enum import Enum
from functools import lru_cache

import click
import polars as pl
from pydantic import BaseModel, HttpUrl


class ValueType(str, Enum):
    text = "text"
    number = "number"
    boolean = "boolean"
    resource = "resource"


class Resource(BaseModel):
    title: str
    description: str
    link: HttpUrl


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


@lru_cache
def country_to_iso3(file: str) -> dict[str, str]:
    """Get the ISO3 code of the country from the file."""
    df = pl.read_excel(
        file,
        sheet_name="_config",
        read_csv_options={"has_header": False, "new_columns": ["field", "value"]},
    )
    return {row["country name"]: row["iso3"] for row in df.iter_rows()}


def get_dataset(file: str) -> Dataset:
    df = pl.read_excel(
        file,
        sheet_name="Dataset Info",
        read_csv_options={"has_header": False, "new_columns": ["field", "value"]},
    )
    data = {
        "name": df.select(pl.col("value").filter(pl.col("field") == "Name")).item(),
        "description": df.select(pl.col("value").filter(pl.col("field") == "Description")).item(),
        "value_type": ValueType.resource,
    }
    return Dataset(**data)


def get_dataset_value(file: str) -> DatasetValue:
    df = pl.read_excel(
        file,
        sheet_name="Data",
    )
    df = df.select(
        pl.col("ISO3"),
    )

    return DatasetValue(**df)


def get_resource(file: str) -> Resource:
    df = pl.read_excel(
        file,
    )
    data = {
        "title": df.select(pl.col("value").filter(pl.col("field") == "Title")).item(),
        "description": df.select(pl.col("value").filter(pl.col("field") == "Description")).item(),
        "link": df.select(pl.col("value").filter(pl.col("field") == "Link")).item(),
    }
    return Resource(**data)


@click.command()
@click.argument("input", type=click.Path(exists=True))
@click.option("--output", "-o", type=click.Choice(["dataset", "value", "resource"]))
def main(input: str, output: str):
    match output:
        case "dataset":
            data = get_dataset(input)
            print(data.model_dump_json(indent=4))
        case "value":
            data = get_dataset_value(input)
            print(data.model_dump_json(indent=4))
        case "resource":
            data = get_resource(input)
            print(data.model_dump_json(indent=4))
        case _:
            raise ValueError(f"Invalid output: {output}")


if __name__ == "__main__":
    raise SystemExit(main())
