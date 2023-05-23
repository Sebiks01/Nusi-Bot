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
    ),
  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } client
   */

  async execute(interaction, client) {
    if (!interaction.guild) return;

    const messageId = interaction.options.getString('message-id');
    const winnersCount = interaction.options.getNumber('winners-count');
    const message = interaction.options.getString('message');

    const giveawayMessage = await interaction.channel.messages.fetch(messageId);
    if (!giveawayMessage) {
      interaction.reply({
        content: 'Message not found.',
        ephemeral: true,
      });

      return;
    }

    const reactions = giveawayMessage.reactions.cache;
    const participants = [];
    const winners = [];

    reactions.forEach((reaction) => {
      users = reaction.users.cache;

      users.forEach((user) =>
        participants.indexOf(user.id) === -1 ? participants.push(user.id) : null
      );
    });

    for (let i = 0; i < winnersCount; i++) {
      const winner =
        participants[Math.floor(Math.random() * participants.length)];

      winners.push(winner);
      participants.splice(participants.indexOf(winner), 1);
    }

    for (const winner of winners) {
      const winnerTag = (await client.users.fetch(winner)).tag;

      const embed = new EmbedBuilder()
        .setDescription(`🎁 <@${winner}> (${winnerTag}) wygrywa **${message}**`)
        .setColor(0xff49fc);

      await giveawayMessage.reply({
        embeds: [embed],
      });
    }
  },
};
