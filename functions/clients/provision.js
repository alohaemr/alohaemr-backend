const functions = require("firebase-functions");
const {firestore, COLLECTIONS, auth, ROLE_KEYS} = require("../database");
const {FieldValue} = require("firebase-admin/firestore");
const pick = require("lodash/pick");

const createRootAdminAuth = (administrator) => {
  const {email, password} = administrator || {};
  return auth.createUser({
    email,
    password,
    emailVerified: true,
  });
};

const createClientBatchItem = (client, uid) => {
  const clientPickedValues = pick(client, [
    "name",
    "email",
    "taxIdNumber",
    "groupNpiNumber",
  ]);
  const clientRef = firestore.collection(COLLECTIONS.CLIENTS).doc();
  const data = {
    ...clientPickedValues,
    rootAdminId: uid,
    clinicCount: 1,
    deletedAt: null,
    updatedAt: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp(),
  };
  return {ref: clientRef, data};
};


const createUserBatchItem = (administrator, clientId, uid) => {
  const userPickedValues = pick(administrator, [
    "firstName",
    "lastName",
    "email",
    "cellPhone",
  ]);

  const userRef = firestore.collection(COLLECTIONS.USERS).doc(uid);
  const data = {
    ...userPickedValues,
    role: ROLE_KEYS.ROOT_ADMIN,
    clientId,
    disabled: false,
    deletedAt: null,
    updatedAt: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp(),
  };
  return {ref: userRef, data};
};

const createClinicBatchItem = (clinic, clientId) => {
  const clinicPickedValues = pick(clinic, [
    "name",
    "shortName",
    "email",
    "textNumber",
    "address1",
    "address2",
    "city",
    "state",
    "zip",
    "cliaNumber",
    "npiNumber",
    "taxIdNumber",
    "taxonomyCode",
  ]);

  const clinicRef = firestore
      .collection(COLLECTIONS.CLIENTS)
      .doc(clientId)
      .collection(COLLECTIONS.CLINICS)
      .doc();

  const data = {
    ...clinicPickedValues,
    deletedAt: null,
    updatedAt: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp(),
  };
  return {ref: clinicRef, data};
};

const provisionClient = functions.https.onCall(async (data) => {
  try {
    const {
      administrator,
      client,
      clinic,
    } = data || {};

    const rootAdmin = await createRootAdminAuth(administrator);
    const {uid} = rootAdmin || {};

    const writeBatch = firestore.batch();

    const clientItem = createClientBatchItem(client, uid);
    writeBatch.create(clientItem.ref, clientItem.data);

    const userItem = createUserBatchItem(administrator, clientItem.ref.id, uid);
    writeBatch.set(userItem.ref, userItem.data, {merge: true});

    const clinicItem = createClinicBatchItem(clinic, clientItem.ref.id);
    writeBatch.create(clinicItem.ref, clinicItem.data);
    await writeBatch.commit();
    return {success: true};
  } catch (e) {
    return e;
  }
});

module.exports = provisionClient;
