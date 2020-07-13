module.exports = {
  // Client
  DiscordClient: require('./client/DiscordClient'),
  BotClient: require('./client/DiscordClient'),
  // Command
  Command: require('./command/Command'),
  CommandContext: require('./command/CommandContext'),
  // Discord
  Embed: require('./discord/Embed'),
  Manager: require('./discord/Manager'),
  Structures: require('./discord/Structures'),
  // Event
  Event: require('./event/Event'),
};
