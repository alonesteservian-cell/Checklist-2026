import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  collection,
  getFirestore,
  addDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCBjs1v-g31ihhakHaqCfEoRNFW-XbQj_g",
  authDomain: "checklistda.firebaseapp.com",
  databaseURL: "https://checklistda-default-rtdb.firebaseio.com",
  projectId: "checklistda",
  storageBucket: "checklistda.firebasestorage.app",
  messagingSenderId: "574620190432",
  appId: "1:574620190432:web:208eb684414dbac83ef285",
  measurementId: "G-E2TQ0Y9EL8"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const auth = getAuth(app);

// ── Auth ──────────────────────────────────────────────────
export const registerUser = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const loginUser    = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const logoutUser   = () => signOut(auth);
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

// ── Firestore ─────────────────────────────────────────────
export const saveSeries   = (Titulo, Sinopsis, Comentario) =>
  addDoc(collection(db, "Series"), { Titulo, Sinopsis, Comentario });

export const getAllSeries  = () => getDocs(collection(db, "Series"));

export const onGetSeries  = (callback) => onSnapshot(collection(db, "Series"), callback);

export const deleteSeries = (id) => deleteDoc(doc(db, "Series", id));

export const getSeries    = (id) => getDoc(doc(db, "Series", id));

export const updateSeries = (id, newFields) => updateDoc(doc(db, "Series", id), newFields);
