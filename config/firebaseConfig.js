// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "teamup-70c1d.firebaseapp.com",
  projectId: "teamup-70c1d",
  storageBucket: "teamup-70c1d.appspot.com",
  messagingSenderId: "217627363376",
  appId: "1:217627363376:web:460f25bc26d752cef985f5",
  measurementId: "G-H9JPRGE9RX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Set persistent auth for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };

