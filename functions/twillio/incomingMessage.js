const functions = require("firebase-functions");
const {firestore, COLLECTIONS} = require("../database");
const {FieldValue} = require("firebase-admin/firestore");

const {MessagingResponse} = require("twilio").twiml;

const receiveIncomingMessage = functions.https.onRequest(async (req, res) => {
  const currentTime = new Date();
  const twiml = new MessagingResponse();
  const messageRef = firestore.collection(COLLECTIONS.MESSAGES).doc("updated");

  await messageRef.set({
    updatedAt: FieldValue.serverTimestamp(),
  });

  currentTime.getHours() < 18 ? twiml.message(
      `Hey, Thank you for contacting Alohaemr.One of our 
      agent will respond to your query soon :)`,
  ): twiml.message(
      `Hey, Thank you for contacting Alohaemr.We are currently closed now :(.
      One of our representative will get back to you soon :) 
      Our Timings are MON-FRI (8-6)`,
  );

  return res.type("text/xml").send(twiml.toString());
});

module.exports = receiveIncomingMessage;

