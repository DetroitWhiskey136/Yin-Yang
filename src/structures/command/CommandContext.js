/* { message, mentions, member, guild, author, channel, client, voiceChannel, level, prefix, database, query, args, discord, sendMessage } */


const discord = require('discord.js');

/**
 * This class provides a object of options for the run method
 */
class CommandContext {
  /**
   *Creates an instance of CommandContext.
   * @param {Object} options The options for the context.
   * @param {BotClient} options.bot The main client for the project.
   * @param {Message} options.message The commands message.
   * @param {string} options.prefix The commands prefix.
   * @param {string} options.query The command's query.
   * @param {string[]} options.args The command's arguments.
   */
  constructor(options) {
    this.bot = options.bot;
    this.message = options.message;
    this.mentions = options.message.mentions;
    this.member = options.message.member;
    this.guild = options.message.guild;
    this.author = options.message.author;
    this.channel = options.message.channel;
    this.client = options.bot.client;
    this.database = options.bot.database;
    this.voiceChannel = this._getVoiceChannel(this.member, this.guild, this.client);
    this.level = options.level;
    this.prefix = options.prefix;
    this.query = options.query;
    this.args = options.args;
    this.discord = discord;
    this.sendMessage = (c) => options.message.channel.send(c);
  }

  _getVoiceChannel(member, guild, client) {
    return member.voice.channel ?
      member.voice.channel :
      client.voice.connections.has(guild.id) ?
        client.voice.connections.get(guild.id).channel :
        null;
  }
}
module.exports = CommandContext;
