import { downloadContentFromMessage } from "baileys";
import { convertVideoToAudio } from "../../utils/toaud.js";

export default {
  name: "toaud",
  description: "Convierte un video en audio.",
  use: "<video>",
  category: "Productividad",
  run: async (sock, msg) => {
    try {
      const ctx = msg.message?.extendedTextMessage?.contextInfo;
      const mediaMsg = ctx?.quotedMessage ?? msg.message;
      const type = Object.keys(mediaMsg)[0];

      if (type !== "videoMessage") {
        await msg.react("❌");
        return msg.reply("Respondé a un video.");
      }

      const videoMessage = mediaMsg.videoMessage;

      if (videoMessage.seconds > 3600) {
        await msg.react("❌");
        return msg.reply("No se pueden convertir videos de más de 1 hora.");
      }

      await msg.react("🔁");

      const stream = await downloadContentFromMessage(videoMessage, "video");
      const chunks = [];
      for await (const chunk of stream) chunks.push(chunk);
      const buffer = Buffer.concat(chunks);

      const audioBuffer = await convertVideoToAudio(buffer);

      await msg.reply({ audio: audioBuffer, mimetype: "audio/mpeg" });
      await msg.react("✅");
    } catch (err) {
      console.error(err);
      await msg.react("❌");
      await msg.reply("Ocurrió un error.");
    }
  },
};