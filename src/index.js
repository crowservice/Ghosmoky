import { makeWASocket, useMultiFileAuthState, Browsers } from "baileys";
import { config } from "./config/config.js";
import { readdir } from "fs/promises";
import { pino } from "pino";

process.loadEnvFile();

export async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState("auth/main");

  const sock = makeWASocket({
    cachedGroupMetadata: (jid) => config.cache.groups.get(jid),
    browser: Browsers.appropriate("chrome"),
    logger: pino({ level: "silent" }),
    version: [2, 3000, 1033916097],
    auth: state,
  });

  if (!sock.authState.creds.registered) {
    const phone = process.env.PHONE_NUMBER?.replace(/\D+/g, "");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    await sock.requestPairingCode(phone, "GHOSMOKY");

    console.log(`Tu codigo de conexión es: GHOSMOKY`);
  }

  const folder = await readdir("./src/core");

  for (const file of folder) {
    const { default: handler } = await import(`./core/${file}`);
    if (typeof handler === "function") handler(config, sock);
  }

  sock.ev.on("creds.update", saveCreds);
}

connect();

process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

/* Code by: Los Webones */
