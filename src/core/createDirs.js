import { mkdir } from "node:fs/promises";

const dirs = ["./.temp", "./.local"];

for (const dir of dirs) {
  try {
    const response = await mkdir(dir, { recursive: true });
    if (response) console.log("Carpeta creada:", dir);
  } catch (error) {
    console.log("[CREATE DIRS] Error:", error);
  }
}
