export function GET_CATEGORIES_OPTIONS(search?: string) {
  return {
    "pagination[pageSize]": 100,
    populate: "datasets",
    sort: "name:asc",
    filters: {
      ...(!!search && {
        datasets: {
          name: {
            $containsi: search,
          },
        },
      }),
    },
  };
}

export function GET_DATASETS_OPTIONS(search?: string, categoryId?: number) {
  return {
    "pagination[pageSize]": 100,
    filters: {
      category: categoryId,
      ...(!!search && {
        name: {
          $containsi: search,
        },
      }),
    },
    populate: "*",
    sort: "name:asc",
  };
}
