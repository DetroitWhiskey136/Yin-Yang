/* eslint-disable require-atomic-updates */

const { Command, Embed } = require('@structures');
const { Music: { PlayNext } } = require('@utils');

const youtubeSearch = require('ytsr');
const youtubePlaylist = require('ytpl');

class PlayCommand extends Command {
  constructor() {
    super({
      name: 'play',
      description: 'Plays a song or adds to queue',
      category: 'Music',
      usage: 'play <song>',
      guildOnly: true,
      aliases: [],
      permLevel: 'user',
      enabled: true,
    });
  }

  run(ctx) {
    const { bot, message, guild, channel, voiceChannel, query } = ctx;
    let firstSong, playlist = false, times = 0;

    const embed = new Embed();

    if (!query) {
      embed.setDescription('I can\'t play nothing. please make sure you provide a youtube song: name, id or url');
      return channel.send(embed).then((m) => m.delete({ timeout: 10 * 1000 }));
    } else if (!voiceChannel) {
      embed.setDescription('Please be in a voice channel first!');
      return channel.send(embed).then((m) => m.delete({ timeout: 10 * 1000 }));
    }

    if (!bot.music.has(guild.id)) {
      firstSong = true;
      bot.music.set(`${guild.id}`, {
        dispatcher: null,
        queue: [],
        connection: null,
        position: -1,
      });
    }

    function playPlaylist(url, limit = 100) {
      youtubePlaylist(url, { limit }, (err, playlistResults) => {
        if (err) return playSong(url);

        let playlistInfo = {
          title: playlistResults.title,
          id: playlistResults.id,
          totalSongs: playlistResults.total_items,
          thumbnail: playlistResults.items[0].thumbnail,
        };

        // write the result to the queue.
        playlistResults.items.forEach((song) => {
          const obj = {
            link: song.url_simple,
            id: song.id,
            author: {
              name: song.author.name,
            },
            title: song.title,
            duration: song.duration,
          };
          writeQueue(obj);
        });

        playlist = true;
        play(playlistInfo);
      });
    }

    function playSong(url) {
      youtubeSearch(url, { limit: 1 }, (err, searchResults) => {
        if (err) return returnMessage();

        // write the result to the queue.
        writeQueue(searchResults.items[0]);

        play(searchResults.items[0]);
      });
    }

    function returnMessage() {
      if (times > 0) return;
      embed.setDescription(`Couldn't find anything with the name \`${query}\``)
        .setTitle('No Results');
      return channel.send(embed).then((m) => m.delete({ timeout: 10 * 1000 }));
    }

    function writeQueue(resultObj) {
      if (!resultObj || (resultObj.type !== 'video' && resultObj.type === 'playlist')) return times++ && returnMessage();
      if (resultObj.type === 'playlist') return;
      const regexID = /\?v=(.)+/g.exec(resultObj.link);
      const songID = regexID[0].replace('?v=', '');

      bot.music.get(guild.id).queue.push({
        url: resultObj.link,
        id: songID,
        chanName: resultObj.author.name,
        songTitle: resultObj.title,
        playTime: resultObj.duration,
      });
    }

    playPlaylist(query.replace(/^<|>$/g, ''));

    async function play(res) {
      if (firstSong) {
        embed.fields = null;
        await voiceChannel.join();
        times = 0;
        PlayNext(bot.music, message);
      } else {
        embed.fields = null;
        times = 0;
        if (playlist) {
          embed
            .setDescription(`**Added playlist to the queue:** \n${res.title} (${res.totalSongs} songs)`)
            .setThumbnail(res.thumbnail);
          channel.send(embed).then((m) => m.delete({ timeout: 2 * (60 * 1000) })).catch(console.error);
        } else {
          embed
            .setDescription(`**Added song to the queue:** \n${res.title} (${res.duration})`)
            .setThumbnail(res.thumbnail);
          channel.send(embed).then((m) => m.delete({ timeout: 2 * (60 * 1000) })).catch(console.error);
        }
      }
    }
  }
}
module.exports = PlayCommand;

