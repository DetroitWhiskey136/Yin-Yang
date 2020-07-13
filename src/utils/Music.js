/* eslint-disable no-unused-vars */

const { Embed } = require('@structures');
const { isEmpty } = require('@utils/Utils');
const ytdl = require('ytdl-core');
// const youtube = require('scrape-youtube').default;

class Music {
  static getMusic(guildID, music) {
    const guildData = music.get(guildID);
    return !isEmpty(guildData) ? guildData : undefined;
  }

  static setMusic(guildID, music, data) {
    return !isEmpty(data) ? music.set(guildID, data) : new Error('Error in Music setMusic: data cannot be empty');
  }

  static getDispatcher(guildID, music) {
    return !isEmpty(Music.getMusic(guildID, music)) ? Music.getMusic(guildID, music).dispatcher : new Error('Error: dispatcher not found try playing music to create a new one');
  }

  static setDispatcher(guild, songID) {
    const dispatcher = guild.voice.connection.play(Music.play(songID), {
      seek: 0,
      passes: 15,
      volume: guild.voice.connection.volume || 0.35,
      highWaterMark: 1,
      bitrate: 50000,
    });
    return dispatcher;
  }

  static play(id, options = {
    quality: 'highest',
    highWaterMark: 25 * (1024 * 1024),
  }) {
    return ytdl(`https://www.youtube.com/watch?v=${id}`, options);
  }
  static sendNowPlaying(description, thumbnail, url, channel) {
    const embed = new Embed()
      .setDescription(description)
      .setThumbnail(thumbnail)
      .setURL(url);
    return channel.send(embed).then((m) => m.delete({ timeout: 5 * (60 * 1000) }));
  }

  static PlayNext(music, message) {
    const { channel, guild, client } = message;
    const thisMusic = Music.getMusic(guild.id, music);

    const nextSong = thisMusic.queue[++thisMusic.position];

    if (!nextSong) return;

    const dispatcher = Music.setDispatcher(guild, nextSong.id);
    thisMusic.dispatcher = dispatcher;

    Music.sendNowPlaying(
      `**Now Playing:** \n${nextSong.songTitle} (${nextSong.playTime})`,
      `https://i.ytimg.com/vi/${nextSong.id}/mqdefault.jpg`,
      nextSong.url, channel,
    );

    dispatcher
      .on('debug', (dbg) => {
        // eslint-disable-next-line no-useless-return
        if (dbg.message !== 'ffmpeg stream: Cannot call write after a stream was destroyed') {
          console.log(dbg);
        }
      })
      .on('error', (err) => {
        // console.log('ERROR', err.message, err);
        if (err.message) {
          const ErrorEmbed = new Embed()
            .setDescription('Song was not available, we will skip it so it doesn\'t break the bot');
          channel.send(ErrorEmbed).then((m) => m.delete({ timeout: 1 * (60 * 1000) })).catch(console.error);
          return dispatcher.end();
        } else {
          console.log(err);
        }
      });

    dispatcher.on('finish', () => {
      if ((thisMusic.position + 1) < thisMusic.queue.length) {
        Music.PlayNext(music, message);
      } else {
        const EndStreamEmbed = new Embed()
          .setDescription('Queue has ended, please add more songs to keep listening.');
        channel.send(EndStreamEmbed).then((m) => m.delete({ timeout: 1 * (60 * 1000) })).catch(console.error);
        guild.voice.connection.disconnect();
        music.delete(message.guild.id);
      }
    });
  }
}
module.exports = Music;
