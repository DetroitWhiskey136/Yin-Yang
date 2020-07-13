class Playlist {
  constructor(client, database) {
    this.client = client;
    this.database = database;
  }

  get playlists() {
    return this.database.playlist;
  }

  /**
   * Creates a Playlist for a single user
   *
   * @param {*} id The id of the playlist
   * @param {*} name The name of the playlist
   * @param {*} user The user ID of the playlists owner
   * @param {*} [entries=[]] The Entries of the playlist
   * @returns {Enmap | null} Enmap or null
   */
  createUserPlaylist(id, name, user, entries = []) {
    const data = { name, user, entries };
    if (!this.playlists.has(id)) {
      return this.database.playlist.set(id, data);
    }
    return null;
  }

  /**
   * Gets a playlist from a given id.
   *
   * @param {*} id The ID of the playlist.
   * @returns {Enmap|null} Enmap or null
   */
  getPlaylistByID(id) {
    if (this.playlists.has(id)) {
      console.log(this.database.playlist.get(id));
    }
    return null;
  }

  /**
   * Finds a playlist by the name.
   *
   * @param {*} name Name of the playlist
   * @returns {Enmap | null} Enmap or null
   */
  findPlaylistByName(name) {
    const key = this.database.playlist.findKey((val) => val.name === name);
    if (key) {
      return this.getPlaylistByID(key);
    }
    return null;
  }

  addToPlaylist(name, song) {
    const playlist = this.database.playlist.findKey((val) => val.name === name);
    if (!playlist) return null;

    return this.database.playlist.push(playlist, song, 'entries');
  }
}
module.exports = Playlist;
