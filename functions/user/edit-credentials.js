const functions = require("firebase-functions");
const {firestore, COLLECTIONS, auth} = require("../database");
const {FieldValue} = require("firebase-admin/firestore");
const pick = require("lodash/pick");

const getISODate = () => {
  return new Date().toISOString();
};

const editCredentials = functions.https.onCall(async (data) => {
  try {
    const {id} = data || {};
    const authAllowed = pick(data, ["email", "password", "disabled"]);
    await auth.updateUser(id, authAllowed);
    const userRef = firestore.collection(COLLECTIONS.USERS).doc(id);
    const docAllowedValues = pick(data, ["email", "disabled"]);
    const userBody = {
      ...docAllowedValues,
      updatedAt: FieldValue.serverTimestamp(),
    };
    await userRef.set(userBody, {merge: true});
    return {id, ...docAllowedValues, updatedAt: getISODate()};
  } catch (e) {
    return e;
  }
});

module.exports = editCredentials;
