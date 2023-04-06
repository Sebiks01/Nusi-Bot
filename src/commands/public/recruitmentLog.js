const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
  ChannelType,
} = require('discord.js');

const recruitmentLogSchema = require('../../schemas/recruitmentLog');
const embed = require('../../config/embeds');
const msg = require('../../config/messages');

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
    const channel = interaction.options.getChannel('channel');

    await interaction.deferReply();

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
        content: 'do zmiany (ustawiono kanal logow)',
        ephemeral: true,
      });
    } catch (err) {
      console.log(msg.pub_cmds.recruitment_log_err);
      console.log(err);

      await interaction.editReply({
        content: 'An error has occurred. Please contact an administrator!',
        ephemeral: true,
      });
    }
  },
};
