const { Client, Events, ActivityType } = require('discord.js');

const statusesTimersSchema = require('../../schemas/statusesTimers');

// Event object
module.exports = {
  name: Events.ClientReady,

  /**
   *
   * @param { Client } client
   */

  async execute(client) {
    const checkStatus = (state) => {
      state = state.toLowerCase();
      const requirementCheck = /dc.nusi.pl/g.test(state);
      if (requirementCheck) state = state.replace(/dc.nusi.pl/g, '');
      else return false;

      const blacklistCheck =
        /[a-zA-Z0-9-.]+\s?(.|dot|(dot)|-|;|:|,)\s?(com|org|net|cz|co|uk|sk|biz|mobi|pl|net|eu|com.pl|xxx|eu|me|io)/.test(
          state
        );
      if (blacklistCheck) return false;

      return true;
    };

    const addToStatusTimer = async () => {
      const guild = await client.guilds.fetch(client.statusesGuildId);

      for (const member of guild.members.cache.values()) {
        if (
          !member.presence?.activities.length === 0 ||
          !member.presence.activities[0].type !== ActivityType.Custom ||
          !member.presence.activities[0].state
        ) {
          if (member.roles.cache.has(client.statusesRoleId))
            try {
              await member.roles.remove(client.statusesRoleId);
            } catch {}
        }

        if (checkStatus(member.presence.activities[0].state)) {
          if (!member.roles.cache.has(client.statusesRoleId))
            try {
              await member.roles.add(client.statusesRoleId);
            } catch {}
        }

        if (!member.roles.cache.has(client.statusesRoleId)) continue;

        await statusesTimersSchema.findOneAndUpdate(
          {
            userId: member.id,
          },
          {
            userId: member.id,
            $inc: { timeInMinutes: 1 },
          },
          {
            new: true,
            upsert: true,
          }
        );
      }

      setTimeout(addToStatusTimer, 1000 * 60);
    };

    addToStatusTimer();
  },
};
