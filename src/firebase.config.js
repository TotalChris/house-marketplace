// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChyvsOkGEdUw7qaCYbZPR-Fjmn3PXUp2o",
  authDomain: "house-marketplace-app-7c2fc.firebaseapp.com",
  projectId: "house-marketplace-app-7c2fc",
  storageBucket: "house-marketplace-app-7c2fc.appspot.com",
  messagingSenderId: "68643877198",
  appId: "1:68643877198:web:5b58395f187f6fe2eb2e1f",
  measurementId: "G-ENPR6W61YK"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
