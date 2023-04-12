const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require('discord.js');
const chalk = require('chalk');

const recruitmentModsSchema = require('../../schemas/recruitmentMods');

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
    if (!interaction.guild) return;

    const sub = interaction.options.getSubcommand();
    const role = interaction.options.getRole('role');

    await interaction.deferReply({ ephemeral: true });
    const result = await recruitmentModsSchema.findOne({ roleId: role.id });

    try {
      switch (sub) {
        case 'add': {
          if (result)
            return await interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setTitle('⛔️ BŁĄD')
                  .setDescription(
                    'Ta ranga została już ustawiona jako moderator rekrutacji!'
                  )
                  .setColor(0xf10303)
                  .setThumbnail(
                    'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=700&height=676'
                  )
                  .setFooter({
                    text: 'NUSI.PL',
                    iconURL:
                      'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=699&height=675',
                  }),
              ],
              ephemeral: true,
            });

          await recruitmentModsSchema.create({ roleId: role.id });
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle('MODERATOR REKRUTACJI')
                .setDescription(
                  '✔️ Ranga została dodana jako **MODERATOR REKRUTACJI**!'
                )
                .setColor(0x1bed03)
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
                  .setTitle('MODERATOR REKRUTACJI')
                  .setDescription('Nie ma tej rangi moderatora w bazie danych!')
                  .setColor(0xf10303)
                  .setThumbnail(
                    'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=700&height=676'
                  )
                  .setFooter({
                    text: 'NUSI.PL',
                    iconURL:
                      'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=699&height=675',
                  }),
              ],
              ephemeral: true,
            });

          await recruitmentModsSchema.deleteOne({ roleId: role.id });
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle('MODERATOR REKRUTACJI')
                .setDescription(
                  '❌ Ranga została usunięta jako **MODERATOR REKRUTACJI**!'
                )
                .setColor(0xff0909)
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
        chalk.yellow('[WARN] Error in the "recruitment-mod" command.')
      );
      console.log(err);

      await interaction.editReply({
        content: 'An error has occurred. Please contact an administrator!',
        ephemeral: true,
      });
    }
  },
};
