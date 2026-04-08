import { MessageWrapper } from "../utils/_exports.js";

export default {
  name: "messages.upsert",

  async load(message, config, sock) {
    if (message.type !== "notify") return;

    const data = message.messages[0];

    if (!data.message || !data.key || data.key.fromMe) return;

    const content =
      data.message?.extendedTextMessage?.text ||
      data.message?.ephemeralMessage?.message?.extendedTextMessage?.text ||
      data.message?.conversation ||
      data.messageinfo?.imageMessage?.caption ||
      data.messageinfo?.videoMessage?.caption ||
      data.messageinfo?.documentMessage?.caption ||
      "";

    if (!content || content.length <= 1 || content[0] !== "/") return;

    const args = content.slice(1).trim().split(/\s+/);
    const label = args.shift().toLowerCase();

    const command = config.cache.commands.find((cmd) => {
      return cmd.name === label || cmd.alias?.includes(label);
    });

    const jid = data.key?.participantAlt || data.key?.remoteJidAlt;
    const isDev = config.devs.has(jid);

    if (!command || (command.dev && !isDev)) return;

    const msg = new MessageWrapper(sock.sendMessage, data);

    command.run(sock, msg, config, args);
  },
};
