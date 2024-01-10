from pathlib import Path

import click
import polars as pl


@click.command()
@click.argument("csv", type=click.Path(exists=True, path_type=Path))
def main(csv: Path):
    """Read a CSV file and print it as a JSON string."""
    pl.read_csv(csv)


if __name__ == "__main__":
    main()
