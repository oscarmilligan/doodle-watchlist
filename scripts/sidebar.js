import { focusCard } from "./focuscard.js";

// get element references
const createButton = document.getElementById("create-button");

function createCard(){
    const defaultTitle = "New Entry";
    const defaultRating = 0;
    // create reference to card gallery
    const gallery = document.getElementById("gallery")
        
    // create card element
    const card = document.createElement("div");
    card.classList.add("card","card--onload");
    const cardID = Date.now();
    const imageId = cardID;
    card.style.setProperty("--entry-id",cardID);
    card.style.setProperty("--image-id",imageId);
    card.style.setProperty("--title",defaultTitle);
    card.style.setProperty("--rating",defaultRating);
    card.addEventListener("click",() => {
        focusCard(card);
    });

    
    gallery.appendChild(card);
    console.log("Created card with id:",cardID);
    console.log("and image id:",imageId);
    // create title span
    const titleElement = document.createElement("span");
    titleElement.textContent = defaultTitle;
    titleElement.classList.add("title");
    
    card.appendChild(titleElement)
}

createButton.addEventListener("click",() => {
    createCard();
})