const { Event, Embed } = require('@structures');
const { hasPlaceholder } = require('@utils/Utils');

class GuildMemberAddEvent extends Event {
  constructor() {
    super({
      name: 'guildMemberAdd',
      enabled: true,
    });
  }

  async run(bot, client, member) {
    let { displayName, displayHexColor, user, guild } = member;
    if (displayHexColor === '#000000') displayHexColor = '#00ffff';

    const settings = bot.database.fn.guild.get(guild.id);
    const avatar = user.displayAvatarURL({ size: 128 });

    const role = '481056982132850689';
    if (guild.id === '432005276447670272' && member.guild.roles.cache.has(role) && !member.roles.cache.has(role)) {
      await member.roles.add(role).catch(console.error);
    }

    if (!settings.welcome.welcomeen) return;

    let welcomeMessage = settings.welcome.welcomemsg;

    welcomeMessage = hasPlaceholder(welcomeMessage, '{{user}}', displayName);
    welcomeMessage = hasPlaceholder(welcomeMessage, '{{guild}}', guild.name);

    let chan = null;
    try {
      chan = member.guild.channels.cache.find((c) => c.id === settings.welcome.welcomelog);
    } catch (error) {
      return client.logger.error(error.message);
    }

    if (!chan) return;

    if (!member.guild.me.permissionsIn(chan).has('SEND_MESSAGES')) return;

    const embed = new Embed()
      .setTitle(`${user.username} has joined ${guild.name}`)
      .setColor(displayHexColor)
      .setDescription(`${welcomeMessage}`)
      .setThumbnail(avatar)
      .setTimestamp();

    chan.send(embed).catch((error) => this.client.logger.error(error));

    bot.database.fn.user.set(user.id);
  }
}

module.exports = GuildMemberAddEvent;
