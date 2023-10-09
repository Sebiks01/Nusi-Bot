const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require('discord.js');

// Command object
module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Picks random winners from reactions to a message.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName('message-id')
        .setDescription('The message ID of the giveaway.')
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName('winners-count')
        .setDescription('The number of winners to pick.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('message')
        .setDescription('The message to be displayed.')
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName('role')
        .setDescription('State a winning only role.')
        .setRequired(false)
    ),
  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } client
   */

  async execute(interaction, client) {
    if (!interaction.guild) return;

    await interaction.deferReply();

    const messageId = interaction.options.getString('message-id');
    const winnersCount = interaction.options.getNumber('winners-count');
    const message = interaction.options.getString('message');
    const role = interaction.options.getRole('role');

    const giveawayMessage = await interaction.channel.messages.fetch(messageId);
    if (!giveawayMessage) {
      interaction.reply({
        content: 'Message not found.',
        ephemeral: true,
      });

      return;
    }

    const reactions = giveawayMessage.reactions.cache;
    let participants = new Array();

    for (const reaction of reactions.values()) {
      const users = await reaction.users.fetch();

      for (const user of users.values()) {
        if (participants.indexOf(user.id) !== -1 || user.bot) continue;

        if (role && !user.roles.cache.has(role.id)) continue;

        participants.push(user.id);
      }
    }

    for (let i = 0; i < winnersCount; i++) {
      if (participants.length === 0) break;

      const winner =
        participants[Math.floor(Math.random() * participants.length)];
      participants.splice(participants.indexOf(winner), 1);

      const winnerTag = (await client.users.fetch(winner)).tag;

      const embed = new EmbedBuilder()
        .setDescription(`🎁 <@${winner}> (${winnerTag}) wygrywa **${message}**`)
        .setColor(0xff49fc);

      await giveawayMessage.reply({
        embeds: [embed],
      });
    }

    interaction.deleteReply();
  },
};
