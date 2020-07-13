const { Command, Embed } = require('@structures');

class RestartCommand extends Command {
  constructor() {
    super({
      name: 'restart',
      description: 'If running the bot with pm2 bot will restart, otherwise stops the bot.',
      category: 'Developer',
      usage: 'restart',
      permLevel: 'botowner',
      aliases: ['reboot', 'power'],
      guildOnly: true,
    });
  }

  async run(ctx) {
    const { bot, channel } = ctx;
    const embed = new Embed();
    try {
      embed.setDescription('Bot is shutting down.');
      await channel.send(embed);
      bot.commands.forEach(async (cmd) => {
        await bot.unloadCommand(cmd);
      });
      process.exit(0);
    } catch (error) {
      bot.logger.error(error);
    }
  }
}

module.exports = RestartCommand;
