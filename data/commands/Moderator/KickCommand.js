/* eslint-disable no-lonely-if */


const { Command, Embed } = require('@structures');
const { REDI_REASONS: { KICKS } } = require('@utils/Constants');
const { hasPlaceholder } = require('@utils/Utils');
const manager = require('@discord/Manager');

class KickCommand extends Command {
  constructor() {
    super({
      name: 'kick',
      description: 'Kicks a user from the guild',
      category: 'Moderator',
      usage: 'Kick <user> <reason>',
      guildOnly: true,
      permLevel: 'moderator',
    });
  }

  async run(ctx) {
    const { mentions, member, guild, channel, client, database, args, sendMessage } = ctx;
    // Defines the GuildMember class of the person who ran the command.
    const embed = new Embed()
      .setColor('ORANGE');

    // Checks if the bot has the required permissions to kick anyone.
    let hasPerm;
    // Fetches the client as a guild member
    await manager.fetch(guild.members, client.user.id)
      // checks the permission
      .then((m) => { hasPerm = m.permissions.has('KICK_MEMBERS'); })
      // catches any errors
      .catch((e) => client.logger.error(e));

    if (!hasPerm) {
      embed.setDescription('Insufficient Bot Perms.');
      channel.send(embed);
    } else { // Bot perms are cleared.
      if (args[0] !== undefined) {
        // get target member
        let TargetGM;
        if (mentions.users.size <= 0) {
          TargetGM = await guild.members.cache.cache.find((m) => m.displayName.includes(args[0]) || m.id === args[0]);
        } else {
          TargetGM = await guild.members.fetch(mentions.users.first().id);
        }

        // if not Target Guild Member return message
        if (!TargetGM) {
          embed.setDescription('User not found');
          return sendMessage(embed);
        }

        // Declare the basic reason if there is none provided.
        let reason = KICKS[Math.floor(Math.random() * KICKS.length)];
        reason = hasPlaceholder(reason, '{{tag}}', TargetGM.user.tag);

        if (args[1] !== undefined) {
          // Modify the final reason export if there is a declared reason.
          reason = args.join(' ').replace(args[0], '').trim();
        }

        embed
          .setDescription(`${TargetGM.user.tag} has been kicked!`)
          .setFooter(reason);
        sendMessage(embed);

        // try to send message to user
        let DMBlocked = false;
        await TargetGM.send(embed).catch((e) => {
          client.logger.error(e.message, TargetGM.user.username);
          if (e.message === 'Cannot send messages to this user') DMBlocked = true;
        });

        const modLog = guild.channels.cache.get(database.fn.guild.get(guild.id).moderator.modlog);
        embed
          .addField('Moderator', member.user.username, true)
          .addField('User', `${TargetGM.displayName} (${TargetGM.user.id})`, true);
        if (DMBlocked === true) await embed.setFooter(`${reason} | Users DMs are blocked`);
        modLog.send(embed);

        TargetGM.kick(reason);
      } else {
        // User didn't provide an argument here.
        embed.setDescription('Please provide a username to search!');
        sendMessage(embed);
      }
    }
  }
}

module.exports = KickCommand;
