export default {
    name: "menu",
    alias: ["comandos"],
    category: "general",
    description: "Lista de comandos disponibles",

    async run(sock, msg, config) {
        const commands = config.cache.commands;
        const jid = msg.key.remoteJid;

        let menu = `Hola ${msg.pushName}!\nTengo ${commands.keys().length} comandos disponibles:\n\n`;

        menu += commandsData("GENERAL", "general");
        menu += commandsData("DESCARGADORES", "downloaders");

        await sock.sendMessage(jid, { text: menu.trim() }, { quoted: msg.raw });

        function commandsData(label, category) {
            const filtered = [...commands.keys()]
                .map(k => commands.get(k))
                .filter(c => c.category === category)
                .map(c => `/${c.name}${c.usage ? " " + c.usage : ""}`);

            return `*${label}*\n${filtered.join("\n")}\n\n`;
        }
    }
};