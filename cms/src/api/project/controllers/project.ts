/**
 * project controller
 */

import { factories } from "@strapi/strapi";
import * as fs from "fs";
import axios from "axios";

export default factories.createCoreController("api::project.project", () => ({
  async approveProjectSuggestion(ctx) {
    const data = ctx.request.body.data;
    let project;
    const currentDate = new Date();

    if (data.id) {
      const { id, ...payload } = ctx.request.body.data;
      project = await strapi.entityService.findOne("api::project.project", id);

      if (project) {
        project = await strapi.entityService.update(
          "api::project.project",
          id,
          { data: { ...payload, publishedAt: currentDate } }
        );
      } else {
        project = await strapi.entityService.create("api::project.project", {
          data: { ...payload, publishedAt: currentDate },
        });
      }
    } else {
      project = await strapi.entityService.create("api::project.project", {
        data: { ...data, publishedAt: currentDate },
      });
    }
    ctx.send(project);
  },

  async importProjects(ctx) {
    const { file } = ctx.request.files as { file: any };
    console.log(
      "**********************************************************trapi.config.server.url**********************************************************",

      ctx.req.rawHeaders[1],
      ctx.req,
      ctx.request,
      "ctx.req.rawHeaders[1],",
      "**********************************************************trapi.config.server.url**********************************************************"
    );

    if (!file) {
      return ctx.badRequest("No file uploaded");
    }

    try {
      const { csvData, rowCount } = await strapi
        .service("api::project.project")
        .parseAndReplaceIds(file);

      // Prepare the data for the import endpoint
      const importData = {
        slug: "api::project.project",
        data: csvData,
        format: "csv",
        idField: "id",
      };

      // Post the data to the import plugin
      const response = await axios.post(
        `${strapi.config.server.url}/api/import-export-entries/content/import`,
        importData,
        {
          headers: {
            Authorization: `${ctx.req.rawHeaders[1] || ""}`, // Ensure the request is authenticated
            "Content-Type": "application/json",
          },
        }
      );

      // Return the response from the import plugin
      ctx.send({
        message: "File processed and imported successfully",
        projectsImported: rowCount,
        data: response.data,
      });
    } catch (error: any) {
      ctx.throw(500, `Failed to import data: ${error.message}`);
    } finally {
      if (file && file.path) {
        fs.unlinkSync(file.path);
      }
    }
  },
}));
