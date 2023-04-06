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
    new ActionRowBuilder().addComponents([
      new TextInputBuilder()
        .setCustomId('recruitment-q1')
        .setLabel('Czy spełniasz wszystkie podane wymagania?')
        .setStyle(TextInputStyle.Short)
        .setMinLength(3)
        .setMaxLength(3)
        .setPlaceholder('(TAK/NIE)')
        .setRequired(true),

        new TextInputBuilder()
        .setCustomId('recruitment-q2')
        .setLabel('Jaki masz nick w Minecraft?')
        .setStyle(TextInputStyle.Short)
        .setMinLength(2)
        .setMaxLength(20)
        .setPlaceholder('Tutaj wpisz nick..')
        .setRequired(true),

        new TextInputBuilder()
        .setCustomId('recruitment-q3')
        .setLabel('Opisz siebie w min 3 rozbudowanych zdaniach.')
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(50)
        .setMaxLength(1000)
        .setPlaceholder('(Imie, wiek, zainteresowania, doświadczenie)')
        .setRequired(true),

        new TextInputBuilder()
        .setCustomId('recruitment-q4')
        .setLabel('Jak oceniasz swoje umiejętności komunikacji z innymi? (1-10)')
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(50)
        .setMaxLength(1000)
        .setPlaceholder('Odpowiedź...')
        .setRequired(true),

        new TextInputBuilder()
        .setCustomId('recruitment-q5')
        .setLabel('5. Co chciałbyś aby zostało zmienione na serwerze?')
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(50)
        .setMaxLength(1000)
        .setPlaceholder('Odpowiedź...')
        .setRequired(true),
    ])
  );
