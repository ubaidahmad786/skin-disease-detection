import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDugHND-zX8SfTHksGQp3VXkkR4_mx5yIA",
  authDomain: "dermvision-sdds.firebaseapp.com",
  projectId: "dermvision-sdds",
  storageBucket: "dermvision-sdds.firebasestorage.app",
  messagingSenderId: "127109763586",
  appId: "1:127109763586:web:65ac3eeafd257790138d1b",
  measurementId: "G-FK6GFDQ003"
};

export const firebase_app = initializeApp(firebaseConfig);
export const firebase_auth = getAuth(firebase_app);
export const firebase_db = getDatabase(firebase_app);
export const firebase_storage = getStorage(firebase_app);