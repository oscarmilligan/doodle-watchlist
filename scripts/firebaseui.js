
const loginDisplay = document.getElementById("login-display")

// Initialize compat (FirebaseUI expects the global `firebase`)


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

        loginDisplay.style.display = "none";

        //   return false to prevent redirect
        return false
        },
    }
}



const ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start("#firebaseui-auth-container", uiConfig);

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log("Signed in user:", user.email);
    console.log("Providers:", user.providerData.map(p => p.providerId));
  } else {
    console.log("No user signed in");
  }
});
window.auth = firebase.auth()