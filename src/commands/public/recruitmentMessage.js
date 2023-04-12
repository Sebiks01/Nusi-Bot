const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
  ChannelType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require('discord.js');
const chalk = require('chalk');

const recruitmentChannelSchema = require('../../schemas/recruitmentChannel.js');
const recruitmentMessagesSchema = require('../../schemas/recruitmentMessages');

// Command object
module.exports = {
  data: new SlashCommandBuilder()
    .setName('recruitment-message')
    .setDescription('Sends the recruitment message.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel in which the message will be sent.')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } _
   */

  async execute(interaction, _) {
    if (!interaction.guild) return;

    const channel = interaction.options.getChannel('channel');

    await interaction.deferReply({ ephemeral: true });

    try {
      if (!(await recruitmentChannelSchema.findOne()))
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle('⛔️ BŁĄD')
              .setDescription(
                'Kanał nie został utworzony lub został on usunięty! Nie można wysłać formularza!'
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

      const message = await channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('REKRUTACJA DO ADMINISTRACJI SERWERA NUSI.PL')
            .setDescription(
              '**WYMAGANIA REKRUTACYJNE!**\n> - 14 lat\n> - Minecraft Premium\n> - Znajomość ortografii oraz interpunkcji.\n> - Dobra opinia wśród innych graczy oraz administracji.\n> - Aktywność na serwerze Minecraft oraz na Discord! (12h tygodniowo na serwerze minecraft oraz podstawowa aktywność na discord czyli odpowiadnie na tickety, kanały pomocy itp.)\n> - Kultura osobista\n\n**PYTANIA REKRUTACYJNE!**\n> 1. Czy spełniasz **wszystkie** podane wymagania?\n> 2. Jaki masz nick w **Minecraft**\n> 3. Opisz siebie w minimum **3 rozbudowanych zdaniach** (Imie, wiek, zainteresowania, doświadczenie w pełnieniu funkcji minecraft)\n> 4. Jak oceniasz swoje umiejętności **komunikacji** z innymi? Czy inne osoby odbierają ciebie przyjaźnie? (1-10)\n> 5. Co chciałbyś aby zostało **zmienione** na serwerze?\n\nWszystkie podania po zakończeniu zostają wysłane na kanał <#1091502812401250405>, można napisać tylko jedno podanie do czasu'
            )
            .setColor(0x0acb00)
            .setImage(
              'https://media.discordapp.net/attachments/1038820694642937936/1092149856442793984/REKRUTACJA.png?width=1320&height=550'
            )
            .setFooter({
              text: 'NUSI.PL',
              iconURL:
                'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=699&height=675',
            }),
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('recruitment-form-init')
              .setLabel('KLIKNIJ ABY NAPISAĆ PODANIE')
              .setStyle(ButtonStyle.Success)
              .setEmoji('📝')
          ),
        ],
      });

      await recruitmentMessagesSchema.create({
        channelId: channel.id,
        messageId: message.id,
      });

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle('REKRUTACJA')
            .setDescription('Formularz rekrutacji został pomyślnie wysłany!')
            .setColor(0x03df03)
            .setThumbnail(
              'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=699&height=675'
            )
            .setFooter({
              text: 'NUSI.PL',
              iconURL:
                'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=699&height=675',
            }),
        ],
        ephemeral: true,
      });
    } catch (err) {
      console.log(
        chalk.yellow('[WARN] Error in the "recruitment-message" command.')
      );
      console.log(err);

      await interaction.editReply({
        content: 'An error has occurred. Please contact an administrator!',
        ephemeral: true,
      });
    }
  },
};
