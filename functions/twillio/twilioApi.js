const axios = require('axios')
require('dotenv').config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
// console.log(accountSid, authToken);
const client = require('twilio')(accountSid, authToken);

async function getAllMessages(number) {
  let response;
  await client.messages
    .list({
      from:number,
      to:'+18145594905'
    })
    .then(messages => response = messages.filter(arr => arr.from == number || arr.to == number));
//   console.log(response);
  return response
}

async function sendMessageByNumber(number, text) {
  try{

    client.messages
    .create({
      body: text,
      from: '+18145594905',
      to: number
    })
    .then(message => console.log(message));
    
    return "success"
  }
  catch(err) {
    return err
  }
    

}

// getAllMessages()



module.exports = {
  getAllMessages,
  sendMessageByNumber
}