const canvas = document.getElementById("canvas");

// image references
const penImg = "url(img/pen.png)";
const penCur = "url(img/pen-cur.png) 0 128, auto";
const eraserImg = "url(img/eraser.png)";
const eraserCur = "url(img/eraser-cur.png) 0 128, auto";

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