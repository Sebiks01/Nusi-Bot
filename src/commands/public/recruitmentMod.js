const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
} = require('discord.js');

const recruitmentModsSchema = require('../../schemas/recruitmentMods');
const embed = require('../../config/embeds');
const msg = require('../../config/messages');

// Command object
module.exports = {
  data: new SlashCommandBuilder()
    .setName('recruitment-mod')
    .setDescription('Manages recruitment moderator roles.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
      sub
        .setName('add')
        .setDescription('Adds a recruitment moderator role.')
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
        .setDescription('Removes a recruitment moderator role.')
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
    const sub = interaction.options.getSubcommand();
    const role = interaction.options.getRole('role');

    await interaction.deferReply();
    const result = await recruitmentModsSchema.findOne({ roleId: role.id });

    try {
      switch (sub) {
        case 'add': {
          if (result)
            return await interaction.editReply({
              content: 'do zmiany (rola jest juz w bazie)',
              ephemeral: true,
            });

          await recruitmentModsSchema.create({ roleId: role.id });
          await interaction.editReply({
            embeds: [embed.pub_cmds.recruitment_mod_add_success],
            ephemeral: true,
          });

          break;
        }

        case 'remove': {
          if (!result)
            return await interaction.editReply({
              content: 'do zmiany (nie ma roli w bazie)',
              ephemeral: true,
            });

          await recruitmentModsSchema.deleteOne({ roleId: role.id });
          await interaction.editReply({
            embeds: [embed.pub_cmds.recruitment_mod_remove_success],
            ephemeral: true,
          });

          break;
        }
      }
    } catch (err) {
      console.log(msg.pub_cmds.recruitment_mod_err);
      console.log(err);

      await interaction.editReply({
        content: 'An error has occurred. Please contact an administrator!',
        ephemeral: true,
      });
    }
  },
};
