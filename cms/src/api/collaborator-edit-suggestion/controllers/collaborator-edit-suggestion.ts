/**
 * collaborator-edit-suggestion controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::collaborator-edit-suggestion.collaborator-edit-suggestion', () => ({
  async create(ctx) {
    const response = await super.create(ctx);
    let emailStatus = { userEmailSent: false, adminEmailsSent: false };

    if (ctx.state.user && ctx.state.user.email) {
      const userEmail = ctx.state.user.email;

      try {
        strapi.log.info(`Sending email confirmation to the author of Collaborator Edit suggestion`);

        await strapi.plugins['email'].services.email.send({
          to: userEmail,
          subject: 'Collaborator Suggestion Received',
          html: `<h3>Your Collaborator Edit suggestion has been received</h3>
                 <p>Thank you for your cooperation, your Collaborator Edit suggestion will be reviewed by the admins as soon as possible</p>`
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
              subject: 'Collaborator Suggestion Created',
              html: `<h3>Collaborator Suggestion Created</h3>
                     <p>A Collaborator suggestion has been created. Please review it at your earliest convenience.</p>`
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
      const suggestion = await strapi.query('api::collaborator-edit-suggestion.collaborator-edit-suggestion').findOne({
        where: { id: suggestionId },
        populate: ['author']
      });

      if (suggestion && suggestion.author && suggestion.author.email) {
        const userEmail = suggestion.author.email;

        try {
          strapi.log.info(`Sending email notification to the author about the Collaborator Suggestion review status change`);

          await strapi.plugins['email'].services.email.send({
            to: userEmail,
            subject: `Collaborator Suggestion ${newReviewStatus.charAt(0).toUpperCase() + newReviewStatus.slice(1)}`,
            html: `<h3>Your Collaborator suggestion has been ${newReviewStatus}</h3>
                   <p>Your Collaborator suggestion review status has been updated to "${newReviewStatus}".</p>`
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
