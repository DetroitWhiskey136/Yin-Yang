const DiscordClient = require('@structures/client/DiscordClient');
const { Collection } = require('discord.js');
const Database = require('@database/Database');
const Logger = require('@utils/Logger');
const permLevels = require('@permissions/Levels');
const utils = require('@utils');
const { promisify } = require('util');
const path = require('path');
const klaw = require('klaw');

/**
 * Represents the bots client
 * @class YinYangClient
 * @extends {Client}
 */
class YinYangClient {
  /**
   * Available properties for the client
   * @param {ClientOptions} options - Same as the normal client options
   */
  constructor(options) {
    this.client = new DiscordClient(options);
    this.logger = Logger;
    this.database = new Database(this.client);
    this.utils = utils;

    this.config = require('../../../data/config');
    this.perms = permLevels;

    // Commands & Aliases are put into a collection
    this.commands = new Collection();
    this.aliases = new Collection();
    this.events = new Collection();

    // load Commands/Events
    this.loadFiles('data/commands', 'commands');
    this.loadFiles('data/events', 'events');

    // async shortcut to setTimeout
    this.wait = promisify(setTimeout);
  }

  /**
   * Gets the permission level of a user from a message.
   * @param {Message} message The message.
   * @returns {number} The users highest Level.
   * @memberof YinYangClient
   */
  permLevel(message) {
    let permlvl = 0;

    const permOrder = this.perms.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message, this)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  }

  /**
   * Gets the permission level of a member from the member object.
   * @param {GuildMember} member The member.
   * @returns {number} The members highest level.
   * @memberof YinYangClient
   */
  getPerm(member) {
    let permlvl = 0;

    const permOrder = this.perms.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (member.guild && currentLevel.guildOnly) continue;
      if (currentLevel.checkMember(member, this)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  }

  loadFiles(folder, type) {
    klaw(folder).on('data', (file) => {
      const parsedFile = path.parse(file.path);
      if (!parsedFile.ext || parsedFile.ext !== '.js') return;

      const parsedPath = `${parsedFile.name}${parsedFile.ext}`;
      let response;
      switch (type) {
        case 'commands':
          response = this.loadCommand(parsedFile.dir, parsedPath);
          break;
        case 'events':
          response = this.loadEvent(parsedFile.dir, parsedPath);
          break;
      }

      if (response) this.logger.error(response);
    });
  }

  /**
   * LOAD COMMAND
   *
   * Used to simplify loading commands from multiple locations
   * @param {String} cmdPath
   * @param {String} cmdName
   */
  loadCommand(cmdPath, cmdName) {
    try {
      const props = new (require(path.resolve(cmdPath, cmdName)))(this);
      // console.log(props);
      if (!props.enabled) return;

      props.location = cmdPath;
      props.fileName = cmdName;

      if (props.init) {
        props.init(this);
      }

      this.commands.set(props.name, props);

      props.aliases.forEach((alias) => {
        this.aliases.set(alias, props.name);
      });

      if (process.env.DEBUG === 'true') this.logger.debug(`${cmdName} Loaded`);
      return false;
    } catch (error) {
      return `Unable to load command ${cmdName}: ${error.message}`;
    }
  }

  /**
   * UNLOAD COMMAND
   *
   * Used to simplify unloads commands from multiple locations
   * @param {String} cmdPath
   * @param {String} cmdName
   */
  async unloadCommand(cmdPath, cmdName) {
    let command;
    if (this.commands.has(cmdName)) {
      command = this.commands.get(cmdName);
    } else if (this.aliases.has(cmdName)) {
      command = this.commands.get(this.aliases.get(cmdName));
    } else {
      return `The command '${cmdName}' doesn't exist, it's not an alias either.`;
    }

    if (command.shutdown) {
      await command.shutdown(this);
    }

    delete require.cache[require.resolve(path.resolve(cmdPath, command.fileName))];
    return false;
  }

  /**
   * LOAD EVENT
   *
   * Used to simplify loading events from multiple locations
   * @param {String} evtPath
   * @param {String} evtName
   */
  loadEvent(evtPath, evtName) {
    try {
      const props = new (require(path.resolve(evtPath, evtName)))(this);

      if (props.enabled === false) return;

      props.location = evtPath;
      props.fileName = evtName;

      if (props.init) {
        props.init(this);
      }

      this.events.set(props.name, props);

      this.client.on(props.name, (...args) => props.run(this, this.client, ...args));

      if (process.env.DEBUG === 'true') this.logger.debug(`${evtName} Loaded`);
      return false;
    } catch (error) {
      return `Unable to load event ${evtName}: ${error.message}`;
    }
  }

  /**
   * UNLOAD EVENT
   *
   * Used to simplify unloads events from multiple locations
   * @param {String} evtPath
   * @param {String} evtName
   */
  async unloadEvent(evtPath, evtName) {
    let event;
    if (this.events.has(evtName)) {
      event = this.events.get(evtName);
    } else {
      return `The event '${evtName}' doesn't exist`;
    }

    if (event.shutdown) {
      await event.shutdown(this);
    }

    delete require.cache[require.resolve(path.resolve(evtPath, event.conf.fileName))];
    return false;
  }
}

module.exports = YinYangClient;
