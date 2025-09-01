
// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();


button = document.getElementById("tab-button-1")
button.addEventListener("click", () => {
    db.collection("users").add({
        first: "Ada",
        last: "Lovelace",
        born: 1815
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });

})
