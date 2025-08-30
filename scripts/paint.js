import { storage, uploadBytes, ref } from "./firebase.js";

// get  context reference
const ctx = canvas.getContext("2d");
// get canvas position
var canv_rect = canvas.getBoundingClientRect();
var canvleft = canv_rect.left;
var canvtop = canv_rect.top;
console.log(canvleft,canvtop);
//set orignal window scale
var windowScale = 1


// get html reference
const brushSize = document.getElementById("brush-size");
const colorPicker =document.getElementById("color-picker");
const clearCanvas = document.getElementById("clear-canvas");
const saveButton = document.getElementById("save");
const downloadButton = document.getElementById("download")
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
	
	//set new width and height in case of dimension change
	resize();
	
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
clearCanvas.addEventListener("click", () => {
		ctx.clearRect(0, 0, canvas.width,canvas.height);
	});

// resize function in case fo canvas size change
function resize(){
	//match rendering scale
	var wRatio =  595 / Math.min(992,0.54*window.innerHeight);
	var hRatio =  842 / Math.min(1403,0.75*window.innerHeight);
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

function saveImage(){ // update to use existing names for images which are not new
	let imageLink = canvas.toDataURL("image/jpeg",1);
	console.log("saved image");
	
	let imagePath = `images/img_${Date.now()}.jpg`;

	let imageRef = ref(storage, imagePath);

	let imageBlob = dataURItoBlob(imageLink);
	uploadBytes(imageRef, imageBlob).then((snapshot) => {
		console.log("Uploaded file:", imagePath)
	})
}
function downloadImage(){
	let imageLink = canvas.toDataURL("image/jpeg",1);
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
penButton.addEventListener("click", () => {
	activatePen();
});

eraserButton.addEventListener("click", () => {
	activateEraser();
});

saveButton.addEventListener("click", () => {
	saveImage();
});


downloadButton.addEventListener("click", () => {
	downloadImage();
});