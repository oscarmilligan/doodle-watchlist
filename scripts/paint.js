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

penButton.addEventListener("click", () => {
	activatePen();
});

eraserButton.addEventListener("click", () => {
	activateEraser();
});