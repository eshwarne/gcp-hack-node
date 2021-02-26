const fs = require("fs");

const speechToText = async () => {
  // Imports the Google Cloud client library
  const speech = require("@google-cloud/speech").v1p1beta1;

  // Creates a client
  const client = new speech.SpeechClient();
  const fileName = "./sample_voices/ta-IN-Standard-B.wav";

  const config = {
    languageCode: "ta-IN",
  };

  const audio = {
    content: fs.readFileSync(fileName).toString("base64"),
  };

  const request = {
    config: config,
    audio: audio,
  };

  const [response] = await client.recognize(request);
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");
  console.log(`Transcription: ${transcription}`);
};

speechToText();
