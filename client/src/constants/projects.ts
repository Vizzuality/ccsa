export const GET_PROJECTS_OPTIONS = (projectSearch: string | null) => ({
  "pagination[pageSize]": 200,
  populate: {
    pillar: {
      fields: ["id", "name"],
    },
    sdgs: {
      fields: ["id", "name"],
    },
    countries: {
      fields: ["id", "name", "iso3"],
    },
  },
  sort: "name:asc",
  filters: {
    ...(!!projectSearch && {
      name: {
        $containsi: projectSearch,
      },
    }),
  },
});
