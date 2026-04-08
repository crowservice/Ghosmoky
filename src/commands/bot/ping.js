export default {
  name: "ping",
  category: "Ghosmoky",
  description: "Mide el tiempo de respuesta del bot.",

  async run(sock, msg) {
    const start = Date.now();

    const sent = await msg.reply("¡Pong!");

    const end = Date.now();

    sock.sendMessage(msg.key.remoteJid, {
      text: `\`${end - start}ms\``,
      edit: sent.key,
    });
  },
};
