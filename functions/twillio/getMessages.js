
const twilioApi =require('./twilioApi.js')
const functions = require("firebase-functions");


const getMessages= functions.https.onCall( async (number) => {
    try{
        console.log("number ",number);
        const messages= await twilioApi.getAllMessages(number);
        // console.log("messages",messages)

        return JSON.stringify(messages);
    }
    catch (e) {
        console.log("error ",e)
        return e;
    }
})

module.exports = getMessages;
