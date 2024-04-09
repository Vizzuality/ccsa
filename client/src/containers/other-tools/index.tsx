"use client";

import { useGetOtherTools } from "@/types/generated/other-tool";

import { useSyncOtherToolsSearch } from "@/app/store";

import ContentLoader from "@/components/ui/loader";
import { Search } from "@/components/ui/search";

import ToolCard from "./tool-card";

const OtherTools = () => {
  const [search, setSearch] = useSyncOtherToolsSearch();

  const {
    data: otherTools,
    isFetched,
    isFetching,
    isError,
  } = useGetOtherTools({
    populate: "other_tools_category",
    sort: "other_tools_category.name",
    ...(search
      ? {
          filters: {
            $or: [
              { name: { $containsi: search } },
              { description: { $containsi: search } },
              { other_tools_category: { name: { $containsi: search } } },
            ],
          },
        }
      : {}),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Remove search param from url if empty
    setSearch(!value ? null : value);
  };

  return (
    <div className="relative z-10 h-full w-full bg-white">
      <div className="h-full overflow-auto">
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
        <div className="space-y-5 pb-10 pt-[30px]">
          <ContentLoader
            skeletonClassName="h-20 w-full"
            data={otherTools?.data}
            isFetching={isFetching}
            isFetched={isFetched}
            isPlaceholderData={false}
            isError={isError}
          >
            <div className="grid-cols-2 gap-4 space-y-4 sm:grid sm:space-y-0">
              {otherTools?.data?.map((a) => <ToolCard key={a.id} tool={a.attributes} />)}
            </div>
          </ContentLoader>
        </div>
      </div>
    </div>
  );
};
export default OtherTools;
