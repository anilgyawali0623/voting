import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "qfx-cinema.firebaseapp.com",
  projectId: "qfx-cinema",
  storageBucket: "qfx-cinema.firebasestorage.app",
  messagingSenderId: "702993012625",
  appId: "1:702993012625:web:b1dfa72f5d4d3edd236c30",
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);