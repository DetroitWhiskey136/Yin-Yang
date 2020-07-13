const { Command, Embed } = require('@structures');

class AvatarCommand extends Command {
  constructor() {
    super({
      name: 'avatar',
      description: 'Displays the command authors avatar.',
      category: 'General',
      usage: 'avatar',
      aliases: ['av'],
      enabled: true,
    });
  }

  async run(ctx) {
    const { message, member, channel, client } = ctx;
    if (channel.permissionsFor(client.user).has('MANAGE_MESSAGES')) message.delete();
    const msg = await channel.send('``Generating Avatar``');

    const format = member.user.displayAvatarURL({ size: 2048 }).includes('gif') ? 'gif' : 'png';

    const embed = new Embed()
      .setImage(member.user.displayAvatarURL({ size: 2048, format: format }))
      .setTitle(`${member.displayName}'s Profile Picture`)
      .setColor(member.displayColor);

    channel.send(embed);
    msg.delete();
  }
}

module.exports = AvatarCommand;
