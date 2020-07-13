/* eslint-disable  max-len */

const { Command, Embed } = require('@structures');
const { isBoolean } = require('@utils/Utils');
const { toProperCase } = require('@utils/StringUtil');

class ConfigCommand extends Command {
  constructor() {
    super({
      name: 'config',
      description: 'Modify the configuration for the current guild',
      category: 'Admin',
      usage: 'config <key> <value>',
      guildOnly: true,
      aliases: ['conf'],
      permLevel: 'administrator',
    });
  }

  run(ctx) {
    let { guild, prefix, database, args: [key, ...value], sendMessage } = ctx;
    const keys = ['adminlog', 'adminrole', 'prefix', 'sysnotice', 'leaveen', 'leavelog', 'leavemsg', 'modlog', 'modrole', 'welcomeen', 'welcomelog', 'welcomemsg'];
    const gSettings = database.fn.guild.get(guild.id);
    value = value.join(' ');

    if (key) {
      if (!keys.includes(key.toLowerCase())) {
        return createEmbed(gSettings, 'RED', `__**That key is not valid**__ \n\nPlease have a look below to see the valid keys also the example is fool proof probably. \n\nexample: \`${prefix}config prefix !\``);
      } else {
        database.fn.guild.update(guild.id, { key, value: isBoolean(value) });
        return createEmbed(database.fn.guild.get(guild.id), 'BLUE', `Successfully changed \`${key}\` to \`${value}\``);
      }
    } else {
      return createEmbed(gSettings, '#00ffff', `To set a option below please input a key and a value \n\nexample: \`${prefix}config prefix !\``);
    }

    function createEmbed(settings, color, description) {
      const embed = new Embed()
        .setTitle(`${guild.name}'s Guild Config`)
        .setColor(color)
        .setDescription(description);
      for (const i in settings) {
        let array = [];
        for (const prop in settings[i]) {
          array.push(`${prop}: ${settings[i][prop]}`);
        }
        embed.addField(toProperCase(i), array.join('\n'));
      }

      sendMessage(embed);
    }
  }
}

module.exports = ConfigCommand;
