const functions = require("firebase-functions");
const {firestore, COLLECTIONS, auth} = require("../database");
const {FieldValue} = require("firebase-admin/firestore");

const getISODate = () => {
  return new Date().toISOString();
};

const createStaff = functions.https.onCall(async (data) => {
  try {
    const {
      clientId,
      firstName,
      lastName,
      password,
      email,
      role,
    } = data || {};
    const authUser = await auth.createUser({
      email,
      password,
      emailVerified: true,
    });

    const {uid} = authUser || {};

    const userRef = firestore.collection(COLLECTIONS.USERS).doc(uid);
    const userBody = {
      clientId,
      email,
      firstName,
      lastName,
      role,
      disabled: false,
      deletedAt: null,
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
    };
    await userRef.set(userBody);
    return {
      id: uid, ...userBody,
      createdAt: getISODate(),
      updatedAt: getISODate(),
    };
  } catch (e) {
    return e;
  }
});

module.exports = createStaff;
