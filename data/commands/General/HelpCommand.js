/* eslint-disable max-depth, max-len */
const { Command, Embed } = require('@structures');
const { toProperCase } = require('@utils/StringUtil');

class HelpCommand extends Command {
  constructor() {
    super({
      name: 'help',
      description: 'Displays all the available commands for you',
      category: 'General',
      usage: 'help <category | command>',
      aliases: ['h', '?'],
      guildOnly: true,
      enabled: true,
    });
  }

  run(ctx) {
    const { bot, member, guild, channel, client, level, prefix, query, args } = ctx;
    const cat = args.join(' ');

    const myCommands = guild ?
      bot.commands.filter((cmd) => bot.levelCache[cmd.permLevel.toLowerCase()] <= level) :
      bot.commands.filter((cmd) => bot.levelCache[cmd.permLevel.toLowerCase()] <= level && cmd.guildOnly !== true);
    const CommandNames = myCommands.keyArray();

    const embed = new Embed()
      .setColor(member.displayColor)
      .setFooter(member.displayName, member.user.displayAvatarURL({ format: 'png' }));


    if (query) {
      const commands = [];

      CommandNames.forEach((cmd) => {
        const command = myCommands.get(cmd);
        if (command.category.toLowerCase() === cat.toLowerCase()) {
          commands.push(command);
        }
      });

      const output = [];
      commands.forEach((cmd) => {
        output.push(`**${prefix}${cmd.name}:**  ⟶  ${cmd.description}`);
      });

      if (commands.length <= 0) {
        try {
          let command = query;
          if (client.commands.has(command)) {
            command = client.commands.get(command);
            if (level < client.levelCache[command.permLevel]) return;
            embed.addField(toProperCase(command.name), `${command.description} \nusage -- ${command.usage} \naliases -- ${command.aliases.join(', ')}`);
            channel.send(embed);
          }
        } catch (_) {
          embed.setTitle('Something went wrong!')
            .setDescription(`It seems **${query}** not a valid category, or a command name`);
          channel.send(embed);
        }
      } else {
        embed.setTitle('Select A Command')
          .setDescription(`Usage: ${prefix}help <command>`)
          .addField('Command List', output.join('\n'));
        channel.send(embed);
      }
    }

    if (!query) {
      const myCategories = [];

      CommandNames.forEach((cmd) => {
        const category = myCommands.get(cmd).category;
        if (!myCategories.includes(category)) {
          myCategories.push(`${category}`);
        }
      });
      const links = [
        `[Add This Bot](https://discordapp.com/oauth2/authorize?client_id=${client.id}&scope=bot&permissions=339078359)`,
        '[Redwing Bots](https://discord.gg/YCsVZua)',
        '[Dannos Guild](https://discord.gg/6aKBJQR)',
      ];
      embed
        .setTitle('Select A Category')
        .setDescription(`Usage: ${prefix}help <category>`)
        .addField('Category List', myCategories.join('\n'), true)
        .addField('Shameless Plugs', links.join('\n'), true);
      channel.send(embed);
    }
  }
}

module.exports = HelpCommand;
