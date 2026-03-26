import Projects from "@/containers/projects";
import ProjectsFilters from "@/containers/projects/filters";
import ProjectsHeader from "@/containers/projects/header";
import ProjectPopup from "@/containers/projects/popup";

import PageTitle from "@/components/ui/page-title";

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

            <div className="space-y-2.5">
              <p className="text-sm text-gray-700">
                To start using this tool, select some datasets from the list below and click on the
                map to see country details. Then, go to the country detail that will appear to
                compare with other countries and download data.
              </p>

              <p className="text-sm text-gray-700">
                If you have any other questions email us at{" "}
                <a
                  className="text-brand1"
                  href="mailto:hello@caribbeanaccelerator.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  hello@caribbeanaccelerator.org
                </a>
              </p>
            </div>

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
