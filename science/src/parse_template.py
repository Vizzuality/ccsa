import json
import os
from pathlib import Path
from typing import Annotated

import dotenv
import httpx
import polars as pl
import typer

NODATA_COLOR = "#999999"

COLOR_STYLE_YES_NO = ["match", ["get", "value"], "yes", "#43a2ca", NODATA_COLOR]

LEGEND_YES_NO = {
    "type": "basic",
    "items": [
        {"color": "#43a2ca", "label": "yes", "value": "yes"},
        {"color": NODATA_COLOR, "label": "no", "value": "no"},
    ],
}

COLOR_STYLE_LOW_HIGH = [
    "match",
    ["get", "value"],
    "Low",
    "#ffeda0",
    "Medium",
    "#feb24c",
    "High",
    "#f03b20",
    NODATA_COLOR,
]

LEGEND_LOW_HIGH = {
    "type": "basic",
    "items": [
        {"color": "#ffeda0", "label": "Low", "value": "Low"},
        {"color": "#feb24c", "label": "Medium", "value": "Medium"},
        {"color": "#f03b20", "label": "High", "value": "High"},
        {"color": NODATA_COLOR, "label": "No Data", "value": "No Data"},
    ],
}

GRADIENT_MIN_COLOR, GRADIENT_MAX_COLOR = "#deebf7", "#3182bd"


def continuous_style(min_val, max_val) -> list:
    """Mapbox style for continuous data"""
    return [
        "case",
        ["all", ["has", "value"], ["==", ["typeof", ["get", "value"]], "number"]],
        [
            "interpolate",
            ["linear"],
            ["get", "value"],
            min_val,
            GRADIENT_MIN_COLOR,
            max_val,
            GRADIENT_MAX_COLOR,
        ],
        "#999999",
    ]


def continuous_legend(min_val, max_val) -> dict:
    """Legend style for continuous data"""
    legend = {
        "type": "gradient",
        "items": [
            {"color": GRADIENT_MIN_COLOR, "label": round(min_val, 2), "value": round(min_val, 2)},
            {"color": GRADIENT_MAX_COLOR, "label": round(max_val, 2), "value": round(max_val, 2)},
        ],
    }
    return legend


def layer_entry_data(name: str, color_style, legend_config, dataset_id) -> dict:
    """build all the json for layer"""
    data = {
        "name": name,
        "type": "countries",
        "config": {
            "styles": [
                {
                    "id": name.lower().replace(" ", "-"),
                    "type": "fill",
                    "paint": {"fill-color": color_style, "fill-opacity": "@@#params.opacity"},
                    "layout": {
                        "visibility": {"v": "@@#params.visibility", "@@function": "setVisibility"}
                    },
                }
            ]
        },
        "params_config": [{"key": "opacity", "default": 1}, {"key": "visibility", "default": True}],
        "legend_config": legend_config,
        "interaction_config": {},
        "dataset": dataset_id,
    }
    return data


def get_ids(plural_api_id: str) -> dict[str, int]:
    """Get Strapi IDs for model"""
    res = httpx.get(
        f"https://staging.ccsa.dev-vizzuality.com/cms/api/{plural_api_id}",
        params={"pagination[pageSize]": 1000},
        headers={"Authorization": f"bearer {os.getenv('STRAPI_TOKEN')}"},
    )
    res.raise_for_status()
    ids = {e["attributes"]["name"]: e["id"] for e in res.json()["data"]}
    return ids


def make_datum(data: pl.DataFrame, dataset_id: str):
    """Extract datum dicts from data sheet"""
    return (
        data.select(pl.col("Abbreviation").alias("iso3"), pl.col(dataset_id).alias("value"))
        .to_struct(name=dataset_id)
        .to_list()
    )


def main(file_: Annotated[Path, typer.Argument()], out_path: Annotated[Path, typer.Argument()]):
    """Process a excel file  from temlate to make json importable to CCSA strapi CSM dataset"""

    out_path.mkdir(parents=True, exist_ok=True)

    categories = pl.read_excel(file_, sheet_name="categories")
    categories.select(pl.col("Categories").alias("name")).write_json(
        out_path / "categories.json", row_oriented=True, pretty=True
    )

    category_ids = get_ids("categories")
    datasets_info = pl.read_excel(file_, sheet_name="datasets info").filter(
        ~pl.all_horizontal(pl.all().is_null())
    )
    data = pl.read_excel(file_, sheet_name="data").filter(~pl.all_horizontal(pl.all().is_null()))

    types = datasets_info.group_by("Type").agg(pl.col("ID")).transpose().to_dict(as_series=False)
    types = {e[0][0]: e[1] for e in types.values()}

    # removes annoying "-"
    data = data.with_columns(
        pl.when(pl.col(pl.Utf8) == "-").then(None).otherwise(pl.col(pl.Utf8)).name.keep()
    )
    data = data.with_columns(
        pl.col(types["category"]).cast(pl.Utf8), pl.col(types["continuous"]).cast(pl.Float32)
    )
    datasets = datasets_info.select(
        pl.col("name"),
        pl.col("description"),
        pl.col("Category").map_dict(category_ids).alias("category"),
        pl.col("Unit").alias("unit"),
        datum=pl.col("ID"),
    ).to_dicts()

    for ds in datasets:
        ds["datum"] = make_datum(data, ds["datum"])

    with open(out_path / "datasets.json", "w") as f:
        json.dump(datasets, f)

    dataset_ids = get_ids("datasets")
    print(dataset_ids)

    entries = []
    for row in datasets_info.iter_rows(named=True):
        if row["Type"] == "continuous":
            min_val = data.select(row["ID"]).to_series().min()
            max_val = data.select(row["ID"]).to_series().max()
            entries.append(
                layer_entry_data(
                    row["name"],
                    continuous_style(min_val, max_val),
                    continuous_legend(min_val, max_val),
                    dataset_ids[row["name"]],
                )
            )
        else:
            # find out if yes no or low high
            is_yes_no = "yes" in data.select(row["ID"]).unique().to_series().to_list()
            entries.append(
                layer_entry_data(
                    row["name"],
                    COLOR_STYLE_YES_NO if is_yes_no else COLOR_STYLE_LOW_HIGH,
                    LEGEND_YES_NO if is_yes_no else LEGEND_LOW_HIGH,
                    dataset_ids[row["name"]],
                )
            )

    with open(out_path / "layers.json", "w") as f:
        json.dump(entries, f)


if __name__ == "__main__":
    # Note: resource category and value type is resource
    dotenv.load_dotenv()
    typer.run(main)
