const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
  ChannelType,
} = require('discord.js');

const recruitmentChannelSchema = require('../../schemas/recruitmentChannel.js');
const recruitmentMessagesSchema = require('../../schemas/recruitmentMessages');
const embed = require('../../config/embedsAndComponents.js');
const msg = require('../../config/messages');

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
          embeds: [embed.pub_cmds.no_recruitment_channel],
          ephemeral: true,
        });

      const message = await channel.send({
        embeds: [embed.pub_cmds.recruitment_embed_init],
        components: [embed.pub_cmds.recruitment_row_init],
      });

      await recruitmentMessagesSchema.create({
        channelId: channel.id,
        messageId: message.id,
      });

      await interaction.editReply({
        embeds: [embed.pub_cmds.sent_recruitment_message_reply],
        ephemeral: true,
      });
    } catch (err) {
      console.log(msg.pub_cmds.recruitment_message_err);
      console.log(err);

      await interaction.editReply({
        content: 'An error has occurred. Please contact an administrator!',
        ephemeral: true,
      });
    }
  },
};
