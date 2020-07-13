const { Structures } = require('discord.js');

Structures.extend('User', (User) => {
  /**
   * The Yin Yang User class.
   * @class YinYangUser
   * @extends {User}
   */
  class YinYangUser extends User {
    /**
     * Creates an instance of YinYangUser.
     * @param {Client} client The Client.
     * @param {Object} data The data of the User.
     */
    constructor(client, data) {
      super(client, data);
    }

    /**
     * Sends a message to the user.
     * @param {Object|string} [content='???'] The content of the message.
     * @param {MessageOptions} [options=null] The options for the message.
     * @param {Object} helpers Helpers that allow the function to work.
     * @param {boolean} [helpers.warn=true] Whether or not to try and find the last channel the user was seen.
     * @returns {Promise<Message>} The message that was sent.
     */
    send(content = '???', options = null, { warn = true } = {}) {
      return super.send(content, options).catch(() => {
        if (warn) {
          const channel = this.client.channels.cache.get(this.lastMessageChannelID);
          if (channel) {
            const text = `Failed to direct message ${this} with the content. Please, make sure you have DMs enabled.`;
            return channel.send(text, options);
          }
        }
      });
    }
  }
  return YinYangUser;
});
