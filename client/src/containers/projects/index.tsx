"use client";

import ProjectPopup from "@/containers/projects/popup";

const Projects = (): JSX.Element => {
  return (
    <>
      <div className="relative z-10 h-full w-full bg-white">
        <div className="flex h-full overflow-auto">
          <div className="px-5 py-10">
            <h1 className="font-metropolis text-3xl text-gray-800">Projects</h1>
          </div>
        </div>
      </div>

      <ProjectPopup />
    </>
  );
};

export default Projects;
