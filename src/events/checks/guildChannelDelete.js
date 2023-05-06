const { GuildChannel, Client, Events, ChannelType } = require('discord.js');

const formsSchema = require('../../schemas/forms.js');
const recruitmentChannelSchema = require('../../schemas/recruitmentChannel.js');
const recruitmentLogSchema = require('../../schemas/recruitmentLog.js');
const recruitmentMessagesSchema = require('../../schemas/recruitmentMessages.js');
const suggestionsChannelSchema = require('../../schemas/suggestionsChannel.js');

module.exports = {
  name: Events.ChannelDelete,

  /**
   *
   * @param { GuildChannel } channel
   * @param { Client } _
   */

  async execute(channel, _) {
    if (channel.type !== ChannelType.GuildText) return;

    await formsSchema.deleteMany({ channelId: channel.id });

    await recruitmentChannelSchema.deleteOne({
      channelId: channel.id,
    });

    await recruitmentLogSchema.deleteOne({
      channelId: channel.id,
    });

    await recruitmentMessagesSchema.deleteMany({
      channelId: channel.id,
    });

    await suggestionsChannelSchema.deleteOne({
      channelId: channel.id,
    });
  },
};
