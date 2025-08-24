
  const focus_card = (card) => {
    if (card.classList.contains("card--unfocused") || card.classList.contains("card--onload")){
        // get card position
        const leftpos = card.offsetLeft;
        const toppos = card.offsetTop;
        const width = card.width;
        const height = card.height;
        console.log(leftpos+"px",toppos +"px")
        card.style.setProperty('--card-left', leftpos+"px");
        card.style.setProperty('--card-top', toppos+"px");

        // insert placeholder to grid
        const placeholder = document.createElement("div");
        placeholder.classList.add("hidden");
        placeholder.id = "placeholder";
        card.insertAdjacentElement("beforebegin", placeholder);
        //fix card
        card.style.position = "fixed";
        card.style.left = leftpos +"px";
        card.style.top = toppos +"px";
        // edit classes
        
        card.classList.contains("card--unfocused") ? card.classList.remove('card--unfocused') : card.classList.remove('card--onload');
        card.classList.add('card--focused');
    }

    else{
        // get placeholder position
        const placeholder = document.getElementById("placeholder");
        const leftpos = placeholder.offsetLeft;
        const toppos = placeholder.offsetTop;
        console.log(leftpos+"px",toppos +"px")
        card.style.setProperty('--card-left', leftpos+"px");
        card.style.setProperty('--card-top', toppos+"px");

        // remove placeholder
        placeholder.remove();
        
        // unfix card
        card.style.position = "relative";
        
        card.classList.remove('card--focused');
        card.classList.add('card--unfocused');
        void card.style;
    }
    
}
