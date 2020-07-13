/* eslint-disable max-len */


const { Command, Embed } = require('@structures');
const { PERM_NAMES } = require('@utils/Constants');
const { getMember } = require('@utils/MemberUtil');

const moment = require('moment');

class UserInfoCommand extends Command {
  constructor() {
    super({
      name: 'userinfo',
      description: 'Displays a users information',
      category: 'General',
      usage: 'userinfo <user>',
      aliases: ['ui', 'user'],
      enabled: true,
      guildOnly: true,
    });
  }

  run(ctx) {
    const { bot, message, channel, query } = ctx;
    const embed = new Embed();
    const guildMember = getMember(query, message);

    let friendly = 'Not Available';

    if (!guildMember) {
      embed.setDescription('Member not found');
    } else {
      const user = guildMember.user;
      let game = user.presence.activity === null ? 'Not Set' : user.presence.activities.map((a) => a.name).filter((a) => a !== 'Custom Status');

      const memberLevel = bot.getPerm(guildMember);
      if (memberLevel >= 0) {
        friendly = bot.perms.find((l) => l.level === memberLevel).name;
        friendly = PERM_NAMES[friendly] || new Error('this user needs to be looked at as they don\'t have a perm level');
      }

      embed
        .setTitle(`${guildMember.displayName}'s info`)
        .setColor(guildMember.displayColor)
        .setThumbnail(user.displayAvatarURL({
          size: 2048,
        }))
        .addField('≈ Tag ≈', user.tag, true)
        .addField('≈ ID ≈', user.id, true)
        .addField('≈ Game ≈', game.length >= 1 ? game : 'Not playing a game', true)
        .addField('≈ Status ≈',
          user.presence.status === 'dnd' ?
            'Do Not Disturb' :
            user.presence.status === 'offline' ?
              'Offline' :
              user.presence.status === 'idle' ?
                'Idle' :
                user.presence.status === 'online' ?
                  'Online' :
                  'Unknown', true)
        .addField('≈ Highest Role ≈', guildMember.roles.highest, true)
        .addField('≈ Hoisted Color ≈', guildMember.displayHexColor, true)
        .addField('≈ Created At ≈', moment(user.createdTimestamp).format('LLL'), true)
        .addField('≈ Joined At ≈', moment(guildMember.joinedTimestamp).format('LLL'), true)
        .addField('≈ Perm Level ≈', `${memberLevel} : ${friendly}`, true)
        // .addField('≈ Account Type ≈', guildMember.user.bot === true ? '<:BOT:646453909786984453>' : '<:HUMAN:646454603789107230>', true)
        .setFooter(`Is Bot? ${user.bot} | Deleted? ${guildMember.deleted} | Banable? ${guildMember.banable} | Kickable? ${guildMember.kickable} | manageable? ${guildMember.manageable}`);

      channel.send(embed);
    }
  }
}
module.exports = UserInfoCommand;
