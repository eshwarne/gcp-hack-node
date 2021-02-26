const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const fs = require("fs");
const encodedPath = "pleaseWork.wav";
ffmpeg()
  .input("./testFinal.m4a")
  .outputOptions([
    "-f s16le",
    "-acodec pcm_s16le",
    "-vn",
    "-ac 1",
    "-ar 41k",
    "-map_metadata -1",
  ])
  .audioChannels(1)
  .output("testoutput.mp3")
  .save(encodedPath)
  .on("end", () => {
    const savedFile = fs.readFileSync(encodedPath);
    if (!savedFile) {
      reject("file can not be read");
    }
    // we have to convert it to base64 in order to send to Google
    const audioBytes = savedFile.toString("base64");
    fs.writeFileSync("FINALBASE.txt", audioBytes);
  });
