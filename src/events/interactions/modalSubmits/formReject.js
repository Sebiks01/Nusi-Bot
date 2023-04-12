const {
  ModalSubmitInteraction,
  Client,
  Events,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const chalk = require('chalk');

const recruitmentLogSchema = require('../../../schemas/recruitmentLog.js');
const formsSchema = require('../../../schemas/forms.js');

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
      !interaction.customId.startsWith('form-rejectreason-')
    )
      return;

    await interaction.deferReply({ ephemeral: true });

    const userId = interaction.customId.split('-').pop();
    const user = await client.users.fetch(userId);
    const reason = interaction.fields.getTextInputValue('reject-reason');

    const result = await formsSchema.findOne({
      userId: userId,
    });

    if (!result) {
      await interaction.editReply({
        content: 'An error has occurred. Please contact an administrator!',
        ephemeral: true,
      });

      return console.log(
        chalk.yellow(
          '[WARN] Error in "formReject.js". Form not found in databse.'
        )
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
        chalk.yellow('[WARN] Error in "formReject.js". Form channel not found.')
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
        chalk.yellow('[WARN] Error in "formReject.js". Form message not found.')
      );
    }

    await formMessage.delete();

    const logChannelResult = await recruitmentLogSchema.findOne();
    if (!logChannelResult) {
      console.log(
        chalk.yellow(
          '[WARN] Error in "formReject.js". Log channel not found in databse.'
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
            '[WARN] Error in "formReject.js". Log channel not found.'
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
          '[WARN] Error in "formReject.js". Cant send message to user.'
        )
      );
    }

    await formsSchema.deleteOne({
      userId: userId,
    });

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle('❌ PODANIE ODRZUCONE')
          .setDescription(`Podanie gracza ${user.tag} zostało odrzucone!`)
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
