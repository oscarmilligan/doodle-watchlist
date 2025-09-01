import { focusCard } from "./focuscard.js";

// get element references
const createButton = document.getElementById("create-button");
const deleteButton = document.getElementById("delete-button");

function createCard(){
    
    // create reference to card gallery
    const gallery = document.getElementById("gallery")
        
    // create card element
    const card = document.createElement("div");
    card.classList.add("card","card--onload");
    card.style.setProperty("--entry-id",Date.now())
    card.addEventListener("click",() => {
        focusCard(card);
    });

    
    gallery.appendChild(card);
}

createButton.addEventListener("click",() => {
    createCard();
})