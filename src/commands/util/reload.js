const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
} = require('discord.js');

const { loadCommands } = require('../../handlers/commandsHandler.js');
const { loadEvents } = require('../../handlers/eventsHandler.js');
const msg = require('../../config/messages.js');

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
          content: msg.util_cmds.cmds_reload,
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
          content: msg.util_cmds.events_reload,
          ephemeral: true,
        });

        break;
      }

      // Checking for an internal error
      default: {
        interaction.reply({
          content: msg.util_cmds.err_reply,
          ephemeral: true,
        });

        console.log(msg.util_cmds.err_log);

        break;
      }
    }
  },
};
