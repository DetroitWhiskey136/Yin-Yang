const { Command, Embed } = require('@structures');

class TodoCommand extends Command {
  constructor() {
    super({
      name: 'todo',
      description: 'control todos, available options add, edit, delete, (if left blank will display list of your todos)',
      category: 'General',
      usage: 'todo <add, edit, delete>',
      aliases: [],
      enabled: true,
      guildOnly: true,
      permLevel: 'user',
    });
  }

  run(ctx) {
    // eslint-disable-next-line no-unused-vars
    let { args: [task, ...content], member, database, author, channel } = ctx;

    database.todos.ensure(member.id, {});
    const embed = new Embed({ author, autoFooter: false });
    const userData = database.fn.todos.get(member.id);
    const UDArray = Object.keys(userData);
    let maxLen = UDArray.length;

    if (maxLen > 32) {
      maxLen = 32;
    }

    if (!task) {
      if (UDArray.length < 1) {
        embed.setDescription('You do not have any todos');
      } else {
        embed.setTitle('Here are your todos');
        for (let i = 0; i < maxLen; i++) {
          embed.addField(UDArray[i], userData[UDArray[i]]);
        }
      }

      return channel.send(embed);
    } else if (task.toLowerCase() === 'add') {
      if (!content) {
        embed.setDescription('You did not provide any content for the todo');
        return channel.send(embed);
      }

      try {
        const contentValue = content.join(' ');
        database.fn.todos.set(member.id, contentValue);
        embed.setDescription(`Successfully Added \`${contentValue}\` `);
      } catch (error) {
        embed.setDescription('There was an error please contact one of the developers of this bot to sort this out');
      }
      return channel.send(embed);
    } else if (task.toLowerCase() === 'edit') {
      if (!content[0]) {
        embed.setDescription('You did not provide an id to edit');
        return channel.send(embed);
      }
      const todoID = content.shift();

      if (todoID in userData) {
        embed.setDescription('That id is not in the database, Please check the id and try again.');
        return channel.send(embed);
      }

      if (!content[0]) {
        embed.setDescription('You did not provide the new content for the todo');
        return channel.send(embed);
      }

      const newValue = content.join(' ');

      try {
        database.fn.todos.update(member.id, todoID, newValue);
        embed.setDescription(`Successfully updated ${todoID} with \`${newValue}\` `);
      } catch (error) {
        embed.setDescription('There was an error please contact one of the developers of this bot to sort this out');
      }
      return channel.send(embed);
    } else if (task.toLowerCase() === 'delete') {
      try {
        if (content[0] in userData) {
          database.fn.todos.delete(member.id, content[0]);
          embed.setDescription(`Successfully deleted ${content}`);
        } else {
          embed.setDescription(`${content} could not be found please check your work and try again`);
        }
      } catch (error) {
        embed.setDescription(error.message);
      }
      return channel.send(embed);
    } else {
      embed.setDescription('Thats not a valid task, valid tasks are <add | edit | delete>');
      channel.send(embed);
    }
  }
}

module.exports = TodoCommand;
