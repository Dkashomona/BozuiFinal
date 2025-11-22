// src/services/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDq-BCWhiqqMyTM5pSM_aZlTImy4rMBWnE",
  authDomain: "bozuishopworld.appspot.com",
  projectId: "bozuishopworld",
  storageBucket: "bozuishopworld.firebasestorage.app",
  messagingSenderId: "536586034208",
  appId: "1:536586034208:web:11cc759ecf5ec4a7063045"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
