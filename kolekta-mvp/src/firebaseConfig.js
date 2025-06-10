// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAnalytics } from "firebase/analytics";

// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-hjdlDAQ0W6sEIUd4WL5AQutHzWcTDWQ",
  authDomain: "kolekta-web.firebaseapp.com",
  projectId: "kolekta-web",
  storageBucket: "kolekta-web.firebasestorage.app",
  messagingSenderId: "471090280537",
  appId: "1:471090280537:web:6bf307ecb33e8332f05948",
  measurementId: "G-FDT8XWHF4P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore and get the instance

const analytics = getAnalytics(app);
export { auth, db }; // Export auth and db to be used in other parts of your app