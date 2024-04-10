"use client";
import { useMemo } from "react";

import Image from "next/image";

import { capitalize, groupBy } from "lodash-es";
import { LuChevronDown, LuExternalLink } from "react-icons/lu";

import { cn } from "@/lib/classnames";

import { useGetCollaborators } from "@/types/generated/collaborator";

import { useSyncCollaboratorsSearch } from "@/app/store";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ContentLoader from "@/components/ui/loader";
import { Search } from "@/components/ui/search";

const CollaboratorsList = () => {
  const [search, setSearch] = useSyncCollaboratorsSearch();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Remove search param from url if empty
    setSearch(!value ? null : value);
  };

  const {
    data: collaboratorsData,
    isFetching,
    isFetched,
    isError,
  } = useGetCollaborators({
    ...(search ? { filters: { name: { $containsi: search } } } : {}),
  });

  const collaborators = useMemo(
    () => groupBy(collaboratorsData?.data, "attributes.type"),
    [collaboratorsData?.data],
  );
  const data = useMemo(() => Object.entries(collaborators), [collaborators]);

  return (
    <div className="relative z-10 h-full w-full bg-white">
      <div className="h-full space-y-5 overflow-auto">
        <div className="flex flex-col gap-4 p-1 pb-0 sm:flex-row">
          <div className="flex-1">
            <p className="max-w-md text-sm text-gray-700">
              Find a curated list of additional mapped resources, including other databases relevant
              to projects in the Caribbean region.
            </p>
          </div>
          <div className="flex-1">
            <Search placeholder="Search" type="text" value={search} onChange={handleSearch} />
          </div>
        </div>
        <div className="space-y-5 pb-10 pt-5">
          <ContentLoader
            skeletonClassName="h-20 w-full"
            data={collaboratorsData?.data}
            isFetching={isFetching}
            isFetched={isFetched}
            isPlaceholderData={false}
            isError={isError}
          >
            <Accordion
              className="space-y-4"
              type="multiple"
              defaultValue={["collaborator", "donor"]}
            >
              {data.map(([key, value]) => (
                <AccordionItem key={key} value={key} className="space-y-4">
                  <AccordionTrigger className="group flex items-center gap-4 py-2.5">
                    <LuChevronDown className="h-6 w-6 stroke-[1.5px] text-gray-700 group-data-[state=open]:rotate-180" />
                    <h2 className="font-open-sans text-xl">{`${capitalize(key)}s`}</h2>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {value.map(({ attributes, id }) => (
                          <div
                            key={id}
                            className="group relative flex flex-col justify-end overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                          >
                            <div className="absolute h-full w-full translate-y-full bg-gradient-to-t from-gray-600 to-white transition-all duration-500 group-hover:translate-y-0" />
                            <div className="absolute z-20 w-full">
                              <a
                                className={cn(
                                  "flex w-full justify-between px-5 pb-2 font-open-sans text-xs font-semibold text-transparent group-hover:text-white",
                                )}
                                href={attributes?.link}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {attributes?.name}
                                <LuExternalLink className="ml-1 h-4 w-4 stroke-none group-hover:stroke-white" />
                              </a>
                            </div>
                            <div className="relative z-10 flex min-h-[134px] w-full flex-1 items-center justify-center p-8">
                              <Image
                                src={`/images/collaborators/collaborator-${id}.png`}
                                alt={attributes?.name || "Collaborator logo"}
                                width={134}
                                height={134}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ContentLoader>
        </div>
      </div>
    </div>
  );
};

export default CollaboratorsList;
