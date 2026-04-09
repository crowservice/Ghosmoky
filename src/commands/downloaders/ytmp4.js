import axios from "axios";
import yts from "yt-search";

const API_URL = "http://216.173.77.174:7153/v1/fetch-media";
const API_KEY = "RojasMasterKey2026";

const QUALITIES = ["144p", "240p", "360p", "480p", "720p"];
const DEFAULT_QUALITY = "360p";

export default {
  name: "ytmp4",
  alias: ["mp4", "ytvideo"],
  category: "downloaders",
  usage: "/ytmp4 <nombre o link> [calidad]",

  async run(sock, msg, config, args) {
    const from = msg.key.remoteJid;

    let quality = DEFAULT_QUALITY;
    let queryArgs = [...args];

    if (QUALITIES.includes(args.at(-1)?.toLowerCase())) {
      quality = queryArgs.pop().toLowerCase();
    }

    const query = queryArgs.join(" ");
    if (!query) return msg.reply(`Uso: /ytmp4 [nombre o link] [calidad]\nCalidades: ${QUALITIES.join(", ")}`);

    await msg.react("⏳");

    try {
      // Buscar siempre con yts, sea URL o título
      const search = await yts(query);
      const video = search.videos[0];

      if (!video) {
        await msg.react("❌");
        return msg.reply("No encontré resultados.");
      }

      // Obtener thumbnail y stream en paralelo
      const [thumbRes, response] = await Promise.all([
        axios.get(video.thumbnail, { responseType: "arraybuffer" }),
        axios.post(
          API_URL,
          { url: video.url, type: "video", quality },
          { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" }, responseType: "stream" }
        ),
      ]);

      await sock.sendMessage(
        from,
        {
          document: { stream: response.data },
          mimetype: "video/mp4",
          fileName: `${video.title}.mp4`,
          caption: `*${video.title}* - ${quality}`,
          jpegThumbnail: Buffer.from(thumbRes.data),
        },
        { quoted: msg.data }
      );

      await msg.react("✅");

    } catch (err) {
      console.error("[ytmp4 error]", err.message);
      await msg.react("❌");
      msg.reply("Error al descargar. Puede que la calidad no esté disponible.");
    }
  },
};