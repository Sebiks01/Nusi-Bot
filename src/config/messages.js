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

        /* -------------------------- recruitmentToggle.js ------------------------- */
        recruitment_toggle_err: chalk.yellow('[WARN] Error in the "recruitment-toggle" command.'),

        /* ---------------------------- recruitmentLog.js --------------------------- */
        recruitment_log_err: chalk.yellow('[WARN] Error in the "recruitment-log" command.'),

        /* -------------------------- recruitmentChannel.js ------------------------- */
        recruitment_channel_err: chalk.yellow('[WARN] Error in the "recruitment-channel" command.')
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
            dev_only_cmd: 'This command is only available to the developer.'
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