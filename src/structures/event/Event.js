/**
 * This class creates the event properties to be used
 */
class Event {
  /**
   * Available properties for the event
   * @param {String} name - Name of the event
   * @param {Boolean} enabled - Is event enabled
   */
  constructor({
    name = 'not provided',
    enabled = true,
  }) {
    this.name = name;
    this.enabled = enabled;
  }
}
module.exports = Event;
