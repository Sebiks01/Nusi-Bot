const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');

module.exports = new ModalBuilder()
  .setTitle('Formularz Rekrutacji')
  .setCustomId('recruitment-form')
  .addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('recruitment-q1')
        .setLabel('1. Czy spełniasz wszystkie wymagania?')
        .setStyle(TextInputStyle.Short)
        .setMinLength(3)
        .setMaxLength(3)
        .setPlaceholder('TAK/NIE')
        .setRequired(true)
    ),

    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('recruitment-q2')
        .setLabel('2. Jaki masz nick w Minecraft?')
        .setStyle(TextInputStyle.Short)
        .setMinLength(2)
        .setMaxLength(20)
        .setPlaceholder('Ja_Kuba')
        .setRequired(true)
    ),

    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('recruitment-q3')
        .setLabel('3. Opisz siebie (min 3 rozbudowane zdania).')
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(50)
        .setMaxLength(1000)
        .setPlaceholder('Miejsce na historie twojego życia...')
        .setRequired(true)
    ),

    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('recruitment-q4')
        .setLabel('4. Dlaczego właśnie ciebie mam wybrać?')
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(50)
        .setMaxLength(1000)
        .setPlaceholder('Lubie pieski')
        .setRequired(true)
    ),

    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('recruitment-q5')
        .setLabel('5. Co chciałbyś zmienić na serwerze?')
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(50)
        .setMaxLength(1000)
        .setPlaceholder('Nic, super serwer')
        .setRequired(true)
    )
  );
