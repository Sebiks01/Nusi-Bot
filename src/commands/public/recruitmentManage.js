const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
  AutocompleteInteraction,
} = require('discord.js');

const recruitmentModsSchema = require('../../schemas/recruitmentMods.js');
const recruitmentLogSchema = require('../../schemas/recruitmentLog');
const formsSchema = require('../../schemas/forms.js');
const embed = require('../../config/embedsAndComponents.js');
const msg = require('../../config/messages');

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
      choices = msg.pub_cmds.accept_reason_autocomplete;
    }

    if (focusedOption.name === 'reject-reason') {
      choices = msg.pub_cmds.reject_reason_autocomplete;
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
            content: 'An error has occurred. Please contact an administrator!',
            ephemeral: true,
          });

          return console.log(msg.pub_cmds.db_form_not_found);
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

          return console.log(msg.pub_cmds.form_channel_not_found);
        }

        try {
          formMessage = await formChannel.messages.fetch(result.messageId);
        } catch {
          await interaction.editReply({
            content: 'An error has occurred. Please contact an administrator!',
            ephemeral: true,
          });

          return console.log(msg.pub_cmds.form_message_not_found);
        }

        await formsSchema.deleteOne({
          userId: userId,
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
              console.log(msg.pub_cmds.db_log_channel_not_found);
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
                console.log(msg.pub_cmds.log_channel_not_found);
              }
            }

            try {
              await user.send({
                embeds: [
                  embed.interactions.modalSubmits.user_accept_embed.setDescription(
                    embed.interactions.modalSubmits.user_accept_embed.data.description.replace(
                      /{REASON}/g,
                      reason
                    )
                  ),
                ],
                components: [embed.interactions.modalSubmits.user_accept_row],
              });
            } catch {
              console.log(msg.pub_cmds.user_send_err);
            }

            return await interaction.editReply({
              embeds: [
                embed.interactions.modalSubmits.accept_reply.setDescription(
                  embed.interactions.modalSubmits.accept_reply.data.description.replace(
                    /{USER_TAG}/g,
                    user.tag
                  )
                ),
              ],
              ephemeral: true,
            });
          }

          case 'reject': {
            await formMessage.delete();

            if (!logChannelResult) {
              console.log(msg.pub_cmds.db_log_channel_not_found);
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
                console.log(msg.pub_cmds.log_channel_not_found);
              }
            }

            try {
              await user.send({
                embeds: [
                  embed.interactions.modalSubmits.user_reject_embed.setDescription(
                    embed.interactions.modalSubmits.user_reject_embed.data.description.replace(
                      /{REASON}/g,
                      reason
                    )
                  ),
                ],
                components: [embed.interactions.modalSubmits.user_reject_row],
              });
            } catch {
              console.log(msg.pub_cmds.user_send_err);
            }

            return await interaction.editReply({
              embeds: [
                embed.interactions.modalSubmits.reject_reply.setDescription(
                  embed.interactions.modalSubmits.reject_reply.data.description.replace(
                    /{USER_TAG}/g,
                    user.tag
                  )
                ),
              ],
              ephemeral: true,
            });
          }
        }
      }
    }

    await interaction.editReply({
      embeds: [embed.misc.recruitment_no_access],
      ephemeral: true,
    });
  },
};
