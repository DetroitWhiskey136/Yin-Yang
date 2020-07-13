const { REGEX: { REGEX } } = require('@utils/Constants');

const { Collection } = require('discord.js');
const Enmap = require('enmap');

/**
 * @class StringUtil
 */
class StringUtil {
  /**
   * If string is longer than maxlength will cut string down
   * @param {String} str
   * @param {String} lang
   * @param {Number} minLength
   * @param {Number} maxLength
   */
  static code(str, lang, minLength = 0, maxLength = 1024) {
    str = String(str);
    return `\`\`\`${lang}\n${str.slice(minLength, maxLength - 3) + (str.length > maxLength - 3 ? '...' : '')}\n\`\`\``;
  }

  /**
   * Escapes Regular Expression
   * @param {String} str
   */
  static escapeRegExp(str) {
    if (typeof str !== 'string') {
      throw new TypeError('Expected a string');
    }
    return str
      .replace(REGEX, '\\$&')
      .replace(/-/g, '\\u002d');
  }

  /**
   * This is good for Titles, thats about it.
   * @param {String} str - String you want to make proper case
   */
  static toProperCase(str) {
    if (typeof str !== 'string') throw new TypeError('text must be type string');
    return (str ? str.toLowerCase() : this)
      .replace(/(^|[\s\xA0])[^\s\xA0]/g, (s) => s.toUpperCase());
  }

  /**
   * MESSAGE CLEAN FUNCTION
   *
   * Mostly used for the __*Compile*__ and __*Exec*__ commands
   *
   ** removes @everyone pings
   ** removes tokens
   ** makes code blocks escaped so they're shown more easily
   ** also resolves promises and will stringify the objects
   * @param {String} str
   */
  static async clean(str) {
    if (str && str.constructor.name === 'Promise') str = await str;
    if (typeof evaled !== 'string') str = require('util').inspect(str, { depth: 0 });

    str = str
      .replace(/`/g, `\`${String.fromCharCode(8203)}`)
      .replace(/@/g, `@${String.fromCharCode(8203)}`)
      .replace(this.token, 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0');

    return str;
  }

  /**
   * Checks if string should be singular (1) or plural (2+).
   * @example
   * // returns "apples";
   * fixPlural(2, "apple");
   * @example
   * // returns "url wasn't a";
   * fixPlural(["a"], "url wasn't a", "urls weren't");
   * @param {*} val The value to check.
   * @param {string} singular The singular form of the word.
   * @param {string} [plural=`${singular}s`] Plural form of the word.
   * @returns {string} Either the singular or plural of the word provided.
   */
  static fixPlural(val, singular, plural = `${singular}s`) {
    if (!singular) return '???';
    else if (
      (([Collection, Map, Object].includes(val.constructor) || val instanceof Enmap) && val.size !== 1) ||
      (val.constructor === Number && val !== 1) ||
      (Array.isArray(val) && val.length !== 1)
    ) return plural;
    return singular;
  }

  static makeID(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
}
module.exports = StringUtil;
