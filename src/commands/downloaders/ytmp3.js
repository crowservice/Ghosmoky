import axios from "axios";
import yts from "yt-search";

function isYouTubeUrl(text) {
  return /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w\-]{11}/.test(text);
}

export default {
  name: "ytmp3",
  alias: ["mp3", "ytaudio"],
  category: "downloaders",
  description: "Descarga audio MP3 de YouTube",
  usage: "<url o búsqueda>",

  async run(sock, msg, config, args) {
    const input = args.join(" ");

    if (!input) return msg.reply("Enviá una URL o término de búsqueda.\nEjemplo: /ytmp3 never gonna give you up");

    await msg.react("⏳");

    let url = input;

    if (!isYouTubeUrl(input)) {
      try {
        const { videos } = await yts(input);
        if (!videos.length) {
          await msg.react("❌");
          return msg.reply("No se encontraron resultados para esa búsqueda.");
        }
        url = videos[0].url;
      } catch (err) {
        console.error("[ytmp3 search error]", err.message);
        await msg.react("❌");
        return msg.reply("Error al buscar el video.");
      }
    }

    try {
      const { data: json } = await axios.get(
        `https://api.delirius.store/download/ytmp3v2?url=${encodeURIComponent(url)}`
      );

      if (!json.success || !json.data?.download) {
        await msg.react("❌");
        return msg.reply("No se pudo obtener el audio. Revisá el link e intentá de nuevo.");
      }

      const { download, title } = json.data;

      await sock.sendMessage(
        msg.key.remoteJid,
        {
          audio: { url: download },
          mimetype: "audio/mpeg",
          fileName: `${title}.mp3`,
        },
        { quoted: msg.data }
      );

      await msg.react("✅");
    } catch (err) {
      console.error("[ytmp3 error]", err.message);
      await msg.react("❌");
      await msg.reply("Hubo un error al conectarse. Revisá el link e intentá de nuevo.");
    }
  },
};