const functions = require("firebase-functions");
const {firestore, COLLECTIONS} = require("../database");
const {FieldValue} = require("firebase-admin/firestore");

const {MessagingResponse} = require("twilio").twiml;

const receiveIncomingMessage = functions.https.onRequest(async (req, res) => {
  const twiml = new MessagingResponse();
  const messageRef = firestore.collection(COLLECTIONS.MESSAGES).doc("updated");
  await messageRef.set({
    updatedAt: FieldValue.serverTimestamp(),
  });
  twiml.message(
      `Hey, Thank you for contacting Alohaemr.One of our 
      agent will respond to your query soon :)`,
  );

  return res.type("text/xml").send(twiml.toString());
});

module.exports = receiveIncomingMessage;

