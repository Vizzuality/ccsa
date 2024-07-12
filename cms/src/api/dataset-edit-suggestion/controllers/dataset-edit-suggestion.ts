/**
 * dataset-edit-suggestion controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::dataset-edit-suggestion.dataset-edit-suggestion', () => ({
  async create(ctx) {
    const response = await super.create(ctx);

    if (ctx.state.user && ctx.state.user.email) {
      const userEmail = ctx.state.user.email;

      strapi.log.info(`Sending email confirmation to the author of Dataset Edit suggestion`);

      await strapi.plugins['email'].services.email.send({
        to: userEmail,
        subject: 'Dataset Edit Suggestion Received',
        html: `<h3>Your Dataset suggestion has been received</h3>
               <p>Thank you for your cooperation, your Dataset Edit suggestion will be reviewed by the admins as soon as possible</p>`
      });

      const adminRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { name: 'Admin' },
        populate: ['users']
      });

      if (adminRole && adminRole.users.length > 0) {
        strapi.log.info(`Sending email notifications to ${adminRole.users.length} admin(s)`);

        for (const admin of adminRole.users) {
          await strapi.plugins['email'].services.email.send({
            to: admin.email,
            subject: 'Collaborator Edit Suggestion Created',
            html: `<h3>Dataset Suggestion Created</h3>
                   <p>A Dataset suggestion has been created. Please review it at your earliest convenience.</p>`
          });
        }
      } else {
        strapi.log.error('No Admin users found or unable to fetch Admin users.');
      }
    } else {
      strapi.log.error('Unable to send email: User is not authenticated or email is missing.');
    }
    return response;
  }
}));
