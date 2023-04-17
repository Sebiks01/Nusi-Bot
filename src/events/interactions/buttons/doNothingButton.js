const { ButtonInteraction, Client, Events } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,

  /**
   *
   * @param { ButtonInteraction } interaction
   * @param { Client } _
   */

  async execute(interaction, _) {
    if (!interaction.isButton() || interaction.customId !== 'do-nothing-button')
      return;

    await interaction.deleteReply();
  },
};
