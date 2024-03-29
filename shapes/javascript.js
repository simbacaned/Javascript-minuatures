"use strict";
let canvas;
let context;
let myShapes = [];
var prevTimeStamp = 0;

window.onload = init;

class Transform2d
{
    constructor()
    {
        this.x = 0;
        this.y= 0;
        this.width= 0;
        this.height= 0;
    }
}

class Shape
{
    constructor()
    {
        this.transform = new Transform2d;
        this.sprite = new Image();
        this.myAlpha = 1;
    }
    draw(context)
    {
        context.drawImage(this.transform.x - this.transform.width/2, this.transform.y - this.transform.height/2, this.transform.width, this.transform.height);
    }
    draw(context)
    {
        context.globalAlpha = this.myAlpha;
        context.drawImage(this.sprite, this.transform.x - this.transform.width/2, this.transform.y - this.transform.height/2, this.transform.width, this.transform.height);
    }
}

class Circle extends Shape
{
    constructor(x, y, width, height, alpha, sprite)
    {
        super(sprite);
        this.sprite.onload = function() {}
        this.sprite.src = 'red circle.png';
        this.transform.x = x;
        this.transform.y = y;
        this.transform.width = width;
        this.transform.height = height;
        this.myAlpha = alpha;
    }
}

class Rect extends Shape
{
    constructor(x, y, width, height, alpha, sprite)
    {
        super(sprite);
        this.sprite.onload = function() {}
        this.sprite.src = 'Red Square.png';
        this.transform.x = x;
        this.transform.y = y;
        this.transform.width = width;
        this.transform.height = height;
        this.myAlpha = alpha;
    }
}


function init(){

    canvas = document.getElementById("myCanvas");
    context = canvas.getContext("2d");

    createShapes();

    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp){
    var timestep = timeStamp - prevTimeStamp;
    var currentShape = myShapes[0];
    currentShape.transform.height+=timestep/10;
    currentShape.transform.width+=timestep/10;
    currentShape.myAlpha -= timestep/1000;
    if(currentShape.myAlpha < 0)
    {
        currentShape.myAlpha = 0.9;
        currentShape.transform.height = 100;
        currentShape.transform.width = 100;
    }
    draw();
    prevTimeStamp = timeStamp;
    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function draw(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    myShapes.forEach(element => {
        element.draw(context);
    });
}


function createShapes()
{
    let myCircle = new Circle(250, 250, 100, 100, 0.9);
    let myCircle2 = new Circle(250, 250, 100, 100, 1);

    myShapes.push(myCircle);
    myShapes.push(myCircle2);
}
