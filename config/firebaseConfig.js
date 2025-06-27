// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZVQ90QW28d85PHwseC3_qdfu9o8e193U",
  authDomain: "teamup-70c1d.firebaseapp.com",
  projectId: "teamup-70c1d",
  storageBucket: "teamup-70c1d.firebasestorage.app",
  messagingSenderId: "217627363376",
  appId: "1:217627363376:web:460f25bc26d752cef985f5",
  measurementId: "G-H9JPRGE9RX"
};


// // ✅ Proper Auth Init with AsyncStorage
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });



// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
