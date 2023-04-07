const { ModalSubmitInteraction, Client, Events } = require('discord.js');

const formsSchema = require('../../../schemas/forms.js');
const recruitmentChannelSchema = require('../../../schemas/recruitmentChannel.js');

const embed = require('../../../config/embedsAndComponents.js');

module.exports = {
  name: Events.InteractionCreate,

  /**
   *
   * @param { ModalSubmitInteraction } interaction
   * @param { Client } _
   */

  async execute(interaction, _) {
    if (
      !interaction.isModalSubmit() ||
      interaction.customId !== 'recruitment-form'
    )
      return;

    await interaction.deferReply({ ephemeral: true });

    const answers = new Object();

    for (i = 0; i < interaction.fields.fields.size; i++) {
      answers[`answer${i + 1}`] = interaction.fields.getTextInputValue(
        `recruitment-q${i + 1}`
      );
    }

    try {
      const result = await recruitmentChannelSchema.findOne();
      const channel = await interaction.guild.channels.fetch(result.channelId);

      const message = await channel.send({
        content: `<@${interaction.user.id}>`,
        embeds: [
          embed.interactions.modalSubmits.form_embed
            .setTitle(
              embed.interactions.modalSubmits.form_embed.data.title.replace(
                /{USER_TAG}/g,
                interaction.user.tag
              )
            )
            .setDescription(
              embed.interactions.modalSubmits.form_embed.data.description
                .replace(/{ANSWER_1}/g, answers.answer1)
                .replace(/{ANSWER_2}/g, answers.answer2)
                .replace(/{ANSWER_3}/g, answers.answer3)
                .replace(/{ANSWER_4}/g, answers.answer4)
                .replace(/{ANSWER_5}/g, answers.answer5)
            ),
        ],
        components: [embed.interactions.modalSubmits.form_row],
      });

      await formsSchema.findOneAndUpdate(
        {
          userId: interaction.user.id,
        },
        {
          userId: interaction.user.id,
          channelId: channel.id,
          messageId: message.id,
          a1: answers.answer1,
          a2: answers.answer2,
          a3: answers.answer3,
          a4: answers.answer4,
          a5: answers.answer5,
        },
        {
          upsert: true,
          new: true,
        }
      );
    } catch {
      return await interaction.editReply({
        embeds: [embed.interactions.modalSubmits.missing_recruitment_channel],
        ephemeral: true,
      });
    }

    await interaction.editReply({
      embeds: [embed.interactions.modalSubmits.form_submit_reply],
      components: [embed.interactions.modalSubmits.form_submit_row],
      ephemeral: true,
    });
  },
};
