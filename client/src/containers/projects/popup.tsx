"use client";

import Markdown from "react-markdown";

import { cn } from "@/lib/classnames";

import { useGetProjectsId } from "@/types/generated/project";

import { useSyncProject } from "@/app/store";

import { PROJECT_PILLARS } from "@/constants/projects";

import Popup from "@/containers/popup";

const ProjectPopup = () => {
  const [project] = useSyncProject();

  const { data } = useGetProjectsId(
    project as number,
    {
      populate: {
        pillar: true,
        sdgs: true,
        countries: {
          fields: ["name"],
        },
        project_status: true,
        project_type_of_funding: true,
      },
    },
    {
      query: {
        enabled: !!project,
        keepPreviousData: true,
      },
    },
  );

  const pillar = data?.data?.attributes?.pillar;
  const sdgs = data?.data?.attributes?.sdgs;
  const countries = data?.data?.attributes?.countries;
  const projectStatus = data?.data?.attributes?.status;
  const projectTypeOfFunding = data?.data?.attributes?.funding;
  const organizationType = (data?.data?.attributes as any)?.organization_type;
  const sourceCountry = (data?.data?.attributes as any)?.source_country;
  const objective = (data?.data?.attributes as any)?.objective;

  const { format } = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <Popup visibleKey={project}>
      <header
        className={cn({
          "space-y-5 bg-gradient-to-r px-10 py-12 text-white": true,
          [PROJECT_PILLARS[`${pillar?.data?.attributes?.name}`]?.color]: true,
        })}
      >
        <h3 className="text-xxs uppercase">Project detail</h3>
        <h2 className="font-metropolis text-3xl">{data?.data?.attributes?.name}</h2>
      </header>

      <div className="divide-y divide-gray-200 px-10">
        {/* HIGHLIGHT */}
        {!!data?.data?.attributes?.highlight && (
          <section className="space-y-2.5 py-5">
            <h3 className="text-xxs uppercase text-gray-500">Description</h3>
            <Markdown className="prose">{data?.data?.attributes?.highlight}</Markdown>
          </section>
        )}

        <section className="space-y-5 py-5">
          {/* PILLAR */}
          {!!pillar?.data?.attributes?.name && (
            <div className="space-y-2.5">
              <h3 className="text-xxs uppercase text-gray-500">Pillar</h3>
              <div className="space-y-1 text-sm">
                <p>{pillar?.data?.attributes?.name}:</p>
                <p className="text-gray-500">{pillar?.data?.attributes?.description}</p>
              </div>
            </div>
          )}
          {/* ACCOUNT */}
          {!!data?.data?.attributes?.account && (
            <div className="space-y-2.5">
              <h3 className="text-xxs uppercase text-gray-500">Account</h3>
              <div className="text-sm">{data?.data?.attributes?.account}</div>
            </div>
          )}
          {/* AMOUNT */}
          {!!data?.data?.attributes?.amount && (
            <div className="space-y-2.5">
              <h3 className="text-xxs uppercase text-gray-500">Amount</h3>
              <div className="text-sm">{format(data?.data?.attributes?.amount)}</div>
            </div>
          )}
          {/* COUNTRIES */}
          {!!countries?.data?.length && (
            <div className="space-y-2.5">
              <h3 className="text-xxs uppercase text-gray-500">Countries</h3>
              <div className="text-sm">
                {countries?.data
                  ?.map((c) => {
                    if (!c.id || !c.attributes) return null;

                    return c.attributes.name;
                  })
                  .join(", ")}
              </div>
            </div>
          )}
          {/* SDGS */}
          {!!sdgs?.data?.length && (
            <div className="space-y-2.5">
              <h3 className="text-xxs uppercase text-gray-500">SDGs</h3>
              <ul className="space-y-0.5">
                {sdgs?.data?.map((sdg) => {
                  if (!sdg?.attributes) return null;

                  return (
                    <li key={sdg.id} className="text-sm">
                      {sdg?.attributes?.name}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {/* STATUS */}
          {!!projectStatus && (
            <div className="space-y-2.5">
              <h3 className="text-xxs uppercase text-gray-500">Status</h3>
              <div className="text-sm">{projectStatus}</div>
            </div>
          )}
          {/* TYPE OF FUNDING */}
          {!!projectTypeOfFunding && (
            <div className="space-y-2.5">
              <h3 className="text-xxs uppercase text-gray-500">Type of funding</h3>
              <div className="text-sm">{projectTypeOfFunding}</div>
            </div>
          )}
          {/* Organization Type */}
          {!!organizationType && (
            <div className="space-y-2.5">
              <h3 className="text-xxs uppercase text-gray-500">Organization Type</h3>
              <div className="text-sm">{organizationType}</div>
            </div>
          )}

          {/* Source Country */}
          {!!sourceCountry && (
            <div className="space-y-2.5">
              <h3 className="text-xxs uppercase text-gray-500">Source Country</h3>
              <div className="text-sm">{sourceCountry}</div>
            </div>
          )}

          {/* Objective */}
          {!!objective && (
            <div className="space-y-2.5">
              <h3 className="text-xxs uppercase text-gray-500">Objective</h3>
              <div className="text-sm">{objective}</div>
            </div>
          )}
        </section>
      </div>
    </Popup>
  );
};

export default ProjectPopup;
