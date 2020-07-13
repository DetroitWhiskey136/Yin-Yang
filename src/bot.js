/* eslint-disable no-unused-expressions */
require('module-alias/register');
require('dotenv').config();

// const YinYangClient = require('@structures/discord/YinYangClient');
const BotClient = require('@structures/client/BotClient');
const { CLIENT_OPTIONS } = require('@utils/Constants');
const permLevels = require('@permissions/Levels');

const bot = new BotClient(CLIENT_OPTIONS);

bot.levelCache = {};

for (let i = 0; i < permLevels.length; i++) {
  const thisLevel = permLevels[i];
  bot.levelCache[thisLevel.name] = thisLevel.level;
}

bot.client
  .on('shardDisconnected', () => bot.logger.debug('Shard Disconnected...') && process.exit(1))
  .on('shardReconnecting', () => bot.logger.debug('Shard Reconnecting...'))
  .on('error', (error) => bot.logger.error(error))
  .on('warn', (info) => bot.logger.warn(info))
  .on('debug', (debug) => {
    if (process.env.DEBUG === 'true') bot.logger.debug(debug);
  });

bot.client.login(process.env.TOKEN);

process
  .on('uncaughtException', (error) => {
    const msg = error.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    bot.logger.error(`Uncaught Exception: ${msg}`);
    process.exit(1);
  })
  .on('unhandledRejection', (error) => bot.logger.error(`Uncaught Promise Error: ${error.message} \n${error.stack}`));
