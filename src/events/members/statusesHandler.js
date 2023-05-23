const { Client, Events, Presence, ActivityType } = require('discord.js');

// Event object
module.exports = {
  name: Events.PresenceUpdate,

  /**
   *
   * @param { Presence } oldPresence
   * @param { Presence } newPresence
   * @param { Client } client
   */

  async execute(oldPresence, newPresence, client) {
    /**
     * @param {String} state
     * @returns {Boolean} checkStatus
     */

    const checkStatus = (state) => {
      state = state.toLowerCase();
      const requirementCheck = /dc.test.pl/g.test(state);
      if (requirementCheck) state = state.replace(/dc.test.pl/g, '');
      else return false;

      const blacklistCheck =
        /[a-zA-Z0-9-.]+\s?(.|dot|(dot)|-|;|:|,)\s?(com|org|net|cz|co|uk|sk|biz|mobi|pl|net|eu|com.pl|xxx|eu|me|io)/.test(
          state
        );
      if (blacklistCheck) return false;

      return true;
    };

    const oldActivities = oldPresence?.activities;
    const newActivities = newPresence.activities;

    if (
      (!oldPresence ||
        oldActivities.length === 0 ||
        oldActivities[0].type !== ActivityType.Custom ||
        !oldActivities[0].state) &&
      newActivities.length > 0 &&
      newActivities[0].type === ActivityType.Custom &&
      newActivities[0].state
    ) {
      // Dodano status

      if (checkStatus(newActivities[0].state)) {
        try {
          if (newPresence.member.roles.cache.has(client.stausesRoleId)) return;

          return newPresence.member.roles.add(client.stausesRoleId);
        } catch (error) {
          console.log("Role doesn't exist");
          return console.log(error.message);
        }
      }
    }

    if (
      oldPresence &&
      oldActivities.length > 0 &&
      oldActivities[0].type === ActivityType.Custom &&
      newActivities.length > 0 &&
      newActivities[0].type === ActivityType.Custom &&
      newActivities[0].state
    ) {
      if (oldActivities[0].state !== newActivities[0].state) {
        // Zmieniono sratus

        if (checkStatus(newActivities[0].state)) {
          try {
            if (newPresence.member.roles.cache.has(client.stausesRoleId))
              return;

            return newPresence.member.roles.add(client.stausesRoleId);
          } catch (error) {
            console.log("Role doesn't exist");
            return console.log(error.message);
          }
        } else {
          try {
            if (!newPresence.member.roles.cache.has(client.stausesRoleId))
              return;

            return newPresence.member.roles.remove(client.stausesRoleId);
          } catch (error) {
            console.log("Role doesn't exist");
            return console.log(error.message);
          }
        }
      } else {
        // Nie zmieniono status

        if (checkStatus(newActivities[0].state)) {
          try {
            if (newPresence.member.roles.cache.has(client.stausesRoleId))
              return;

            return newPresence.member.roles.add(client.stausesRoleId);
          } catch (error) {
            console.log("Role doesn't exist");
            return console.log(error.message);
          }
        } else {
          try {
            if (!newPresence.member.roles.cache.has(client.stausesRoleId))
              return;

            return newPresence.member.roles.remove(client.stausesRoleId);
          } catch (error) {
            console.log("Role doesn't exist");
            return console.log(error.message);
          }
        }
      }
    }

    if (
      oldPresence &&
      oldActivities.length > 0 &&
      oldActivities[0].type === ActivityType.Custom &&
      oldActivities[0].state &&
      (newActivities.length === 0 ||
        (newActivities.length > 0 &&
          newActivities[0].type !== ActivityType.Custom) ||
        (newActivities[0].type === ActivityType.Custom &&
          !newActivities[0].state))
    ) {
      // Usunięto status

      try {
        if (!newPresence.member.roles.cache.has(client.stausesRoleId)) return;

        return newPresence.member.roles.remove(client.stausesRoleId);
      } catch (error) {
        console.log("Role doesn't exist");
        return console.log(error.message);
      }
    }
  },
};
