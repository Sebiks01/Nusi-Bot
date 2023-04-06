const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
} = require('discord.js');

const recruitmentMessagesSchema = require('../../schemas/recruitmentMessages');
const embed = require('../../config/embedsAndComponents.js');
const msg = require('../../config/messages');

// Command object
module.exports = {
  data: new SlashCommandBuilder()
    .setName('recruitment-toggle')
    .setDescription('Toggles the recruitment status.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName('status')
        .setDescription('The toggle status.')
        .setRequired(true)
        .addChoices({ name: 'on', value: 'on' }, { name: 'off', value: 'off' })
    ),

  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } _
   */

  async execute(interaction, _) {
    if (!interaction.guild) return;

    const status = interaction.options.getString('status');
    const { guild } = interaction;

    await interaction.deferReply({ ephemeral: true });

    try {
      const results = await recruitmentMessagesSchema.find();

      switch (status) {
        case 'on': {
          for (const { channelId, messageId } of results) {
            let channel, message;

            try {
              channel = await guild.channels.fetch(channelId);
            } catch {
              await recruitmentMessagesSchema.deleteOne({
                channelId: channelId,
                messageId: messageId,
              });
              continue;
            }

            try {
              message = await channel.messages.fetch(messageId);
            } catch {
              await recruitmentMessagesSchema.deleteOne({
                channelId: channelId,
                messageId: messageId,
              });
              continue;
            }

            await message.edit({
              embeds: [embed.pub_cmds.recruitment_embed_init],
              components: [embed.pub_cmds.recruitment_on_row],
            });
          }

          await interaction.editReply({
            embeds: [embed.pub_cmds.recruitment_on_reply],
            ephemeral: true,
          });

          break;
        }

        case 'off': {
          for (const { channelId, messageId } of results) {
            const channel = await guild.channels.fetch(channelId);
            if (!channel) {
              await recruitmentMessagesSchema.deleteOne({
                channelId: channelId,
                messageId: messageId,
              });
              continue;
            }

            const message = await channel.messages.fetch(messageId);
            if (!message) {
              await recruitmentMessagesSchema.deleteOne({
                channelId: channelId,
                messageId: messageId,
              });
              continue;
            }

            await message.edit({
              embeds: [embed.pub_cmds.recruitment_embed_init],
              components: [embed.pub_cmds.recruitment_off_row],
            });
          }

          await interaction.editReply({
            embeds: [embed.pub_cmds.recruitment_off_reply],
            ephemeral: true,
          });

          break;
        }
      }
    } catch (err) {
      console.log(msg.pub_cmds.recruitment_toggle_err);
      console.log(err);

      await interaction.editReply({
        content: 'An error has occurred. Please contact an administrator!',
        ephemeral: true,
      });
    }
  },
};
