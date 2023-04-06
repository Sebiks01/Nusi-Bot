const { loadFiles } = require('../util/fileLoader.js');
const msg = require('../config/messages.js')
const path = require('../config/paths.js')

async function loadCommands(client) {
  console.log(msg.handlers.load_cmds_start);

  // Logging commands loading time
  console.time(msg.handlers.load_cmds_time);

  // Creating a new client commands map
  client.commands = new Map();

  const commands = new Array();
  const applicationCommands = new Array();

  // Loading commands files
  const files = await loadFiles(path.commands);

  // Loooping through commands files
  for (const file of files) {
    try {
      // Importing command file
      const command = require(file);

      // Adding command to client commands collection
      client.commands.set(command.data.name, command);

      applicationCommands.push(command.data.toJSON());

      // Adding event to events array
      commands.push({ Command: command.data.name, Status: msg.handlers.cmds_table_success_emoji });
    } catch (err) {
      // Adding errored event file to events array
      commands.push({
        Command: file.split('/').pop().slice(0, -3),
        Status: msg.handlers.cmds_table_error_emoji,
      });

      console.log(
        msg.handlers.cmd_load_err.replace(/{CMD_NAME}/g, file.split('/').pop().slice(0, -3))
      );
      console.log(err);
    }
  }

  client.application.commands.set(applicationCommands);

  // Logging commands array as a table
  console.table(commands);
  console.timeEnd(msg.handlers.load_cmds_time);
}

module.exports = { loadCommands };
