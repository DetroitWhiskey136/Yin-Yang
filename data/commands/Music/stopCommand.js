const { Command, Embed } = require('@structures');

class StopCommand extends Command {
  constructor() {
    super({
      name: 'stop',
      description: 'Ends the current playlist',
      category: 'Music',
      usage: 'stop',
      aliases: [],
      guildOnly: true,
    });
  }

  run(ctx) {
    const { bot, member, guild, channel, voiceChannel, database } = ctx;
    const embed = new Embed();

    const data = database.fn.user.get(member.id);

    if (!data || !data.dj) {
      embed.setDescription('You are not a DJ, please ask a moderator to add you to the DJ list');
      return channel.send(embed).then((m) => m.delete({ timeout: 3 * (60 * 1000) })).catch(console.error);
    }

    if (!voiceChannel) {
      embed.setDescription('Please be in a voice channel first!');
      return channel.send(embed).then((m) => m.delete({ timeout: 3 * (60 * 1000) })).catch(console.error);
    }

    const music = bot.music.get(guild.id);
    if (!music) return;
    music.queue = [];
    music.dispatcher.end();
    embed.setDescription('Queue stopped...');
    return channel.send(embed).then((m) => m.delete({ timeout: 1 * (60 * 1000) })).catch(console.error);
  }
}

module.exports = StopCommand;
