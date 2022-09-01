const functions = require("firebase-functions");
const {firestore, COLLECTIONS} = require("../database");
const {FieldValue} = require("firebase-admin/firestore");

const createUser = functions.auth.user().onCreate(async (user) => {
  const {uid, email, displayName} = user || {};
  try {
    await firestore
        .collection(COLLECTIONS.USERS)
        .doc(uid)
        .set({
          email,
          displayName,
          createdAt: FieldValue.serverTimestamp(),
        });
  } catch (e) {
  }
});

module.exports = createUser;
