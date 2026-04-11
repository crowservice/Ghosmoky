import { downloadContentFromMessage } from "baileys";
import { Shazam } from "node-shazam";
import fs from "fs";
import path from "path";
import os from "os";

const shazam = new Shazam();

export default {
  name: "shazam",
  alias: ["shz"],
  category: "Premium",
  description: "Identifica la canción de un audio usando Shazam.",
  use: "-shazam [ Audio citado ]",
  run: async (sock, msg) => {
    try {
      await msg.react("⏳");

      const ctx = msg.message?.extendedTextMessage?.contextInfo;
      const mediaMsg = ctx?.quotedMessage ?? msg.message;
      const type = Object.keys(mediaMsg)[0];

      if (type !== "audioMessage") {
        await msg.react("❓");
        return msg.reply("Responde a un mensaje de audio.");
      }

      const stream = await downloadContentFromMessage(mediaMsg[type], "audio");
      const chunks = [];
      for await (const chunk of stream) chunks.push(chunk);
      const buffer = Buffer.concat(chunks);

      if (buffer.length > 40 * 1024 * 1024) {
        await msg.react("❌");
        return msg.reply("El audio es muy grande.\n\nLimite: `40MB`");
      }

      const tempFile = path.join(os.tmpdir(), `shazam_${Date.now()}.mp3`);
      fs.writeFileSync(tempFile, buffer);

      await msg.react("🔍");
      const result = await shazam.recognise(tempFile, "en-US");
      fs.unlinkSync(tempFile);

      if (!result) {
        await msg.react("❌");
        return msg.reply("No se pudo identificar la canción.");
      }

      if (result.track) {
        const { title, subtitle: artist, images } = result.track;
        await msg.react("✅");
        await msg.reply({
          image: { url: images?.coverart },
          caption: `🎶 *Título:* ${title}\n👤 *Artista:* ${artist}`,
        });
      } else if (result.message) {
        await msg.react("❌");
        await msg.reply(result.message);
      } else {
        throw new Error("La API ha dado una respuesta inesperada");
      }
    } catch (error) {
      console.error(error);
      await msg.react("❌");
      await msg.reply("Error al procesar el audio: " + error.message);
    }
  },
};