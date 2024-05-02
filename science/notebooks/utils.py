import os

import httpx


def get_ids(plural_api_id: str) -> dict[str, int]:
    """Get Strapi IDs for model"""
    res = httpx.get(
        # f"https://staging.ccsa.dev-vizzuality.com/cms/api/{plural_api_id}",
        f"https://staging.ccsa.dev-vizzuality.com/cms/api/{plural_api_id}",
        params={"pagination[pageSize]": 1000},
        headers={"Authorization": f"bearer {os.getenv('STRAPI_TOKEN')}"},
    )
    res.raise_for_status()
    ids = {e["attributes"]["name"]: e["id"] for e in res.json()["data"]}
    return ids
