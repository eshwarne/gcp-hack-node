const fs = require("fs");
const speech = require("@google-cloud/speech");

// Creates a client
const client = new speech.SpeechClient();

const speechText = async (content) => {
  return new Promise(async (resolve, reject) => {
    const config = {
      languageCode: "en-IN",
      sampleRateHertz: 16000,
    };
    const audio = {
      content: content,
    };

    const request = {
      config: config,
      audio: audio,
    };

    const [response] = await client.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");
    console.log(transcription);
  });
};
const filename = "./test1.m4a";
const inputAudio = fs.readFileSync(filename).toString("base64");
speechText(inputAudio);
