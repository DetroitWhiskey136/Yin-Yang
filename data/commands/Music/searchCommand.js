const { Command, Embed } = require('@structures');

const youtube = require('scrape-youtube').default;

class SearchCommand extends Command {
  constructor() {
    super({
      name: 'search',
      description: 'looks up five songs on youtube',
      category: 'Music',
      usage: 'search <query>',
      aliases: [],
      guildOnly: true,
    });
  }

  async run(ctx) {
    const { channel, query } = ctx;
    const embed = new Embed();

    const results = await youtube.search(query, { limit: 10 });

    if (results.length <= 0) {
      embed.setDescription(`Couldn't find anything with the name \`${query}\``)
        .setTitle('No Results');
      return channel.send(embed).then((m) => m.delete({ timeout: 2 * (60 * 1000) })).catch(console.error);
    }

    embed.setTitle(`Top ${results.length} Results`);

    // eslint-disable-next-line array-callback-return
    await results.forEach((i) => {
      embed.addField(i.title, `https://www.youtube.com/watch?v=${i.id}`, false);
    });

    return channel.send(embed).then((m) => m.delete({ timeout: 10 * (60 * 1000) })).catch(console.error);
  }
}

module.exports = SearchCommand;
