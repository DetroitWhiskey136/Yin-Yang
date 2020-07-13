/* eslint-disable semi, no-unused-vars, no-unused-expressions, max-depth */
const { Command, Embed } = require('@structures');
const { isRoleID, isRoleMention } = require('@utils/RoleUtils')
const { getMember } = require('@utils/MemberUtil');
const manager = require('@discord/Manager');
const Doc = require('discord.js-docs');

class TestCommand extends Command {
  constructor() {
    super({
      name: 'test',
      description: 'only for developer, if you don\t know what this is don\'t touch it ',
      category: 'Developer',
      usage: 'test',
      guildOnly: true,
      permLevel: 'botadmin',
      enabled: true,
    });
  }

  async run(ctx) {
    const { message, mentions, member, guild, author, channel, client, voiceChannel, level, prefix, database, query, args, discord, messageEmbed, sendMessage } = ctx;
    await database.fn.playlist.addToPlaylist('test', 'https://www.youtube.com/watch?v=b6CCcTClgYE');
    const playlist = database.fn.playlist.findPlaylistByName('test')
    console.log(playlist);
  }
}

module.exports = TestCommand;
