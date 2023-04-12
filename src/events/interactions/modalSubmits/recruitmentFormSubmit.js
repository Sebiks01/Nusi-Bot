const {
  ModalSubmitInteraction,
  Client,
  Events,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

const formsSchema = require('../../../schemas/forms.js');
const recruitmentChannelSchema = require('../../../schemas/recruitmentChannel.js');

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
          new EmbedBuilder()
            .setTitle(`Podanie gracza ${interaction.user.tag}`)
            .setDescription(
              `**1.** Czy spełniasz wszystkie wymagania?\n\`\`\`${answers.answer1}\`\`\`\n\n**2.** Jaki masz nick w Minecraft?\n\`\`\`${answers.answer2}\`\`\`\n\n**3.** Opisz siebie (min 3 rozbudowane zdania).\n\`\`\`${answers.answer3}\`\`\`\n\n**4.** Dlaczego właśnie ciebie mam wybrać?\n\`\`\`${answers.answer4}\`\`\`\n\n**5.** Co chciałbyś zmienić na serwerze?\n\`\`\`${answers.answer5}\`\`\``
            )
            .setColor(0xebcc04)
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
              .setCustomId('form-accept')
              .setStyle(ButtonStyle.Success)
              .setEmoji('✔'),

            new ButtonBuilder()
              .setCustomId('form-reject')
              .setStyle(ButtonStyle.Danger)
              .setEmoji('❌')
          ),
        ],
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
        embeds: [
          new EmbedBuilder()
            .setTitle('⛔️ BŁĄD')
            .setDescription(
              'Kanał nie został utworzony lub został on usunięty! Nie można wysłać formularza!'
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
    }

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle('📩 TWOJE PODANIE ZOSTAŁO WYSŁANE')
          .setDescription(
            'Rekrutacja została pomyślnie przesłana! Sprawdź kanał <#1091502812401250405> oraz oczekuj wyników w wiadomości prywatnej od <@1009158071467126855>!'
          )
          .setColor(0x0acb00)
          .setImage(
            'https://media.discordapp.net/attachments/1038820694642937936/1092161241658691624/REKRUTACJA_1.png?width=1320&height=550'
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
            .setLabel('DZIĘKI ZA TĄ INFORMACJE, CZEKAM!')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('❤')
        ),
      ],
      ephemeral: true,
    });
  },
};
