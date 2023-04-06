const { loadFiles } = require('../util/fileLoader.js')
const msg = require('../config/messages.js')
const path = require('../config/paths.js')

async function loadEvents(client) {
  console.log(msg.handlers.load_events_start);

  // Logging events loading time
  console.time(msg.handlers.load_events_time);

  // Creating a new client events map
  client.events = new Map();

  const events = new Array();

  // Loading events files
  const files = await loadFiles(path.events);

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
        Status: msg.handlers.events_table_success_emoji,
      });
    } catch (err) {
      // Adding errored event file to events array
      events.push({ Event: file.split('/').pop().slice(0, -3), Status: msg.handlers.events_table_error_emoji });

      console.log(
        msg.handlers.event_load_err.replace(/{EVENT_NAME}/g, file.split('/').pop().slice(0, -3))
      );
      console.log(err);
    }
  }

  // Logging events array as a table
  console.table(events);
  console.timeEnd(msg.handlers.load_events_time);
}

module.exports = { loadEvents };
