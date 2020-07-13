/* eslint-disable no-unused-expressions */
const manager = require('@discord/Manager');
const { REGEX: { USER_ID }, EMOJIS } = require('@utils/Constants');

/**
 * @class Utils
 */
class Utils {
  /**
   * Checks if something is empty as in if their size/length is 0.
   * @param {*} val The value to be checked if empty.
   * @returns {boolean} Whether it is empty or not.
   */
  static isEmpty(val) {
    if ([false, null, undefined].includes(val)) return true;

    if (typeof val === 'number') return val === 0;
    if (typeof val === 'boolean') return false;
    if (typeof val === 'string' || typeof val === 'function' || Array.isArray(val)) return val.length === 0;

    if (val instanceof Error) return val.message === '';

    if (val.toString === Object.prototype.toString) {
      const type = val.toString();

      if (type === '[object File]' || type === '[object Map]' || type === '[object Set]') return val.size === 0;

      if (type === '[object Object]') {
        for (const key in val) {
          if (Object.prototype.hasOwnProperty.call(val, key)) return false;
        }

        return true;
      }
    }

    return false;
  }

  /**
   * Checks if something is a promise.
   * @param {*} val The value to be checked.
   * @returns {boolean} If the value was a promise.
   */
  static isPromise(val) {
    return val && Object.prototype.toString.call(val) === '[object Promise]' && typeof val.then === 'function';
  }

  static isBoolean(str) {
    let result;
    str === 'true' ? result = true : str === 'false' ? result = false : result = str;
    return result;
  }

  /**
   * SINGLE LINE AWAIT MESSAGE
   *
   * A simple way to grab a single reply, from the user that initiated the command.
   ** Useful to get __*precisions*__ on certain things.
   * @example const response = await client.awaitReply(msg, "Am i cool?"); msg.reply(response)
   * @param {*} msg
   * @param {String} question
   * @param {Number} limit
   */
  static async awaitReply(msg, question, limit = 60000) {
    // eslint-disable-next-line no-return-assign
    const filter = (m) => m.author.id = msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
      return collected.first();
    } catch (error) {
      return false;
    }
  }

  /**
   * Gets the state of a setting
   * @param {Boolean} state
   * @returns `ON/OFF`
   */
  static getState(state) {
    let res = 'OFF';
    if (state === 'true') {
      res = 'ON';
    }
    return res;
  }

  /**
   * Checks is id is a UserID
   * @param {String} id
   * @todo Move to UserUtils
   */
  static isUserID(id) {
    return id && !USER_ID.test(id);
  }

  static hasPlaceholder(message, placeholder, value) {
    let result;
    message.includes(placeholder) ? result = message.replace(placeholder, value) : result = message;
    return result;
  }

  static getEmoji(client, emoji) {
    return manager.get(client.emojis, EMOJIS[emoji]);
  }
}
module.exports = Utils;
