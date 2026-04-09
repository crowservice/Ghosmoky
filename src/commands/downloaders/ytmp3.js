import axios from "axios";

function isYouTubeUrl(text) {
  return /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w\-]{11}/.test(text);
}

export default {
  name: "ytmp3",
  alias: ["mp3", "ytaudio"],
  category: "downloaders",
  description: "Descarga audio MP3 de YouTube",
  usage: "<url>",

  async run(sock, msg, config, args) {
    const url = args[0];
    const from = msg.key.remoteJid;

    if (!url) return msg.reply("Enviá una URL de YouTube.\nEjemplo: /ytmp3 https://youtu.be/...");
    if (!isYouTubeUrl(url)) return msg.reply("Esa URL no es de YouTube.");

    await msg.react("⏳");

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
        from,
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