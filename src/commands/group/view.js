import { generateWAMessageFromContent } from 'baileys';

export default {
  name: "view",
  description: "Descarga imágenes o videos de visualización única.",
  use: "-view <imagen, video o audio>",
  category: "Grupos",

  run: async (sock, msg) => {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    try {
      if (!quoted) {
        await msg.reply("Cita un archivo de visualización única.");
        return;
      }

      const type = Object.keys(quoted).at(-1);
      if (!/\b(?:image|video|audio)Message\b/.test(type)) {
        await msg.reply("Cita un archivo de visualización única.");
        return;
      }

      const jid = msg.key.remoteJid;
      delete quoted[type].viewOnce;

      const proto = generateWAMessageFromContent(jid, quoted, {
        quoted: msg.data,
      });

      await sock.relayMessage(jid, proto.message, {
        messageId: proto.key.id,
      });

    } catch (error) {
      console.error(error);
      await msg.reply("Hubo un error obteniendo el archivo.");
    }
  },
};