import { focusCard } from "./focuscard.js";

// get element references
const createButton = document.getElementById("create-button");

function createCard(){
    
    // create reference to card gallery
    const gallery = document.getElementById("gallery")
        
    // create card element
    const card = document.createElement("div");
    card.classList.add("card","card--onload");
    const cardID = Date.now();
    const imageId = cardID;
    card.style.setProperty("--entry-id",cardID);
    card.style.setProperty("--image-id",imageId);
    card.addEventListener("click",() => {
        focusCard(card);
    });

    
    gallery.appendChild(card);
    console.log("Created card with id:",cardID);
    console.log("and image id:",imageId);
    
}

createButton.addEventListener("click",() => {
    createCard();
})