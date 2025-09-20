import {focusCard} from "./focuscard.js"
import { switchCategory, saveCategory, expandSidebar } from "./sidebar.js";

const canvas = document.getElementById("canvas");
const sortInput = document.getElementById("sort-input")
const createGroupButton = document.getElementById("create-group-button")
const loadGroupButton = document.getElementById("load-group-menu-button")


// other constants
const root = document.querySelector(":root");
console.log("ROOT:",root);

window.root = root

function scaleTextToFit(element, getTextContentFromChildren = false, width=-1, height=-1){
    console.log("Attempting to scale text for:",element);
    
    // default width to be sidebar width
    if (width == -1){
        width = Number(window.getComputedStyle(root).getPropertyValue("--sidebar-width").slice(0,-2));
    }
    if(height == -1){
        height = 40;
    }


    if (width != 0) {
        console.log("Scaling element text for:",element);
        console.log("before:",element.style.fontSize);
        var textContent = element.textContent
        if(getTextContentFromChildren){
            for (const child of element.children) {
                textContent += child.textContent
            }
        }
        const textLen = textContent.length;

        console.log("Text content:",textContent);
        
        console.log("Length of content:",textLen);
        console.log("Width of container:",width);
        console.log("Height of container:",height);

        const newSize = `${Math.min(Math.round((width)/ textLen)+3,height)}`

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
    tab.appendChild(unwatchedGallery);
    tab.appendChild(watchedGallery);
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

function loadCategoryEntries(uid, categoryId, orderField = "name_lower",order = "asc"){
    const watchedGallery = document.getElementById(`seen-${categoryId}`);
    const unwatchedGallery = document.getElementById(`unseen-${categoryId}`);

    // load cards
    var categoryRef = db.collection(`users`).doc(`${uid}`).collection(`categories`);
    var entriesRef = categoryRef.doc(`${categoryId}`).collection("entries").orderBy(orderField,order)
    if (orderField != "name_lower"){
        entriesRef = entriesRef.orderBy("name_lower") // add name as secondary order field
    }
    entriesRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc => {
            console.log("Card entry:",doc.id, " => ", doc.data());
            // get entry image reference
            const imageId = doc.data()["imageId"];
            const title = doc.data()["name"];
            const rating = doc.data()["rating"];
            const watched = doc.data()["watched"];


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
            card.style.setProperty("--watched",watched)
            card.style.setProperty("--category-id",categoryId)
            card.addEventListener("click",() => {
                focusCard(card);
            });
            // create title span
            const titleElement = document.createElement("span");
            titleElement.textContent = title;
            titleElement.classList.add("title");

            card.appendChild(titleElement)

            //add to appropriate gallery
            if (watched){
                watchedGallery.appendChild(card)
            }
            else{
                unwatchedGallery.appendChild(card)
            }

        }))
        
    })
}

// load cards
function loadAllCategories(uid, orderField = "name_lower",order = "asc", groupId = "Personal"){    
    // Get categories from db
    if(groupId === "Personal"){
        const categoryRef = db.collection(`users`).doc(`${uid}`).collection(`categories`)
        categoryRef.get().then((querySnapshot) => {
            
            querySnapshot.forEach((doc) => {
                console.log("Category:",doc.id, " => ", doc.data());
                const categoryId = doc.id
                const categoryName = doc.data()["name"]
                // load category
                loadCategory(categoryId, categoryName)
                loadCategoryEntries(uid,categoryId, orderField, order)
                
            });
        });
    }
    // TODO:
    
}



function sortCategory(categoryId, orderField, order = "asc"){
    console.log(orderField);
    
    // clear galleries
    const seen = document.getElementById(`seen-${categoryId}`)
    const unseen = document.getElementById(`unseen-${categoryId}`)
    
    for(let gallery of [seen, unseen]){
        while (gallery.firstChild) {
            gallery.removeChild(gallery.lastChild);
        }
    }

    // load category
    loadCategoryEntries(window.user.uid, categoryId, orderField, order)
}

// function to update rendering of a single card
function updateCard(card) {
    console.log("updating card:",card);
    
    const uid= window.user.uid;
    const entryId = card.style.getPropertyValue("--entry-id");
    const categoryId = window.currentCategory
    console.log("Updating card with entryID",entryId,"at",`users/${uid}/entries/${entryId}`);
    
    db.collection(`users`).doc(`${uid}`).collection(`categories`).doc(`${categoryId}`).collection("entries").doc(`${entryId}`).get().then((doc) => {
        console.log("retrieved doc reference");
        
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());

        // load doc data
        const imageId = doc.data()["imageId"]
        const title = doc.data()["name"]
        const rating = doc.data()["rating"]
        const watched = doc.data()["watched"]

        // get storage reference
        let userPath = `users/${uid}`;
        let storageRef = firebase.storage().ref(userPath);

        //move to appropriate gallery
        if (watched){
            const watchedGallery = document.getElementById(`seen-${categoryId}`)
            watchedGallery.appendChild(card)
        }
        else{
            const unwatchedGallery = document.getElementById(`unseen-${categoryId}`)
            unwatchedGallery.appendChild(card)
        }
        
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
        card.style.setProperty("--watched", watched);

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
    header.id = `head-${categoryId}`
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

function scaleUserUIElements(){
    const sidebarWidth = Number(window.getComputedStyle(root).getPropertyValue("--sidebar-width").slice(0,-2));

    const usernameDisplay = document.getElementById("username-display");
    const groupIDText = document.getElementById("group-id-text")
    const groupButtonGroupID = document.getElementById("group-button-group-id")
    const groupButton = document.getElementById("group-button")
    scaleTextToFit(usernameDisplay)
    scaleTextToFit(groupButton,false)
}

async function createNewGroup(groupName){
    
    const groupId = Date.now();
    console.log("Creating new group with name:", groupName,"id:",groupId);

    // update user permission display
    var {email, userPermissions} = await loadActiveUserInfo(); 
    console.log("Loaded user details:",email,userPermissions);
    
    userPermissions[groupId] = {
        groupName: groupName,
        permission: "owner"
    }
    saveActiveUserInfo(userPermissions);

    // add group to database
    var groupPermissions = {}
    groupPermissions[window.user.uid] = "owner"

    db.collection(`groups`).doc(`${groupId}`).set({
        groupName: groupName,
        groupPermissions: groupPermissions
        })
        .then(() => {
            console.log("Saved group with permissions:",groupPermissions);
        })
        .catch((error) => {
            console.error("Error saving group info: ", error);
        });
}

async function loadActiveUserInfo(){
    return new Promise((resolve, reject) => {
        db.collection(`users`).doc(`${window.user.uid}`).get().then((doc) => {
        console.log("retrieved doc reference");
        
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());

        // load doc data
        const email = doc.data()["email"]
        var userPermissions = doc.data()["groupPermissions"]

        if (typeof userPermissions === 'undefined') {
            userPermissions = {}
        }

        console.log("user info is:",email,userPermissions);
        
        resolve({email, userPermissions})

    }).catch((error) => {
            console.error("Error loading user info: ", error);
            reject(error)
        });;
  })

}
function saveActiveUserInfo(userGroupPermissions){
    // add group reference to user
    db.collection(`users`).doc(`${window.user.uid}`).set({
        email: window.user.email,
        groupPermissions: userGroupPermissions
        })
        .then(() => {
            console.log("Saved user info with permissions:",userGroupPermissions);
        })
        .catch((error) => {
            console.error("Error saving user info: ", error);
        });
}

function groupSelectClick(groupListItem, groupId){
    const groupSelectList = document.getElementById("group-select-list")

    // clear any selected grouop
    for (const li of groupSelectList.children) {
        if(li.classList.contains("group-select-list-item--selected")){
            li.classList.remove("group-select-list-item--selected")
        }
    }

    // update ui
    groupListItem.classList.add("group-select-list-item--selected")

    groupSelectList.selected = groupId;
}
async function addGroupItem(groupSelectList, groupId, groupName, groupPermission){
    const groupItem = document.createElement("li")
    groupItem.classList.add("group-select-list-item")

    if(groupId === window.currentGroupId){
        groupItem.classList.add("group-select-list-item--active")
    }
    else{
        groupItem.addEventListener("click",() => {
            groupSelectClick(groupItem, groupId)
        })
    }

    const groupNameElement = document.createElement("span")
    groupNameElement.classList.add("group-select-name")
    groupNameElement.textContent = groupName

    const groupRoleElement = document.createElement("span")
    groupRoleElement.classList.add("group-select-role")
    groupRoleElement.textContent = groupPermission

    groupItem.appendChild(groupNameElement)
    groupItem.appendChild(groupRoleElement)

    

    groupSelectList.appendChild(groupItem)
}
async function loadGroupSelectButtons(){
    const groupSelectList = document.getElementById("group-select-list")

    // clear existing list items
    while (groupSelectList.firstChild){
        groupSelectList.removeChild(groupSelectList.lastChild);
    }
    

    const {email, userPermissions} = await loadActiveUserInfo()
    console.log("userPermissions:",userPermissions);

    // Add personal group
    addGroupItem(groupSelectList, "Personal", "Personal", "owner");
    
    // add other groups
    for (const [groupId, permissions] of Object.entries(userPermissions)) {
        addGroupItem(groupSelectList, groupId, permissions["groupName"], permissions["permission"]);
    }
}

createGroupButton.addEventListener("click", () => {
    console.log("Create button pressed");
    createNewGroup("Test group 1");
})

loadGroupButton.addEventListener("click", () => {
    const groupSelectList = document.getElementById("group-select-list");
    console.log("Selected groupId:",groupSelectList.selected);

    window.currentGroupId = groupSelectList.selected;

    // remove categories from ui
    const categories = document.getElementsByClassName("main")
    for (let i = categories.length-1; i >= 0; i--){
        removeCategoryFromDOM(categories[i].id.slice(4))
    }
    
})

sortInput.addEventListener("change",() => {
    sortCategory(window.currentCategory, sortInput.value, "asc");
})


firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log("Signed in user:", user.email);
    console.log("User id:", user.uid);
    console.log("Providers:", user.providerData.map(p => p.providerId));
    const loginDisplay = document.getElementById("login-display");
    loginDisplay.style.display = "none";
    const usernameDisplay = document.getElementById("username-display");
    usernameDisplay.textContent = user.email

    window.user = user
    window.currentCategory = null
    window.currentGroupId = "Personal"
    
    // fix some element text scaling
    scaleUserUIElements()


    loadAllCategories(user.uid)
    loadGroupSelectButtons()
    
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

    window.baseSidebarWidth = baseSidebarWidth;

    // fix some element text scaling
    scaleUserUIElements();
    
    // set startup variables
    window.currentGroupId = "Personal"

});
export {updateCard, createCategoryElements, loadCategory, scaleTextToFit}