/* eslint-disable no-useless-escape */
module.exports = {
  DISABLED_EVENTS: [
    'TYPING_START',
  ],
  REGEX: {
    ROLE_ID: /^[0-9]{16,19}$/,
    ROLE_MENTION: /^(?:<@&)([0-9]{16,19})(?:>)$/,
    USER_ID: /^[0-9]{16,19}$/,
    MEMBER_MENTION: /^(?:<@!?)?([0-9]{16,19})(?:>)?$/,
    REGEX: /[|\\{}()[\]^$+*?.]/g,
    DOMAINS: /^https?:\/\/(www\.)?(pastebin|(gist\.)?github|gitlab)\.com\/\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?$/i,
  },
  CLIENT_OPTIONS: {
    fetchAllMembers: true,
    disableEveryone: true,
    disabledEvents: this.DISABLED_EVENTS,
    messageCacheMaxSize: 100,
    messageCacheLifetime: 240,
    messageSweepInterval: 300,
    ws: {
      large_threshold: 1000,
    },
  },
  PERM_NAMES: {
    user: 'User',
    moderator: 'Moderator',
    administrator: 'Administrator',
    serverowner: 'Server Owner',
    botsupport: 'Bot Support',
    botadmin: 'Bot Admin',
    botowner: 'Bot Owner',
  },
  REDI_REASONS: {
    KICKS: [
      'Imagine getting Dan00ted out of a server. Can\'t relate.',
      'Sayonara {{tag}}',
      'Heh, i guess ur a goner now. Well. Hopefully you can find your way back here.',
      'Eye spy my little eye, something that looks like a kick.',
      'You have been dan00ted from the server for an undefined amount of time.',
      'Here. have a free kick, it\'s on the house',
      '{{tag}} dropped the soap.',
      '#IGotBeamedFromADevBotLol!',
      'Thy mighty Dan00t Gods have summoned a minion to throw you away!',
    ],
    BANS: [
      'Imagine getting Dan00ted out of a server. Can\'t relate.',
      'Sayonara {{tag}}',
      'Heh, i guess ur a goner now. Well. Hopefully you can find your way back home.',
      'Eye spy my little eye, something that looks like a ban.',
      'You have been dan00ted from the server for an infinite amount of time.',
      'Here. have a free ban, it\'s on the house',
      '{{tag}} dropped the soap.',
      '#IGotBeamedFromADevBotLol!',
      'Thy mighty Dan00t Gods have summoned a minion to throw you away!',

    ],
  },
};
