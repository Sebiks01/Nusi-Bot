const { Client, Events } = require('discord.js');
const chalk = require('chalk');

const { loadCommands } = require('../../handlers/commandsHandler.js');

// Event object
module.exports = {
  name: Events.ClientReady,
  once: true,

  /**
   *
   * @param { Client } client
   */

  execute(client) {
    // Logging that the client is ready
    console.log(chalk.green('[INFO] The client is now ready.'));

    // Loading client commands
    loadCommands(client);
  },
};
