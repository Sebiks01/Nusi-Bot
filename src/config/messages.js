const chalk = require('chalk')

module.exports = {
    /* -------------------------------------------------------------------------- */
    /*                                  Commands                                  */
    /* -------------------------------------------------------------------------- */

    pub_cmds: {
        /* -------------------------- recruitmentMessage.js ------------------------- */
        recruitment_message_err: chalk.yellow('[WARN] Error in the "recruitment-message" command.'),

        /* -------------------------- recruitmentMod.js ------------------------- */
        recruitment_mod_err: chalk.yellow('[WARN] Error in the "recruitment-mod" command.'),

        /* -------------------------- recruitmentBlacklist.js ------------------------- */
        recruitment_blacklist_err: chalk.yellow('[WARN] Error in the "recruitment-blacklist" command.'),

        /* -------------------------- recruitmentToggle.js ------------------------- */
        recruitment_toggle_err: chalk.yellow('[WARN] Error in the "recruitment-toggle" command.'),

        /* ---------------------------- recruitmentLog.js --------------------------- */
        recruitment_log_err: chalk.yellow('[WARN] Error in the "recruitment-log" command.'),

        /* -------------------------- recruitmentChannel.js ------------------------- */
        recruitment_channel_err: chalk.yellow('[WARN] Error in the "recruitment-channel" command.'),

        /* -------------------------- recruitmentManage.js -------------------------- */
        accept_reason_autocomplete: ['Twoje podanie zostało zaakceptowane, zgłoś się w tickecie w celu przeprowadzenia 2 etapu'],
        reject_reason_autocomplete: ['Nie spełniasz wymagań.', 'Podanie posiada błędy ortograficzne.', 'Byłeś zbyt często karany.'],
        db_form_not_found: chalk.yellow('[WARN] Error in "recruitmentManage.js". Form not found in databse.'),
        form_channel_not_found: chalk.yellow('[WARN] Error in "recruitmentManage.js". Form channel not found.'),
        form_message_not_found: chalk.yellow('[WARN] Error in "recruitmentManage.js". Form message not found.'),
        db_log_channel_not_found: chalk.yellow('[WARN] Error in "recruitmentManage.js". Log channel not found in databse.'),
        log_channel_not_found: chalk.yellow('[WARN] Error in "recruitmentManage.js". Log channel not found.'),
        user_send_err: chalk.yellow('[WARN] Error in "recruitmentManage.js". Cant send message to user.')
    },

    util_cmds: {
        /* -------------------------------- reload.js ------------------------------- */
        cmds_reload: 'Reloaded commands.',
        events_reload: 'Reloaded Events.',
        err_reply: 'An internal error has occured, contact an administrator immediately!',
        err_log: chalk.yellow('[WARN] Error in the "reload" command: Invalid subcommand.')
    },

    /* -------------------------------------------------------------------------- */
    /*                                   Events                                   */
    /* -------------------------------------------------------------------------- */

    events: {
        client: {
            /* -------------------------------- ready.js -------------------------------- */
            client_ready: chalk.blue('[INFO] The client is now ready.')
        },

        interactions: {
            /* ---------------------------- slashCommands.js ---------------------------- */
            outdated_cmd: 'This command is outdated.',
            dev_only_cmd: 'This command is only available to the developer.',
            outdated_cmd_log: chalk.yellow('[WARN] Command {CMD_NAME} is outdated.'), // Placeholders: {CMD_NAME} - Command name

            modalSubmits: {
                /* ---------------------- formAccept.js & formReject.js --------------------- */
                db_form_not_found: chalk.yellow('[WARN] Error in "formAccept.js/formReject.js". Form not found in databse.'),
                form_channel_not_found: chalk.yellow('[WARN] Error in "formAccept.js/formReject.js". Form channel not found.'),
                form_message_not_found: chalk.yellow('[WARN] Error in "formAccept.js/formReject.js". Form message not found.'),
                db_log_channel_not_found: chalk.yellow('[WARN] Error in "formAccept.js/formReject.js". Log channel not found in databse.'),
                log_channel_not_found: chalk.yellow('[WARN] Error in "formAccept.js/formReject.js". Log channel not found.'),
                user_send_err: chalk.yellow('[WARN] Error in "formAccept.js/formReject.js". Cant send message to user.')
            }
        }
    },

    /* -------------------------------------------------------------------------- */
    /*                                  Handlers                                  */
    /* -------------------------------------------------------------------------- */

    handlers: {
        /* ---------------------------- commandHandler.js --------------------------- */
        load_cmds_start: chalk.blue('[INFO] Loading commands...'),
        load_cmds_time: chalk.blue('[INFO] Loaded commands in'),
        cmds_table_success_emoji: '✅',
        cmds_table_error_emoji: '🛑',
        cmd_load_err: chalk.yellow('[WARN] Error in command {CMD_NAME}'), // Placeholders: {CMD_NAME} - name of command

        /* ---------------------------- eventsHandler.js ---------------------------- */
        load_events_start: chalk.blue('[INFO] Loading events...'),
        load_events_time: chalk.blue('[INFO] Loaded events in'),
        events_table_success_emoji: '✅',
        events_table_error_emoji: '🛑',
        event_load_err: chalk.yellow('[WARN] Error in event {EVENT_NAME}') // Placeholders: {EVENT_NAME} - name of event
    },

    /* -------------------------------------------------------------------------- */
    /*                                    Util                                    */
    /* -------------------------------------------------------------------------- */

    util: {
        /* ------------------------------ fileLoader.js ----------------------------- */
        file_load_err: chalk.red('[ERROR] Error loading files from directory "{DIR_NAME}".'), // Placeholders: {DIR_NAME} - name of directory
        
        /* ----------------------------- mongoConnect.js ---------------------------- */
        db_conn_start: chalk.blue('[INFO] Connecting to the database...'),
        db_conn_success: chalk.blue('[INFO] Successfully connected to the database.'),
        db_conn_id: chalk.blue('[INFO] Connection ID: {DB_CONN_ID}'), // Placeholders: {DB_CONN_ID} - database connection id
        db_conn_err: chalk.yellow('[WARN] Invalid mongo uri provided. Aborting connection.')
    },

    /* -------------------------------------------------------------------------- */
    /*                                    Main                                    */
    /* -------------------------------------------------------------------------- */

    main: {
        /* -------------------------------- index.js -------------------------------- */
        invalid_token: chalk.red('[ERROR] Inavlid token provided.')
    }

}