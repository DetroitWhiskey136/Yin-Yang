const { Guild, GuildMember, Message, MessageEmbed, User } = require('discord.js');
const CommandContext = require('@command/CommandContext');

const types = {
  normal: 'GREEN',
  error: 'RED',
  warn: 0xfdfd96,
};

/**
 * Resolves a name.
 * @param {Guild|GuildMember|User} resolvable The resolvable to be resolved.
 * @returns {string|void} The resolved name.
 * @private
 */
function checkName(resolvable) {
  if (resolvable instanceof User) return resolvable.tag;
  if (resolvable instanceof GuildMember) return resolvable.user.tag;
  if (resolvable instanceof Guild) return resolvable.name;
}

/**
 * Resolves an icon.
 * @param {Guild|GuildMember|User} resolvable The resolvable to be resolved.
 * @returns {string|void} The resolved image url.
 * @private
 */
function checkIcon(resolvable) {
  const opts = { size: 2048 };
  if (resolvable instanceof User) return resolvable.displayAvatarURL(opts);
  if (resolvable instanceof GuildMember) return resolvable.user.displayAvatarURL(opts);
  if (resolvable instanceof Guild) return resolvable.iconURL(opts);
}

/**
 * Resolves an url.
 * @param {GuildMember|User} resolvable The resolvable to be resolved.
 * @returns {string|void} The resolved url.
 * @private
 */
function checkURL(resolvable) {
  if (resolvable instanceof User) return `https://discordapp.com/users/${resolvable.id}`;
  if (resolvable instanceof GuildMember) return `https://discordapp.com/users/${resolvable.user.id}`;
}

/**
 * Main Embed class.
 * @class Embed
 * @extends {MessageEmbed}
 */
class Embed extends MessageEmbed {
  /**
   * Creates an instance of Embed.
   * @param {Object} [embedResolvable={}] The embed resolvable.
   * @param {GuildMember|Message|User} embedResolvable.author The author of the embed.
   * @param {Object} [options={}] The options for the embed.
   * @param {boolean} [options.autoFooter=true] Whether to automatically set the footer of the embed.
   * @param {boolean} [options.autoAuthor=true] Whether to automatically set the author of the embed.
   * @param {boolean} [options.autoTimestamp=true] Whether to automatically set the timestamp of the embed.
   * @param {Object} [data={}] The data of the embed.
   */
  constructor(embedResolvable = {}, options = {}, data = {}) {
    super(data);
    this._setupEmbed(embedResolvable, options);
  }

  /**
   * Private method that resolves the embeds' options.
   * @param {Object} embedResolvable The embed resolvable.
   * @param {Object} options The embeds' options.
   * @private
   * @returns {Embed} The embed.
   */
  _setupEmbed(embedResolvable, options) {
    this.options = Object.assign({
      autoFooter: true,
      autoAuthor: true,
      autoTimestamp: true,
      type: 'normal',
    }, options);

    if (embedResolvable instanceof User) embedResolvable = { author: embedResolvable };
    if (embedResolvable instanceof GuildMember) embedResolvable = { author: embedResolvable.user };
    if (embedResolvable instanceof Message) {
      const context = new CommandContext({ message: embedResolvable });
      embedResolvable = { author: context.author };
    }

    embedResolvable = Object.assign({ author: null }, embedResolvable);

    if (embedResolvable.author) {
      if (this.options.autoAuthor) this.setAuthor(embedResolvable.author);
      if (this.options.autoFooter) this.setFooter(embedResolvable.author.tag);
      if (this.options.autoTimestamp) this.setTimestamp();
    }

    const color = types[this.options.type] || types.normal || 'BLUE';
    this.setColor(color);
  }

  /**
   * Sets the Embed as an error embed.
   * @returns {Embed} The embed.
   */
  setError() {
    return this.setColor('RED');
  }

  /**
   * Sets the Embeds' color.
   * @param {string} color The color to set.
   * @returns {Embed} The embed.
   */
  setColor(color) {
    return super.setColor(color);
  }

  /**
   * Sets the Embeds' author.
   * @param {Guild|GuildMember|User|string} [name='???'] The name of the author.
   * @param {Guild|GuildMember|User|string} [iconURL=null] The resolvable to resolve the icon from.
   * @param {GuildMember|User|string} [url=null] The resolvable to resolve the url from.
   * @returns {Embed} The embed.
   */
  setAuthor(name = '???', iconURL = null, url = null) {
    const authorName = checkName(name);
    const authorNameIcon = checkIcon(name);
    const authorIcon = checkIcon(iconURL);
    const resolvedURL = checkURL(url) || checkURL(name);
    if (authorName) name = authorName;
    if (authorNameIcon && !iconURL) iconURL = authorNameIcon;
    if (authorIcon) iconURL = authorIcon;
    if (resolvedURL) url = resolvedURL;

    return super.setAuthor(name, iconURL, url);
  }

  /**
   * Set the Embeds' footer.
   * @param {Guild|GuildMember|User|string} [text='???'] The text of the footer.
   * @param {Guild|GuildMember|User|string} [iconURL=null] The resolvable to resolve the icon from.
   * @returns {Embed} The embed.
   */
  setFooter(text = '???', iconURL = null) {
    const footerTextName = checkName(text);
    const footerTextIcon = checkIcon(text);
    const footerIcon = checkIcon(iconURL);
    if (footerTextName) text = footerTextName;
    if (footerTextIcon && !iconURL) iconURL = footerTextIcon;
    if (footerIcon) iconURL = footerIcon;

    return super.setFooter(text, iconURL);
  }

  /**
   * Set the Embeds' description.
   * @param {string} [description='???'] The embeds' description.
   * @returns {Embed} The embed.
   */
  setDescription(description = '???') {
    return super.setDescription(description);
  }

  /**
   * Set the Embeds' title.
   * @param {string} [title='???'] The embeds' title.
   * @returns {Embed} The embed.
   */
  setTitle(title = '???') {
    return super.setTitle(title);
  }

  /**
   * Add a field to the Embed.
   * @param {string} [name='???'] The name for the field.
   * @param {string} [value='???'] The value for the field.
   * @param {boolean} [inline=false] Whether the field should be inline.
   * @returns {Embed} The embed.
   */
  addField(name = '???', value = '???', inline = false) {
    return super.addFields({ name, value, inline });
  }

  /**
   * Adds multiple fields to the embed.
   * @param {...EmbedField} fields The fields that will be added.
   * @returns {Embed} The embed.
   */
  addFields(...fields) {
    return super.addFields(fields);
  }

  /**
   * Set the Embeds' thumbnail.
   * @param {Guild|GuildMember|User|string} url The url to the image.
   * @returns {Embed} The embed.
   */
  setThumbnail(url) {
    const thumbnail = checkIcon(url) || url;
    return super.setThumbnail(thumbnail);
  }

  /**
   * Set the Embeds' image.
   * @param {GuildMember|User|string} url The url to the image.
   * @returns {Embed} The embed.
   */
  setImage(url) {
    const image = checkIcon(url) || url;
    return super.setImage(image);
  }


  /**
   * Set the Embeds' url.
   * @param {url} url The url
   * @returns {Embed} The embed.
   */
  setURL(url) {
    const cURL = checkURL(url) || url;
    return super.setURL(cURL);
  }
}

module.exports = Embed;
