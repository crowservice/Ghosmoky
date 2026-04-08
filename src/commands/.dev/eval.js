import { inspect } from "util";

export default {
  name: "eval",
  dev: true,

  async run(sock, msg, config, args, user) {
    if (!args.length) return;

    const code = args.join(" ");

    try {
      const evaluated = await eval(`(async () => { ${code} } )()`);

      if (typeof evaluated === "string") return msg.reply(evaluated);

      msg.reply(inspect(evaluated, { depth: null }));
    } catch (error) {
      msg.reply(inspect(error));
    }
  },
};
