/* eslint-disable no-unused-expressions, max-len, no-irregular-whitespace */


const { Command, Embed } = require('@structures');
const { size } = require('@discord/Manager');

const changeLogFile = `${process.cwd()}/CHANGELOG.json`;
const changeLog = require(changeLogFile);
const moment = require('moment');
const os = require('os');

class BotInfoCommand extends Command {
  constructor() {
    super({
      name: 'botinfo',
      description: 'Displays information about the bot',
      category: 'System',
      usage: 'botinfo',
      aliases: ['bi'],
      enabled: true,
      guildOnly: true,
    });
  }

  run(ctx) {
    const { bot, message, member, channel, client, discord } = ctx;

    function formatUptime() {
      let totalSeconds = process.uptime();
      let years, days, hours, minutes, seconds;

      if (totalSeconds >= 31536000) {
        years = Math.floor(totalSeconds / 31536000);
        totalSeconds %= 31536000;
      }

      if (totalSeconds >= 86400) {
        days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
      }
      if (totalSeconds >= 3600) {
        hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
      }
      if (totalSeconds >= 60) {
        minutes = Math.floor(totalSeconds / 60);
      }
      seconds = Math.floor(totalSeconds % 60);
      let result = [];

      years >= 1 ? result.push(`${years}y`) : null;
      days >= 1 ? result.push(`${days}d`) : null;
      hours >= 1 ? result.push(`${hours}h`) : null;
      minutes >= 1 ? result.push(`${minutes}m`) : null;
      seconds >= 1 ? result.push(`${seconds}s`) : null;

      return result.join(', ');
    }

    const users = size(client.users);
    const guilds = size(client.guilds);
    const chan = message.channel.name;


    let clientDataResult = [];
    let systemDataResult = [];
    const clientData = [
      ['Started At:', `${moment(client.readyTimestamp).format('MMM DD, YYYY hh:mm A')}`],
      ['Process Uptime:', `${formatUptime()}`],
      ['Guilds:', `${guilds}`],
      ['Users:', `${users}`],
    ];

    const systemData = [
      ['Discord.js Version:', `${discord.version}`],
      ['Node Version:', `${process.versions.node}`],
      ['Ram Usage:', `${((process.memoryUsage().heapUsed / os.freemem()) * 100).toFixed(2)}%`],
      ['Ping:', `${Math.floor(client.ws.ping)} ms`],
    ];

    clientData.forEach((i) => {
      clientDataResult.push(`${i[0]}\n~ ${i[1]}`);
    });

    systemData.forEach((i) => {
      systemDataResult.push(`${i[0]}\n~ ${i[1]}`);
    });

    const embed = new Embed()
      .setTitle(`This is ${client.user.username}'s info!`)
      .setColor(member.displayColor)
      .setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 64 }))
      .setDescription(`${client.user.username}(${client.user.id})\n${bot.appInfo.description}`)
      .addField('Client Information:', `\`\`\`${clientDataResult.join('\n')}\`\`\``)
      .addField('System Information:', `\`\`\`${systemDataResult.join('\n')}\`\`\``)
      .addField('CHANGELOG @latest', `\`\`\`${changeLog.latest.join('\n')}\`\`\``)
      .setFooter(`${member.displayName} | #${chan.charAt(0).toUpperCase() + chan.slice(1)}  |  ${moment().format('LLL')}`);

    channel.send(embed);
  }
}

module.exports = BotInfoCommand;
