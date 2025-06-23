const canvas = document.getElementById('canvas');
const width = canvas.clientWidth*2;
const height = canvas.clientHeight*2;

canvas.width = width;
canvas.height = height;

const context = canvas.getContext('2d');

const drawPlanet = () => {
    context.beginPath();
    context.arc(canvas.width/2, canvas.height, 100, 0, Math.PI);
    context.fillStyle = 'rgba(255, 255, 0, 1)';
    context.fill();
}

const draw = () => {
    if(!context) return;
}

draw();