const { Command, Embed } = require('@structures');

class VolumeCommand extends Command {
  constructor() {
    super({
      name: 'volume',
      description: 'Sets the voiceConnection volume.',
      category: 'Music',
      usage: 'volume',
      aliases: ['vol', 'v'],
      guildOnly: true,
      enabled: true,
    });
  }

  run(ctx) {
    const { bot, member, guild, channel, voiceChannel, database, query } = ctx;
    const embed = new Embed();

    if (!bot.music.get(guild.id)) {
      embed.setDescription('how do you expect to change the volume if I\'m not playing anything?').setColor('RED');
      return channel.send(embed).then((m) => m.delete({ timeout: 3 * (60 * 1000) })).catch(console.error);
    }

    if (!query) {
      embed.setDescription(`Current volume is set at ${
        bot.music.get(guild.id).dispatcher.volume * 100
      }%`);
      return channel.send(embed);
    }

    const data = database.fn.user.get(member.id);

    if (!data || !data.dj) {
      embed.setDescription('You are not a DJ, please ask a moderator to add you to the DJ list').setColor('ORANGE');
      return channel.send(embed).then((m) => m.delete({ timeout: 3 * (60 * 1000) })).catch(console.error);
    }

    if (!voiceChannel) {
      embed.setDescription('Please be in a voice channel first!').setColor('ORANGE');
      return channel.send(embed).then((m) => m.delete({ timeout: 3 * (60 * 1000) })).catch(console.error);
    }

    function volume() {
      if (query < 0 || query > 100) {
        embed.setDescription('Volume must be a value between 0% and 100%');
        return channel.send(embed).then((m) => m.delete({ timeout: 1 * (60 * 1000) })).catch(console.error);
      }

      embed.setDescription(`Setting volume to ${query}%`);
      channel.send(embed).then((m) => {
        guild.voice.connection.volume = query / 100;
        bot.music.get(guild.id).dispatcher.setVolume(query / 100);
        m.delete({ timeout: 1 * (60 * 1000) });
      }).catch(console.error);
    }

    return volume();
  }
}

module.exports = VolumeCommand;
