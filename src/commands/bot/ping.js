export default {
  name: "ping",

  async run(sock, msg) {
    const start = Date.now();

    await sock.sendMessage(msg.key.remoteJid, {
      text: "¡Pong!",
    });

    const end = Date.now();

    sock.sendMessage(msg.key.remoteJid, {
      text: `\`${end - start}ms\``,
    });
  },
};
