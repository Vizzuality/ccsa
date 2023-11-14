import Projects from "@/containers/projects";
import ProjectsHeader from "@/containers/projects/header";
import ProjectPopup from "@/containers/projects/popup";
import ProjectsSearch from "@/containers/projects/search";

export default function ProjectsPage() {
  return (
    <>
      <div className="relative z-10 h-full w-full bg-white">
        <div className="h-full overflow-auto">
          <div className="space-y-5 px-5 py-10">
            <h1 className="font-metropolis text-3xl tracking-tight">Projects</h1>

            <div className="space-y-5">
              <ProjectsSearch />
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
