const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require('discord.js');

const { Success, Danger, Secondary } = ButtonStyle;

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

function createButton(id, style, emoji) {
  return new ButtonBuilder().setCustomId(id).setStyle(style).setEmoji(emoji);
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

        Success,
        '📝'
      ).setLabel('KLIKNIJ ABY NAPISAĆ PODANIE'),
    ]),
    no_recruitment_channel: createEmbed(
      '⛔️ BŁĄD',
      'Kanał nie został utworzony lub został on usunięty! Nie można wysłać formularza!',
      0xff0707
    ),
    sent_recruitment_message_reply: createEmbed(
      'REKRUTACJA',
      'Formularz rekrutacji został pomyślnie wysłany!',
      0x03df03
    ).setThumbnail(
      'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=699&height=675'
    ),

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
    recruitment_mod_already_added: createEmbed(
      '⛔️ BŁĄD',
      'Ta ranga została już ustawiona jako moderator rekrutacji!',
      0xf10303
    ).setThumbnail(
      'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=700&height=676'
    ),
    recruitment_mod_not_found: createEmbed(
      'MODERATOR REKRUTACJI',
      'Nie ma tej rangi moderatora w bazie danych!',
      0xf10303
    ).setThumbnail(
      'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=700&height=676'
    ),

    /* ---------------------------- recruitmentBlacklist.js --------------------------- */
    recruitment_blacklist_add_success: createEmbed(
      'REKRUTACJA',
      'Rola została dodana do czarnej listy do rekrutacji!',
      0x12e507
    ),
    recruitment_blacklist_remove_success: createEmbed(
      'REKRUTACJA',
      'Rola została usunięta z czarnej listy do rekrutacji!',
      0xff0707
    ),
    recruitment_blacklist_already_added: createEmbed(
      '⛔️ BŁĄD',
      'Rola jest już ustawiona! Aby zmienić rolę na początku musisz ją usunąć!',
      0xff0707
    ),
    recruitment_blacklist_not_found: createEmbed(
      '⛔️ BŁĄD',
      'Rola nie została znaleziona w bazie danych!',
      0xff0707
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

        Success,
        '📝'
      ).setLabel('KLIKNIJ ABY NAPISAĆ PODANIE'),
    ]),
    recruitment_off_row: new ActionRowBuilder().addComponents([
      createButton('recruitment-form-init', Success, '📝')
        .setLabel('KLIKNIJ ABY NAPISAĆ PODANIE')
        .setDisabled(true),
    ]),

    /* ---------------------------- recruitmentLog.js --------------------------- */
    recruitment_log_setchannel: createEmbed(
      '✔️ KANAŁ LOGÓW ZOSTAŁ USTAWIONY',
      'Od teraz wszystkie odrzucone/zaakceptowane podania będą wysyłane na ten kanał.',
      0xe7b707
    ).setThumbnail(
      'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=700&height=676'
    ),

    /* -------------------------- recruitmentChannel.js ------------------------- */
    recruitment_channel_set: createEmbed(
      'KANAŁ PODAŃ',
      'Pomyślnie ustawiono kanał publicznych podań!',
      0x16e532
    ),
  },

  /* -------------------------------------------------------------------------- */
  /*                                   Events                                   */
  /* -------------------------------------------------------------------------- */

  interactions: {
    modalSubmits: {
      /* ------------------------ recruitmentFormSubmit.js ------------------------ */

      /*
        Placeholders:

        {USER_TAG} - The user tag (Username#Discriminator)
        {ANSWER_1} - Answer to question 1
        {ANSWER_2} - Answer to question 2
        {ANSWER_3} - Answer to question 3
        {ANSWER_4} - Answer to question 4
        {ANSWER_5} - Answer to question 5
    */
      form_embed: createEmbed(
        'Podanie gracza {USER_TAG}',
        '**1.** Czy spełniasz wszystkie wymagania?\n```{ANSWER_1}```\n\n**2.** Jaki masz nick w Minecraft?\n```{ANSWER_2}```\n\n**3.** Opisz siebie (min 3 rozbudowane zdania).\n```{ANSWER_3}```\n\n**4.** Dlaczego właśnie ciebie mam wybrać?\n```{ANSWER_4}```\n\n**5.** Co chciałbyś zmienić na serwerze?\n```{ANSWER_5}```',
        0xebcc04
      ).setThumbnail(
        'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=700&height=676'
      ),
      form_row: new ActionRowBuilder().addComponents([
        createButton('form-accept', Success, '✔'),
        createButton('form-reject', Danger, '❌'),
      ]),
      form_submit_reply: createEmbed(
        '📩 TWOJE PODANIE ZOSTAŁO WYSŁANE',
        'Rekrutacja została pomyślnie przesłana! Sprawdź kanał <#1091502812401250405> oraz oczekuj wyników w wiadomości prywatnej od <@1009158071467126855>!',
        0x0acb00
      ).setImage(
        'https://media.discordapp.net/attachments/1038820694642937936/1092161241658691624/REKRUTACJA_1.png?width=1320&height=550'
      ),
      form_submit_row: new ActionRowBuilder().addComponents([
        createButton('do-nothing-button', Secondary, '❤').setLabel(
          'DZIĘKI ZA TĄ INFORMACJE, CZEKAM!'
        ),
      ]),
      missing_recruitment_channel: createEmbed(
        '⛔️ BŁĄD',
        'Kanał nie został utworzony lub został on usunięty! Nie można wysłać formularza!',
        0xff0707
      ),

      /* ------------------------------ formAccept.js ----------------------------- */

      // Placeholders: {REASON} - Form acceptation reason, {USER_TAG} - The user tag (Username#Discriminator)
      user_accept_embed: createEmbed(
        '🟢 TWOJE PODANIE ZOSTAŁO ZAAKCEPTOWANE!',
        'Zostajesz przyjęty na **DRUGI ETAP REKRUTACJI** do naszej administracji!\n\n**POWÓD:**\n```{REASON}```\nSkontaktuj się w tickecie w ciągu **48h** od otrzymania tej wiadomości aby otrzymać termin drugiego etapu, jeżeli nie otworzysz ticketa w ciągu wyznaczonego czasu zostajesz automatycznie usunięty z listy osób do rekrutacji! 😱\n',
        0x20e506
      ).setThumbnail(
        'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=700&height=676'
      ),
      user_accept_row: new ActionRowBuilder().addComponents([
        createButton('do-nothing-button', Success, '👋').setLabel(
          'OKEJ, ROZUMIEM!'
        ),
      ]),
      accept_reply: createEmbed(
        '✔️ PODANIE ZAAKCEPTOWANE',
        'Podanie gracza {USER_TAG} zostało zaakceptowane!',
        0x1fe315
      ).setThumbnail(
        'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=700&height=676'
      ),

      /* ------------------------------ formReject.js ----------------------------- */

      // Placeholders: {REASON} - Form rejection reason, {USER_TAG} - The user tag (Username#Discriminator)
      user_reject_embed: createEmbed(
        '🔴 TWOJE PODANIE ZOSTAŁO ODRZUCONE!',
        'Niestety nie udało się tobie przejść do **2 ETAPU REKRUTACJI** :sob:\n\n**POWÓD:**\n```{REASON}```\nNie matrw się! Kolejnym razem napewno się uda!\n:dart: **Próba jest matką sukcesu** \n',
        0xe50606
      ).setThumbnail(
        'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=700&height=676'
      ),
      user_reject_row: new ActionRowBuilder().addComponents([
        createButton('do-nothing-button', Danger, '👋').setLabel(
          'DO KOLEJNEGO!'
        ),
      ]),
      reject_reply: createEmbed(
        '❌ PODANIE ODRZUCONE',
        'Podanie gracza {USER_TAG} zostało odrzucone!',
        0xf10303
      ).setThumbnail(
        'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=700&height=676'
      ),
    },

    buttons: {
      /* ------------------------- recruitmentFormInit.js ------------------------- */
      form_already_submitted: createEmbed(
        '⛔️ BŁĄD',
        'Nie możesz wysłać podania ponieważ już wysłałeś podanie do zatwierdzenia! Kolejne podanie będziesz mógł napisać gdy twoje podanie zostanie odrzucone/zaatwierdzone!',
        0xff0707
      ),
      user_blacklisted: createEmbed(
        '⛔️ BŁĄD',
        'Nie możesz napisać podania ponieważ jesteś na blackliście!',
        0xed0b0b
      ),
    },
  },

  /* -------------------------------------------------------------------------- */
  /*                                    Misc                                    */
  /* -------------------------------------------------------------------------- */
  misc: {
    recruitment_no_access: createEmbed(
      '⛔️ BŁĄD',
      'Komenda nie jest dostępna dla ciebie ponieważ nie jesteś **MODERATOREM REKRUTACJI**.',
      0xf10303
    ).setThumbnail(
      'https://media.discordapp.net/attachments/1038820694642937936/1090016809865986231/nusilogo.png?width=700&height=676'
    ),
  },
};
