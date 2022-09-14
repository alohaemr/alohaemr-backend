const functions = require("firebase-functions");
const {firestore, COLLECTIONS} = require("../database");
const {FieldValue} = require("firebase-admin/firestore");

const createUser = functions.auth.user().onCreate(async (user) => {
  const {uid, email} = user || {};
  try {
    await firestore
        .collection(COLLECTIONS.USERS)
        .doc(uid)
        .set({
          email,
          deletedAt: null,
          createdAt: FieldValue.serverTimestamp(),
        });
  } catch (e) {
  }
});

module.exports = createUser;
