const { Command, Embed } = require('@structures');

class PingCommand extends Command {
  constructor() {
    super({
      name: 'ping',
      description: 'Latency and API response times.',
      category: 'General',
      usage: 'ping',
      aliases: ['pong'],
      enabled: true,
    });
  }

  async run(ctx) {
    const { message, member, channel, client } = ctx;
    try {
      const embed = new Embed()
        .setColor(member.displayColor)
        .setDescription('🏓 Ping!');
      const msg = await channel.send(embed);
      const timeStamp = msg.createdTimestamp - message.createdTimestamp;
      embed.setDescription(`🏓 Pong! (Roundtrip took: ${timeStamp}ms. 💙: ${Math.round(client.ws.ping)}ms.)`);
      msg.edit(embed);
    } catch (e) {
      client.logger.error(e);
    }
  }
}

module.exports = PingCommand;
