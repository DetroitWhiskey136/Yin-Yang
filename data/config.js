/* eslint-disable max-len */
const config = {
  /**
   * Bot Admins, level 9 by default.
   *
   * Array of user ID Strings
   */
  admins: ['190324299083546624', '385132696135008259', '211607587232153600', '222954293374746626'],

  /**
   * Bot Support, Level 8 by default.
   *
   * Array of user ID strings
   */
  support: ['290216832013565973'],

  /**
   * Dash Board will add this later
   */
  dashboard: {
    callbackURL: 'http://localhost:8082/callback',
    sessionSecret: process.env.SESSION_SECRET,
    domain: 'localhost',
    port: 8082,
  },
};

module.exports = config;
