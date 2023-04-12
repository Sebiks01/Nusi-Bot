const {
  ButtonInteraction,
  Client,
  Events,
  EmbedBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');

const recruitmentBlacklistSchema = require('../../../schemas/recruitmentBlacklists.js');
const formsSchema = require('../../../schemas/forms.js');

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
          embeds: [
            new EmbedBuilder()
              .setTitle('⛔️ BŁĄD')
              .setDescription(
                'Nie możesz napisać podania ponieważ jesteś na blackliście!'
              )
              .setColor(0xed0b0b)
              .setFooter({
                text: 'NUSI.PL',
                iconURL:
                  'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=699&height=675',
              }),
          ],
          ephemeral: true,
        });
      }
    }

    const result = await formsSchema.findOne({
      userId: interaction.user.id,
    });

    if (result)
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('⛔️ BŁĄD')
            .setDescription(
              'Nie możesz wysłać podania ponieważ już wysłałeś podanie do zatwierdzenia! Kolejne podanie będziesz mógł napisać gdy twoje podanie zostanie odrzucone/zaatwierdzone!'
            )
            .setColor(0xff0707)
            .setFooter({
              text: 'NUSI.PL',
              iconURL:
                'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=699&height=675',
            }),
        ],
        ephemeral: true,
      });

    await interaction.showModal(
      new ModalBuilder()
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
        )
    );
  },
};
