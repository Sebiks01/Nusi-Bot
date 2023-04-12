const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const chalk = require('chalk');

const recruitmentMessagesSchema = require('../../schemas/recruitmentMessages');

// Command object
module.exports = {
  data: new SlashCommandBuilder()
    .setName('recruitment-toggle')
    .setDescription('Toggles the recruitment status.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName('status')
        .setDescription('The toggle status.')
        .setRequired(true)
        .addChoices({ name: 'on', value: 'on' }, { name: 'off', value: 'off' })
    ),

  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } _
   */

  async execute(interaction, _) {
    if (!interaction.guild) return;

    const status = interaction.options.getString('status');
    const { guild } = interaction;

    await interaction.deferReply({ ephemeral: true });

    try {
      const results = await recruitmentMessagesSchema.find();

      switch (status) {
        case 'on': {
          for (const { channelId, messageId } of results) {
            let channel, message;

            try {
              channel = await guild.channels.fetch(channelId);
            } catch {
              await recruitmentMessagesSchema.deleteOne({
                channelId: channelId,
                messageId: messageId,
              });
              continue;
            }

            try {
              message = await channel.messages.fetch(messageId);
            } catch {
              await recruitmentMessagesSchema.deleteOne({
                channelId: channelId,
                messageId: messageId,
              });
              continue;
            }

            await message.edit({
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
          }

          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle('STATUS REKRUTACJI')
                .setDescription('✔️ Rekrutacja została włączona!')
                .setColor(0x0acb00)
                .setFooter({
                  text: 'NUSI.PL',
                  iconURL:
                    'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=699&height=675',
                }),
            ],
            ephemeral: true,
          });

          break;
        }

        case 'off': {
          for (const { channelId, messageId } of results) {
            const channel = await guild.channels.fetch(channelId);
            if (!channel) {
              await recruitmentMessagesSchema.deleteOne({
                channelId: channelId,
                messageId: messageId,
              });
              continue;
            }

            const message = await channel.messages.fetch(messageId);
            if (!message) {
              await recruitmentMessagesSchema.deleteOne({
                channelId: channelId,
                messageId: messageId,
              });
              continue;
            }

            await message.edit({
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
                    .setDisabled(true)
                ),
              ],
            });
          }

          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle('STATUS REKRUTACJI')
                .setDescription('❌ Rekrutacja została wyłączona!')
                .setColor(0xed0303)
                .setFooter({
                  text: 'NUSI.PL',
                  iconURL:
                    'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=699&height=675',
                }),
            ],
            ephemeral: true,
          });

          break;
        }
      }
    } catch (err) {
      console.log(
        chalk.yellow('[WARN] Error in the "recruitment-toggle" command.')
      );
      console.log(err);

      await interaction.editReply({
        content: 'An error has occurred. Please contact an administrator!',
        ephemeral: true,
      });
    }
  },
};
