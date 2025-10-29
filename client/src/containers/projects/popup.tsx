"use client";

import Markdown from "react-markdown";

import { cn } from "@/lib/classnames";

import { useGetProjectsId } from "@/types/generated/project";

import { useSyncProject } from "@/app/store";

import { PROJECT_PILLARS } from "@/constants/projects";

import Popup from "@/containers/popup";

import { useGetProjectFieldMetadata } from "@/types/generated/project-field-metadata";
import { Tooltip, TooltipArrow, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { LuInfo } from "react-icons/lu";

import { TooltipPortal } from "@radix-ui/react-tooltip";

const ProjectFieldHeader = ({ title, data }: { title: string; data: string | undefined }) => (
  <div className="flex items-center">
    <h3 className="text-xxs uppercase text-gray-500">{title}</h3>
    <Tooltip>
      <TooltipTrigger>
        <LuInfo className="h-4 w-4 pl-1 font-bold text-gray-500" />
      </TooltipTrigger>

      <TooltipPortal>
        <TooltipContent side="right" align="center">
          <Markdown className="prose text-xxs">{data}</Markdown>
          <TooltipArrow className="fill-white" width={10} height={5} />
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  </div>
);

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
        status: {
          fields: ["name"],
        },
        funding: {
          fields: ["name"],
        },
        objective: {
          fields: ["type"],
        },
        organization_type: {
          fields: ["name"],
        },
        source_country: {
          fields: ["name"],
        },
      },
    },
    {
      query: {
        enabled: !!project,
        keepPreviousData: true,
      },
    },
  );

  const { data: dataInfo } = useGetProjectFieldMetadata();

  const pillar = data?.data?.attributes?.pillar;
  const sdgs = data?.data?.attributes?.sdgs;
  const countries = data?.data?.attributes?.countries;
  const projectStatus = data?.data?.attributes?.status?.data?.attributes?.name;
  const projectTypeOfFunding = data?.data?.attributes?.funding?.data?.attributes?.name;
  const organizationType = data?.data?.attributes?.organization_type?.data?.attributes?.name;
  const sourceCountry = data?.data?.attributes?.source_country?.data?.attributes?.name;
  const objective = data?.data?.attributes?.objective?.data?.attributes?.type;
  const info = data?.data?.attributes?.info;
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
            <ProjectFieldHeader title="Description" data={dataInfo?.data?.attributes?.highlight} />
            <Markdown className="prose">{data?.data?.attributes?.highlight}</Markdown>
          </section>
        )}

        <section className="space-y-5 py-5">
          {/* PILLAR */}
          {!!pillar?.data?.attributes?.name && (
            <div className="space-y-2.5">
              <ProjectFieldHeader title="Pillar" data={dataInfo?.data?.attributes?.pillar} />

              <div className="space-y-1 text-sm">
                <p>{pillar?.data?.attributes?.name}:</p>
                <p className="text-gray-500">{pillar?.data?.attributes?.description}</p>
              </div>
            </div>
          )}

          {/* AMOUNT */}
          {!!data?.data?.attributes?.amount && (
            <div className="space-y-2.5">
              <ProjectFieldHeader title="Amount" data={dataInfo?.data?.attributes?.amount} />
              <div className="text-sm">{format(data?.data?.attributes?.amount)}</div>
            </div>
          )}

          {/* COUNTRIES */}
          {!!countries?.data?.length && (
            <div className="space-y-2.5">
              <ProjectFieldHeader title="Countries" data={dataInfo?.data?.attributes?.countries} />
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
              <ProjectFieldHeader title="SDGs" data={dataInfo?.data?.attributes?.sdgs} />
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

          {/* ACCOUNT */}
          {!!data?.data?.attributes?.account && (
            <div className="space-y-2.5">
              <ProjectFieldHeader title="Account" data={dataInfo?.data?.attributes?.account} />
              <div className="text-sm">{data?.data?.attributes?.account}</div>
            </div>
          )}

          {/* STATUS */}
          {!!projectStatus && (
            <div className="space-y-2.5">
              <ProjectFieldHeader title="Status" data={dataInfo?.data?.attributes?.status} />
              <div className="text-sm">{projectStatus}</div>
            </div>
          )}

          {/* Source Country */}
          {!!sourceCountry && (
            <div className="space-y-2.5">
              <ProjectFieldHeader
                title="Source Country"
                data={dataInfo?.data?.attributes?.source_country}
              />
            </div>
          )}

          {/* Organization Type */}
          {!!organizationType && (
            <div className="space-y-2.5">
              <ProjectFieldHeader
                title="Organization Type"
                data={dataInfo?.data?.attributes?.organization_type}
              />
            </div>
          )}

          {/* INFO */}
          {!!info && (
            <div className="space-y-2.5">
              <ProjectFieldHeader title="Info" data={dataInfo?.data?.attributes?.info} />
              <div className="text-sm">{info}</div>
            </div>
          )}

          {/* Objective */}
          {!!objective && (
            <div className="space-y-2.5">
              <ProjectFieldHeader title="Objective" data={dataInfo?.data?.attributes?.objective} />
              <div className="text-sm">{objective}</div>
            </div>
          )}

          {/* TYPE OF FUNDING */}
          {!!projectTypeOfFunding && (
            <div className="space-y-2.5">
              <ProjectFieldHeader
                title="Type of funding"
                data={dataInfo?.data?.attributes?.funding}
              />
              <div className="text-sm">{projectTypeOfFunding}</div>
            </div>
          )}
        </section>
      </div>
    </Popup>
  );
};

export default ProjectPopup;
