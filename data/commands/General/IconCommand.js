const { Command, Embed } = require('@structures');

class ServerIconCommand extends Command {
  constructor() {
    super({
      name: 'icon',
      description: 'Displays the servers icon',
      category: 'General',
      usage: 'icon',
      aliases: ['guildicon', 'servericon'],
      enabled: true,
    });
  }

  async run(ctx) {
    const { message, member, guild, channel, client } = ctx;
    if (message.channel.permissionsFor(client.user).has('MANAGE_MESSAGES')) message.delete();
    const msg = await channel.send('``Generating Guild Icon``');

    if (!guild.iconURL) return msg.edit(`No icon found for ${guild.name}`);

    const format = guild.iconURL({ size: 2048 }).includes('gif') ? 'gif' : 'png';

    const embed = new Embed()
      .setImage(guild.iconURL({ format: format, size: 2048 }))
      .setTitle(`${guild.name}'s Icon`)
      .setColor(member.displayColor);
    channel.send(embed);
    msg.delete();
  }
}

module.exports = ServerIconCommand;
