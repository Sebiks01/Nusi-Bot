const { ButtonInteraction, Client, Events } = require('discord.js');

const verificationCooldownsSchema = require('../../../schemas/verificationCooldowns.js');

module.exports = {
  name: Events.InteractionCreate,

  /**
   *
   * @param { ButtonInteraction } interaction
   * @param { Client } _
   */

  async execute(interaction, client) {
    if (!interaction.isButton() || !interaction.customId.startsWith('captcha-'))
      return;

    await interaction.deferReply({ ephemeral: true });

    const status = interaction.customId.split('-')[1];

    if (status == 'success') {
      await interaction.editReply({
        content: 'Weryfikacja została pomyślnie ukończona!',
        ephemeral: true,
      });

      try {
        await interaction.member.roles.add(client.verificationRoleId);
      } catch (err) {
        console.log(err);
        console.log(
          'Could not add verifiaction role to user.',
          interaction.user.id
        );
      }
    } else {
      await verificationCooldownsSchema.create({
        userId: interaction.user.id,
        expires: Date.now() + 1000 * 10,
      });

      await interaction.editReply({
        content: 'Weryfikacja nie powiodła się! Spróbuj ponownie!',
        ephemeral: true,
      });
    }
  },
};
