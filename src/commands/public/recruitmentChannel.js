const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
  ChannelType,
  EmbedBuilder,
} = require('discord.js');
const chalk = require('chalk');

const recruitmentChannelSchema = require('../../schemas/recruitmentChannel.js');

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
        embeds: [
          new EmbedBuilder()
            .setTitle('KANAŁ PODAŃ')
            .setDescription('Pomyślnie ustawiono kanał publicznych podań!')
            .setColor(0x16e532)
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
        chalk.yellow('[WARN] Error in the "recruitment-channel" command.')
      );
      console.log(err);

      await interaction.editReply({
        content: 'An error has occurred. Please contact an administrator!',
        ephemeral: true,
      });
    }
  },
};
