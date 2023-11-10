"use client";

import { useSyncProject } from "@/app/store";

import Popup from "@/containers/popup";

const ProjectPopup = () => {
  const [project] = useSyncProject();

  return (
    <Popup visibleKey={project}>
      <div>
        <h3 className="text-xxs uppercase text-gray-500">Project detail</h3>
        <h2 className="text-xl">Project title</h2>
      </div>
    </Popup>
  );
};

export default ProjectPopup;
