/* eslint-disable max-len, require-atomic-updates */


const { Event } = require('@structures');
const { guildAvailable, existsName } = require('@utils/GuildUtils');

class GuildCreateEvent extends Event {
  constructor() {
    super({
      name: 'guildCreate',
      enabled: true,
    });
  }

  run(bot, client, guild) {
    if (!guildAvailable(guild)) return new Error(`Guild Unavailable: ${guild.id}`);

    // eslint-disable-next-line no-unused-vars
    const { id, name, channels, roles, owner, ownerID } = guild;

    const data = [{
      general: {
        prefix: '!',
        sysnotice: false,
      },
      moderator: {
        modlog: existsName(channels.cache, 'mod-logs'),
        modrole: existsName(roles.cache, 'moderator'),
      },
      admin: {
        adminlog: existsName(roles.cache, 'admin'),
        adminrole: existsName(channels.cache, 'admin-logs'),
      },
      welcome: {
        welcomelog: existsName(channels.cache, 'welcome'),
        welcomemsg: `Welcome {{user}} to {{guild}}, please read over the rules and have fun.`,
        welcomeen: false,
      },
      leave: {
        leavelog: existsName(channels.cache, 'leave'),
        leavemsg: `All good things come to an end`,
        leaveen: false,
      },
    }];

    return bot.database.fn.guild.set(id, data);
  }
}

module.exports = GuildCreateEvent;
