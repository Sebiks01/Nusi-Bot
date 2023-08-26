const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    ChannelType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } = require('discord.js');
  
  // Command object
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('verification')
      .setDescription('Verification message.')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .addChannelOption((option) =>
        option
          .setName('channel')
          .setDescription('Verification channel.')
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true)
      ),
    /**
     *
     * @param { ChatInputCommandInteraction } interaction
     * @param { Client } client
     */
  
    async execute(interaction, client) {
      if (!interaction.guild) return;
  
      await interaction.deferReply();
  
      const channel = interaction.options.getChannel('channel');

      await channel.send({
        content: '# :flag_pl: WERYFIKACJA  /  :flag_gb: VERIFICATION',
        components: [new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId('verify')
            .setEmoji('📑')
            .setLabel('Zweryfikuj się')
            .setStyle(ButtonStyle.Primary)
        )]
      })

      interaction.editReply({
        content: 'Verification message sent.',
        ephemeral: true,
      })
    },
  };
  