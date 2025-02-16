// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Import Firebase Storage SDK

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjjb_1AaIrM8PcTKBQrPfk0OQ4VA7BoMQ",
  authDomain: "hireai-ccd32.firebaseapp.com",
  projectId: "hireai-ccd32",
  storageBucket: "hireai-ccd32.firebasestorage.app",
  messagingSenderId: "67955948338",
  appId: "1:67955948338:web:e09d5b5d91fc89ef34f52b",
  measurementId: "G-D2FN6VRV5P"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firebase Storage
export const storage = getStorage(app); // Export storage instance

// Log Firebase initialization confirmation
console.log("Firebase initialized successfully!");

