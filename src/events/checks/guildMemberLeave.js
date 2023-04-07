const { Client, Events, GuildMember } = require('discord.js');

const formsSchema = require('../../schemas/forms.js');

module.exports = {
  name: Events.GuildMemberRemove,

  /**
   *
   * @param { GuildMember } member
   * @param { Client } _
   */

  async execute(member, _) {
    const result = await formsSchema.findOne({ userId: member.user.id });
    if (!result) return;

    await formsSchema.deleteOne(result.id);

    try {
      const channel = await member.guild.channels.fetch(result.channelId);

      const message = await channel.messages.fetch(result.messageId);

      await message.delete();
    } catch {}
  },
};
