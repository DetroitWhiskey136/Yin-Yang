const Doc = require('discord.js-docs');
const { Command } = require('@structures');

class DocumentationCommand extends Command {
  constructor() {
    super({
      name: 'docs',
      description: 'Gets documentation about discord.js, commando, rpc and akairo',
      category: 'General',
      usage: '<stable, master, commando, rpc, akairo or akairo-master> <...query>',
      aliases: ['doc'],
      enabled: true,
    });
  }

  async run(ctx) {
    let { member, author, channel, args: [source, ...q] } = ctx;
    if (!source) return;

    if (!['stable', 'master', 'commando', 'rpc', 'akairo', 'akairo-master'].includes(source)) {
      const array = [source];
      for (const i in q) {
        array.push(q[i]);
      }
      q = array;
      source = 'master';
    }

    if (!q) return;
    const image = 'https://discord.js.org/static/logo-square.png';
    const doc = await Doc.fetch(source, { force: true });
    const content = await doc.resolveEmbed(q.join('#'));
    if (content !== null) {
      author.icon_url = image;
      channel.send({ embed: content });
    } else {
      channel.send({
        embed: {
          color: member.displayColor,
          description: 'Clearly thats not valid. Try again or don\'t, I couldn\'t care less',
        },
      });
    }
  }
}

module.exports = DocumentationCommand;
