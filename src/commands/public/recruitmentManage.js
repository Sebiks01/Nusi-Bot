const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
  AutocompleteInteraction,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require('discord.js');
const chalk = require('chalk');

const recruitmentModsSchema = require('../../schemas/recruitmentMods.js');
const recruitmentLogSchema = require('../../schemas/recruitmentLog');
const formsSchema = require('../../schemas/forms.js');

// Command object
module.exports = {
  data: new SlashCommandBuilder()
    .setName('recruitment-manage')
    .setDescription('Accept or reject a users recruitation form.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
      sub
        .setName('accept')
        .setDescription('Accept a user.')
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription('User to accept.')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('accept-reason')
            .setDescription('Reason for acception.')
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('reject')
        .setDescription('Reject a user.')
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription('User to reject.')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('reject-reason')
            .setDescription('Reason for rejection.')
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),

  /**
   *
   * @param { AutocompleteInteraction } interaction
   * @param { Client } _
   */

  async autocomplete(interaction, _) {
    const focusedOption = interaction.options.getFocused(true);
    let choices;

    if (focusedOption.name === 'accept-reason') {
      choices = [
        'Twoje podanie zostało zaakceptowane, zgłoś się w tickecie w celu przeprowadzenia 2 etapu.',
      ];
    }

    if (focusedOption.name === 'reject-reason') {
      choices = [
        'Nie spełniasz wymagań.',
        'Podanie posiada błędy ortograficzne.',
        'Byłeś zbyt często karany.',
      ];
    }

    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedOption.value)
    );

    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },

  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } _
   */

  async execute(interaction, _) {
    await interaction.deferReply({ ephemeral: true });

    const results = await recruitmentModsSchema.find();

    for (const result of results) {
      if (interaction.member.roles.cache.has(result.roleId)) {
        const subCommand = interaction.options.getSubcommand();
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString(`${subCommand}-reason`);

        const result = await formsSchema.findOne({
          userId: user.id,
        });

        if (!result) {
          await interaction.editReply({
            content: 'Nie ma takiego podania (dz)',
            ephemeral: true,
          });

          return console.log(
            chalk.yellow(
              '[WARN] Error in "recruitmentManage.js". Form not found in databse.'
            )
          );
        }

        let formChannel, formMessage;

        try {
          formChannel = await interaction.guild.channels.fetch(
            result.channelId
          );
        } catch {
          await interaction.editReply({
            content: 'An error has occurred. Please contact an administrator!',
            ephemeral: true,
          });

          return console.log(
            chalk.yellow(
              '[WARN] Error in "recruitmentManage.js". Form channel not found.'
            )
          );
        }

        try {
          formMessage = await formChannel.messages.fetch(result.messageId);
        } catch {
          await interaction.editReply({
            content: 'An error has occurred. Please contact an administrator!',
            ephemeral: true,
          });

          return console.log(
            chalk.yellow(
              '[WARN] Error in "recruitmentManage.js". Form message not found.'
            )
          );
        }

        await formsSchema.deleteOne({
          userId: user.id,
        });

        const logChannelResult = await recruitmentLogSchema.findOne();

        switch (subCommand) {
          case 'accept': {
            await formMessage.edit({
              embeds: [
                EmbedBuilder.from(formMessage.embeds[0])
                  .setTitle(
                    `[ZAAKCEPTOWANE] ${formMessage.embeds[0].data.title}`
                  )
                  .setColor(0x64eb04),
              ],
              components: [],
            });

            if (!logChannelResult) {
              console.log(
                chalk.yellow(
                  '[WARN] Error in "recruitmentManage.js". Log channel not found in databse.'
                )
              );
            } else {
              try {
                const logChannel = await interaction.guild.channels.fetch(
                  logChannelResult.channelId
                );

                await logChannel.send({
                  embeds: [
                    EmbedBuilder.from(formMessage.embeds.shift())
                      .setTitle(`✉️ Podanie zaakceptowane ${user.tag}`)
                      .setColor(0x23f103),
                  ],
                });
              } catch {
                console.log(
                  chalk.yellow(
                    '[WARN] Error in "recruitmentManage.js". Log channel not found.'
                  )
                );
              }
            }

            try {
              await user.send({
                embeds: [
                  new EmbedBuilder()
                    .setTitle('🟢 TWOJE PODANIE ZOSTAŁO ZAAKCEPTOWANE!')
                    .setDescription(
                      `Zostajesz przyjęty na **DRUGI ETAP REKRUTACJI** do naszej administracji!\n\n**POWÓD:**\n\`\`\`${reason}\`\`\`\nSkontaktuj się w tickecie w ciągu **48h** od otrzymania tej wiadomości aby otrzymać termin drugiego etapu, jeżeli nie otworzysz ticketa w ciągu wyznaczonego czasu zostajesz automatycznie usunięty z listy osób do rekrutacji! 😱\n`
                    )
                    .setColor(0x20e506)
                    .setThumbnail(
                      'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=700&height=676'
                    )
                    .setFooter({
                      text: 'NUSI.PL',
                      iconURL:
                        'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=699&height=675',
                    }),
                ],
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId('do-nothing-button')
                      .setLabel('OKEJ, ROZUMIEM!')
                      .setStyle(ButtonStyle.Success)
                      .setEmoji('👋')
                  ),
                ],
              });
            } catch {
              console.log(
                chalk.yellow(
                  '[WARN] Error in "recruitmentManage.js". Cant send message to user.'
                )
              );
            }

            return await interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setTitle('✔️ PODANIE ZAAKCEPTOWANE')
                  .setDescription(
                    `Podanie gracza ${user.tag} zostało zaakceptowane!`
                  )
                  .setColor(0x1fe315)
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
          }

          case 'reject': {
            await formMessage.delete();

            if (!logChannelResult) {
              console.log(
                chalk.yellow(
                  '[WARN] Error in "recruitmentManage.js". Log channel not found in databse.'
                )
              );
            } else {
              try {
                const logChannel = await interaction.guild.channels.fetch(
                  logChannelResult.channelId
                );
                await logChannel.send({
                  embeds: [
                    EmbedBuilder.from(formMessage.embeds.shift())
                      .setTitle(`✉️ Podanie odrzucone ${user.tag}`)
                      .setColor(0xf10303),
                  ],
                });
              } catch {
                console.log(
                  chalk.yellow(
                    '[WARN] Error in "recruitmentManage.js". Log channel not found.'
                  )
                );
              }
            }

            try {
              await user.send({
                embeds: [
                  new EmbedBuilder()
                    .setTitle('🔴 TWOJE PODANIE ZOSTAŁO ODRZUCONE!')
                    .setDescription(
                      `Niestety nie udało się tobie przejść do **2 ETAPU REKRUTACJI** :sob:\n\n**POWÓD:**\n\`\`\`${reason}\`\`\`\nNie matrw się! Kolejnym razem napewno się uda!\n:dart: **Próba jest matką sukcesu** \n`
                    )
                    .setColor(0xe50606)
                    .setThumbnail(
                      'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=700&height=676'
                    )
                    .setFooter({
                      text: 'NUSI.PL',
                      iconURL:
                        'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=699&height=675',
                    }),
                ],
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId('do-nothing-button')
                      .setLabel('DO KOLEJNEGO!')
                      .setStyle(ButtonStyle.Danger)
                      .setEmoji('👋')
                  ),
                ],
              });
            } catch {
              console.log(
                chalk.yellow(
                  '[WARN] Error in "recruitmentManage.js". Cant send message to user.'
                )
              );
            }

            return await interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setTitle('❌ PODANIE ODRZUCONE')
                  .setDescription(
                    `Podanie gracza ${user.tag} zostało odrzucone!`
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
          }
        }
      }
    }

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle('⛔️ BŁĄD')
          .setDescription(
            'Komenda nie jest dostępna dla ciebie ponieważ nie jesteś **MODERATOREM REKRUTACJI**.'
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
  },
};
