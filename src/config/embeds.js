const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require('discord.js');

const { Success } = ButtonStyle;

function createEmbed(title, description, color) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setFooter({
      text: 'NUSI.PL',
      iconURL:
        'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=699&height=675',
    });
}

function createButton(id, label, style, emoji) {
  return new ButtonBuilder()
    .setCustomId(id)
    .setLabel(label)
    .setStyle(style)
    .setEmoji(emoji);
}

module.exports = {
  /* -------------------------------------------------------------------------- */
  /*                                  Commands                                  */
  /* -------------------------------------------------------------------------- */

  pub_cmds: {
    /* -------------- recruitmentMessage.js & recruitmentToggle.js -------------- */
    recruitment_embed_init: createEmbed(
      'REKRUTACJA DO ADMINISTRACJI SERWERA NUSI.PL',
      '**WYMAGANIA REKRUTACYJNE!**\n> - 14 lat\n> - Minecraft Premium\n> - Znajomość ortografii oraz interpunkcji.\n> - Dobra opinia wśród innych graczy oraz administracji.\n> - Aktywność na serwerze Minecraft oraz na Discord! (12h tygodniowo na serwerze minecraft oraz podstawowa aktywność na discord czyli odpowiadnie na tickety, kanały pomocy itp.)\n> - Kultura osobista\n\n**PYTANIA REKRUTACYJNE!**\n> 1. Czy spełniasz **wszystkie** podane wymagania?\n> 2. Jaki masz nick w **Minecraft**\n> 3. Opisz siebie w minimum **3 rozbudowanych zdaniach** (Imie, wiek, zainteresowania, doświadczenie w pełnieniu funkcji minecraft)\n> 4. Jak oceniasz swoje umiejętności **komunikacji** z innymi? Czy inne osoby odbierają ciebie przyjaźnie? (1-10)\n> 5. Co chciałbyś aby zostało **zmienione** na serwerze?\n\nWszystkie podania po zakończeniu zostają wysłane na kanał <#1091502812401250405>, można napisać tylko jedno podanie do czasu',
      0x0acb00
    ).setImage(
      'https://media.discordapp.net/attachments/1038820694642937936/1092149856442793984/REKRUTACJA.png?width=1320&height=550'
    ),
    recruitment_row_init: new ActionRowBuilder().setComponents([
      createButton(
        'recruitment-form-init',
        'KLIKNIJ ABY NAPISAĆ PODANIE',
        Success,
        '📝'
      ),
    ]),

    /* ---------------------------- recruitmentMod.js --------------------------- */
    recruitment_mod_add_success: createEmbed(
      'MODERATOR REKRUTACJI',
      '✔️ Ranga została dodana jako **MODERATOR REKRUTACJI**!',
      0x1bed03
    ),
    recruitment_mod_remove_success: createEmbed(
      'MODERATOR REKRUTACJI',
      '❌ Ranga została usunięta jako **MODERATOR REKRUTACJI**!',
      0xff0909
    ),

    /* -------------------------- recruitmentToggle.js -------------------------- */
    recruitment_on_reply: createEmbed(
      'STATUS REKRUTACJI',
      '✔️ Rekrutacja została włączona!',
      0x0acb00
    ),
    recruitment_off_reply: createEmbed(
      'STATUS REKRUTACJI',
      '❌ Rekrutacja została wyłączona!',
      0xed0303
    ),
    recruitment_on_row: new ActionRowBuilder().addComponents([
      createButton(
        'recruitment-form-init',
        'KLIKNIJ ABY NAPISAĆ PODANIE',
        Success,
        '📝'
      ),
    ]),
    recruitment_off_row: new ActionRowBuilder().addComponents([
      createButton(
        'recruitment-form-init',
        'KLIKNIJ ABY NAPISAĆ PODANIE',
        Success,
        '📝'
      ).setDisabled(true),
    ]),
  },
};
