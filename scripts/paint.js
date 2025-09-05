import {unfocusCard} from "./focuscard.js"
import {updateCard} from "./main.js"

// get  context reference
const ctx = canvas.getContext("2d");
// get canvas position
var canv_rect = canvas.getBoundingClientRect();
var canvleft = canv_rect.left;
var canvtop = canv_rect.top;
console.log(canvleft,canvtop);
//set orignal window scale
var windowScale = 1


// image references
const penImg = "url(img/pen.png)";
const penCur = "url(img/pen-cur.png) 0 128, auto";
const eraserImg = "url(img/eraser.png)";
const eraserCur = "url(img/eraser-cur.png) 0 128, auto";

// get html reference
const brushSize = document.getElementById("brush-size");
const colorPicker =document.getElementById("color-picker");
const clearCanvas = document.getElementById("clear-canvas");
const saveButton = document.getElementById("save");
const downloadButton = document.getElementById("download")
const closeButton = document.getElementById("close-paint")
const deleteButton = document.getElementById("delete-button")
const titleInput = document.getElementById("title-input");
let isDrawing = false;

//set canvas resolution (a4 72dpi)
canvas.width = 595;
canvas.height = 842;

resize() // match screen size to resolution

console.log("canvdim:",Math.min(992,0.54*window.innerHeight),
 Math.min(1403,0.75*window.innerHeight));

const backgroundColor = "#faebd7";
canvas.fillStyle = backgroundColor;
ctx.lineWidth = 5;
ctx.lineCap = "round";
ctx.strokeStyle = "black";

//start drawing
function startPosition(e) {
	console.log("start draw")
    canv_rect = canvas.getBoundingClientRect();
    canvleft = canv_rect.left;
    canvtop = canv_rect.top;
	
    isDrawing = true;
    draw(e);
	
}

//end drawing
function endPosition() {
	isDrawing = false;
	ctx.beginPath();
}


function draw(e) {
	if (!isDrawing) return;
    
	ctx.strokeStyle = colorPicker.value; 
	ctx.lineWidth = brushSize.value*windowScale; 
	ctx.lineTo(
		e.clientX - canvleft,
		e.clientY - canvtop
	);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(
		e.clientX - canvleft,
		e.clientY - canvtop
	);
}

// event listeners for differnt mouse actions
canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseout", endPosition);
window.addEventListener("resize",resize)

clearCanvas.addEventListener("click", () => {
		ctx.clearRect(0, 0, canvas.width,canvas.height);
	});

// resize function in case of canvas size change
function resize(){
  console.log("resizing canvas");
  
  // get canvas dims
  var canv_rect = canvas.getBoundingClientRect();
  var width = canv_rect.width;
  var height = canv_rect.height;
	//match rendering scale
	var wRatio =  595 / width;
	var hRatio =  842 / height;
	ctx.setTransform(wRatio,0,0,hRatio,0,0);

	// update window scale
	windowScale = 1/hRatio

}


brushSize.addEventListener("input", () => {
	ctx.lineWidth = brushSize.value;
	updateBrushSizeLabel(brushSize.value);
});

function updateBrushSizeLabel(size) {
	const brushSizeLabel = document.getElementById("brush-size-label");
	if (brushSizeLabel) {
		brushSizeLabel.textContent =`Brush Size: ${size}`;
	}
}

//Get references to the pen and eraser button
const penButton = document.getElementById("pen");
const eraserButton = document.getElementById("eraser");

//switing to pen mode
function activatePen() {
	ctx.globalCompositeOperation = "source-over";
	ctx.strokeStyle = colorPicker.value;
	
	// change canvas cursor
	canvas.style.setProperty("--canvas-cursor",penCur);
}

//switching to eraser mode
function activateEraser() {
	ctx.globalCompositeOperation = "destination-out";
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
	// change canvas cursor
	canvas.style.setProperty("--canvas-cursor",eraserCur);
}

// converts dataurl from saved canvas to blob object to upload
function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  return blob;

}

function getPixelColor(data,x,y){
  var i = 4*(x+w*y); // 
  var color = (pixels[i]<<24) + (pixels[i+1]<<16) + (pixels[i+2]<<8) + (pixels[i+3]); // I don't care about the alpha
}

async function saveImage(){ // update to use existing names for images which are not new
  const focusedCard = window.card_focused;
  const categoryId = window.currentCategory;
  
	let imageLink = canvas.toDataURL("image/png",1);
	console.log("saved image");
	
  let entryID = canvas.style.getPropertyValue("--entry-id");
  let imageId = canvas.style.getPropertyValue("--image-id");
  let title = titleInput.textContent;
  let rating = window.card_focused.style.getPropertyValue("--rating");

	let imagePath = `users/${user.uid}/images/${imageId}.png`;

	let storageRef = firebase.storage().ref(imagePath);

	let imageBlob = dataURItoBlob(imageLink);

	let metadata = {"contentType":"image/png",}

	console.log(imageBlob.size);
	
	
  // upload debug info
  console.log("---- Upload Debug Info ----");
  console.log("Auth UID:", window.user.uid);
  console.log("Upload path:", imagePath);
  console.log("File size (bytes):", imageBlob.size);
  console.log("Detected content type:", imageBlob.type);
  console.log("Metadata being sent:", metadata);
	console.log("Default bucket:", firebase.storage().app.options.storageBucket);

	console.log("Auth user:", window.auth.currentUser?.uid);
  const token =  await auth.currentUser?.getIdToken();
  console.log("Auth token:", token ? token.substring(0,20) + "..." : "none");
  console.log("window.user.uid:", window.user?.uid);
  console.log("currentUser.uid:", auth.currentUser?.uid);
  console.log("Is Blob:", imageBlob instanceof Blob);
  console.log("---------------------------");

	
  // Upload the file
  const uploadTask = storageRef.put(imageBlob, metadata);


  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Optional: progress monitoring
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress.toFixed(2) + "% done");
    },
    (error) => {
      console.error("Upload failed:", error);
    },
    () => {
      // Upload completed successfully
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log("File available at", downloadURL);
        console.log("Updating database at",`users/${window.user.uid}/categories/${categoryId}/entries/${entryID}`);
        
        
        db.collection(`users`).doc(`${window.user.uid}`).collection(`categories`).doc(`${categoryId}`).collection("entries").doc(`${entryID}`).set({
        name: title,
        rating: rating,
        imageId: imageId
        })
        .then(() => {
            console.log("Document written with ID: ", entryID);
            updateCard(focusedCard)
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
        

        // Optionally get server-side metadata
        uploadTask.snapshot.ref.getMetadata().then((meta) => {
          console.log("---- Server-side metadata ----");
          console.log(meta);
          console.log("-------------------------------");
        });
      });
    }
  );

  
  
}
	

function downloadImage(){
	let imageLink = canvas.toDataURL("image/png",1);
	console.log("saved image");
	
	// Create an anchor, and set the href value to our data URL
    const createEl = document.createElement('a');
    createEl.href = imageLink;

    // This is the name of our downloaded file
    createEl.download = `img_${Date.now()}`;

    // Click the download button, causing a download, and then remove it
    createEl.click();
    createEl.remove();

}

function deleteCard(card){
  const entryId = card.style.getPropertyValue("--entry-id")
  const imageId = card.style.getPropertyValue("--image-id")

  // Create a reference to the file to delete
  let userPath = `users/${window.user.uid}`;
  let storageRef = firebase.storage().ref(userPath);

  var imageRef = storageRef.child(`images/${imageId}.png`);

  // Delete the db entry
  console.log("Deleting db entry...");
  db.collection(`users`).doc(`${window.user.uid}`).collection(`categories`).doc(`${window.currentCategory}`).collection("entries").doc(`${entryId}`).delete().then(() => {
    console.log("Database entry successfully deleted from:",`users/${window.user.uid}/categories/${window.currentCategory}/entries/${entryId}`);
    
    // Delete the file
    console.log("Deleting file...");
    imageRef.delete().then(() => {
      console.log("File successfully deleted from:",`users/${window.user.uid}/images/${imageId}.png`);

    }).catch((error) => {
      console.log("Failed to delete file due to:",error);
    });
    // delete the card
    unfocusCard(card);
    card.remove();

  }).catch((error) => {
    console.log("Failed to delete db entry due to:",error);
  })
    

  
}

penButton.addEventListener("click", () => {
	activatePen();
});

eraserButton.addEventListener("click", () => {
	activateEraser();
});

saveButton.addEventListener("click", () => {
	try {
      saveImage();
  } catch (error) {
    alert("Could not save image due to",error);
  }
});


downloadButton.addEventListener("click", () => {
	downloadImage();
});

closeButton.addEventListener("click", () => {
	unfocusCard();
});

deleteButton.addEventListener("click", () => {
  deleteCard(card_focused);
})

// listen for the enter key on title input
titleInput.addEventListener('keypress', function(e) {
	if (e.key === "Enter") {
		e.preventDefault();
    try {
      saveImage();
    } catch (error) {
      alert("Could not save image due to",error);
    }
	}      
});

export {resize}