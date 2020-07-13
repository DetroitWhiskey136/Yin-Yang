const manager = require('@discord/Manager');

/**
 * @class MemberUtil
 */
class MemberUtil {
  /**
   * Tries to get a guild member based on the parmas provided
   *
   * @static
   * @param {*} query Fuzzy Search Params.
   * @param {*} message The message to query off of.
   * @returns {GuildMember|null} The GuildMember or null
   * @memberof MemberUtil
   */
  static getMember(query, message) {
    const { member, guild: { members }, mentions } = message;
    if (query.length <= 0) {
      return member;
    } else if (mentions.members.size >= 1) {
      return mentions.members.first();
    } else {
      return manager.get(members, query) ||
        manager.find(members, (m) => m.displayName.toUpperCase() === query.toUpperCase()) ||
        manager.find(members, (m) => m.user.username.toUpperCase() === query.toUpperCase()) ||
        manager.find(members, (m) => m.user.tag.toUpperCase() === query.toUpperCase()) ||
        manager.find(members, (m) => m.user.id.toUpperCase() === query.toUpperCase()) ||
        manager.find(members, (m) => m.user.username.toUpperCase().startsWith(query.toUpperCase())) ||
        manager.find(members, (m) => m.user.username.toUpperCase().endsWith(query.toUpperCase())) ||
        manager.find(members, (m) => m.displayName.toUpperCase().startsWith(query.toUpperCase())) ||
        manager.find(members, (m) => m.displayName.toUpperCase().endsWith(query.toUpperCase())) ||
        null;
    }
  }
}
module.exports = MemberUtil;
