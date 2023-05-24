const chalk = require('chalk');

const { loadFiles } = require('../util/fileLoader.js');

async function loadCommands(client) {
  console.log(chalk.blue('[INFO] Loading commands...'));

  // Logging commands loading time
  console.time(chalk.green('[INFO] Loaded commands in'));

  // Creating a new client commands map
  client.commands = new Map();

  const commands = new Array();
  const applicationCommands = new Array();

  // Loading commands files
  const files = await loadFiles('src/commands');

  // Loooping through commands files
  for (const file of files) {
    try {
      // Importing command file
      const command = require(file);

      // Adding command to client commands collection
      client.commands.set(command.data.name, command);

      applicationCommands.push(command.data.toJSON());

      // Adding event to events array
      commands.push({ Command: command.data.name, Status: '✅' });
    } catch (err) {
      // Adding errored event file to events array
      commands.push({
        Command: file.split('/').pop().slice(0, -3),
        Status: '🛑',
      });

      console.log(
        chalk.yellow(
          `[WARN] Error in command "${file.split('/').pop().slice(0, -3)}".`
        )
      );
      console.log(err);
    }
  }

  console.log(applicationCommands);

  client.application.commands.set(applicationCommands);

  // Logging commands array as a table
  console.table(commands);
  console.timeEnd(chalk.green('[INFO] Loaded commands in'));
}

module.exports = { loadCommands };
