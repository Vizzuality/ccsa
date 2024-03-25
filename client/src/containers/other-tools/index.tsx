"use client";

import { Search } from "@/components/ui/search";
import { useGetOtherTools } from "@/types/generated/other-tool";
import { useMemo, useState } from "react";
import ToolCard from "./tool-card";

const OtherTools = () => {
  const [search, setSearch] = useState("");

  const { data } = useGetOtherTools({
    populate: "other_tools_category",
    sort: "other_tools_category.name",
  });

  const otherTools = useMemo(
    () =>
      data?.data?.filter(
        ({ attributes }) =>
          attributes?.name?.toLowerCase()?.includes(search.toLowerCase()) ||
          attributes?.other_tools_category?.data?.attributes?.name
            ?.toLowerCase()
            ?.includes(search.toLowerCase()) ||
          attributes?.description?.toLowerCase()?.includes(search.toLowerCase()),
      ),
    [search, data],
  );

  return (
    <div className="relative z-10 h-full w-full bg-white">
      <div className="h-full overflow-auto">
        <div className="p-1 pb-0">
          <Search
            placeholder="Search by name, category or description"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="space-y-5 px-5 py-10">
          <div className="space-y-5">
            {otherTools?.map((a) => <ToolCard key={a.id} tool={a.attributes} />)}
          </div>
        </div>
      </div>
    </div>
  );
};
export default OtherTools;
