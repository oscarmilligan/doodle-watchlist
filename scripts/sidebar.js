import { focusCard } from "./focuscard.js";

// get element references
const createButton = document.getElementById("create-button");

function createCard(){
    
    // create reference to card gallery
    const gallery = document.getElementById("gallery")
        
    // create card element
    const card = document.createElement("div");
    card.classList.add("card","card--onload");
    const cardID = Date.now()
    card.style.setProperty("--entry-id",cardID)
    card.addEventListener("click",() => {
        focusCard(card);
    });

    
    gallery.appendChild(card);
    console.log("Created card with id:",cardID);
    
}

createButton.addEventListener("click",() => {
    createCard();
})