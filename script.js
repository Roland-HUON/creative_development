const canvas = document.getElementById('canvas');
const width = canvas.clientWidth*2;
const height = canvas.clientHeight*2;

canvas.width = width;
canvas.height = height;

const context = canvas.getContext('2d');

const draw = () => {
    if(!context) return;
    // context.fillStyle = 'red';
    // context.fillRect(width/2-250, height/2-250, 500, 500);   
    // context.closePath();

    // context.fillStyle = 'white';
    // context.beginPath();
    // context.arc(width/2, height/2, 500/2, 0, Math.PI * 2);
    // context.fill();
    // context.closePath();

    // context.fillStyle = 'red';
    // context.beginPath();
    // context.moveTo(width/2 - 250, height/2 + 250);
    // context.lineTo(width/2 + 250, height/2 + 250);
    // context.lineTo(width/2, height/2 + 250);
    // context.fill();
    // context.closePath();
    
    // context.strokeStyle = 'red';
    // context.lineWidth = 5;
    // context.arc(100, 100, 100, 0, Math.PI);
    // context.lineTo(202, 100);
    // context.arc(100, 100, 80, 0, Math.PI);
    // context.stroke();
}

// const drawSquare = (dimension,x, y, color) => {
//     context.fillStyle = color;
//     context.strokeStyle = 'black';
//     context.lineWidth = 5;
//     context.beginPath();
//     context.rect(x, y, dimension, dimension);
//     context.fill();
//     context.stroke();
//     context.closePath();
// }

// const nbSquares = 400;

// for( let i=0; i<nbSquares; i++){
//     for( let j=0; j<nbSquares; j++){
//         if((i+j)%2 === 0){
//             drawSquare(width/nbSquares, i*width/nbSquares, j*width/nbSquares, 'white');
//         }else{
//             drawSquare(width/nbSquares, i*width/nbSquares, j*width/nbSquares, 'black');
//         }
//     }
// }

const paint = () => {
    let draw = false;
    context.beginPath();
    context.lineWidth = 10;
    canvas.addEventListener('mousemove', (e) => {
        const x = e.offsetX * 2;
        const y = e.offsetY * 2;
        context.fillStyle = "black";
        context.strokeStyle = "black";
        if(draw){
            context.lineTo(x, y);
            context.stroke();
        }
    })
    canvas.addEventListener('mousedown', (e) => {
        draw = true;
    })
    canvas.addEventListener('mouseup', (e) => {
        draw = false;
        context.closePath();
        context.beginPath();
    })
}

const drawSquare = (x, y, size) => {
    context.fillStyle = "black";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    context.beginPath();
    context.rect(x, y, size, size);
    context.fill();
    context.stroke();
    context.closePath();
}
let x = 0;
const loop = () => {
    context.clearRect(0, 0, width, height);
    drawSquare(x, 100, 100);
    x++;
    if(x > width){
        x = 0;
    }
    requestAnimationFrame(loop);
}

loop();