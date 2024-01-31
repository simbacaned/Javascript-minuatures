const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const a = 2 * Math.PI / 6;
const r = 50;
const vec2 = [0,0];
const myIndex = [0,0];
const hexagons = [];
var mousePosX = 0;
var mousePosY = 0;

// Define the Hexagon class
class Hexagon {
    constructor(index, position) {
        this.index = [0,0];
        this.index[0] = index[0];
        this.index[1] = index[1];
        this.position = position;
    }

    drawHexagon() 
    {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            ctx.lineTo(this.position[0] + r * Math.cos(a * i), this.position[1] + r * Math.sin(a * i));
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

function init() {
createGrid(500, canvas.height);
}
init();
function createGrid(width, height) {
    for (let y = r; y + r * Math.sin(a) < height; y += r * Math.sin(a)) {
        for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < width; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {                    
            const hexagon = new Hexagon(vec2,[x, y]);
            hexagons.push(hexagon);
            vec2[0] += 1;
        }
        vec2[1] +=1;
        vec2[0] = 0;
    }
    update();
}

var fps = 60;
var now;
var then = Date.now();
var interval = 3000/fps;
var delta;

function update()
{
    requestAnimationFrame(update);

    now = Date.now();
    delta = now - then;
    // Do updates and drawing
    if (delta > interval) 
    {
        ctx.fillStyle = '#FFF';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        then = now - (delta % interval);
    }
    for(let i = 0; i < hexagons.length; i++)
    {
        if(hexagons[i].index[0] == myIndex[0] && hexagons[i].index[1] == myIndex[1])
        {
            ctx.fillStyle = "#000"
        }
        else
        {
            ctx.fillStyle = "#FFF"
        }
        hexagons[i].drawHexagon();
    }
}

window.addEventListener('keydown', function(event)
{
    event.preventDefault();
    // Go back one step
    if (event.isComposing || event.keyCode === 37) {
        if(myIndex[0] > 0)
        {
            myIndex[0] -= 1;
            console.log(myIndex);
        }
    }
    // Go up one step
    if (event.isComposing || event.keyCode === 38) {
        if(myIndex[1] > 0)
        {
            myIndex[1] -= 1;
        }
        console.log(myIndex);
    }
    // Go forward one step
    if (event.isComposing || event.keyCode === 39) {
        if(myIndex[0] < (canvas.height/100) - 1)
        {
            myIndex[0] += 1;
        }
        console.log(myIndex);
    }
    // Go down one step
    if (event.isComposing || event.keyCode === 40) {
        if(myIndex[1] < (canvas.width/100) - 1)
        {
            myIndex[1] += 1;
        }
        console.log(myIndex);
    }
    console.log(hexagons[myIndex[1] * 5 + myIndex[0]].position);
    //console.log(event.keyCode);
});
let handleMousemove = (event) => {
    mousePosX = event.x;
    mousePosY = event.y;
};