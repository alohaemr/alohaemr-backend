const functions = require("firebase-functions");
const {firestore, COLLECTIONS, auth} = require("../database");
const {FieldValue} = require("firebase-admin/firestore");
const pick = require("lodash/pick");
const isEmpty = require("lodash/isEmpty");

const updateRootAdminAuth = async (id, administrator) => {
  const pickedValues = pick(administrator, ["email", "password"]);
  if (isEmpty(pickedValues)) {
    return null;
  }
  return await auth.updateUser(id, administrator);
};

const updateClientBatchItem = (id, client) => {
  const clientPickedValues = pick(client, [
    "name",
    "email",
    "taxIdNumber",
    "groupNpiNumber",
  ]);
  const clientRef = firestore.collection(COLLECTIONS.CLIENTS).doc(id);
  const data = {
    ...clientPickedValues,
    updatedAt: FieldValue.serverTimestamp(),
  };
  return {ref: clientRef, data};
};


const updateUserBatchItem = (id, administrator) => {
  const userPickedValues = pick(administrator, [
    "firstName",
    "lastName",
    "email",
    "cellPhone",
  ]);

  const userRef = firestore.collection(COLLECTIONS.USERS).doc(id);
  const data = {
    ...userPickedValues,
    updatedAt: FieldValue.serverTimestamp(),
  };
  return {ref: userRef, data};
};

const editClient = functions.https.onCall(async (data) => {
  try {
    const {administratorId, clientId, administrator, client} = data || {};
    await updateRootAdminAuth(administratorId, administrator);
    const writeBatch = firestore.batch();

    if (client) {
      const clientItem = updateClientBatchItem(clientId, client);
      writeBatch.set(clientItem.ref, clientItem.data, {merge: true});
    }

    if (administrator) {
      const userItem = updateUserBatchItem(administratorId, administrator);
      writeBatch.set(userItem.ref, userItem.data, {merge: true});
    }

    await writeBatch.commit();
    return {success: true};
  } catch (e) {
    return e;
  }
});

module.exports = editClient;
