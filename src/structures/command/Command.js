/* eslint-disable no-array-constructor */

const Logger = require('@utils/Logger');

/**
 * The main Command class.
 * @class Command
 */
class Command {
  /**
   *Creates an instance of Command.
   * @param {Client} client The Client.
   * @param {Object} [options={}] The options for the command.
   * @param {string} [options.name=none] The name for the command.
   * @param {string} [options.description=none] The description for the command.
   * @param {string} [options.category=general] The category for the command.
   * @param {string} [options.usage=none] The usage for the command.
   * @param {string} [options.enabled=true] The enabled for the command.
   * @param {string} [options.guildOnly=false] The guildOnly for the command.
   * @param {string} [options.aliases=[]] The aliases for the command.
   * @param {string} [options.permLevel=user] The permLevel for the command.
   * @param {string} [options.premium=false] The premium for the command.
   * @param {string} [options.location=null] The location of the command.
   * @param {string} [options.fileName=null] The filename of the command.
   * @param {Object} [parameters=[]] The commands parameters.
   */
  constructor(options = {}, parameters = []) {
    this.parameters = parameters;
    this._setup(options);
  }

  /**
   * Sets up the command options.
   * @param {Object} options the commands options.
   * @returns {boolean} True.
   * @private
   */
  _setup(options) {
    this.name = options.name || 'none';
    this.description = options.description || 'none';
    this.category = options.category || 'General';
    this.usage = options.usage || 'none';
    this.enabled = options.enabled || true;
    this.guildOnly = options.guildOnly || false;
    this.aliases = options.aliases || [];
    this.permLevel = options.permLevel || 'User';
    this.premium = options.premium || false;
    this.location = null;
    this.fileName = null;

    return true;
  }

  /**
   * What gets ran when the command is triggered.
   * @returns {void}
   */
  run() {
    throw new Error(`${this.constructor.name} doesn't have a run() method.`);
  }

  // eslint-disable-next-line no-unused-vars
  async _run(ctx, ...args) {
    try {
      await this.run(ctx);
    } catch (error) {
      Logger.error(error.message, '\n', error.stack);
    }
  }
}
module.exports = Command;
