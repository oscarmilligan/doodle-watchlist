
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
import { getStorage, ref, uploadBytes,uploadBytesResumable, getMetadata } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-storage.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBs47VrPynDv9ULMJVl12-3YQHisLpOFIo",
  authDomain: "watchlist-canvas.firebaseapp.com",
  projectId: "watchlist-canvas",
  storageBucket: "watchlist-canvas.firebasestorage.app",
  messagingSenderId: "725234883961",
  appId: "1:725234883961:web:ed3a3b322c045e214663a8",
  measurementId: "G-B9GV1JLGZ0"


};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);


export {app, analytics, storage, ref, uploadBytes, getMetadata,uploadBytesResumable}