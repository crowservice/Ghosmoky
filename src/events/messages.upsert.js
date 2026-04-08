export default {
  name: "messages.upsert",

  async load(msg, config, sock) {
    if (msg.type !== "notify") return;

    const message = msg.messages[0];

    if (!message.message || !message.key || message.key.fromMe) return;

    const jid = message.key?.participantAlt || message.key?.participant || message.key.remoteJid;

    const content =
      message.message?.extendedTextMessage?.text ||
      message.message?.ephemeralMessage?.message?.extendedTextMessage?.text ||
      message.message?.conversation ||
      message.messageinfo?.imageMessage?.caption ||
      message.messageinfo?.videoMessage?.caption ||
      message.messageinfo?.documentMessage?.caption ||
      "";

    if (!content || content.length <= 1 || content[0] !== "/") return;

    const args = content.slice(1).split(/ +/);
    const label = args.shift().toLowerCase();

    const command = config.cache.commands.find((cmd) => {
      return cmd.name === label || cmd.alias?.includes(label);
    });

    const isDev = config.devs.has(jid);

    if (!command || (command.dev && !isDev)) return;

    message.quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    command.run(sock, message, config, args, jid);
  },
};
