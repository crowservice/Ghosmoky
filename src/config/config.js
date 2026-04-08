import { BotCache } from "../utils/_exports.js";

process.loadEnvFile();

const DEVS = process.env.DEVS?.split("|").map((number) => `${number}@s.whatsapp.net`) || [];

export const config = {
  devs: new Set(DEVS),

  cache: {
    commands: new BotCache(),
    groups: new BotCache({ stdTTL: 300 }),
  },

  messages: {
    error: "Ocurrió un error al procesar tu comando. Por favor, inténtalo de nuevo.",
  },
};
