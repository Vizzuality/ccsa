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

      const token = ctx.request.header.authorization;

      // Post the data to the import plugin
      const response = await axios.post(
        `${strapi.config.server.url}/api/import-export-entries/content/import`,
        importData,
        {
          headers: {
            Authorization: `${token}`,
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

  async searchByNameWholeWord(ctx) {
    try {
      const qRaw = ctx.query.q;
      const q = typeof qRaw === "string" ? qRaw.trim() : "";

      const page = Math.max(parseInt(String(ctx.query.page ?? "1"), 10), 1);
      const pageSize = Math.min(
        Math.max(parseInt(String(ctx.query.pageSize ?? "200"), 10), 1),
        200
      );
      const offset = (page - 1) * pageSize;

      // --- Parse filters from query ---
      const parseCsvNums = (v: any): number[] =>
        String(v ?? "")
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean)
          .map((x) => Number(x))
          .filter((n) => Number.isFinite(n));

      const parseCsvStr = (v: any): string[] =>
        String(v ?? "")
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean);

      const pillars = parseCsvNums(ctx.query.pillars);
      const status = parseCsvNums(ctx.query.status);
      const countries = parseCsvStr(ctx.query.countries);

      const sortField = String(ctx.query.sortField ?? "name"); // "name" | "status"
      const sortOrder =
        String(ctx.query.sortOrder ?? "asc").toLowerCase() === "desc"
          ? "desc"
          : "asc";

      // --- Build base where ---
      const where: any = {};

      if (pillars.length) where.pillar = { id: { $in: pillars } };
      if (status.length) where.status = { id: { $in: status } };
      if (countries.length) where.countries = { iso3: { $in: countries } };

      // --- Populate (same as GET_PROJECTS_OPTIONS) ---
      const populate = {
        pillar: { select: ["id", "name"] },
        sdgs: { select: ["id", "name"] },
        countries: { select: ["id", "name", "iso3"] },
        status: { select: ["maturity", "name", "state"] },
      };

      // --- Sorting ---
      // Note: status.maturity lives in populated relation; Strapi can sort by relation fields in many cases.
      // If it doesn't in your setup, we will sort in JS as fallback (below).
      const sort =
        sortField === "status"
          ? [{ status: { state: sortOrder } }]
          : [{ name: sortOrder }];

      // --- Case: empty q OR q too short -> return all with filters/sort/pagination ---
      // (If you want "min 2 chars to search", keep this.)
      if (!q || q.length < 2) {
        const [projects, total] = await Promise.all([
          strapi.db.query("api::project.project").findMany({
            where,
            populate,
            orderBy: sort as any,
            limit: pageSize,
            offset,
          }),
          strapi.db.query("api::project.project").count({ where }),
        ]);

        return ctx.send({
          data: projects.map((p: any) => {
            const { id, ...attributes } = p;
            return { id, attributes };
          }),
          meta: {
            pagination: {
              page,
              pageSize,
              pageCount: Math.ceil(total / pageSize),
              total,
            },
          },
        });
      }

      // --- Search flow ---
      const qTrim = (q ?? "").trim();
      if (!qTrim)
        return ctx.send({
          data: [],
          meta: { pagination: { page, pageSize, pageCount: 0, total: 0 } },
        });

      const qLower = qTrim.toLowerCase();

      // Get candidates with your base filters only (or keep your DB prefilter if you want)
      const candidates = await strapi.db
        .query("api::project.project")
        .findMany({
          where,
          // make sure highlight is actually included:
          select: ["id", "name", "highlight"],
          populate,
          limit: 2000,
        });

      // 3) Whole-word filter on NAME only (your requirement)
      const rawTokens = qTrim
        .split(/\s+/)
        .map((t) => t.trim())
        .filter(Boolean);
      const tokens = rawTokens.map((t) =>
        t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      );
      const wordRes = tokens.map((t) => new RegExp(`(^|\\W)${t}($|\\W)`, "i"));

      const filtered = candidates.filter((p) => {
        const name = String(p?.name ?? "");
        const highlight = String(p?.highlight ?? "");

        const matchesHighlight = highlight.toLowerCase().includes(qLower);
        const matchesNameWholeWord = wordRes.every((re) => re.test(name));

        // ✅ keep if either matches
        return matchesHighlight || matchesNameWholeWord;
      });

      // 4) Sort fallback in JS (reliable)
      const sorted = filtered.sort((a, b) => {
        if (sortField === "status") {
          const av = a?.status?.state ?? Number.NEGATIVE_INFINITY;
          const bv = b?.status?.state ?? Number.NEGATIVE_INFINITY;
          return sortOrder === "asc" ? av - bv : bv - av;
        }
        const av = String(a?.name ?? "");
        const bv = String(b?.name ?? "");
        return sortOrder === "asc"
          ? av.localeCompare(bv)
          : bv.localeCompare(av);
      });

      // 5) Pagination
      const total = sorted.length;
      const pageCount = Math.ceil(total / pageSize);
      const pageItems = sorted.slice(offset, offset + pageSize);

      return ctx.send({
        data: pageItems.map((p) => {
          const { id, ...attributes } = p;
          return { id, attributes };
        }),
        meta: { pagination: { page, pageSize, pageCount, total } },
      });
    } catch (err: any) {
      strapi.log.error("searchByNameWholeWord failed", err);
      ctx.throw(500, err.message || "searchByNameWholeWord failed");
    }
  },
}));
