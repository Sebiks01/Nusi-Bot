const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
require('dotenv/config.js');

const { loadEvents } = require('./handlers/eventsHandler.js');
const { mongoConnect } = require('./util/mongoConnect.js');
const msg = require('./config/messages.js')

const { Guilds, GuildMembers, GuildMessages, MessageContent } = GatewayIntentBits;
const { User, Message, GuildMember } = Partials;

// Creating the client
const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, MessageContent],
  partials: [User, Message, GuildMember],
});

// Creating a new collection of commands
client.commands = new Collection();

// Creating a new collection of events
client.events = new Collection();

// Creating a new collection of developers
client.devs = ['793780954803601429'];

// Connecting to the database
mongoConnect();

// Loading client events
loadEvents(client);

// Login to client
client.login(process.env.TOKEN).catch((err) => {
  console.log(msg.main.invalid_token);
  console.log(err);
});
