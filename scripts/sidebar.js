import { focusCard } from "./focuscard.js";
import { createCategoryElements, loadCategory, scaleTextToFit } from "./main.js";


// get element references
const createButton = document.getElementById("create-button");
const createCategoryButton = document.getElementById("create-category")
const SignoutButton = document.getElementById("log-out-button")
const root = window.root

var sidebarExpanded = true;

// sidebar expand/shrink temporary
// const expandButton = document.getElementsByClassName("expand-button");
// expandButton[0].addEventListener("click", () => {
//     expandSidebar(expandButton[0]);
// })

function expandSidebar(expandButton){
    const root = window.root
    if (sidebarExpanded) {
            root.style.setProperty('--sidebar-width',"0px");
            expandButton.classList.add("expand-button--minimised");
            sidebar.classList.add("sidebar--minimised");
            sidebar.classList.remove("sidebar--expanded");
            sidebarExpanded = false;
        }
        else{
            root.style.setProperty('--sidebar-width',window.baseSidebarWidth);
            expandButton.classList.remove("expand-button--minimised");
            sidebar.classList.add("sidebar--expanded");
            sidebar.classList.remove("sidebar--minimised");
            sidebarExpanded = true;
        }
}

function createCard(){
    const defaultTitle = "New Entry";
    const defaultRating = 0;
    const categoryId = window.currentCategory;
    // create reference to card gallery
    const gallery = document.getElementById(`gal-${categoryId}`)
        
    // create card element
    const card = document.createElement("div");
    card.classList.add("card","card--onload");
    const cardID = Date.now();
    const imageId = cardID;
    card.style.setProperty("--entry-id",cardID);
    card.style.setProperty("--image-id",imageId);
    card.style.setProperty("--title",defaultTitle);
    card.style.setProperty("--rating",defaultRating);
    card.style.setProperty("--entry-image","url("+"img/stars.png"+")")
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
function createNewCategory(){
    const defaultName = "New Category (press enter to save name)";
    // set create new id as unix time
    const categoryId = Date.now();
    // load cateogry onto page
    loadCategory(categoryId, defaultName)
    // switch tab
    const switchButton = document.getElementById(`switch-${categoryId}`);
    switchButton.click();
    // save to db
    saveCategory(categoryId, defaultName);
}

function switchCategory(categoryId, button = null){
    const originalCategory = window.currentCategory;
    window.currentCategory = categoryId;
    if (originalCategory != null){
        // hide orignal category
        console.log("Hiding original category with id:",originalCategory);
        const originTab = document.getElementById(`tab-${originalCategory}`)
        
        originTab.style.display = "none";

        // unhighlight original button
        try { 
            const oldButton = document.getElementById(`switch-${originalCategory}`)
            oldButton.classList.remove("tab-button--pressed")
        } catch (error) {
            console.log(error);
        }
    }
    // show new category
    console.log("Showing new category id:",categoryId);
    const newTab = document.getElementById(`tab-${categoryId}`)
    newTab.style.display = "block"

    // highlight button
    if (button != null){
        button.classList.add("tab-button--pressed")
    }
}

function saveCategory(categoryId, categoryName){
    db.collection(`users`).doc(`${window.user.uid}`).collection(`categories`).doc(`${categoryId}`).set({
        name: categoryName,
        })
        .then(() => {
            console.log("Category written with ID: ", categoryId);
            console.log("Category written with name: ", categoryName);
            // update category buttton
            const categoryButton = document.getElementById(`switch-${categoryId}`)
            categoryButton.textContent = categoryName;
            scaleTextToFit(categoryButton)

        })
        .catch((error) => {
            console.error("Error adding category: ", error);
        });
}

function signOut(){
    firebase.auth().signOut().then(() => {
        console.log("User signed out successfully");
        const cards = document.getElementsByClassName("card")
        for (let i = cards.length-1; i >= 0; i--){
            cards[i].remove()
        }
        const loginDisplay=document.getElementById("login-display");
        loginDisplay.style.display = "block";
        
        ui.start("#firebaseui-auth-container", uiConfig);
        console.log("Displaying login screen");
        
    })
}

createButton.addEventListener("click",() => {
    createCard();
})

createCategoryButton.addEventListener("click",() => {
    createNewCategory();
})

SignoutButton.addEventListener("click", () => {
    signOut();
})

export {expandSidebar, switchCategory, saveCategory}