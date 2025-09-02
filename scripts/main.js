import {focusCard} from "./focuscard.js"

const canvas = document.getElementById("canvas");


// other constants
const baseSidebarWidth = "120px";

const root = document.querySelector(":root");

var sidebarExpanded = true;


// fix sidebar width
const sidebar = document.getElementById("sidebar");
sidebar.style.width = baseSidebarWidth;

// sidebar expand/shrink
const expandButton = document.getElementById("expand-button");
expandButton.addEventListener("click", () => {
    if (sidebarExpanded) {
        root.style.setProperty('--sidebar-width',"0px");
        expandButton.classList.add("expand-button--minimised");
        sidebar.classList.add("sidebar--minimised");
        sidebar.classList.remove("sidebar--expanded");
        sidebarExpanded = false;
    }
    else{
        root.style.setProperty('--sidebar-width',baseSidebarWidth);
        expandButton.classList.remove("expand-button--minimised");
        sidebar.classList.add("sidebar--expanded");
        sidebar.classList.remove("sidebar--minimised");
        sidebarExpanded = true;
    }
})

// load cards
function loadCards(uid){    
    db.collection(`users`).doc(`${uid}`).collection(`entries`).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        // get entry image reference
        const imageId = doc.data()["imageId"];
        const title = doc.data()["name"];
        const rating = doc.data()["rating"];

        let userPath = `users/${uid}`;
        let storageRef = firebase.storage().ref(userPath);

        // create reference to card gallery
        const gallery = document.getElementById("gallery")
        
        // create card element
        const card = document.createElement("div");
        card.classList.add("card","card--onload");
        card.style.setProperty("--entry-id",doc.id)
        card.style.setProperty("--image-id",imageId)
        card.style.setProperty("--title",title)
        card.style.setProperty("--rating",rating)
        card.addEventListener("click",() => {
            focusCard(card);
        });
        // create title span
        const titleElement = document.createElement("span");
        titleElement.textContent = title;
        titleElement.classList.add("title");


        // load image
        storageRef.child(`/images/${imageId}.png`).getDownloadURL()
        .then((url) => {
            card.style.setProperty("--entry-image","url("+url+")")
        })
        .catch((error) => {
            // Handle any errors
            console.log(error);
            
        });
        
        
        gallery.appendChild(card);
        card.appendChild(titleElement)
    });
    });
}

// function to update rendering of a single card
function updateCard(card) {
    console.log("updating card:",card);
    
    const uid= window.user.uid;
    const entryId = card.style.getPropertyValue("--entry-id");
    console.log("Updating card with entryID",entryId,"at",`users/${uid}/entries/${entryId}`);
    
    db.collection(`users`).doc(`${uid}`).collection(`entries`).doc(`${entryId}`).get().then((doc) => {
        console.log("retrieved doc reference");
        
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());

        // save doc data
        const imageId = doc.data()["imageId"]
        const title = doc.data()["name"]
        const rating = doc.data()["rating"]

        // get storage reference
        let userPath = `users/${uid}`;
        let storageRef = firebase.storage().ref(userPath);

        // create reference to card gallery
        const gallery = document.getElementById("gallery")
        
        // load image
        storageRef.child(`/images/${imageId}.png`).getDownloadURL()
        .then((url) => {
            console.log("retrieved image");
            card.style.setProperty("--entry-image","url("+url+")")

            // load title
            for (const child of card.children){
                if (child.classList.contains("title")){
                    child.textContent = title;
                }
            }

        })
        .catch((error) => {
            // Handle any errors
            console.log(error);
            
        });
        // set other card properties 
        card.style.setProperty("--title",title);
        card.style.setProperty("--rating",rating);
        
        console.log("updated card");
    });
}


firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log("Signed in user:", user.email);
    console.log("User id:", user.uid);
    console.log("Providers:", user.providerData.map(p => p.providerId));
    const loginDisplay=document.getElementById("login-display");
    loginDisplay.style.display = "none";
    window.user = user
    loadCards(user.uid)
  } else {
    console.log("No user signed in");
  }
});

export {updateCard}