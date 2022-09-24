const {initializeApp, cert} = require("firebase-admin/app");
const serviceAccount = require("../credentials/service-account-key.json");
const {getFirestore} = require("firebase-admin/firestore");
const {getAuth} = require("firebase-admin/auth");

const app = initializeApp({
  credential: cert(serviceAccount),
});

const firestore = getFirestore(app);
const auth = getAuth(app);

const COLLECTIONS = {
  CLINICS: "clinics",
  PATIENTS: "patients",
  CLIENTS: "clients",
  USERS: "userAccess",
  ENCOUNTER: "encounters",
};

const ROLE_KEYS = {
  SUPER_ADMIN: "SuperAdmin",
  ROOT_ADMIN: "RootAdmin",
  ADMIN: "Admin",
  MANAGER: "Manager",
  PROVIDER: "Provider",
  STAFF: "Staff",
  RECEPTIONIST: "Receptionist",
};


module.exports = {firestore, auth, COLLECTIONS, ROLE_KEYS};
