import { resize } from "./paint.js";
var card_focused

function focusCard (card){
    // console.log(card_focused);
    if (card_focused) {
        unfocusCard(card_focused);
    }
    if (card != card_focused && (card.classList.contains("card--unfocused") || card.classList.contains("card--onload"))){
        // update canvas with entry
        // get  context reference
        const ctx = canvas.getContext("2d");
        const titleInput = document.getElementById("title-input");
        const imageDownloadURL = card.style.getPropertyValue("--entry-image");
        const title = card.style.getPropertyValue("--title");
        console.log("Drawing on canvas:",imageDownloadURL);
        
        if (imageDownloadURL != "") {
            
	        ctx.setTransform(1,0,0,1,0,0); //so image ligns up
            const image = new Image();
            image.setAttribute('crossorigin', 'anonymous'); // prevent security error
            image.src = imageDownloadURL.slice(4,-1);
            image.onload = () => {
                ctx.imageSmoothingEnabled = false;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image,0, 0);
            };
            console.log("Successfully loaded canvas");
        }
        else{
            console.log("clearing canvas");
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        //update canvas title
        titleInput.textContent = title;
        console.log("canvas title updated to:",title);
        

        // get card position
        const leftpos = card.offsetLeft;
        const toppos = card.offsetTop - window.scrollY;
        const width = card.width;
        const height = card.height;
        // console.log(leftpos+"px",toppos +"px")

        // get canvas position
        var canv_rect = canvas.getBoundingClientRect();
        const canvleft = canv_rect.left;
        const canvtop = canv_rect.top;
        // console.log(canvleft,canvtop);
        

        canvas.style.setProperty("--entry-id",card.style.getPropertyValue("--entry-id"));
        canvas.style.setProperty("--image-id",card.style.getPropertyValue("--image-id"));
            

        // insert placeholder to grid
        const placeholder = document.createElement("div");
        placeholder.classList.add("hidden");
        placeholder.id = "placeholder";
        card.insertAdjacentElement("beforebegin", placeholder);
        //fix card
        card.style.position = "fixed";
        card.style.left = leftpos +"px";
        card.style.top = toppos +"px";
        
        // pass canvas position to card
        card.style.setProperty("--canv-left",canvleft+"px")
        card.style.setProperty("--canv-top",canvtop+"px")

        // edit classes
        card.classList.contains("card--unfocused") ? card.classList.remove('card--unfocused') : card.classList.remove('card--onload');
        card.classList.add('card--focused');
        card_focused = card;

        // unhide canvas
        const canvas_area = document.getElementById("canvas-area")
        canvas_area.classList.remove("hidden")

        // hide card after canvas animation
        canvas_area.addEventListener("transitionend", function() {if (card = card_focused){card.classList.add("hidden")}});
        
    }

    // else{
    //     //unfocus card
    //     unfocus_card(card)
    // }
    window.card_focused = card_focused
    console.log("The current card focused is:",card_focused);
    
}
function unfocusCard(card = "N/A") {
    if (card = "N/A"){
        card = card_focused
    }
    // get placeholder position
    const placeholder = document.getElementById("placeholder");

    // remove placeholder
    placeholder.remove();
    
    // unhide card
    card.classList.remove("hidden")

    // unfix card
    card.style.position = "relative";
    card.style.left = "0";
    card.style.top = "0";

    card.classList.remove('card--focused');
    card.classList.add('card--unfocused');
    card_focused = null;

    // hide canvas area
    const canvas_area = document.getElementById("canvas-area")
    canvas_area.classList.add("hidden")

    window.card_focused= card_focused
}

export {focusCard, unfocusCard}