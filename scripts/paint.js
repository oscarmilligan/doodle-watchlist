// get  context reference
const ctx = canvas.getContext('2d');
// get canvas position
var canv_rect = canvas.getBoundingClientRect();
var canvleft = canv_rect.left;
var canvtop = canv_rect.top;
console.log(canvleft,canvtop);
//set orignal window scale
var windowScale = 1


// get html reference
const brush_size = document.getElementById('brush-size');
const color_picker =document.getElementById('color-picker');
const clear_canvas = document.getElementById('clear-canvas');
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
ctx.lineCap = 'round';
ctx.strokeStyle = 'black';

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
    
	ctx.strokeStyle = color_picker.value; 
	ctx.lineWidth = brush_size.value*windowScale; 
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
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);
clear_canvas.addEventListener('click', () => {
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