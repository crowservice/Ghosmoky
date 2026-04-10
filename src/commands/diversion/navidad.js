export default {
  name: "navidad",
  alias: ["christmas"],
  category: "Diversión",
  description: "Muestra cuantos días faltan para navidad.",
  run: async (sock, msg) => {
    const today = new Date();
    const year = today.getFullYear();
    const christmas = new Date(`${year}-12-25`);

    if (today.toDateString() === christmas.toDateString()) {
      await msg.reply("🎄 _*¡Feliz navidad!*_");
      return;
    }

    if (today > christmas) {
      christmas.setFullYear(year + 1);
    }

    const diffTime = christmas - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    await msg.react("🎅");
    await msg.reply(`🎄 ¡Quedan *${diffDays} días* para Navidad!`);
  },
};