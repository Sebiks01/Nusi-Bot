const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
} = require('discord.js');
const chalk = require('chalk');

const { loadCommands } = require('../../handlers/commandsHandler.js');
const { loadEvents } = require('../../handlers/eventsHandler.js');

// Command object
module.exports = {
  dev: true,
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reloads the bot commands/events.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
      sub.setName('commands').setDescription('Reloads the bot commands.')
    )
    .addSubcommand((sub) =>
      sub.setName('events').setDescription('Reloads the bot events.')
    ),

  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } client
   */

  execute(interaction, client) {
    // Getting the used subcommand
    const subCommand = interaction.options.getSubcommand();

    // Checking for the subcommand type
    switch (subCommand) {
      case 'commands': {
        // Loading client commands
        loadCommands(client);

        interaction.reply({
          content: 'Reloaded commands.',
          ephemeral: true,
        });

        break;
      }

      case 'events': {
        // Looping through the client events collection
        for (const [key, value] of client.events) {
          // Removing the event listener
          client.removeListener(`${key}`, value, true);
        }

        // Loading client events
        loadEvents(client);

        interaction.reply({
          content: 'Reloaded Events.',
          ephemeral: true,
        });

        break;
      }

      // Checking for an internal error
      default: {
        interaction.reply({
          content:
            'An internal error has occured, contact an administrator immediately!',
          ephemeral: true,
        });

        console.log(
          chalk.yellow(
            '[WARN] Error in the "reload" command: Invalid subcommand.'
          )
        );

        break;
      }
    }
  },
};
