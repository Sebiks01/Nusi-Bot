const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
  ChannelType,
  EmbedBuilder,
} = require('discord.js');
const chalk = require('chalk');

const recruitmentLogSchema = require('../../schemas/recruitmentLog');

// Command object
module.exports = {
  data: new SlashCommandBuilder()
    .setName('recruitment-log')
    .setDescription('Sets the recruitment log channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Logs channel or none to unset.')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
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
      if (!channel) {
        const result = await recruitmentLogSchema.findOne();

        if (result) {
          await recruitmentLogSchema.deleteOne({ channelId: result.channelId });
        }
      } else {
        await recruitmentLogSchema.findOneAndUpdate(
          {},
          {
            channelId: channel.id,
          },
          {
            new: true,
            upsert: true,
          }
        );
      }

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle('✔️ KANAŁ LOGÓW ZOSTAŁ USTAWIONY')
            .setDescription(
              'Od teraz wszystkie odrzucone/zaakceptowane podania będą wysyłane na ten kanał.'
            )
            .setColor(0xe7b707)
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
        chalk.yellow('[WARN] Error in the "recruitment-log" command.')
      );
      console.log(err);

      await interaction.editReply({
        content: 'An error has occurred. Please contact an administrator!',
        ephemeral: true,
      });
    }
  },
};
