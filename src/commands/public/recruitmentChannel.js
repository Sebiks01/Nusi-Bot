const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
  ChannelType,
} = require('discord.js');

const recruitmentChannelSchema = require('../../schemas/recruitmentChannel.js');
const embed = require('../../config/embedsAndComponents.js');
const msg = require('../../config/messages');

// Command object
module.exports = {
  data: new SlashCommandBuilder()
    .setName('recruitment-channel')
    .setDescription('Sets the recruitment channel to send forms.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Recruitment forms channel.')
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
      await recruitmentChannelSchema.findOneAndUpdate(
        {},
        {
          channelId: channel.id,
        },
        {
          new: true,
          upsert: true,
        }
      );

      await interaction.editReply({
        embeds: [embed.pub_cmds.recruitment_channel_set],
        ephemeral: true,
      });
    } catch (err) {
      console.log(msg.pub_cmds.recruitment_channel_err);
      console.log(err);

      await interaction.editReply({
        content: 'An error has occurred. Please contact an administrator!',
        ephemeral: true,
      });
    }
  },
};
