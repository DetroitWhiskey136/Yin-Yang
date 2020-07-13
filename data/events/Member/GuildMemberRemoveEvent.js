const { Event, Embed } = require('@structures');
const { hasPlaceholder } = require('@utils/Utils');

const moment = require('moment');
require('moment-duration-format');

class GuildMemberRemoveEvent extends Event {
  constructor() {
    super({
      name: 'guildMemberRemove',
      enabled: true,
    });
  }

  run(bot, client, member) {
    let date = moment(new Date);
    let { displayName, displayHexColor, user, guild } = member;
    if (displayHexColor === '#000000') displayHexColor = '#00ffff';

    const settings = bot.database.fn.guild.get(guild.id);
    const avatar = user.displayAvatarURL({ size: 128 });

    if (!settings.leave.leaveen) return;

    let leaveMessage = settings.leave.leavemsg;

    leaveMessage = hasPlaceholder(leaveMessage, '{{user}}', displayName);
    leaveMessage = hasPlaceholder(leaveMessage, '{{guild}}', guild.name);

    date = moment.duration(date.diff(member.joinedTimestamp))._data;

    let chan = null;
    try {
      chan = member.guild.channels.cache.find((c) => c.id === settings.welcome.welcomelog);
    } catch (error) {
      return client.logger.error(error.message);
    }

    if (!chan) return;

    if (!member.guild.me.permissionsIn(chan).has('SEND_MESSAGES')) return;

    const embed = new Embed()
      .setTitle(`${user.username} has left ${guild.name}`)
      .setColor(displayHexColor)
      .setDescription(`${leaveMessage}`)
      .setThumbnail(avatar)
      .setTimestamp()
      .setFooter(`Time in guild: ${date.years}y, ${date.months}m, ${date.days}d, ${date.hours}h, ${date.minutes}m, ${date.seconds}s`);
    chan.send(embed).catch((error) => this.client.logger.error(error));
  }
}
module.exports = GuildMemberRemoveEvent;
