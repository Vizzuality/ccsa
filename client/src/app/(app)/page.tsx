import CountryPopup from "@/containers/countries/popup";
import DatasetsCategories from "@/containers/datasets/categories";
import DatasetsHeader from "@/containers/datasets/header";
import DatasetsSearch from "@/containers/datasets/search";

export default function HomePage() {
  return (
    <>
      <div className="relative z-10 h-full w-full bg-white">
        <div className="h-full overflow-auto">
          <div className="space-y-5 px-5 py-10">
            <h1 className="font-metropolis text-3xl tracking-tight">Explore datasets</h1>

            <div className="space-y-5">
              <DatasetsSearch />
              <DatasetsHeader />
              <DatasetsCategories />
            </div>
          </div>
        </div>
      </div>

      <CountryPopup />
    </>
  );
}
