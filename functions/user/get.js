const functions = require("firebase-functions");
const {firestore} = require("../database");

const getUser = functions.https.onRequest(async (request, response) => {
  const querySnapshot = await firestore
      .collection("userAccess")
      .doc("sRMR1uff2fNneWvNFWH0k5nPttL2")
      .get();
  response.send({
    id: querySnapshot.id,
    ...querySnapshot.data(),
  });
});

module.exports=getUser;
