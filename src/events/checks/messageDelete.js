const { Message, Client, Events } = require('discord.js');

const formsSchema = require('../../schemas/forms.js');
const recrruitmentMessagesSchema = require('../../schemas/recruitmentMessages.js');

module.exports = {
  name: Events.MessageDelete,

  /**
   *
   * @param { Message } message
   * @param { Client } _
   */

  async execute(message, _) {
    if (!message.inGuild()) return;

    await formsSchema.deleteOne({ messageId: message.id });

    await recrruitmentMessagesSchema.deleteOne({
      messageId: message.id,
    });
  },
};
