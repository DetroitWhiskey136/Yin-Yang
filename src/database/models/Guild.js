class Guild {
  constructor(client, database) {
    this.client = client;
    this.database = database;
  }

  /**
   * Gets the stored data of a guild
   * @param {String} guildID
   */
  get(guildID) {
    return this.database.guild.get(guildID);
  }

  /**
   * Sets the stored data of a guild
   * @param {String} guildID
   * @param {*} data
   */
  set(guildID, data) {
    // eslint-disable-next-line max-len, no-unused-vars
    const { prefix, sysnotice, modlog, modrole, adminlog, adminrole, welcomelog, welcomemsg, welcomeen, leavelog, leavemsg, leaveen } = data;

    const result = {
      general: {
        prefix: prefix || '!',
        sysnotice: sysnotice || false,
      },
      moderator: {
        modlog: modlog || null,
        modrole: modrole || null,
      },
      admin: {
        adminlog: adminlog || null,
        adminrole: adminrole || null,
      },
      welcome: {
        welcomelog: welcomelog || null,
        welcomemsg: welcomemsg || `Welcome {{user}} to {{guild}}, please read over the rules and have fun.`,
        welcomeen: welcomeen || false,
      },
      leave: {
        leavelog: leavelog || null,
        leavemsg: leavemsg || `All good things come to an end`,
        leaveen: leaveen || false,
      },
    };
    return this.database.guild.set(guildID, result);
  }

  /**
   * Deletes the data of a guild
   * @param {String} guildID
   */
  delete(guildID) {
    return this.database.guild.delete(guildID);
  }

  update(guildID, { key, value }) {
    let oldData = this.database.guild.get(guildID);
    for (const i in oldData) {
      if (key in oldData[i]) {
        oldData[i][key] = value;
        return this.database.guild.set(guildID, oldData);
      }
    }
    return new Error('Key not found');
  }
}

module.exports = Guild;
