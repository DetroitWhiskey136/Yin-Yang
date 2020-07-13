const { Command, Embed } = require('@structures');
const { getMember } = require('@utils/MemberUtil');

class SetPremiumCommand extends Command {
  constructor() {
    super({
      name: 'setpremium',
      description: 'Sets the premium for a user to true or false based on what they have',
      category: 'Owner',
      usage: 'setpremium <command>',
      permLevel: 'botadmin',
      guildOnly: true,
      enabled: true,
      aliases: ['sp', 'setprem'],
    });
  }

  async run(ctx) {
    const { message, channel, client, query } = ctx;
    const embed = new Embed();

    if (!query) {
      return this.replyEmbed(embed, channel, 'ORANGE', 'Please make sure to provide a user to add to the premium pack');
    }

    const GuildMember = await getMember(query, message);

    if (!GuildMember) {
      return this.replyEmbed(embed, channel, 'RED', 'The user provided is not a guild member');
    }

    let DBData = client.database.fn.user.get(GuildMember.id);

    if (!DBData || DBData.premium === false) {
      client.database.fn.user.set(GuildMember.id, { premium: true });
    } else if (DBData === true) {
      client.database.fn.user.set(GuildMember.id, { premium: false });
    }

    this.replyEmbed(embed, channel, 'GREEN', `Updated ${GuildMember.user.username}s' premium status`);
  }

  /**
   * Send a reply embed (this really should be its own thing maybe one day soon).
   *
   * @param {*} embed the embed object
   * @param {*} channel the channel
   * @param {*} color the color
   * @param {*} message the message to send
   */
  replyEmbed(embed, channel, color, message) {
    if (!embed || !channel || !color || !message) return;

    embed
      .setColor(color)
      .setDescription(message);
    channel.send(embed);
  }
}
module.exports = SetPremiumCommand;
