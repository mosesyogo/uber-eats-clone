// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5cZ_mbY5C5DMy_Tw8h6TRJz48jiKt57A",
  authDomain: "uber-eats-clone-2d1da.firebaseapp.com",
  projectId: "uber-eats-clone-2d1da",
  storageBucket: "uber-eats-clone-2d1da.firebasestorage.app",
  messagingSenderId: "190359929814",
  appId: "1:190359929814:web:50574ff79b7879c51e5a77",
  measurementId: "G-YNWVP4BQ3E"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const db = getFirestore(app)