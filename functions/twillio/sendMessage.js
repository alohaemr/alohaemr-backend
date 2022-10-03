
const twilioApi =require('./twilioApi.js')
const functions = require("firebase-functions");


const sendMessage= functions.https.onCall( async (data) => {
    try{
        // console.log("number ",data.number);
        const messages= await twilioApi.sendMessageByNumber(data.number,data.message);
        // console.log("messages",messages)

        return JSON.stringify(messages);
    }
    catch (e) {
        console.log("error ",e)
        return e;
    }
})

module.exports = sendMessage;
