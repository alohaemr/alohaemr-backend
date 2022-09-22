const pick = require("lodash/pick");
const functions = require("firebase-functions");
const {firestore, COLLECTIONS} = require("../database");
const {FieldValue} = require("firebase-admin/firestore");

const getISODate = () => {
  return new Date().toISOString();
};

const editUser = functions.https.onCall(async (data) => {
  try {
    const {id} = data || {};
    const userBody = pick(data, [
      "displayName",
      "firstName",
      "lastName",
      "spiNumber",
      "cellPhone",
      "licenceNumber",
      "state",
      "clinicId",
      "cdsNumber",
      "deaNumber",
      "credentials",
      "role",
    ]);
    const userRef = firestore.collection(COLLECTIONS.USERS).doc(id);
    await userRef.set({
      ...userBody,
      updatedAt: FieldValue.serverTimestamp(),
    }, {merge: true});
    return {id, ...userBody, updatedAt: getISODate()};
  } catch (e) {
    return e;
  }
});

module.exports = editUser;
