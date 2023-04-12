const chalk = require('chalk');

const { loadFiles } = require('../util/fileLoader.js');

async function loadEvents(client) {
  console.log(chalk.blue('[INFO] Loading events...'));

  // Logging events loading time
  console.time(chalk.green('[INFO] Loaded events in'));

  // Creating a new client events map
  client.events = new Map();

  const events = new Array();

  // Loading events files
  const files = await loadFiles('src/events');

  // Looping through events files
  for (const file of files) {
    try {
      // Importing event file
      const event = require(file);

      // Defining execute function params
      const execute = (...args) => event.execute(...args, client);

      // Checking target
      const target = event.rest ? client.rest : client;

      // Adding listener
      target[event.once ? 'once' : 'on'](event.name, execute);

      // Adding event to client events map
      client.events.set(event.name, execute);

      // Adding event to events array
      events.push({
        Event: file.split('/').pop().slice(0, -3),
        Type: event.name,
        Status: '✅',
      });
    } catch (err) {
      // Adding errored event file to events array
      events.push({ Event: file.split('/').pop().slice(0, -3), Status: '🛑' });

      console.log(
        chalk.yellow(
          `[WARN] Error in event "${file.split('/').pop().slice(0, -3)}".`
        )
      );
      console.log(err);
    }
  }

  // Logging events array as a table
  console.table(events);
  console.timeEnd(chalk.green('[INFO] Loaded events in'));
}

module.exports = { loadEvents };
