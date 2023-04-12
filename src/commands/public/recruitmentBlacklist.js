const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require('discord.js');
const chalk = require('chalk');

const recruitmentBlacklistsSchema = require('../../schemas/recruitmentBlacklists');

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
              embeds: [
                new EmbedBuilder()
                  .setTitle('⛔️ BŁĄD')
                  .setDescription(
                    'Rola jest już ustawiona! Aby zmienić rolę na początku musisz ją usunąć!'
                  )
                  .setColor(0xff0707)
                  .setFooter({
                    text: 'NUSI.PL',
                    iconURL:
                      'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=699&height=675',
                  }),
              ],
              ephemeral: true,
            });

          await recruitmentBlacklistsSchema.create({ roleId: role.id });
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle('REKRUTACJA')
                .setDescription(
                  'Rola została dodana do czarnej listy do rekrutacji!'
                )
                .setColor(0x12e507)
                .setFooter({
                  text: 'NUSI.PL',
                  iconURL:
                    'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=699&height=675',
                }),
            ],
            ephemeral: true,
          });

          break;
        }

        case 'remove': {
          if (!result)
            return await interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setTitle('⛔️ BŁĄD')
                  .setDescription('Rola nie została znaleziona w bazie danych!')
                  .setColor(0xff0707)
                  .setFooter({
                    text: 'NUSI.PL',
                    iconURL:
                      'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=699&height=675',
                  }),
              ],
              ephemeral: true,
            });

          await recruitmentBlacklistsSchema.deleteOne({ roleId: role.id });
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle('REKRUTACJA')
                .setDescription(
                  'Rola została usunięta z czarnej listy do rekrutacji!'
                )
                .setColor(0xff0707)
                .setFooter({
                  text: 'NUSI.PL',
                  iconURL:
                    'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=699&height=675',
                }),
            ],
            ephemeral: true,
          });

          break;
        }
      }
    } catch (err) {
      console.log(
        chalk.yellow('[WARN] Error in the "recruitment-blacklist" command.')
      );
      console.log(err);

      await interaction.editReply({
        content: 'An error has occurred. Please contact an administrator!',
        ephemeral: true,
      });
    }
  },
};
