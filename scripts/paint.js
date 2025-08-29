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

canvas.width = Math.min(992,0.54*window.innerHeight);
canvas.height = Math.min(1403,0.75*window.innerHeight);
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


	oldWidth = canvas.width;
	oldHeight = canvas.height;
	newWidth = Math.min(992,0.54*window.innerHeight);
	newHeight = Math.min(1403,0.75*window.innerHeight);

	windowScale=newHeight/oldHeight

	// create a temporary canvas obj to cache the pixel data //
    var temp_cnvs = document.createElement('canvas');
    var temp_cntx = temp_cnvs.getContext('2d');
	// set it to the new width & height and draw the current canvas data into it // 
    temp_cnvs.width = newWidth; 
    temp_cnvs.height = newHeight;
    temp_cntx.fillStyle = backgroundColor;  // the original canvas's background color
    temp_cntx.fillRect(0, 0, newWidth, newHeight);
    temp_cntx.drawImage(canvas, 0, 0, newWidth, newHeight);
	// resize & clear the original canvas and copy back in the cached pixel data //
    canvas.width = newWidth; 
    canvas.height = newHeight;
    ctx.drawImage(temp_cnvs, 0, 0);
}