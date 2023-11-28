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
      $or: [
        {
          name: {
            $containsi: projectSearch,
          },
        },
        {
          countries: {
            name: {
              $containsi: projectSearch,
            },
          },
        },
      ],
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

export const PROJECT_PILLARS: Record<string, { color: string; selectedColor: string }> = {
  "30 x 30 Nature Based Solutions": {
    color: "from-[#E10098] to-[#E5838A] shadow-[#E10098]",
    selectedColor: "bg-[#E10098]/10 border-[#E10098]",
  },
  "90% Renewable Energy for All": {
    color: "from-[#F7A600] to-[#F87] shadow-[#F7A600]",
    selectedColor: "bg-[#F7A600]/10 border-[#F7A600]",
  },
  "1.5% New Green Jobs for Physical & Economic Resilience": {
    color: "from-[#48A02D] to-[#EECC45] shadow-[#48A02D]",
    selectedColor: "bg-[#48A02D]/10 border-[#48A02D]",
  },
  "Climate Smart Map": {
    color: "from-[#01B6DE] to-[#00BFB3] shadow-[#01B6DE]",
    selectedColor: "bg-[#01B6DE]/10 border-[#01B6DE]",
  },
};
