const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');

module.exports = {
  form_accept: new ModalBuilder()
    .setTitle('Podanie {USER_TAG}') // Placeholders: {USER_TAG} - The user tag (Username#Discriminator)
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('accept-reason')
          .setLabel('Powód akceptacji:')
          .setPlaceholder('Spełnia wymagania.')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMaxLength(100)
          .setMinLength(5)
      )
    ),

  form_reject: new ModalBuilder()
    .setTitle('Podanie {USER_TAG}') // Placeholders: {USER_TAG} - The user tag (Username#Discriminator)
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('reject-reason')
          .setLabel('Powód odrzucenia:')
          .setPlaceholder('Nie spełnia wymagania.')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMaxLength(100)
          .setMinLength(5)
      )
    ),
};
