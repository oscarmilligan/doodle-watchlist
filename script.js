
  const focus_card = (card) => {
    if (card.classList.contains("card--unfocused")){
        const placeholder = document.createElement("div");
        placeholder.classList.add("hidden")
        placeholder.id = "placeholder"
        card.insertAdjacentElement("beforebegin", placeholder);
        card.classList.add('card--focused');
        card.classList.remove('card--unfocused');
        
    }

    else{
        const placeholder = document.getElementById("placeholder");
        placeholder.remove();
        card.classList.remove('card--focused');
        card.classList.add('card--unfocused');
    }
    
}
