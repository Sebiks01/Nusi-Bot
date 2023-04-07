const {
  ModalSubmitInteraction,
  Client,
  Events,
  EmbedBuilder,
} = require('discord.js');

const recruitmentLogSchema = require('../../../schemas/recruitmentLog.js');
const formsSchema = require('../../../schemas/forms.js');
const embed = require('../../../config/embedsAndComponents.js');
const msg = require('../../../config/messages.js');

module.exports = {
  name: Events.InteractionCreate,

  /**
   *
   * @param { ModalSubmitInteraction } interaction
   * @param { Client } client
   */

  async execute(interaction, client) {
    if (
      !interaction.isModalSubmit() ||
      !interaction.customId.startsWith('form-acceptreason-')
    )
      return;

    await interaction.deferReply({ ephemeral: true });

    const userId = interaction.customId.split('-').pop();
    const user = await client.users.fetch(userId);
    const reason = interaction.fields.getTextInputValue('accept-reason');

    const result = await formsSchema.findOne({
      userId: userId,
    });

    if (!result) {
      await interaction.editReply({
        content: 'An error has occurred. Please contact an administrator!',
        ephemeral: true,
      });

      return console.log(
        msg.events.interactions.modalSubmits.db_form_not_found
      );
    }

    let formChannel, formMessage;

    try {
      formChannel = await interaction.guild.channels.fetch(result.channelId);
    } catch {
      await interaction.editReply({
        content: 'An error has occurred. Please contact an administrator!',
        ephemeral: true,
      });

      return console.log(
        msg.events.interactions.modalSubmits.form_channel_not_found
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
        msg.events.interactions.modalSubmits.form_message_not_found
      );
    }

    await formMessage.edit({
      embeds: [
        EmbedBuilder.from(formMessage.embeds[0])
          .setTitle(`[ZAAKCEPTOWANE] ${formMessage.embeds[0].data.title}`)
          .setColor(0x64eb04),
      ],
      components: [],
    });

    const logChannelResult = await recruitmentLogSchema.findOne();
    if (!logChannelResult) {
      console.log(
        msg.events.interactions.modalSubmits.db_log_channel_not_found
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
        console.log(msg.events.interactions.modalSubmits.log_channel_not_found);
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
      console.log(msg.events.interactions.modalSubmits.user_send_err);
    }

    await formsSchema.deleteOne({
      userId: userId,
    });

    await interaction.editReply({
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
  },
};
