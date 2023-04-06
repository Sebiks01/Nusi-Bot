const { ButtonInteraction, Client, Events } = require('discord.js');

const form = require('../../../config/form');
const formsSchema = require('../../../schemas/forms.js')

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
    
    const result = await formsSchema.findOne({
      userId: interaction.user.id,
    })

    if (result) return await interaction.reply({
      content: 'Posiadasz już podanie (do zmiany)',
      ephemeral: true
    })

    await interaction.showModal(form);
  },
};
