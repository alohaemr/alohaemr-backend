require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

async function getAllMessages(number) {
  let response;
  await client.messages
      .list()
      .then(
          (messages) =>
            (response = messages.filter(
                (arr) => arr.from == number || arr.to == number,
            )),
      );
  return response;
}

async function sendMessageByNumber(number, text) {
  try {
    client.messages
        .create({
          body: text,
          from: "+18145594905",
          to: number,
        })
        .then((message) => console.log(message));

    return "success";
  } catch (err) {
    console.error("error", err);
    return err;
  }
}

module.exports = {
  getAllMessages,
  sendMessageByNumber,
};
