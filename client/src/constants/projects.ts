export const GET_PROJECTS_OPTIONS = (
  projectSearch: string | undefined,
  filters: {
    pillars: number[];
    country?: string | null;
  },
) => ({
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
    ...(!!filters?.pillars?.length && {
      pillar: filters?.pillars,
    }),
    ...(!!filters?.country && {
      countries: {
        iso3: filters?.country,
      },
    }),
  },
});

export const PROJECT_PILLARS: Record<string, { color: string }> = {
  "30 x 30 Nature Based Solutions": {
    color: "from-[#E10098] to-[#E5838A]",
  },
  "90% Renewable Energy for All": {
    color: "from-[#F7A600] to-[#F87]",
  },
  "1.5% New Green Jobs for Physical & Economic Resilience": {
    color: "from-[#48A02D] to-[#EECC45]",
  },
  "Climate Smart Map": {
    color: "from-[#01B6DE] to-[#00BFB3]",
  },
};
