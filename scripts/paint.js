// get  context reference
const ctx = canvas.getContext('2d');
// get canvas position
var canv_rect = canvas.getBoundingClientRect();
var canvleft = canv_rect.left;
var canvtop = canv_rect.top;
console.log(canvleft,canvtop);

// get html reference
const brush_size = document.getElementById('brush-size');
const color_picker =document.getElementById('color-picker');
const clear_canvas = document.getElementById('clear-canvas');
let isDrawing = false;

canvas.width = Math.min(992,0.54*window.innerHeight);
canvas.height = Math.min(1403,0.75*window.innerHeight);
console.log("canvdim:",Math.min(992,0.54*window.innerHeight),
 Math.min(1403,0.75*window.innerHeight));

ctx.lineWidth = 5;
ctx.lineCap = 'round';
ctx.strokeStyle = 'black';

//start drawing
function startPosition(e) {
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
    console.log("drawing");
    
	ctx.strokeStyle = color_picker.value; 
	ctx.lineWidth = brush_size.value; 
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