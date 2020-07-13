const { Command, Embed } = require('@structures');
const { getMember } = require('@utils/MemberUtil');

class DJCommand extends Command {
  constructor() {
    super({
      name: 'dj',
      description: 'sets a users DJ state',
      category: 'Music',
      usage: 'dj <member>',
      aliases: [],
      guildOnly: true,
      enabled: true,
      permLevel: 'moderator',
    });
  }

  run(ctx) {
    const { message, member, channel, database, query } = ctx;
    const embed = new Embed();

    if (!member.permissions.has('KICK_MEMBERS')) {
      embed.setDescription('You need the `kick members` permission to use this command.');
      return channel.send(embed).then((m) => m.delete({ timeout: 2 * (60 * 1000) })).catch(console.error);
    }

    if (query.length <= 0) {
      embed.setDescription('Please provide a member to add to the dj');
      return channel.send(embed).then((m) => m.delete({ timeout: 2 * (60 * 1000) })).catch(console.error);
    }

    const GM = getMember(query, message);

    if (!GM) {
      embed.setDescription('Guild Member not found');
      return channel.send(embed).then((m) => m.delete({ timeout: 2 * (60 * 1000) })).catch(console.error);
    }

    const DBData = database.fn.user.get(GM.id);

    if (!DBData || DBData.dj === false) {
      database.fn.user.set(GM.id, { dj: true });
      embed.setDescription(`${GM.user.tag} has been added to the DJ list`);
      return channel.send(embed).then((m) => m.delete({ timeout: 2 * (60 * 1000) })).catch(console.error);
    } else {
      database.fn.user.set(GM.id, { dj: false });
      embed.setDescription(`${GM.user.tag} has been removed from the DJ list`);
      return channel.send(embed).then((m) => m.delete({ timeout: 2 * (60 * 1000) })).catch(console.error);
    }
  }
}
module.exports = DJCommand;
