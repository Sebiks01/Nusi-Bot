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

      const result1 = await formsSchema.findOne({ messageId: message.id });
      if (result1) await formsSchema.deleteOne(result1.id);

      const result2 = await recrruitmentMessagesSchema.findOne({
        messageId: message.id,
      });
      if (result2) await recrruitmentMessagesSchema.deleteOne(result2.id);
    });
  },
};
