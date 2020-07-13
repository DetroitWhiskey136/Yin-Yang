class User {
  constructor(client, database) {
    this.client = client;
    this.database = database;
  }

  /**
   * Gets the stored data of a user
   * @param {String} userID
   */
  get(userID) {
    return this.database.user.get(userID);
  }

  /**
   * Sets the stored data of a user
   * @param {String} userID
   * @param {*} data
   */
  set(userID, data = { premium: false, muted: false, dj: false }) {
    // eslint-disable-next-line max-len, no-unused-vars
    return this.database.user.set(userID, data);
  }

  /**
   * Deletes the data of a user
   * @param {String} userID
   */
  delete(userID) {
    return this.database.user.delete(userID);
  }
}

module.exports = User;
