const { ButtonInteraction, Client } = require('discord.js');

const form = require('../../../config/form');

module.exports = {
  name: 'interactionCreate',

  /**
   *
   * @param { ButtonInteraction } interaction
   * @param { Client } _
   */

  async execute(interaction, _) {
    if (
      !interaction.isButton() &&
      interaction.customId !== 'recruitment-form-init'
    )
      return;

    await interaction.showModal(form);
  },
};
