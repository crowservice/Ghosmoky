export default {
  name: "fake",
  category: "Diversión",
  description: "Crea un mensaje citado falso para trollear a tus amigos.",

  async run(sock, msg) {
    // 1. Extraemos el texto de forma segura (Ghosmoky suele inyectar msg.text)
    const text = msg.text || msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
    const from = msg.key.remoteJid;
    
    // Extraemos el argumento (todo lo que va después de la palabra !fake)
    const args = text.trim().split(/ +/).slice(1);
    const fullText = args.join(' ');

    // 2. Verificamos que usen el separador "|"
    if (!fullText.includes('|')) {
      // Usamos msg.reply() ya que vimos que Ghosmoky lo soporta
      return await msg.reply("> ⚠️ *Uso incorrecto*\n> Escribe: *!fake @usuario texto falso | tu respuesta*\n> \n> _Ejemplo:_\n> !fake @amigo Soy feo | Ya lo sabía");
    }

    // 3. Extraemos a quién etiquetó
    let targetJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    
    // Si no etiquetó a nadie, revisamos si respondió al mensaje de alguien
    if (!targetJid) {
      targetJid = msg.message?.extendedTextMessage?.contextInfo?.participant;
    }

    // Si definitivamente no hay víctima, avisamos
    if (!targetJid) {
      return await msg.reply("> ❌ *Falta la víctima.* Debes etiquetar a alguien o responder a su mensaje.");
    }

    // 4. Separamos el texto falso de tu respuesta real
    const partes = fullText.split('|');
    
    let textoFalso = partes[0].replace(/@\d+/g, '').trim();
    let tuRespuesta = partes[1].trim();

    if (!textoFalso || !tuRespuesta) {
      return await msg.reply("> ❌ *Error:* Debes escribir tanto el texto falso como tu respuesta.");
    }

    // 🔥 LA MAGIA: CREAMOS EL MENSAJE FANTASMA 🔥
    const mensajeFantasma = {
      key: {
        fromMe: false,
        participant: targetJid, // Le decimos a WhatsApp que lo envió tu amigo
        id: "BOTA" + Math.random().toString(36).substring(2, 10).toUpperCase() // Inventamos un ID falso
      },
      message: {
        conversation: textoFalso // El texto que nunca dijo
      }
    };

    // 5. Enviamos tu respuesta real, inyectando el fantasma
    await sock.sendMessage(from, {
      text: tuRespuesta,
      mentions: [targetJid] // Lo mencionamos para la trolleada
    }, {
      quoted: mensajeFantasma
    });
  }
};