import { dehydrate, Hydrate } from "@tanstack/react-query";
import { getGetOtherToolsQueryOptions } from "@/types/generated/other-tool";
import getQueryClient from "@/lib/react-query/getQueryClient";
import OtherToolsList from "@/containers/other-tools";
import PageTitle from "@/components/ui/page-title";

export const metadata = {
  title: "Other Tools",
};

async function prefetchQueries() {
  const queryClient = getQueryClient();
  try {
    const { queryKey, queryFn } = getGetOtherToolsQueryOptions({
      populate: "other_tools_category",
      sort: "other_tools_category.name",
    });

    await queryClient.prefetchQuery({
      queryKey,
      queryFn,
    });
    return dehydrate(queryClient);
  } catch (error) {
    console.info(error);
    return null;
  }
}

export default async function OtherTools() {
  const dehydratedState = await prefetchQueries();

  return (
    <Hydrate state={dehydratedState}>
      <>
        <div className="relative z-10 h-full w-full bg-white">
          <div className="h-full overflow-auto">
            <PageTitle />
            <div className="space-y-5 px-5 pb-10 pt-[30px]">
              <h1 className="font-metropolis text-3xl tracking-tight text-gray-700">Other Tools</h1>

              <div className="space-y-5">
                <OtherToolsList />
              </div>
            </div>
          </div>
        </div>
      </>
    </Hydrate>
  );
}
