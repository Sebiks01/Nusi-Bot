const { Client, Events, Role } = require('discord.js');

const recruitmentBlacklistsSchema = require('../../schemas/recruitmentBlacklists.js');
const recruitmentModsSchema = require('../../schemas/recruitmentMods.js');

module.exports = {
  name: Events.GuildRoleDelete,

  /**
   *
   * @param { Role } role
   * @param { Client } _
   */

  async execute(role, _) {
    const results1 = await recruitmentBlacklistsSchema.find({
      roleId: role.id,
    });
    if (results1.length !== 0)
      await recruitmentBlacklistsSchema.deleteMany(results1);

    const results2 = await recruitmentModsSchema.find({ roleId: role.id });
    if (results2.length !== 0) await recruitmentModsSchema.deleteMany(results2);
  },
};
