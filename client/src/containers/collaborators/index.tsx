"use client";
import { useMemo } from "react";

import { useAtom } from "jotai";
import { groupBy } from "lodash-es";

import { useGetCollaborators } from "@/types/generated/collaborator";

import { collaboratorsSearchAtom } from "@/app/store";

import { Accordion } from "@/components/ui/accordion";
import ContentLoader from "@/components/ui/loader";
import { Search } from "@/components/ui/search";

import CollaboratorItem from "./item";

const CollaboratorsList = () => {
  const [search, setSearch] = useAtom(collaboratorsSearchAtom);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
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
              className="pointer-events-auto space-y-4"
              type="multiple"
              defaultValue={["collaborator", "donor"]}
            >
              {data?.map(([key, value]) => (
                <CollaboratorItem key={key} collaboratorType={key} collaborators={value} />
              ))}
            </Accordion>
          </ContentLoader>
        </div>
      </div>
    </div>
  );
};

export default CollaboratorsList;
