const { ChatInputCommandInteraction, Client, Events } = require('discord.js');
const chalk = require('chalk');

// Event object
module.exports = {
  name: Events.InteractionCreate,

  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } client
   */

  async execute(interaction, client) {
    // Checking if interaction is a chat input command
    if (!interaction.isChatInputCommand() && !interaction.isAutocomplete())
      return;

    if (interaction.isChatInputCommand()) {
      // Fetching the command from the client commands collection
      const command = client.commands.get(interaction.commandName);

      // Checking if the command exists
      if (!command) {
        console.log(
          chalk.yellow(`[WARN] Command ${interaction.commandName} is outdated.`)
        );

        return interaction.reply({
          content: 'This command is outdated.',
          ephemeral: true,
        });
      }

      // Checking if the command is developer only and the user isn't a developer
      if (command.dev && !client.devs.includes(interaction.user.id)) {
        return interaction.reply({
          content: 'This command is only available to the developer.',
          ephemeral: true,
        });
      }

      // Executing the command
      command.execute(interaction, client);
    } else if (interaction.isAutocomplete()) {
      // Fetching the command from the client commands collection
      const command = client.commands.get(interaction.commandName);

      // Checking if the command exists
      if (!command)
        return console.log(
          chalk.yellow(`[WARN] Command ${interaction.commandName} is outdated.`)
        );

      // Executing autocomplete for the command
      try {
        await command.autocomplete(interaction, client);
      } catch (err) {
        console.log(
          chalk.yellow(
            `[WARN] Error with autocomplete in ${interaction.commandName} command.`
          )
        );
        console.log(err);
      }
    }
  },
};
