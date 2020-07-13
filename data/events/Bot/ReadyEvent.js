/* eslint-disable max-len, require-atomic-updates */
const { Event } = require('@structures');
const { size } = require('@discord/Manager');

class ReadyEvent extends Event {
  constructor() {
    super({
      name: 'ready',
      enabled: true,
    });
  }

  async run(bot, client) {
    bot.wait(1000);

    bot.appInfo = await client.fetchApplication();
    setInterval(async () => {
      bot.appInfo = await client.fetchApplication();
    }, 60000);


    setInterval(() => {
      const cachedGuilds = bot.database.fn.settings.getGuilds();
      const guilds = client.guilds.cache.size;
      if (!cachedGuilds || guilds !== cachedGuilds) {
        bot.database.fn.settings.setGuilds(guilds);
        client.user.setActivity(`mentions | ${guilds} Guilds`, { type: 3 });
      }
    }, 60000 * 60);

    const users = size(client.users);
    const guilds = size(client.guilds);

    client.user.setActivity(`mentions | ${guilds} Guilds`, { type: 3 });

    bot.database.fn.settings.setRestart(false);
    bot.logger.log(`${client.user.username}, Ready to serve ${users} users in ${guilds} guilds.`);
  }
}

module.exports = ReadyEvent;
