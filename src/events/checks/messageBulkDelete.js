const { Client, Events, Collection, GuildChannel } = require('discord.js');

const formsSchema = require('../../schemas/forms.js');
const recrruitmentMessagesSchema = require('../../schemas/recruitmentMessages.js');

module.exports = {
  name: Events.MessageBulkDelete,

  /**
   *
   * @param { Collection } messages
   * @param { GuildChannel } __
   * @param { Client } _
   */

  async execute(messages, __, _) {
    messages.forEach(async (message) => {
      if (!message.inGuild()) return;

      await formsSchema.deleteOne({ messageId: message.id });

      await recrruitmentMessagesSchema.deleteOne({
        messageId: message.id,
      });
    });
  },
};
