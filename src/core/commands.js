import { readdir } from "fs/promises";

export default async function (config) {
  if (config.cache.commands.size) return;

  const directory = await readdir("./src/commands");

  for (const folder of directory) {
    const files = await readdir(`./src/commands/${folder}`);

    for (const file of files) {
      const { default: command } = await import(`../commands/${folder}/${file}`);
      config.cache.commands.set(command.name, command);
    }
  }

  console.log(`Comandos listos para ejecutarse.`);
}
