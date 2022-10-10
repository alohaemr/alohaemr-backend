
const twilioApi =require("./twilioApi.js");
const functions = require("firebase-functions");


const getMessages= functions.https.onCall( async (number) => {
  try {
    const messages= await twilioApi.getAllMessages(number);
    return JSON.stringify(messages);
  } catch (e) {
    console.error("error ", e);
    return e;
  }
});

module.exports = getMessages;
