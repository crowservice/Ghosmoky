export default {
  name: "fake",
  aliases: ["falso", "citar"],
  category: "Diversión",
  description: "Crea un mensaje citado falso para trollear a tus amigos.",

  async run(sock, msg, args) {
    // 1. Extraemos la información del mensaje basada en la estructura de Ghosmoky
    const from = msg.key.remoteJid;
    const prefix = "!"; // Asumimos '!' por defecto
    
    // Si la base no inyecta 'args' directamente, los extraemos del texto del mensaje
    if (!args) {
      const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
      args = text.trim().split(/ +/).slice(1);
    }
    
    const fullText = args.join(' ');

    // 2. Verificamos que usen el separador "|"
    if (!fullText.includes('|')) {
      return sock.sendMessage(from, { 
        text: `> ⚠️ *Uso incorrecto*\n> Escribe: *${prefix}fake @usuario texto falso | tu respuesta*\n> \n> _Ejemplo:_\n> ${prefix}fake @amigo Soy feo | Ya lo sabía` 
      }, { quoted: msg });
    }

    // 3. Extraemos a quién etiquetó
    let targetJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    
    // Si no etiquetó a nadie, revisamos si respondió al mensaje de alguien
    if (!targetJid) {
      targetJid = msg.message?.extendedTextMessage?.contextInfo?.participant;
    }

    // Si definitivamente no hay víctima, avisamos
    if (!targetJid) {
      return sock.sendMessage(from, { 
        text: '> ❌ *Falta la víctima.* Debes etiquetar a alguien o responder a su mensaje.' 
      }, { quoted: msg });
    }

    // 4. Separamos el texto falso de tu respuesta real
    const partes = fullText.split('|');
    
    // Limpiamos el texto falso para quitar la etiqueta (@numero) y que se vea real
    let textoFalso = partes[0].replace(/@\d+/g, '').trim();
    let tuRespuesta = partes[1].trim();

    // Si dejó algún lado vacío
    if (!textoFalso || !tuRespuesta) {
      return sock.sendMessage(from, { text: '> ❌ *Error:* Debes escribir tanto el texto falso como tu respuesta.' }, { quoted: msg });
    }

    // 🔥 LA MAGIA: CREAMOS EL MENSAJE FANTASMA 🔥
    const mensajeFantasma = {
      key: {
        fromMe: false,
        participant: targetJid, // Le decimos a WhatsApp que lo envió tu amigo
        id: "BOTA" + Math.random().toString(36).substring(2, 10).toUpperCase() // Inventamos un ID de mensaje
      },
      message: {
        conversation: textoFalso // El texto que nunca dijo
      }
    };

    // 5. Enviamos tu respuesta real, citando al fantasma
    await sock.sendMessage(from, {
      text: tuRespuesta,
      mentions: [targetJid] // Lo mencionamos para que vea la trolleada
    }, {
      quoted: mensajeFantasma // Aquí inyectamos el mensaje falso
    });
  }
};