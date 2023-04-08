import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
// Initialize Firebase
const firebaseConfig = {
  // Your Firebase configuration goes here
  apiKey: "AIzaSyDzHjP-iUD5IQGDtPVtrR_cChsKSNc76SA",
  authDomain: "react-firebase-65a6c.firebaseapp.com",
  projectId: "react-firebase-65a6c",
  storageBucket: "react-firebase-65a6c.appspot.com",
  messagingSenderId: "805389922873",
  appId: "1:805389922873:web:ce01297a929d59851a13e8",
  measurementId: "G-FYZ8W8MGS2",
};

const app = initializeApp(firebaseConfig);

// Get a reference to Firebase Storage and Firestore
const storage = getStorage(app);
const firestore = getFirestore(app);

const fileInput = document.getElementById("file-input");

// Get a reference to the image file and upload it to Firebase Storage
const file = fileInput.files[0];
const storageRef = ref(storage, "path/to/image.jpg");
const uploadTask = uploadBytesResumable(storageRef, file);

// Handle upload progress or errors
uploadTask.on(
  "state_changed",
  (snapshot) => {
    // Handle upload progress
    console.log(snapshot);
  },
  (error) => {
    // Handle error
  },
  async () => {
    // Handle successful upload
    // Get the URL of the uploaded image
    const url = await getDownloadURL(uploadTask.snapshot.ref);

    // Push a document to Firestore with the URL of the image
    try {
      const docRef = await addDoc(collection(firestore, "images"), {
        imgUrl: url,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }
);
