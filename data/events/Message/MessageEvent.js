/* eslint-disable complexity, max-len, no-useless-escape, no-unused-vars */
const { Event, Embed } = require('@structures');
const { escapeRegExp, toProperCase } = require('@utils/StringUtil');
const CommandContext = require('@root/structures/command/CommandContext');

class MessageEvent extends Event {
  constructor() {
    super({
      name: 'message',
      enabled: true,
    });
  }

  /**
   * @param {YinYangClient} client
   * @param {Message} message
   * @returns
   */
  run(bot, client, message) {
    // #region Initial Data
    // Get useful properties from the message object
    const { author, channel, content, guild, member } = message;
    const database = bot.database;
    // Check if author is a bot and if the client has permission to speak in the channel.
    if (author.bot || (guild && !channel.permissionsFor(client.user).has('SEND_MESSAGES'))) return;
    let prefix = '!';
    let settings;

    if (this._isDMChannel(channel)) {
      return this.createEmbed(channel, 'RED', 'this bot is not designed to work in dm channels please only use me in a guild channel.');
    }

    settings = database.fn.guild.get(guild.id);
    prefix = settings.general.prefix ? settings.general.prefix : '!';
    // #endregion

    // Static messages
    const helpPrefix = `My prefix in this guild is: \`${prefix}\``;

    // #region Set Data
    this._updateMemberData(author, database);
    this._setGuildData(guild, database.fn.guild.get(guild.id));
    this._setMemberData(member, database.fn.user.get(member.id), client);
    // #endregion

    // Gets the used prefix for later use
    let usedPrefix = this._getPrefix(prefix, client, content);
    usedPrefix = usedPrefix && usedPrefix.length && usedPrefix[0];

    // Mention related tasks
    const MentionRegex = new RegExp(`^(<@!?${client.user.id}>)`);
    const mentioned = MentionRegex.test(message.content);

    if (!usedPrefix) return;

    const args = content.slice(usedPrefix.length).trim().split(/ +/g);
    // get the commandName from the first argument
    const commandName = args.shift().toLowerCase();
    // get the command from the client based on commandName
    const command = bot.commands.get(commandName) || bot.commands.get(bot.aliases.get(commandName));

    // check if mentioned and invalid command provided
    if (mentioned && !command) return this.createEmbed(channel, 'BLUE', helpPrefix);

    const level = bot.permLevel(message);

    if (!command) return;

    if (command.premium && (!member.premium || member.premium !== true)) {
      this.createEmbed(channel, 'RED', `This command is only available to premium users.`);
    }

    if (!guild && command.guildOnly) {
      this.createEmbed(channel, 'RED', `This command ${command.name} is unavailable in DMs. Please run this command in a guild.`);

      bot.logger.warn(`${bot.config.permLevels.find((l) => l.level === level).name} ${author.username} (${author.id}) ran unauthorized command ${command.name} in DMs`);
      return;
    }

    if (level < bot.levelCache[command.permLevel]) {
      if (settings !== null && settings.general.sysnotice) {
        this.createEmbed(channel, 'RED',
          `You do not have permission to use this command.\nYour permission level is: \`${level} (${toProperCase(bot.perms.find((l) => l.level === level).name)})\`\nThis command requires level \`${bot.levelCache[command.permLevel]} (${toProperCase(command.permLevel)})\``,
        );
      }
      return bot.logger.debug(`${bot.perms.find((l) => l.level === level).name} ${author.username} (${author.id}) ran unauthorized command: ${command.name} Content: ${content}`);
    }

    author.permLevel = level;

    const params = { bot, args, message, prefix, level, query: args.join(' ') };
    return command._run(new CommandContext(params), args);
  }

  _isDMChannel(channel) {
    return channel.type === 'dm';
  }

  _getPrefix(prefix, client, content) {
    // Prefix related tasks
    const fixedPrefix = escapeRegExp(prefix);
    const fixedUsername = escapeRegExp(client.user.username);

    const PrefixRegex = new RegExp(`^(<@!?${client.user.id}>|${fixedPrefix}|${fixedUsername})?`, 'i');

    return content.match(PrefixRegex);
  }

  /**
   * Ensures the member has data in the db in case it doesn't exist.
   * @param {GuildMember} member The member to ensure.
   * @param {Database} db The database.
   * @returns {Enmap} The enmap.
   */
  _updateMemberData(author, db) {
    const data = { premium: false, muted: false, dj: false };
    return db.user.ensure(author.id, data);
  }

  /**
   * Sets the Member data for later use in commands and stuff.
   * @param {GuildMember} member The Guild Member.
   * @param {*} data The data to set.
   */
  _setMemberData(member, data, client) {
    // client.logger.log('Message Event', member.user.username, data);
    member.premium = data && data.premium ? data.premium : null;
    member.muted = data && data.muted ? data.muted : null;
    member.dj = data && data.dj ? data.dj : null;
  }

  /**
   * Sets the Guild Data for later use in commands and stuff.
   * @param {Guild} guild The Messages Guild.
   * @param {*} data The data to set.
   */
  _setGuildData(guild, data) {
    guild.admin = data.admin;
    guild.general = data.general;
    guild.leave = data.leave;
    guild.moderator = data.moderator;
    guild.welcome = data.welcome;
  }

  /**
   *  Creates a nice little embed for returning information to the user.
   *
   * @param {Channel} channel the message channel
   * @param {String} color the embed color wanted
   * @param {String} message the message you want to send to the user i.e. "Don't be a dumbass"
   */
  createEmbed(channel, color, message) {
    if (!color || !message) throw new Error('A argument was not provided please check your work!');
    const embed = new Embed()
      .setColor(color)
      .setDescription(message);

    if (!channel || channel === undefined) throw new Error('Channel not provided please check your work!');
    channel.send(embed);
  }
}

module.exports = MessageEvent;
