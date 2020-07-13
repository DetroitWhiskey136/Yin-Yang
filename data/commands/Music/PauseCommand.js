const { Command, Embed } = require('@structures');

class PauseCommand extends Command {
  constructor() {
    super({
      name: 'pause',
      description: 'pauses the queue',
      category: 'Music',
      usage: 'pause',
      aliases: ['p'],
      guildOnly: true,
    });
  }

  run(ctx) {
    const { bot, member, guild, channel, voiceChannel, database } = ctx;
    const embed = new Embed();

    const data = database.fn.user.get(member.id);

    if (!data || !data.dj) {
      embed.setDescription('You are not a DJ, please ask a moderator to add you to the DJ list');
      return channel.send(embed).then((m) => m.delete({ timeout: 2 * (60 * 1000) })).catch(console.error);
    }

    if (!voiceChannel) {
      embed.setDescription('Please be in a voice channel first!');
      return channel.send(embed).then((m) => m.delete({ timeout: 2 * (60 * 1000) })).catch(console.error);
    }

    if (!bot.music.get(guild.id)) return;

    if (bot.music.get(guild.id).dispatcher.paused) {
      embed.setDescription('Nothing to do, playback is already paused.');
      return channel.send(embed).then((m) => m.delete({ timeout: 2 * (60 * 1000) })).catch(console.error);
    }

    bot.music.get(guild.id).dispatcher.pause();
    embed.setDescription('Playback paused!');
    channel.send(embed).then((m) => m.delete({ timeout: 2 * (60 * 1000) })).catch(console.error);
  }
}
module.exports = PauseCommand;
