const Enmap = require('enmap');
const models = require('@models');
const path = require('path');
const dataDir = `${process.cwd()}${path.sep}${path.join('data', 'enmap_data')}`;

/**
 * The Database used by the client
 */
class Database {
  /**
   * This creates the database functions
   * @param {*} client
   * @property fn
   */
  constructor(client) {
    this.client = client;
    this.fn = {};
    this.help = {};

    // get the files from classes and assign them.
    for (const i in models) {
      this[i.toLowerCase()] = new Enmap(i, { dataDir });
      Object.assign(this.fn, { [i.toLowerCase()]: new models[i](this.client, this) });
      Object.assign(this.help, { [i.toLowerCase()]: this.fn[i.toLowerCase()].__proto__ });
    }
  }
}

module.exports = Database;
