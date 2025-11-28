// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDjJEQjzd2ne2Qh7gDRWMH0Da2RPpsyFs",
  authDomain: "serveless-epitech-dev.firebaseapp.com",
  projectId: "serveless-epitech-dev",
  storageBucket: "serveless-epitech-dev.firebasestorage.app",
  messagingSenderId: "390328565727",
  appId: "1:390328565727:web:7fa0e176bcffcbf11f8e6a",
  measurementId: "G-2WZX9MXZ25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, process.env.NEXT_PUBLIC_FIRESTORE_DATABASE_ID || '');
