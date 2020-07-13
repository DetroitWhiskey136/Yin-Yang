/* eslint-disable max-len, max-depth, no-unused-vars*/

const { Command, Embed } = require('@structures');
const { Constants, GuildUtils, Logger, MemberUtils, RoleUtils, StringUtil, Utils } = require('@utils');
const manager = require('@discord/Manager');
const { isEmpty, isPromise } = Utils;
const { code } = StringUtil;

const { inspect } = require('util');

const token = process.env.TOKEN;
const value = (str) => code(str, 'js').replace(token, () => '*'.repeat(20));
const hrToSeconds = (hrtime) => (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
const exec = (c) => require('child_process').execSync(c).toString();

class EvalCommand extends Command {
  constructor() {
    super({
      name: 'eval',
      description: 'Evaluates arbitrary JavaScript',
      category: 'Developer',
      usage: 'eval <code>',
      aliases: ['compile', 'ev', 'js'],
      permLevel: 'botadmin',
      guildOnly: false,
    });
  }

  async run(ctx) {
    const { bot, message, mentions, member, guild, author, channel, client, voiceChannel, level, prefix, database, query, args, discord, sendMessage } = ctx;

    const embed = new Embed({ author });

    let res;

    // eslint-disable-next-line quotes
    const toEval = query.replace(/(^`{3}(\w+)?|`{3}$)/gim, () => '');

    const cleanResult = async (evaluated, hrStart) => {
      const resolved = await Promise.resolve(evaluated);
      const hrDiff = process.hrtime(hrStart);

      const inspected = typeof resolved === 'string' ? resolved : inspect(query ? resolved : bot, { depth: 0, showHidden: true });
      const cleanEvaluated = value(this.clean(inspected));

      const executedIn = `Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000} ms`;
      return `${isPromise(evaluated) ? 'Promise ' : ''}Result (${executedIn}): ${cleanEvaluated}`;
    };

    try {
      const hrStart = process.hrtime();
      const evaluated = eval(toEval);
      res = await cleanResult(evaluated, hrStart);
    } catch (err) {
      console.error(err.stack);
      if (['await is only valid in async function', 'await is not defined'].includes(err.message)) {
        try {
          const hrStart = process.hrtime();
          if (toEval.trim().split('\n').length === 1) {
            res = await cleanResult(eval(`(async () => ${toEval})()`), hrStart);
          } else res = await cleanResult(eval(`(async () => {\n${toEval}\n})()`), hrStart);
        } catch (er) {
          res = `Error: ${value(this.clean(er))}`;
        }
      } else res = `Error: ${value(this.clean(err))}`;
    } finally {
      embed.setDescription(res);
      await channel.send(embed);
    }
  }

  clean(text) {
    const blankSpace = String.fromCharCode(8203);
    return typeof text === 'string' ? text.replace(/`/g, `\`${blankSpace}`).replace(/@/g, `@${blankSpace}`) : text;
  }
}

module.exports = EvalCommand;
