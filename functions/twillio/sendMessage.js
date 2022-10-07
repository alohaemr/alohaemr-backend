
const twilioApi =require("./twilioApi.js");
const functions = require("firebase-functions");

const sendMessage= functions.https.onCall( async (data) => {
  try {
    const mess= await twilioApi.sendMessageByNumber(data.number, data.message);
    return JSON.stringify(mess);
  } catch (e) {
    console.error("error ", e);
    return e;
  }
});

module.exports = sendMessage;
