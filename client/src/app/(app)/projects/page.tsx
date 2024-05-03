import PageTitle from "@/components/ui/page-title";
import Projects from "@/containers/projects";
import ProjectsFilters from "@/containers/projects/filters";
import ProjectsHeader from "@/containers/projects/header";
import ProjectPopup from "@/containers/projects/popup";

export const metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <>
      <div className="relative z-10 h-full w-full bg-white">
        <div className="h-full overflow-auto">
          <PageTitle />
          <div className="space-y-5 px-5 pb-10 pt-[30px]">
            <h1 className="font-metropolis text-3xl tracking-tight text-gray-700">Projects</h1>

            <div className="space-y-5">
              <ProjectsFilters />
              <ProjectsHeader />
              <Projects />
            </div>
          </div>
        </div>
      </div>

      <ProjectPopup />
    </>
  );
}
