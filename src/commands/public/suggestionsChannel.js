const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
  ChannelType,
} = require('discord.js');

const suggestionsChannelSchema = require('../../schemas/suggestionsChannel.js');

// Command object
module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggestions-channel')
    .setDescription('Sets the suggestions channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Suggestions channel or none to unset.')
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
    await interaction.deferReply({ ephemeral: true });

    const channel = interaction.options.getChannel('channel');

    if (!channel) {
      await suggestionsChannelSchema.findOneAndDelete();
      return interaction.followUp({
        content: 'Suggestions channel has been unset.',
      });
    }

    await suggestionsChannelSchema.findOneAndUpdate(
      {},
      {
        channelId: channel.id,
      },
      {
        new: true,
        upsert: true,
      }
    );

    interaction.followUp({
      content: `Suggestions channel has been set to ${channel}.`,
    });
  },
};
