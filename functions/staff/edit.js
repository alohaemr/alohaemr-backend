const pick = require("lodash/pick");
const functions = require("firebase-functions");
const {firestore, COLLECTIONS} = require("../database");

const editStaff = functions.https.onCall(async (data) => {
  try {
    const {id} = data || {};
    const userBody = pick(data, ["firstName", "lastName", "role"]);
    const userRef = firestore.collection(COLLECTIONS.USERS).doc(id);
    await userRef.set(userBody, {merge: true});
    return {id, ...userBody};
  } catch (e) {
    return e;
  }
});

module.exports = editStaff;
