const {
  ButtonInteraction,
  Client,
  Events,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
} = require('discord.js');

const verificationCooldownsSchema = require('../../../schemas/verificationCooldowns.js');

const { Primary, Secondary, Success, Danger } = ButtonStyle;

function generateButtons(userId) {
  const styles = [
    { pl: 'NIEBIESKI', en: 'BLUE', s: Primary },
    { pl: 'SZARY', en: 'GRAY', s: Secondary },
    { pl: 'ZIELONY', en: 'GREEN', s: Success },
    { pl: 'CZERWONY', en: 'RED', s: Danger },
  ];

  const icons = [
    { pl: 'HELIKOPTEREM', en: 'HELICOPTER', i: '🚁' },
    { pl: 'SZCZUREM', en: 'RAT', i: '🐀' },
    { pl: 'KOTEM', en: 'CAT', i: '🐱' },
    { pl: 'PSEM', en: 'DOG', i: '🐶' },
    { pl: 'KROWĄ', en: 'COW', i: '🐮' },
    { pl: 'DUCHEM', en: 'GHOST', i: '👻' },
    { pl: 'RYBĄ', en: 'FISH', i: '🐟' },
    { pl: 'KACZKĄ', en: 'DUCK', i: '🦆' },
  ];

  const buttons = [];

  while (buttons.length < 25) {
    const randomStyle = Math.floor(Math.random() * styles.length);
    const randomIcon = Math.floor(Math.random() * icons.length);

    const button = { s: styles[randomStyle], i: icons[randomIcon] };

    if (buttons.some((b) => JSON.stringify(b) == JSON.stringify(button)))
      continue;
    buttons.push(button);
  }

  const customIds = [];

  const randomSuccess = Math.floor(Math.random() * buttons.length);

  while (customIds.length < 25) {
    if (customIds.length === randomSuccess) {
      customIds.push(`captcha-success-${userId}`);
      continue;
    }

    customIds.push(`captcha-fail-${userId}-${customIds.length}`);
  }

  return {
    buttons,
    customIds,
    successStyle: {
      pl: buttons[randomSuccess].s.pl,
      en: buttons[randomSuccess].s.en,
    },
    successIcon: {
      pl: buttons[randomSuccess].i.pl,
      en: buttons[randomSuccess].i.en,
    },
  };
}

module.exports = {
  name: Events.InteractionCreate,

  /**
   *
   * @param { ButtonInteraction } interaction
   * @param { Client } _
   */

  async execute(interaction, _) {
    if (!interaction.isButton() || interaction.customId !== 'verify') return;

    await interaction.deferReply({ ephemeral: true });

    const cooldown = await verificationCooldownsSchema.findOne({
      userId: interaction.user.id,
    });

    if (cooldown) {
      const timeLeft = cooldown.expires - Date.now();

      if (timeLeft > 0) {
        return await interaction.editReply({
          content: `Musisz poczekać jeszcze ${Math.floor(timeLeft / 1000)}s.`,
          ephemeral: true,
        });
      } else {
        await verificationCooldownsSchema.deleteOne({
          userId: interaction.user.id,
        });
      }
    }

    const buttons = generateButtons(interaction.user.id);

    const components = [];

    for (let i = 0; i < 5; i++) {
      const row = new ActionRowBuilder();

      for (let j = 0; j < 5; j++) {
        const button = buttons.buttons[i * 5 + j];
        const customId = buttons.customIds[i * 5 + j];

        row.addComponents(
          new ButtonBuilder()
            .setCustomId(customId)
            .setEmoji(button.i.i)
            .setStyle(button.s.s)
        );
      }

      components.push(row);
    }

    await interaction.editReply({
      content: `🇵🇱  Zweryfikuj się klikając **${buttons.successStyle.pl}** przycisk z **${buttons.successIcon.pl}**!\n🇬🇧  Verify yourself by clicking the **${buttons.successStyle.en}** button with a **${buttons.successIcon.en}**!`,
      components: components,
      ephemeral: true,
    });
  },
};
