import {focusCard} from "./focuscard.js"
import { switchCategory, saveCategory, expandSidebar } from "./sidebar.js";

const canvas = document.getElementById("canvas");


// other constants
const root = document.querySelector(":root");
console.log("ROOT:",root);

window.root = root

function scaleTextToFit(element){
    console.log("Attempting to scale text for:",element);
    
    var width = Number(window.getComputedStyle(root).getPropertyValue("--sidebar-width").slice(0,-2));
    // var height = Number(window.getComputedStyle(element).height.slice(0,-2));
    var height = 40
    if (width != 0) {
        console.log("Scaling element text for:",element);
        console.log("before:",element.style.fontSize);
        
        const textLen = element.textContent.length;

        console.log("Length of content:",textLen);
        console.log("Width of container:",width);
        console.log("Height of container:",height);

        const newSize = `${Math.min(Math.round(width / textLen),height)}`

        console.log("Scaling to: ",newSize);
        
        
        element.style.fontSize = `${newSize}px`;
        console.log("after:",element.style.fontSize);
    }
    else{
        console.log("Cannot rescale text, width is 0");
        
    }
    

}



// load category
function loadCategory(categoryId, categoryName){
    // create html elements
    const {tab, header, expandBtn, watchedGallery,unwatchedGallery, switchButton} = createCategoryElements(categoryId, categoryName);
    // load elements onto doc
    const body = document.getElementById("body");
    body.appendChild(tab);
    tab.appendChild(header);
    tab.appendChild(expandBtn);
    tab.appendChild(watchedGallery);
    tab.appendChild(unwatchedGallery);
    // load switch button
    const buttonContainer = document.getElementById("sidebar-tab-container");
    buttonContainer.appendChild(switchButton);

    // hide category until switched to
    tab.style.display = "none";
    // open category if it is the only one
    if(buttonContainer.children.length==1){
        console.log("Opening first category");
        
        switchButton.click()
    }

}


// load cards
function loadCards(uid){    
    // TODO: Load category buttons, load category pages, load cards on each page

    // Get categories from db
    const categoryRef = db.collection(`users`).doc(`${uid}`).collection(`categories`)
    categoryRef.get().then((querySnapshot) => {
        
        // console.log(querySnapshot);
        querySnapshot.forEach((doc) => {
            console.log("Category:",doc.id, " => ", doc.data());
            const categoryId = doc.id
            const categoryName = doc.data()["name"]
            // load category
            loadCategory(categoryId, categoryName)

            let watchedGallery = document.getElementById(`seen-${categoryId}`)

            // load cards
            const entriesRef = categoryRef.doc(`${categoryId}`).collection("entries")
            entriesRef.get().then((querySnapshot) => {
                querySnapshot.forEach((doc => {
                    console.log("Card entry:",doc.id, " => ", doc.data());
                    // get entry image reference
                    const imageId = doc.data()["imageId"];
                    const title = doc.data()["name"];
                    const rating = doc.data()["rating"];


                    let userPath = `users/${uid}`;
                    let storageRef = firebase.storage().ref(userPath);
                    
                    // create card element
                    const card = document.createElement("div");
                    card.classList.add("card","card--onload");
                    
                    // load image
                    storageRef.child(`/images/${imageId}.png`).getDownloadURL()
                    .then((url) => {
                        card.style.setProperty("--entry-image","url("+url+")")
                    })
                    .catch((error) => {
                        // Handle any errors
                        console.log(error);
                        
                    });

                    //set card properties
                    card.style.setProperty("--entry-id",doc.id)
                    card.style.setProperty("--image-id",imageId)
                    card.style.setProperty("--title",title)
                    card.style.setProperty("--rating",rating)
                    card.style.setProperty("--category-id",categoryId)
                    card.addEventListener("click",() => {
                        focusCard(card);
                    });
                    // create title span
                    const titleElement = document.createElement("span");
                    titleElement.textContent = title;
                    titleElement.classList.add("title");

                    card.appendChild(titleElement)

                    watchedGallery.appendChild(card)
                }))
                
            })
        });
    });
}

// function to update rendering of a single card
function updateCard(card) {
    console.log("updating card:",card);
    
    const uid= window.user.uid;
    const entryId = card.style.getPropertyValue("--entry-id");
    console.log("Updating card with entryID",entryId,"at",`users/${uid}/entries/${entryId}`);
    
    db.collection(`users`).doc(`${uid}`).collection(`categories`).doc(`${window.currentCategory}`).collection("entries").doc(`${entryId}`).get().then((doc) => {
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

        // create reference to card watchedGallery
        const watchedGallery = document.getElementById("watchedGallery")
        
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
function titleInputFunction(input, categoryId){
    try {
        const categoryName = input.textContent;
        saveCategory(categoryId,categoryName);
    } catch (error) {
        alert("Could not save image due to",error);
    }
}
function createCategoryElements(categoryId, categoryName){
    // create tab div
    const tab = document.createElement("div");
    tab.classList.add("main");
    tab.id = `tab-${categoryId}`;

    // create header element
    const header = document.createElement("h1");
    header.classList.add("category-header");
    header.setAttribute("contenteditable","true");
    header.textContent = categoryName;
    // add header listener on enter key to save name
    header.addEventListener('keypress', function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            titleInputFunction(header, categoryId);
    };
    });

    // create expand button
    const expandBtn = document.createElement("button");
    expandBtn.classList.add("expand-button")
    expandBtn.textContent = "<";
    expandBtn.addEventListener("click", () => {
        expandSidebar(expandBtn);
    })

    // create gallery elements
    const watchedGallery = document.createElement("div")
    watchedGallery.classList.add("watchedGallery");
    watchedGallery.classList.add("gallery");
    watchedGallery.id = `seen-${categoryId}`;

    const unwatchedGallery = document.createElement("div")
    unwatchedGallery.classList.add("unwatchedGallery");
    unwatchedGallery.classList.add("gallery");
    unwatchedGallery.id = `unseen-${categoryId}`;

    // create sidebar switch button element
    const switchButton = document.createElement("button")
    switchButton.classList.add("tab-button");
    switchButton.textContent = categoryName;
    switchButton.id = `switch-${categoryId}`;
    switchButton.addEventListener("click", () => {
        switchCategory(categoryId,switchButton);
    })
    switchButton.style.width = window.getComputedStyle(root).getPropertyValue("--sidebar-width")
    scaleTextToFit(switchButton);

    return {tab,header,expandBtn,watchedGallery,unwatchedGallery, switchButton}
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log("Signed in user:", user.email);
    console.log("User id:", user.uid);
    console.log("Providers:", user.providerData.map(p => p.providerId));
    const loginDisplay=document.getElementById("login-display");
    loginDisplay.style.display = "none";
    window.user = user
    window.currentCategory = null
    loadCards(user.uid)
    
  } else {
    console.log("No user signed in");
  }
});

document.addEventListener("DOMContentLoaded", () => {
    // fix sidebar width
    const baseSidebarWidth = window.getComputedStyle(root).getPropertyValue("--sidebar-width");
    console.log("Base sidebar width:",baseSidebarWidth);
    
    const sidebar = document.getElementById("sidebar");
    sidebar.style.width = baseSidebarWidth;

    window.baseSidebarWidth = baseSidebarWidth

});
export {updateCard, createCategoryElements, loadCategory, scaleTextToFit}