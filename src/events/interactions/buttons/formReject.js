const {
  ButtonInteraction,
  Client,
  Events,
  ModalBuilder,
  ActionRowBuilder,
  TextInputStyle,
  TextInputBuilder,
  EmbedBuilder,
} = require('discord.js');

const recruitmentModsSchema = require('../../../schemas/recruitmentMods.js');

module.exports = {
  name: Events.InteractionCreate,

  /**
   *
   * @param { ButtonInteraction } interaction
   * @param { Client } client
   */

  async execute(interaction, client) {
    if (!interaction.isButton() || interaction.customId !== 'form-reject')
      return;

    const results = await recruitmentModsSchema.find();

    for (const result of results) {
      if (interaction.member.roles.cache.has(result.roleId)) {
        const userId = interaction.message.content.slice(2, -1);
        const user = await client.users.fetch(userId);

        return await interaction.showModal(
          new ModalBuilder()
            .setTitle(`Podanie ${user.tag}`)
            .setCustomId(`form-rejectreason-${user.id}`)
            .addComponents(
              new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                  .setCustomId('reject-reason')
                  .setLabel('Powód odrzucenia:')
                  .setPlaceholder('Nie spełnia wymagania.')
                  .setStyle(TextInputStyle.Short)
                  .setRequired(true)
                  .setMaxLength(100)
                  .setMinLength(5)
              )
            )
        );
      }
    }

    await interaction.reply({
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
