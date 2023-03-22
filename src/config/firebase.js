// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
/*
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGEING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
};
*/

const firebaseConfig = {
    apiKey: "AIzaSyDzHjP-iUD5IQGDtPVtrR_cChsKSNc76SA",
    authDomain: "react-firebase-65a6c.firebaseapp.com",
    projectId: "react-firebase-65a6c",
    storageBucket: "react-firebase-65a6c.appspot.com",
    messagingSenderId: "805389922873",
    appId: "1:805389922873:web:ce01297a929d59851a13e8",
    measurementId: "G-FYZ8W8MGS2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const DB = getFirestore(app);
export const storage = getStorage(app);
