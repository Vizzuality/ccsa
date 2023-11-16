import Projects from "@/containers/projects";
import ProjectsFilters from "@/containers/projects/filters";
import ProjectsHeader from "@/containers/projects/header";
import ProjectPopup from "@/containers/projects/popup";

export default function ProjectsPage() {
  return (
    <>
      <div className="relative z-10 h-full w-full bg-white">
        <div className="h-full overflow-auto">
          <div className="space-y-5 px-5 py-10">
            <h1 className="font-metropolis text-3xl tracking-tight">Projects</h1>

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
