const { Client } = require('discord.js');

const msg = require('../../config/messages.js')
const { loadCommands } = require('../../handlers/commandsHandler.js');

// Event object
module.exports = {
  name: 'ready',
  once: true,

  /**
   *
   * @param { Client } client
   */

  execute(client) {
    // Logging that the client is ready
    console.log(msg.events.client.client_ready);

    // Loading client commands
    loadCommands(client);
  },
};
