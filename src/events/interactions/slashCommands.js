const { ChatInputCommandInteraction, Client } = require('discord.js');

const msg = require('../../config/messages.js')

// Event object
module.exports = {
  name: 'interactionCreate',

  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } client
   */

  async execute(interaction, client) {
    // Checking if interaction is a chat input command
    if (!interaction.isChatInputCommand()) return;

    // Fetching the command from the client commands collection
    const command = client.commands.get(interaction.commandName);

    // Checking if the command exists
    if (!command) {
      return interaction.reply({
        content: msg.events.interactions.outdated_cmd,
        ephemeral: true,
      });
    }

    // Checking if the command is developer only and the user isn't a developer
    if (command.dev && !client.devs.includes(interaction.user.id)) {
      return interaction.reply({
        content: msg.events.interactions.dev_only_cmd,
        ephemeral: true,
      });
    }

    // Executing the command
    command.execute(interaction, client);
  },
};
