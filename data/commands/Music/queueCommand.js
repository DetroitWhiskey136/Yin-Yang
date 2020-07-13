/* eslint-disable max-len */

const { Command, Embed } = require('@structures');

class Queue extends Command {
  constructor() {
    super({
      name: 'queue',
      description: 'queue',
      category: 'Music',
      usage: 'queue',
      aliases: ['np', 'nowplaying'],
      guildOnly: true,
    });
  }

  run(ctx) {
    const { bot, guild, channel } = ctx;
    let queues, singular, current;
    const embed = new Embed();

    if (!bot.music.has(guild.id)) {
      embed.setDescription('The queue is empty');
      channel.send(embed).then((m) => m.delete({ timeout: 2 * (60 * 1000) })).catch(console.error);
    }

    queues = bot.music.get(guild.id);

    if (!queues) return;

    queues = queues.queue.slice(queues.position);
    current = queues.shift();
    singular = queues.length === 1;

    embed
      .setTitle(`Currently playing: \n**${current.songTitle.substring(0, 50)}** ${current.playTime}`)
      .setDescription(`There ${singular ? 'is' : 'are'} currently ${queues.length} song${singular ? '' : 's'} in the queue.\n`)
      .setThumbnail(`https://i.ytimg.com/vi/${current.id}/mqdefault.jpg`)
      .setURL(`https://www.youtube.com/watch?v=${current.id}`);

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < queues.length && i < 5; i++) {
      embed.addField(`**${queues[i].songTitle.substring(0, 50)}** (${queues[i].playTime})`, `Song url ${queues[i].url}`);
    }
    channel.send(embed).then((m) => m.delete({ timeout: 10 * (60 * 1000) })).catch(console.error);
  }
}

module.exports = Queue;
