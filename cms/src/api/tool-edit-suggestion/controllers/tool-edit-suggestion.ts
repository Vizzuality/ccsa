/**
 * tool-edit-suggestion controller
 */

import { factories } from "@strapi/strapi";
import axios from 'axios';
import * as fs from 'fs';

export default factories.createCoreController(
  "api::tool-edit-suggestion.tool-edit-suggestion",
  () => ({
    async create(ctx) {
      const response = await super.create(ctx);
      let emailStatus = { userEmailSent: false, adminEmailsSent: false };

      if (ctx.state.user && ctx.state.user.email) {
        const userEmail = ctx.state.user.email;
        const dashboardUrl = process.env.NEXT_PUBLIC_URL;

        try {
          strapi.log.info(
            `Sending email confirmation to the author of Tool Edit suggestion`
          );

          await strapi.plugins["email"].services.email.send({
            to: userEmail,
            subject: "Tool Suggestion Received",
            html: `<h3>Your Tool suggestion has been received</h3>
                <p>Thank you for taking the time to submit your edit to the Climate Smart Map. We truly appreciate your efforts in increasing access to data in the Caribbean, which will help us achieve our climate objectives more efficiently.</p>
                <p>We review submissions on an ongoing basis and aim to complete the review within a month. Once your submission is reviewed, you will receive an email confirming whether it has been approved for upload or if further edits are needed.</p>
                <p>To review your suggestion, please access the <a href="${dashboardUrl}/dashboard">Dashboard</a>, where you can see the recommendation and the status of the review. If there is anything we can do to improve the Climate Smart Map or enhance your ability to support it, please let us know.</p>
                <p>We encourage you to share the <a href="https://map.caribbeanaccelerator.org/">Climate Smart Map</a> with others. We aim to support all our collective efforts in bringing more funding to the Caribbean.</p>`,
          });

          emailStatus.userEmailSent = true;
        } catch (error) {
          strapi.log.error("Failed to send email to the user:", error);
        }

        try {
          const adminRole = await strapi
            .query("plugin::users-permissions.role")
            .findOne({
              where: { name: "Admin" },
              populate: ["users"],
            });

          if (adminRole && adminRole.users.length > 0) {
            strapi.log.info(
              `Sending email notifications to ${adminRole.users.length} admin(s)`
            );

            for (const admin of adminRole.users) {
              await strapi.plugins["email"].services.email.send({
                to: admin.email,
                subject: "Tool Suggestion Created",
                html: `<h3>Tool Suggestion Created</h3>
                     <p>A Tool suggestion on the Climate Smart Map has been created.  To review the suggestion please access the <a href="${dashboardUrl}/dashboard">Dashboard</a>.  Thank you for your support.</p>`,
              });
            }

            emailStatus.adminEmailsSent = true;
          } else {
            strapi.log.error(
              "No Admin users found or unable to fetch Admin users."
            );
          }
        } catch (error) {
          strapi.log.error("Failed to send email to admins:", error);
        }
      } else {
        strapi.log.error(
          "Unable to send email: User is not authenticated or email is missing."
        );
      }

      return { ...response, emailStatus };
    },

    async update(ctx) {
      const response = await super.update(ctx);
      let emailStatus = { userEmailSent: false };

      const newReviewStatus = response.data.attributes.review_status;

      if (newReviewStatus === "approved" || newReviewStatus === "declined") {
        const suggestionId = ctx.params.id;
        const suggestion = await strapi
          .query("api::tool-edit-suggestion.tool-edit-suggestion")
          .findOne({
            where: { id: suggestionId },
            populate: ["author"],
          });

        if (suggestion && suggestion.author && suggestion.author.email) {
          const userEmail = suggestion.author.email;

          try {
            strapi.log.info(
              `Sending email notification to the author about the Tool Suggestion review status change`
            );

            let htmlContent;

            if (newReviewStatus === "approved") {
              htmlContent = `<h3>We are pleased to inform you that your recent submission to the Climate Smart Map has been reviewed and approved for upload.</h3>
                 <p>Thank you for your valuable contribution to enhancing data accessibility in the Caribbean. Your efforts play a crucial role in accelerating our progress towards achieving our climate objectives.</p>
                 <p>You can view your approved submission on the Dashboard. If you have any further suggestions or if there is anything we can do to improve the Climate Smart Map or support your involvement, please let us know.</p>
                 <p>We encourage you to share the Climate Smart Map with others to amplify its impact. Together, we can bring more funding and attention to the Caribbean's climate initiatives.</p>`;
            } else if (newReviewStatus === "rejected") {
              htmlContent = `<h3>Thank you for submitting your edit to the Climate Smart Map. After careful review, we regret to inform you that your submission has not been approved for upload at this time.</h3>
                 <p>We appreciate your effort and dedication to enhancing data accessibility in the Caribbean.</p>
                 <p>You can view the feedback and status of your submission on the Dashboard. Many times we need verification of the source of the data or an element was incomplete for which we need your input. If you have any questions or need further clarification, please do not hesitate to reach out to us.</p>
                 <p>We value your contributions and encourage you to continue supporting the Climate Smart Map. If you have other suggestions or ideas, please feel free to share them with us. Together, we can work towards our collective goal of bringing more funding and attention to the Caribbean's climate initiatives.</p>`;
            } else {
              htmlContent = `<h3>Your Tool suggestion has been ${newReviewStatus}</h3>
                   <p>Your Tool suggestion review status has been updated to "${newReviewStatus}".</p>`;
            }

            await strapi.plugins["email"].services.email.send({
              to: userEmail,
              subject: `Tool Suggestion ${
                newReviewStatus.charAt(0).toUpperCase() +
                newReviewStatus.slice(1)
              }`,
              html: htmlContent,
            });

            emailStatus.userEmailSent = true;
          } catch (error) {
            strapi.log.error("Failed to send email to the user:", error);
          }
        } else {
          strapi.log.error(
            "Unable to send email: Author is missing or email is not provided."
          );
        }
      }

      return { ...response, emailStatus };
    },

    async importOtherToolsEditSuggestions(ctx) {
      const { file } = ctx.request.files as { file: any }; // Assuming file is uploaded as 'file'
      const authorId = ctx.state.user?.id; // Get the author ID from the authenticated user state

      if (!file) {
        return ctx.badRequest('No file uploaded');
      }

      try {
        // Use the service to parse and replace IDs, including the authorId from the user state
        const { csvData, rowCount } = await strapi
          .service('api::other-tool.other-tool')
          .parseAndReplaceIds(file, authorId);

        // Prepare the data for the import endpoint
        const importData = {
          slug: 'api::tool-edit-suggestion.tool-edit-suggestion',
          data: csvData,
          format: 'csv',
          idField: 'id',
        };

        // Post the data to the import plugin
        const response = await axios.post(
          `${strapi.config.server.url}/api/import-export-entries/content/import`,
          importData,
          {
            headers: {
              Authorization: `${ctx.request.header.authorization || ''}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Return the response from the import plugin
        ctx.send({
          message: 'File processed and imported successfully',
          toolsImported: rowCount,
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
  })
);
