export class MessageWrapper {
  #msg;
  #jid;
  #sendMessage;

  constructor(sendMessage, data) {
    if (typeof sendMessage !== "function") {
      throw new TypeError("sendMessage debe ser una función");
    }

    this.#sendMessage = sendMessage;
    this.#msg = data;
    this.#jid = data?.key?.remoteJid;

    this.category = this.#msg?.category;
    this.messageTimestamp = this.#msg?.messageTimestamp;
    this.pushName = this.#msg?.pushName;
    this.broadcast = this.#msg?.broadcast || false;
  }

  get key() {
    return this.#msg.key;
  }

  get message() {
    return this.#msg.message;
  }

  async reply(payload) {
    if (!this.#jid) throw new Error("jid no definido");

    const body = typeof payload === "string" ? { text: payload } : payload;

    return this.#sendMessage(this.#jid, body, { quoted: this.#msg });
  }

  async react(reaction = "") {
    return this.#sendMessage(this.#jid, {
      react: { text: reaction, key: this.#msg.key },
    });
  }
}
