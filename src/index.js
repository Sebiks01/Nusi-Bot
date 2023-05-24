const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require('discord.js');
const chalk = require('chalk');
require('dotenv/config.js');

const { loadEvents } = require('./handlers/eventsHandler.js');
const { mongoConnect } = require('./util/mongoConnect.js');

const {
  Guilds,
  GuildMembers,
  GuildMessages,
  MessageContent,
  GuildPresences,
  GuildMessageReactions,
} = GatewayIntentBits;
const { User, Message, GuildMember } = Partials;

// Creating the client
const client = new Client({
  intents: [
    Guilds,
    GuildMembers,
    GuildMessages,
    MessageContent,
    GuildPresences,
    GuildMessageReactions,
  ],
  partials: [User, Message, GuildMember],
});

// Creating a new collection of commands
client.commands = new Collection();

// Creating a new collection of events
client.events = new Collection();

// Creating a new collection of developers
client.devs = ['793780954803601429', '904341940139606057'];

client.statusesRoleId = '1094989603905208432';
client.statusesGuildId = '949266894588874782';

// Connecting to the database
mongoConnect();

// Loading client events
loadEvents(client);

// Login to client
client.login(process.env.TOKEN).catch((err) => {
  console.log(chalk.red('[ERROR] Inavlid token provided.'));
  console.log(err);
});
