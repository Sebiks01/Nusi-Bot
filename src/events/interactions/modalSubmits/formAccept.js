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
        chalk.yellow(
          '[WARN] Error in "formAccept.js". Form not found in databse.'
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
        chalk.yellow('[WARN] Error in "formAccept.js". Form channel not found.')
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
        chalk.yellow('[WARN] Error in "formAccept.js". Form message not found.')
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
        chalk.yellow(
          '[WARN] Error in "formAccept.js". Log channel not found in databse.'
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
            '[WARN] Error in "formAccept.js". Log channel not found.'
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
          '[WARN] Error in "formAccept.js/formReject.js". Cant send message to user.'
        )
      );
    }

    await formsSchema.deleteOne({
      userId: userId,
    });

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle('✔️ PODANIE ZAAKCEPTOWANE')
          .setDescription(`Podanie gracza ${user.tag} zostało zaakceptowane!`)
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
  },
};
