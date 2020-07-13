const { Event, Embed } = require('@structures');
const { code } = require('@utils/StringUtil');
class MessageDeleteEvent extends Event {
  constructor() {
    super({
      name: 'messageDelete',
      enabled: true,
    });
  }

  run(bot, client, message) {
    const { author, guild, channel, content } = message;

    const settings = bot.database.fn.guild.get(guild.id);
    const modlog = settings.moderator.modlog;

    if (
      !settings ||
      !modlog ||
      !guild.channels.cache.has(modlog) ||
      author.bot
    ) return;

    const embed = new Embed();
    embed
      .setColor('ORANGE')
      .setTitle(`${author.username} deleted a message`)
      .setDescription(`Message: ${code(content)}`)
      .setFooter(`Channel: ${channel.name} (${channel.id})`);

    const chan = guild.channels.cache.get(modlog);
    chan.send(embed);
  }
}
module.exports = MessageDeleteEvent;
