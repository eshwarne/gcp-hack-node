const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dialogFlow = require("./dialogFlow");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const os = require("os");
ffmpeg.setFfmpegPath(ffmpegPath);
const axios = require("axios");
const javaServer = "https://hecktitan-java-dot-hack-titans.el.r.appspot.com";
const getTransactions = async (userId) => {
  return new Promise(async (resolve, reject) => {
    const response = await axios.get(javaServer + `/transactions?userId=${userId}&startDate=2015-01-01&endDate=2021-02-26`);
    resolve(response.data);
  });
};

const payViaBeneficiary = async (
  userId,
  beneficiaryId,
  amount,
  latitude,
  longitude,
  remark
) => {
  return new Promise(async (resolve, reject) => {
 
    const response = await axios.post(javaServer + "/pay/beneficiary", {
      userId,
  beneficiaryId,
  amount: 500,
  latitude: latitude || '20',
  longitude: longitude || '20',
  remark:'Payment to Grocery'
    });
    resolve(response.data);
  });
};
 const getBalance = async (userId) => {
  return new Promise(async (resolve, reject) => {
    console.log(userId)
    const response = await axios.get(
      javaServer + "/balance" + "?userId=" + userId
    );
    resolve(response.data);
  });
};
const fs = require("fs");
app.use(bodyParser.json());
const PORT = process.env.PORT || 4000;
//sendMessage POST
//userId,query, prevResponse
app.post("/sendMessage", async (req, res) => {
  const userId=req.body.userId
  const latitude = req.body.latitude
  const longitude =req.body.longitude
  if (!req.body.isAudio) {
    console.log("HI")
    try {
      const intentResponse = await dialogFlow.executeQueries(
        req.body.query,
        req.body.userId,
        req.body.prevResponse
      );
      if(intentResponse.queryResult.intent.displayName == "check-account-balance"){
        const response = await getBalance(userId)
        console.log(response)
        res.json({
          success: true,
          audio: Buffer.from(intentResponse.outputAudio).toString("base64"),
          text: "Your account balance is "+response,
          response:response
        });
      }
      else if(intentResponse.queryResult.intent.displayName == "check-statement"){
        console.log("CHECKIN")
        const response = await getTransactions(userId)
        console.log(response)
        res.json({
          success: true,
          audio: Buffer.from(intentResponse.outputAudio).toString("base64"),
          text: "Your last transaction was rupees "+response[0].AMOUNT+" and remark was "+response[0].remark

        });
      }
      else if(intentResponse.queryResult.intent.displayName == "make-payment" && intentResponse.queryResult.allRequiredParamsPresent){
        console.log("Paying...")
        const response = await payViaBeneficiary(userId,"THAKCHI",intentResponse.queryResult.parameters.fields.amount.structValue.fields.amount.numberValue,latitude,longitude,"hello")
        console.log(response)
        res.json({
          success: true,
          audio: Buffer.from(intentResponse.outputAudio).toString("base64"),
          text:intentResponse.queryResult.fulfillmentText,
          response:response
        });
      }
      else{
        res.json({
          success: true,
          audio: Buffer.from(intentResponse.outputAudio).toString("base64"),
          text:intentResponse.queryResult.fulfillmentText,
          
        });
      }
     
     
    
    } catch (error) {
      res.json(error);
    }
  } else {
    const encodedPath = path.join(
      os.tmpdir(),
      "encoded" + req.body.userId + ".wav"
    );
    const inputPath = path.join(os.tmpdir(), req.body.userId + ".m4a");
    fs.writeFileSync(inputPath, req.body.query, { encoding: "base64" });
    ffmpeg()
      .input(inputPath)
      .outputOptions([
        "-f s16le",
        "-acodec pcm_s16le",
        "-vn",
        "-ac 1",
        "-ar 41k",
        "-map_metadata -1",
      ])
      .audioChannels(1)
      .output(path.join(os.tmpdir(), req.body.userId + ".mp3"))
      .save(encodedPath)
      .on("end", async () => {
        try {
          const intentResponse = await dialogFlow.executeQueries(
            req.body.query,
            req.body.userId,
            req.body.prevResponse,
            true
          );
          if(intentResponse.queryResult.intent.displayName == "check-account-balance"){
            const response = await getBalance(userId)
            console.log(response)
            res.json({
              success: true,
              audio: Buffer.from(intentResponse.outputAudio).toString("base64"),
              text: "Your account balance is "+response,
              response:response
            });
          }
          else if(intentResponse.queryResult.intent.displayName == "check-statement"){
            const response = await getBalance(userId)
            console.log(response)
            res.json({
              success: true,
              audio: Buffer.from(intentResponse.outputAudio).toString("base64"),
              text: "Your account balance is "+response,
              response:response
            });
          }
          else if(intentResponse.queryResult.intent.displayName == "make-payment" && intentResponse.queryResult.allRequiredParamsPresent){
            console.log("Paying...")
            const response = await payViaBeneficiary(userId,"THAKCHI",intentResponse.queryResult.parameters.fields.amount.structValue.fields.amount.numberValue,latitude,longitude,"hello")
            console.log(response)
            res.json({
              success: true,
              audio: Buffer.from(intentResponse.outputAudio).toString("base64"),
              text:intentResponse.queryResult.fulfillmentText,
              response:response
            });
          }
          else{
            res.json({
              success: true,
              audio: Buffer.from(intentResponse.outputAudio).toString("base64"),
              text:intentResponse.queryResult.fulfillmentText,
              
            });
          }
         
         
        
        } catch (error) {
          res.json(error);
        }
      });
  }
});

app.listen(PORT, () => {
  console.log(`dialogFlow Service listening on Port ${PORT}`);
});
