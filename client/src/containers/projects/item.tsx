"use client";

import { ProjectListResponseDataItem } from "@/types/generated/strapi.schemas";

const ProjectsItem = (project: ProjectListResponseDataItem) => {
  return <div>{project?.attributes?.name}</div>;
};

export default ProjectsItem;
