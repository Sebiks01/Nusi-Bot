const { GuildChannel, Client, Events, ChannelType } = require('discord.js');

const formsSchema = require('../../schemas/forms.js');
const recruitmentChannelSchema = require('../../schemas/recruitmentChannel.js');
const recruitmentLogSchema = require('../../schemas/recruitmentLog.js');
const recruitmentMessagesSchema = require('../../schemas/recruitmentMessages.js');

module.exports = {
  name: Events.ChannelDelete,

  /**
   *
   * @param { GuildChannel } channel
   * @param { Client } _
   */

  async execute(channel, _) {
    if (channel.type !== ChannelType.GuildText) return;

    const results1 = await formsSchema.find({ channelId: channel.id });
    if (results1.length != 0) await formsSchema.deleteMany(results1);

    const result2 = await recruitmentChannelSchema.findOne({
      channelId: channel.id,
    });
    if (result2) await recruitmentChannelSchema.deleteOne(result2.id);

    const result3 = await recruitmentLogSchema.findOne({
      channelId: channel.id,
    });
    if (result3) await recruitmentLogSchema.deleteOne(result3.id);

    const results4 = await recruitmentMessagesSchema.find({
      channelId: channel.id,
    });
    if (results4.length != 0)
      await recruitmentMessagesSchema.deleteMany(results4);
  },
};
