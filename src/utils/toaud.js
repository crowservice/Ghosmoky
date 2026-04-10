import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";
import { v4 as uuidv4 } from "uuid";

export function convertVideoToAudio(buffer) {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const inputPath = path.join(tmpdir(), `${id}.mp4`);
    const outputPath = path.join(tmpdir(), `${id}.mp3`);

    fs.writeFileSync(inputPath, buffer);

    const command = `ffmpeg -i "${inputPath}" -vn -acodec libmp3lame -q:a 4 "${outputPath}" -y`;

    exec(command, (err) => {
      if (err) {
        fs.unlinkSync(inputPath);
        return reject(err);
      }

      const audioBuffer = fs.readFileSync(outputPath);
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);

      resolve(audioBuffer);
    });
  });
}
