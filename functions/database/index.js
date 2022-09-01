const {initializeApp, cert} = require("firebase-admin/app");
const serviceAccount = require("../credentials/service-account-key.json");
const {getFirestore} = require("firebase-admin/firestore");
const app = initializeApp({
  credential: cert(serviceAccount),
});

const firestore = getFirestore(app);
const COLLECTIONS = {
  CLINICS: "clinics",
  PATIENTS: "patients",
  CLIENTS: "clients",
  USERS: "userAccess",
  ENCOUNTER: "encounters",
};
module.exports = {firestore, COLLECTIONS};
