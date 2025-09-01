const firebaseConfig = {
  apiKey: "AIzaSyBs47VrPynDv9ULMJVl12-3YQHisLpOFIo",
  authDomain: "watchlist-canvas.firebaseapp.com",
  projectId: "watchlist-canvas",
  storageBucket: "watchlist-canvas.firebasestorage.app",
  messagingSenderId: "725234883961",
  appId: "1:725234883961:web:ed3a3b322c045e214663a8",
  measurementId: "G-B9GV1JLGZ0"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}