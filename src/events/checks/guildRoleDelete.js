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
    await recruitmentBlacklistsSchema.deleteMany({
      roleId: role.id,
    });

    await recruitmentModsSchema.deleteMany({ roleId: role.id });
  },
};
