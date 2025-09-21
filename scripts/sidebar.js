import { focusCard, unfocusCard} from "./focuscard.js";
import { createCategoryElements, loadCategory, scaleTextToFit } from "./main.js";



// get element references
const createButton = document.getElementById("create-button");
const createCategoryButton = document.getElementById("create-category")
const SignoutButton = document.getElementById("log-out-button")
const deleteCategoryButton = document.getElementById("delete-category")
const groupSelectOpenButton = document.getElementById("group-button")
const groupSelectContainer = document.getElementById("group-select-container")
const groupSelectCloseButton = document.getElementById("group-select-close-button")
const groupAddContainer = document.getElementById("group-add-container")
const groupAddCloseButton = document.getElementById("group-menu-close-button")
const groupAddOpenButton = document.getElementById("create-group-menu-button")
const selectGroupMenuButton = document.getElementById("select-group-menu-button")
const joinMenuButton = document.getElementById("join-menu-button")
const joinMenuCloseButton = document.getElementById("join-menu-close-button")
const viewSentMenuButton = document.getElementById("view-sent-menu-button")
const sendRequestButton = document.getElementById("send-request-button")
const joinMenuContainer = document.getElementById("group-join-container")

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
    const defaultWatched = false;
    const categoryId = window.currentCategory;
    // create reference to card gallery

    if (defaultWatched){
        var gallery = document.getElementById(`seen-${categoryId}`)
    }
    else{
        var gallery = document.getElementById(`unseen-${categoryId}`)
    }
    // create card element
    const card = document.createElement("div");
    card.classList.add("card","card--onload");
    const cardID = Date.now();
    const imageId = cardID;
    card.style.setProperty("--entry-id",cardID);
    card.style.setProperty("--image-id",imageId);
    card.style.setProperty("--title",defaultTitle);
    card.style.setProperty("--rating",defaultRating);
    card.style.setProperty("--watched",defaultWatched);
    // card.style.setProperty("--entry-image","url("+"img/stars.png"+")")
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
    const defaultName = "Type here...";
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
    if (window.card_focused != null) {
        unfocusCard(window.card_focused)
    }
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
    var dbPathRef = db.collection(`users`).doc(`${window.user.uid}`)

    if (window.currentGroupId !== "Personal"){
        dbPathRef = db.collection("groups").doc(`${window.currentGroupId}`)
    }

    dbPathRef.collection(`categories`).doc(`${categoryId}`).set({
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

function deleteCategory(categoryId){
    console.log("Deleting category db entry...");
    var dbPathRef = db.collection(`users`).doc(`${window.user.uid}`)

    if (window.currentGroupId !== "Personal"){
        dbPathRef = db.collection("groups").doc(`${window.currentGroupId}`)
    }

    dbPathRef.collection(`categories`).doc(`${window.currentCategory}`).delete().then(() => {
        console.log("Database entry successfully deleted from:",`users/${window.user.uid}/categories/${window.currentCategory}`);
        
        // delete the ui
        removeCategoryFromDOM(categoryId)
        // try to switch to new category
        const buttonContainer = document.getElementById("sidebar-tab-container");
        const tabButtons = buttonContainer.children
        if (tabButtons.length >= 1){
            console.log("Switching to last availible category");
            tabButtons[tabButtons.length-1].click();
        }
        else{
            console.log("No category to switch to");
        }

    }).catch((error) => {
        console.log("Failed to delete db entry due to:",error);
    })
}

function removeCategoryFromDOM(categoryId){
    const tab = document.getElementById(`tab-${categoryId}`);
    const oldButton = document.getElementById(`switch-${categoryId}`);
    console.log(tab,oldButton);
    
    oldButton.remove();
    tab.remove();
    console.log("Deleted button and tab");
    
    window.currentCategory = null;
}

function signOut(){
    firebase.auth().signOut().then(() => {
        console.log("User signed out successfully");
        const categories = document.getElementsByClassName("main")
        for (let i = categories.length-1; i >= 0; i--){
            removeCategoryFromDOM(categories[i].id.slice(4))
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

deleteCategoryButton.addEventListener("click",() => {
    deleteCategory(window.currentCategory);
})

SignoutButton.addEventListener("click", () => {
    signOut();
})

groupSelectOpenButton.addEventListener("click", () => {
    groupSelectContainer.classList.remove("hidden");
})

groupSelectCloseButton.addEventListener("click", () => {
    groupSelectContainer.classList.add("hidden");
})

groupAddCloseButton.addEventListener("click", () => {
    groupAddContainer.classList.add("hidden");
})

groupAddOpenButton.addEventListener("click", () => {
    groupAddContainer.classList.remove("hidden");
    groupSelectContainer.classList.add("hidden");
})
selectGroupMenuButton.addEventListener("click", () => {
    groupSelectContainer.classList.remove("hidden");
    groupAddContainer.classList.add("hidden");
})
joinMenuButton.addEventListener("click",() => {
    joinMenuContainer.classList.remove("hidden")
})
joinMenuCloseButton.addEventListener("click", () => {
    joinMenuContainer.classList.add("hidden")
})
viewSentMenuButton.addEventListener("click", () => {
    alert("WIP")
})
sendRequestButton.addEventListener("click", () => {
    alert("WIP")
})

export {expandSidebar, switchCategory, saveCategory, removeCategoryFromDOM, createNewCategory}