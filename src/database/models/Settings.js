class Settings {
  constructor(client, database) {
    this.client = client;
    this.database = database;
  }

  get admins() {
    return this.database.settings.get('admins');
  }

  get support() {
    return this.database.settings.get('support');
  }

  /**
   * Adds a user to the admin array.
   *
   * @param {String} id ID of the user to add.
   * @returns {Enmap|null} Enmap or null
   */
  addAdmin(id) {
    if (!this.admins.includes(id)) {
      return this.database.settings.push('admins', id);
    }
    return null;
  }

  /**
   * Removes a user from the admin array.
   *
   * @param {String} id ID of the user to remove.
   * @returns {Enmap|null} Enmap or null
   */
  removeAdmin(id) {
    if (this.admins.includes(id)) {
      return this.database.settings.remove('admins', id);
    }
    return null;
  }

  /**
   * Adds a user to the support array.
   *
   * @param {String} id ID of the user to add.
   * @returns {Enmap|null} Enmap or null
   */
  addSupport(id) {
    if (!this.admins.includes(id)) {
      return this.database.settings.push('support', id);
    }
    return null;
  }

  /**
   * Removes a user from the support array.
   *
   * @param {String} id ID of the user to remove.
   * @returns {Enmap|null} Enmap or null
   */
  removeSupport(id) {
    if (this.admins.includes(id)) {
      return this.database.settings.remove('support', id);
    }
    return null;
  }

  getGuilds() {
    return this.database.settings.get('guilds');
  }

  setGuilds(value) {
    return this.database.settings.set('guilds', value);
  }

  setRestart(value) {
    return this.database.settings.set('restating', value);
  }

  getRestart() {
    return this.database.settings.get('restarting');
  }
}

module.exports = Settings;
