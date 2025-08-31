const firebaseConfig = {
  apiKey: "AIzaSyBs47VrPynDv9ULMJVl12-3YQHisLpOFIo",
  authDomain: "watchlist-canvas.firebaseapp.com",
  projectId: "watchlist-canvas",
  storageBucket: "watchlist-canvas.firebasestorage.app",
  messagingSenderId: "725234883961",
  appId: "1:725234883961:web:ed3a3b322c045e214663a8",
  measurementId: "G-B9GV1JLGZ0"
};

// Initialize compat (FirebaseUI expects the global `firebase`)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const uiConfig = {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    },
    signInFlow: 'popup',
    signInSuccessUrl: "/", // Redirect URL after login
    signInOptions: [{
    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    requireDisplayName: true,},
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    ],
}


const ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start("#firebaseui-auth-container", uiConfig);
