/**
 * tool-edit-suggestion controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::tool-edit-suggestion.tool-edit-suggestion', () => ({
  async create(ctx) {
    const response = await super.create(ctx);
    let emailStatus = { userEmailSent: false, adminEmailsSent: false };

    if (ctx.state.user && ctx.state.user.email) {
      const userEmail = ctx.state.user.email;
      const dashboardUrl = process.env.NEXT_PUBLIC_URL;

      try {
        strapi.log.info(`Sending email confirmation to the author of Tool Edit suggestion`);

        await strapi.plugins['email'].services.email.send({
          to: userEmail,
          subject: 'Tool Suggestion Received',
          html: `<h3>Your Tool suggestion has been received</h3>
                 <p>Thank you for your cooperation, your Tool suggestion will be reviewed by the admins as soon as possible</p>
                 <p>To review your suggestion, please, access <a href="${dashboardUrl}/dashboard">Dashboard</a>.</p>`
        });

        emailStatus.userEmailSent = true;
      } catch (error) {
        strapi.log.error('Failed to send email to the user:', error);
      }

      try {
        const adminRole = await strapi.query('plugin::users-permissions.role').findOne({
          where: { name: 'Admin' },
          populate: ['users']
        });

        if (adminRole && adminRole.users.length > 0) {
          strapi.log.info(`Sending email notifications to ${adminRole.users.length} admin(s)`);

          for (const admin of adminRole.users) {
            await strapi.plugins['email'].services.email.send({
              to: admin.email,
              subject: 'Tool Suggestion Created',
              html: `<h3>Tool Suggestion Created</h3>
                     <p>A Tool suggestion has been created. To review the suggestion, please, access <a href="${dashboardUrl}/dashboard">Dashboard</a>.</p>`
            });
          }

          emailStatus.adminEmailsSent = true;
        } else {
          strapi.log.error('No Admin users found or unable to fetch Admin users.');
        }
      } catch (error) {
        strapi.log.error('Failed to send email to admins:', error);
      }
    } else {
      strapi.log.error('Unable to send email: User is not authenticated or email is missing.');
    }

    return { ...response, emailStatus };
  },

  async update(ctx) {
    const response = await super.update(ctx);
    let emailStatus = { userEmailSent: false };

    const newReviewStatus = response.data.attributes.review_status;

    if (newReviewStatus === 'approved' || newReviewStatus === 'declined') {
      const suggestionId = ctx.params.id;
      const suggestion = await strapi.query('api::tool-edit-suggestion.tool-edit-suggestion').findOne({
        where: { id: suggestionId },
        populate: ['author']
      });

      if (suggestion && suggestion.author && suggestion.author.email) {
        const userEmail = suggestion.author.email;

        try {
          strapi.log.info(`Sending email notification to the author about the Tool Suggestion review status change`);

          await strapi.plugins['email'].services.email.send({
            to: userEmail,
            subject: `Tool Suggestion ${newReviewStatus.charAt(0).toUpperCase() + newReviewStatus.slice(1)}`,
            html: `<h3>Your Tool suggestion has been ${newReviewStatus}</h3>
                   <p>Your Tool suggestion review status has been updated to "${newReviewStatus}".</p>`
          });

          emailStatus.userEmailSent = true;
        } catch (error) {
          strapi.log.error('Failed to send email to the user:', error);
        }
      } else {
        strapi.log.error('Unable to send email: Author is missing or email is not provided.');
      }
    }

    return { ...response, emailStatus };
  }
}));

