const { Command, Embed } = require('@structures');

class SkipCommand extends Command {
  constructor() {
    super({
      name: 'skip',
      description: 'Skips the current song',
      category: 'Music',
      usage: 'skip',
      aliases: ['s'],
      guildOnly: true,
      enabled: true,
    });
  }

  run(ctx) {
    const { bot, member, guild, channel, voiceChannel, database } = ctx;
    const embed = new Embed();

    const data = database.fn.user.get(member.id);

    function skip() {
      if (!bot.music.get(guild.id)) return;
      embed.setDescription('Skipping song in queue...');
      channel.send(embed).then((m) => m.delete({ timeout: 3 * (60 * 1000) })).catch(console.error);
      bot.music.get(guild.id).dispatcher.end();
    }

    if (!voiceChannel) {
      embed.setDescription('Please be in a voice channel first!');
      return channel.send(embed).then((m) => m.delete({ timeout: 3 * (60 * 1000) })).catch(console.error);
    }

    if (!data || !data.dj) {
      if ((voiceChannel.members.size - 1) <= 4) {
        return skip();
      }
      const filter = (m) => m.content === 'skip';
      const collector = channel.createMessageCollector(filter, { time: 15000 });

      embed.setDescription(`enter \`skip\` to vote skip, `);
      channel.send(embed);

      collector.on('end', (collected) => {
        if (collected.size >= (voiceChannel.members.size - 1) / 3) {
          return skip();
        } else {
          embed.setDescription('Not enough votes to skip');
          return channel.send(embed).then((m) => m.delete({ timeout: 1 * (60 * 1000) })).catch(console.error);
        }
      });
    } else {
      return skip();
    }
  }
}

module.exports = SkipCommand;
