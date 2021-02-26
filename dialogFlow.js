const dialogflow = require("@google-cloud/dialogflow");
const util = require("util");
const sessionClient = new dialogflow.SessionsClient();
const projectId = "hack-titans";
const fs = require("fs");

async function detectIntent(sessionId, query, languageCode, isAudio) {
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  let request;
  if (isAudio) {
    const inputAudio = fs.readFileSync(query).toString("base64");
    request = {
      session: sessionPath,
      queryInput: {
        audioConfig: {
          // enableAutomaticPunctuation: false,
          // encoding: "LINEAR16",

          // sampleRateHertz: 41000,
          languageCode: "en-US",
          model: "default",
        },
      },
      inputAudio: inputAudio,
    };
  } else {
    request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: languageCode,
        },
      },
      outputAudioConfig: {
        audioEncoding: `OUTPUT_AUDIO_ENCODING_MP3`,
        sampleRateHertz: 44100,
        synthesizeSpeechConfig: {
          speakingRate: 0.8,
          voice: {
            ssmlGender: "SSML_VOICE_GENDER_FEMALE",
          },
        },
      },
    };
  }

  const responses = await sessionClient.detectIntent(request);
  return responses[0];
}

async function executeQueries(
  query,
  sessionId,
  prevResponse,
  isAudio,
  languageCode = "en-US"
) {
  return new Promise(async (resolve, reject) => {
    let intentResponse;
    if (isAudio) {
      try {
        intentResponse = await detectIntent(
          sessionId,
          query,
          languageCode,
          isAudio
        );
        // fs.writeFileSync("something.m4a", intentResponse.outputAudio);
        // const str = fs.readFileSync("something.m4a").toString("base64");

        resolve(intentResponse);
      } catch (error) {
      
        reject(error);
      }
    }

    try {
      if (
        prevResponse &&
        prevResponse.includes("How much do you want to pay")
      ) {
        query += " rupees";
      }
     

      intentResponse = await detectIntent(
        sessionId,
        query,
        languageCode,
        isAudio
      );
      
      resolve(intentResponse);
    } catch (error) {
    
      reject(error);
    }
  });
}
module.exports.executeQueries = executeQueries;
