/* eslint-disable max-len */
const { Command, Embed } = require('@structures');

const Gamedig = require('gamedig');

class ServerStatusCommand extends Command {
  constructor() {
    super({
      name: 'fivemstatus',
      description: 'Coming soon',
      category: 'FiveM',
      usage: 'fivemstatus',
      enabled: true,
    });
  }

  run(ctx) {
    const { member, author, channel } = ctx;
    const embed = new Embed()
      .setColor(member.displayHexColor)
      .setFooter(member.displayName, author.displayAvatarURL({ format: 'png' }));

    Gamedig.query({
      type: 'fivem',
      host: 'inserthosthere',
      port: '20197',
    }).then((state) => {
      // console.log(state);
      const rawdata = state.raw;
      const players = state.raw.players;
      const playerList = [];
      players.forEach((p) => {
        playerList.push(`${p.name} (${p.id})`);
      });
      embed.setTitle(`${rawdata.hostname} (${rawdata.gametype})`);
      embed.setDescription(`**__Resources__**: | ${rawdata.info.resources.join(' | ')} |`);
      embed.addField('Players', playerList.length >= 1 ? playerList.join('\n') : 'No one is playing right now');

      channel.send(embed);
    }).catch((error) => {
      console.log('server is offline', error);
    });
    // return null;
  }
}

module.exports = ServerStatusCommand;
