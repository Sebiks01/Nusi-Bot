const { ButtonInteraction, Client, Events } = require('discord.js');

const embed = require('../../../config/embedsAndComponents.js');
const reasonModals = require('../../../config/reasonModals.js');
const recruitmentModsSchema = require('../../../schemas/recruitmentMods.js');

module.exports = {
  name: Events.InteractionCreate,

  /**
   *
   * @param { ButtonInteraction } interaction
   * @param { Client } client
   */

  async execute(interaction, client) {
    if (!interaction.isButton() || interaction.customId !== 'form-accept')
      return;

    const results = await recruitmentModsSchema.find();

    for (const result of results) {
      if (interaction.member.roles.cache.has(result.roleId)) {
        const userId = interaction.message.content.slice(2, -1);
        const user = await client.users.fetch(userId);

        return await interaction.showModal(
          reasonModals.form_accept
            .setTitle(
              reasonModals.form_accept.data.title.replace(
                /{USER_TAG}/g,
                user.tag
              )
            )
            .setCustomId(`form-acceptreason-${user.id}`)
        );
      }
    }

    await interaction.reply({
      embeds: [embed.misc.recruitment_no_access],
      ephemeral: true,
    });
  },
};
