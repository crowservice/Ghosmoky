import { readdir } from "fs/promises";

export default async function (config, sock) {
  const folder = await readdir("./src/events");

  for (const file of folder) {
    const { default: event } = await import(`../events/${file}`);

    const method = event.once ? "once" : "on";

    sock.ev[method](event.name, (...args) => {
      event.load(...args, config, sock);
    });
  }

  console.log("Eventos cargados exitosamente.");
}
