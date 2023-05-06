const { Message, Client, Events } = require('discord.js');

const suggestionsChannelSchema = require('../../schemas/suggestionsChannel.js');

module.exports = {
  name: Events.MessageCreate,

  /**
   *
   * @param { Message } message
   * @param { Client } _
   */

  async execute(message, _) {
    if (!message.inGuild()) return;

    const channelResult = await suggestionsChannelSchema.findOne();
    if (!channelResult) return;

    if (message.channel.id !== channelResult.channelId) return;

    await message.react('👍');
    await message.react('👎');
    message.startThread({
      name: `Propozycja od ${message.author.tag}`,
      autoArchiveDuration: 10080,
    });
  },
};
