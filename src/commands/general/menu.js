import { generateWAMessageFromContent } from "baileys";

export default {
    name: "menu",
    aliases: ["comandos"],
    category: "general",
    description: "Lista de comandos disponibles",

    async run(sock, msg) {
        let menu = `*Tengo ${sock.commands.size} comandos disponibles:\n`;
        
        menu += `\n*GENERAL*\n` +
            commandsData(sock.commands.filter(c => c.category === "general"), prefix);

        const adMessage = await generateWAMessageFromContent(
            msg.from,
            {
                extendedTextMessage: {
                    text: menu,
                    contextInfo: {
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "120363406931048017@newsletter",
                            newsletterName: "Ghosmoky",
                            serverMessageId: -1
                        },
                        mentionedJid: [msg.sender],
                        externalAdReply: {
                            title: "Ghosmoky",
                            body: "E belda",
                            sourceUrl: "https://whatsapp.com/channel/0029Vb8DSE84inoqS5gygU0v",
                            thumbnailUrl: "https://files.catbox.moe/d3dadc.jpg",
                            mediaType: 1,
                            renderLargerThumbnail: true,
                            buttonText: "Unirme al canal",
                            showAdAttribution: true
                        }
                    }
                }
            },
            { quoted: msg }
        );

        await sock.relayMessage(msg.from, adMessage.message, {});
    }
};

function commandsData(commands, prefix) {
    return commands
        .map(i => `/${i.name} b${i.usage ?? ""}`.trim())
        .join("\n");
}