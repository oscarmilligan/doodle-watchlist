var card_focussed



const focus_card = (card) => {
    console.log(card_focussed);
    if (card_focussed) {
        unfocus_card(card_focussed);
    }
    if (card != card_focussed && (card.classList.contains("card--unfocused") || card.classList.contains("card--onload"))){
        // get card position
        const leftpos = card.offsetLeft;
        const toppos = card.offsetTop - window.scrollY;
        const width = card.width;
        const height = card.height;
        console.log(leftpos+"px",toppos +"px")

        // get canvas position
        canvas = document.getElementById("canvas")
        var canv_rect = canvas.getBoundingClientRect();
        const canvleft = canv_rect.left;
        const canvtop = canv_rect.top;
        console.log(canvleft,canvtop);

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
        console.log(canvleft,canvtop);
        card.style.setProperty("--canv-left",canvleft+"px")
        card.style.setProperty("--canv-top",canvtop+"px")

        // edit classes
        card.classList.contains("card--unfocused") ? card.classList.remove('card--unfocused') : card.classList.remove('card--onload');
        card.classList.add('card--focused');
        card_focussed = card;

        // unhide canvas
        const canvas_area = document.getElementById("canvas-area")
        canvas_area.classList.remove("hidden")

        // hide card after canvas animation
        canvas_area.addEventListener("transitionend", function() {if (card = card_focussed){card.classList.add("hidden")}});
        
    }

    // else{
    //     //unfocus card
    //     unfocus_card(card)
    // }
    
}
const unfocus_card = (card = "N/A") => {
    if (card = "N/A"){
        card = card_focussed
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
    card_focussed = null;

    // hide canvas area
    const canvas_area = document.getElementById("canvas-area")
    canvas_area.classList.add("hidden")
}