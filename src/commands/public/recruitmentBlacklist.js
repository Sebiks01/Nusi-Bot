const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
} = require('discord.js');

const recruitmentBlacklistsSchema = require('../../schemas/recruitmentBlacklists');
const embed = require('../../config/embedsAndComponents.js');
const msg = require('../../config/messages');

// Command object
module.exports = {
  data: new SlashCommandBuilder()
    .setName('recruitment-blacklist')
    .setDescription('Manages recruitment blacklist roles.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
      sub
        .setName('add')
        .setDescription('Adds a recruitment blacklist role.')
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('The role to add.')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('remove')
        .setDescription('Removes a recruitment blacklist role.')
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('The role to remove.')
            .setRequired(true)
        )
    ),

  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } _
   */

  async execute(interaction, _) {
    if (!interaction.guild) return;

    const sub = interaction.options.getSubcommand();
    const role = interaction.options.getRole('role');

    await interaction.deferReply({ ephemeral: true });
    const result = await recruitmentBlacklistsSchema.findOne({
      roleId: role.id,
    });

    try {
      switch (sub) {
        case 'add': {
          if (result)
            return await interaction.editReply({
              embeds: [embed.pub_cmds.recruitment_blacklist_already_added],
              ephemeral: true,
            });

          await recruitmentBlacklistsSchema.create({ roleId: role.id });
          await interaction.editReply({
            embeds: [embed.pub_cmds.recruitment_blacklist_add_success],
            ephemeral: true,
          });

          break;
        }

        case 'remove': {
          if (!result)
            return await interaction.editReply({
              embeds: [embed.pub_cmds.recruitment_blacklist_not_found],
              ephemeral: true,
            });

          await recruitmentBlacklistsSchema.deleteOne({ roleId: role.id });
          await interaction.editReply({
            embeds: [embed.pub_cmds.recruitment_blacklist_remove_success],
            ephemeral: true,
          });

          break;
        }
      }
    } catch (err) {
      console.log(msg.pub_cmds.recruitment_blacklist_err);
      console.log(err);

      await interaction.editReply({
        content: 'An error has occurred. Please contact an administrator!',
        ephemeral: true,
      });
    }
  },
};
