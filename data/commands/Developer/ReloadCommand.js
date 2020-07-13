const { Command, Embed } = require('@structures');

class ReloadCommand extends Command {
  constructor() {
    super({
      name: 'reload',
      description: 'Reloads a command that has been modified.',
      category: 'Admin',
      usage: 'reload <command>',
      permLevel: 'administrator',
      guildOnly: true,
      enabled: true,
      aliases: ['rl', 'load'],
    });
  }

  async run(ctx) {
    const { bot, message, channel, query } = ctx;
    const embed = new Embed();
    if (!query) return this.replyEmbed(embed, channel, 'RED', 'You must provide a command to reload.'); // message.reply('Must provide a command to reload.');

    const commands = bot.commands.get(query) ||
      bot.commands.get(bot.aliases.get(query));

    if (!commands) return this.replyEmbed(embed, channel, 'RED', `The Command \`${query}\` doesn't exist, nor was it an alias.`);
    // return message.reply(`The Command \`${query}\` doesn't exist, nor was it an alias.`);

    let response = await bot.unloadCommand(commands.location, commands.name);
    if (response) return message.reply(`Error Unloading: ${response}`);

    response = bot.loadCommand(commands.location, commands.fileName);
    if (response) return message.reply(`Error Loading: ${response}`);

    channel.send(`The Command \`${commands.name}\` has been reloaded.`);
  }

  /**
   * Send a reply embed (this really should be its own thing maybe one day soon).
   *
   * @param {*} embed the embed object
   * @param {*} channel the channel
   * @param {*} color the color
   * @param {*} message the message to send
   */
  replyEmbed(embed, channel, color, message) {
    if (!embed || !channel || !color || !message) return;

    embed
      .setColor(color)
      .setDescription(message);
    channel.send(embed);
  }
}

module.exports = ReloadCommand;
