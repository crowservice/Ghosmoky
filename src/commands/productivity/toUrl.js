import { Catbox } from "node-catbox";
import fs from "fs";
import path from "path";
import { fileTypeFromBuffer } from "file-type";
import { downloadContentFromMessage } from "baileys";

const catbox = new Catbox();

export default {
  name: "tourl",
  category: "Productividad",
  description: "Convierte un archivo en un enlace",
  run: async (sock, msg) => {
    try {
      const target = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
        ? msg.message.extendedTextMessage.contextInfo
        : null;

      const mediaMsg = target
        ? target.quotedMessage
        : msg.message;

      const type = Object.keys(mediaMsg)[0];
      const mediaTypes = ["imageMessage", "videoMessage", "audioMessage", "documentMessage", "stickerMessage"];

      if (!mediaTypes.includes(type)) {
        await msg.react("❌");
        return msg.reply("Respondé a una imagen, video o documento.");
      }

      await msg.react("⏳");

      const stream = await downloadContentFromMessage(mediaMsg[type], type.replace("Message", ""));
      const chunks = [];
      for await (const chunk of stream) chunks.push(chunk);
      const buffer = Buffer.concat(chunks);

      const fileType = await fileTypeFromBuffer(buffer);
      const ext = fileType?.ext || "bin";

      const tmpDir = "./tmp";
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

      const filePath = path.join(tmpDir, `catbox_${Date.now()}.${ext}`);
      fs.writeFileSync(filePath, buffer);

      const url = await catbox.uploadFile({ path: filePath });
      fs.unlinkSync(filePath);

      await msg.react("✅");
      await msg.reply(url);
    } catch (err) {
      console.error(err);
      await msg.react("❌");
      await msg.reply("Error al subir el archivo.");
    }
  },
};