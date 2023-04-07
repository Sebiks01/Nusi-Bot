const { ButtonInteraction, Client, Events } = require('discord.js');

const recruitmentBlacklistSchema = require('../../../schemas/recruitmentBlacklists.js');
const form = require('../../../config/form');
const formsSchema = require('../../../schemas/forms.js');
const embed = require('../../../config/embedsAndComponents.js');

module.exports = {
  name: Events.InteractionCreate,

  /**
   *
   * @param { ButtonInteraction } interaction
   * @param { Client } _
   */

  async execute(interaction, _) {
    if (
      !interaction.isButton() ||
      interaction.customId !== 'recruitment-form-init'
    )
      return;

    const results = await recruitmentBlacklistSchema.find();

    for (const result of results) {
      if (interaction.member.roles.cache.has(result.roleId)) {
        return await interaction.reply({
          embeds: [embed.interactions.buttons.user_blacklisted],
          ephemeral: true,
        });
      }
    }

    const result = await formsSchema.findOne({
      userId: interaction.user.id,
    });

    if (result)
      return await interaction.reply({
        embeds: [embed.interactions.buttons.form_already_submitted],
        ephemeral: true,
      });

    await interaction.showModal(form);
  },
};
