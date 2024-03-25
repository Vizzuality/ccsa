"use client";

import { useSyncOtherToolsSearch } from "@/app/store";
import { Search } from "@/components/ui/search";
import { useGetOtherTools } from "@/types/generated/other-tool";

import ToolCard from "./tool-card";
import ContentLoader from "@/components/ui/loader";

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
        <div className="p-1 pb-0">
          <Search
            placeholder="Search by name, category or description"
            type="text"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <div className="space-y-5 px-5 py-10">
          <ContentLoader
            skeletonClassName="h-20 w-full"
            data={otherTools?.data}
            isFetching={isFetching}
            isFetched={isFetched}
            isPlaceholderData={false}
            isError={isError}
          >
            <div className="space-y-5">
              {otherTools?.data?.map((a) => <ToolCard key={a.id} tool={a.attributes} />)}
            </div>
          </ContentLoader>
        </div>
      </div>
    </div>
  );
};
export default OtherTools;
