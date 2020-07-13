/* eslint-disable max-len, require-atomic-updates */


const { Event } = require('@structures');

class MessageUpdateEvent extends Event {
  constructor() {
    super({
      name: 'messageUpdate',
      enabled: true,
    });
  }

  // eslint-disable-next-line no-unused-vars
  run(bot, client, oldMessage, newMessage) {
    return null;
  }
}

module.exports = MessageUpdateEvent;
