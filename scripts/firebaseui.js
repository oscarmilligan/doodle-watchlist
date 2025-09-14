
const firebaseConfig = {
  apiKey: "AIzaSyBs47VrPynDv9ULMJVl12-3YQHisLpOFIo",
  authDomain: "watchlist-canvas.firebaseapp.com",
  projectId: "watchlist-canvas",
  storageBucket: "watchlist-canvas.firebasestorage.app",
  messagingSenderId: "725234883961",
  appId: "1:725234883961:web:ed3a3b322c045e214663a8",
  measurementId: "G-B9GV1JLGZ0"
};

const loginDisplay = document.getElementById("login-display")

// Initialize compat (FirebaseUI expects the global `firebase`)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: "/", // Redirect URL after login
    signInOptions: [
        {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false
        },
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        {
        provider: firebase.auth.GithubAuthProvider.PROVIDER_ID,
        scopes: ['user:email'] // important!
      }
    ],

    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        const user = authResult.user;
        window.user = user
        console.log(user);
        
        console.log("User signed in:", user.email);

        // save user email
        db.collection(`users`).doc(`${user.uid}`).set({
        email: user.email,
        })
        .then(() => {
            console.log("Saved user email:",user.email);
        })
        .catch((error) => {
            console.error("Error saving user info: ", error);
        });

        loginDisplay.style.display = "none";

        //   return false to prevent redirect
        return false
        },
    }
}



const ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start("#firebaseui-auth-container", uiConfig);

window.auth = firebase.auth()