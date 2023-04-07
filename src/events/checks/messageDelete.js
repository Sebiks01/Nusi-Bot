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

    const result1 = await formsSchema.findOne({ messageId: message.id });
    if (result1) await formsSchema.deleteOne(result1.id);

    const result2 = await recrruitmentMessagesSchema.findOne({
      messageId: message.id,
    });
    if (result2) await recrruitmentMessagesSchema.deleteOne(result2.id);
  },
};
