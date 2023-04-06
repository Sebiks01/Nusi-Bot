const {
  ModalSubmitInteraction,
  Client,
  Events,
  EmbedBuilder,
} = require('discord.js');

const recruitmentLogSchema = require('../../../schemas/recruitmentLog.js');
const formsSchema = require('../../../schemas/forms.js');
const embed = require('../../../config/embedsAndComponents.js');

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

      return console.log('Nie znaleziono podania w bazie (dz)');
    }

    let formChannel, formMessage;

    try {
      formChannel = await interaction.guild.channels.fetch(result.channelId);
    } catch {
      await interaction.editReply({
        content: 'An error has occurred. Please contact an administrator!',
        ephemeral: true,
      });

      return console.log('Nie znaleziono kanału podania (dz)');
    }

    try {
      formMessage = await formChannel.messages.fetch(result.messageId);
    } catch {
      await interaction.editReply({
        content: 'An error has occurred. Please contact an administrator!',
        ephemeral: true,
      });

      return console.log('Nie znaleziono wiadomosci podania (dz)');
    }

    await formMessage.edit({
      embeds: [
        EmbedBuilder.from(formMessage.embeds.shift())
          .setTitle(`[ZAAKCEPTOWANE] ${formMessage.embeds.shift().title}`)
          .setColor(0x64eb04),
      ],
      components: [],
    });

    const logChannelResult = await recruitmentLogSchema.findOne();
    if (!logChannelResult) {
      console.log('no log channel, skipping logging (dz)');
    } else {
      try {
        const logChannel = interaction.guild.channels.fetch(
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
        console.log('log channel not found, skipping logging (dz)');
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
      console.log('cant send message to user');
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
