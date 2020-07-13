const Discord = require('discord.js');

class DiscordClient extends Discord.Client {
  constructor(options) {
    super(options);
  }
}
module.exports = DiscordClient;
