class Colour
{
    constructor(flt1, flt2, flt3, flt4)
    {
        this.r = flt1;
        this.g = flt2;
        this.b = flt3;
        this.a = flt4;
        if(flt4 == null)
        {
            flt4 = 255;
        }
    }
    getColour()
    {

        var newR = Math.floor(this.r).toString(16);
        var newG = Math.floor(this.g).toString(16);
        var newB = Math.floor(this.b).toString(16);
        var newA = Math.floor(this.a).toString(16);

        if(newR.length < 2)
        {
            newR = "0" + newR;
        }
        if(newG.length < 2)
        {
            newG = "0" + newG;
        }
        if(newB.length < 2)
        {
            newB = "0" + newB;
        }
        if(newA.length < 2)
        {
            newA = "0" + newA;
        }
        return ("#" + newR + newG + newB + newA);
    }
}
class Vector2D
{
    x;
    y;
    constructor(flt1, flt2)
    {
        if (flt1 == null)
        {
            this.x = 0;
            this.y = 0;
        }
        else if (flt2 == null)
        {
            this.x = flt1;
            this.y = flt1;
        }
        else
        {
            this.x = flt1;
            this.y = flt2;
        }
    }
}
class TextBox
{
    constructor(text, position)
    {
        this.position = new Vector2D(position.x, position.y);
        this.text = text;
    }
    update(text)
    {
        this.text = text;
    }
    draw(ctx, colour)
    {
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#000';
        ctx.fillRect(this.position.x - 5, this.position.y - 45, 220, 50);
        ctx.fillStyle = colour.getColour();
        ctx.font = "60px monospace";
        ctx.fillText((Math.floor(this.text*100)/100).toFixed(2) + "x", this.position.x, this.position.y);
    }
}
class Button
{
    constructor(position, width)
    {
        this.position = position;
        this.width = width;
    }
    update()
    {

    }
    draw(ctx)
    {
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#F22';
        ctx.fillRect(this.position.x, this.position.y, this.width.x, this.width.y);
    }
    isMouseOver(mousePos)
    {
        if(mousePos.x > this.position.x && mousePos.x < this.position.x + this.width.x && mousePos.y > this.position.y && mousePos.y < this.position.y + this.width.y)
        {
            this.onClick();
        }
    }
    onClick()
    {
        cashOut();
    }
}
class Line
{
    constructor()
    {
        this.position = new Vector2D(52, 748);
        this.colour = new Colour(255, 0, 0, 255);
        this.multiplier = 1;
        this.scalar = 1;
        this.crash = false;
        this.multipliers = [];
        this.timer = 2;
    }
    update()
    {
        if(!this.crash)
        {
            this.position.x += 2;
            this.multiplier *= 1.003;
            this.position.y -= this.multiplier * this.position.x/500;
            this.colour.r = Math.max(255 * (this.position.y - 150) / 600,0)
            this.colour.g = Math.min(255 - this.colour.r,255);
            var seed = Math.random().toString();
            seed = Math.floor(seed.slice(2, 5)/8);
            if (seed == 10)
            {
                console.log("crash");
                this.crash = true;
                console.log(this.multiplier);
                this.multipliers.push(this.multiplier);
            }
        }
        else
        {
            this.timer -= 0.05;
        }
    }
    calculateAverage()
    {
        var accum = 0;
        this.multipliers.forEach(function(multi)
        {
            accum += multi;
        });
        return accum / this.multipliers.length;
    }
    getBelow(flt)
    {
        var noBelow = 0;
        this.multipliers.forEach(function(multi)
        {
            if(multi < flt)
            {
                noBelow += 1;
            }
        });
        console.log("Raw quantity below " + flt + " : " + noBelow + " of " + this.multipliers.length + " results");
        console.log("Percentage of total results " + 100 * noBelow / this.multipliers.length + "%");
        return false;
    }
    draw(ctx)
    {
        if(this.crash)
        {
            if(this.timer < 0)
            {
                createGraph(ctx);
                this.crash = false;
                this.timer = 5;
                this.position = new Vector2D(52, 748);
                this.colour = new Colour(255, 0, 0, 255);
                this.multiplier = 1;
            }
        }
        ctx.beginPath();
        ctx.strokeStyle = this.colour.getColour();
        ctx.rect(this.position.x, this.position.y, 2, 2);
        ctx.rect(this.position.x-1, this.position.y+this.multiplier/2, 2, 2);
        ctx.stroke();  
    }

}

class Layer
{
    constructor()
    {
        this.line = new Line();
        this.textBox = new TextBox("", new Vector2D(750,300));
        this.buttons = []
        this.buttons.push(new Button(new Vector2D(800,600),new Vector2D(100,50)));
    }
    update()
    {
        this.line.update();
        this.textBox.update((this.line.multiplier).toString());
        this.buttons.forEach(function(button)
        {
            button.update();
        });
    }
    draw(ctx)
    {
        this.line.draw(ctx);
        this.textBox.draw(ctx, this.line.colour);
        this.buttons.forEach(function(button)
        {
            button.draw(ctx);
        });
    }
}

class LayerStack
{
    constructor()
    {
        this.layers = [];
        this.layers.push(new Layer());
    }
    update()
    {
        this.layers.forEach(function(layer)
        {
            layer.update();
        });
    }
    draw(ctx)
    {
        
        this.layers.forEach(function(layer)
        {
            layer.draw(ctx);
        });
    }
}

class Scene
{
    layerstack = new LayerStack();
    update()
    {
        this.layerstack.update();
    }
    draw(ctx)
    {
        this.layerstack.draw(ctx);
    }
}

var fps = 60;
var now;
var then = Date.now();
var interval = 300/fps;
var delta;
var context;
var canvas;
var heightScale = 1;
var currentScale = new Vector2D();
var direction = new Vector2D(1.5);

function createContext() 
{
    canvas = document.getElementById("myCanvas");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight * heightScale;
    currentScale.x = 1920 / window.innerWidth;
    currentScale.y = 977 / window.innerHeight;
    direction.x /= Math.pow(currentScale.x,2);
    direction.y /= Math.pow(currentScale.y,2);
    context = canvas.getContext("2d");
    createGraph(context);
    createScene();
}

function createGraph(ctx)
{
    context.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = '#4444FF77';
    ctx.rect(50, 750, 600, 2);
    ctx.rect(50, 150, 2, 600);
    ctx.stroke();  
    ctx.globalAlpha = 1;
}

function createScene()
{
    scene = new Scene();
    context.canvas.addEventListener('mousemove', function(event)
    {
        var mouseX = event.clientX - context.canvas.offsetLeft;
        var mouseY = event.clientY - context.canvas.offsetTop;
    });
    context.canvas.addEventListener('click', function(event)
    {
        var mouseX = event.clientX;
        var mouseY = event.clientY;
        scene.layerstack.layers[0].buttons.forEach(function(button)
        {
            if(button.isMouseOver(new Vector2D (mouseX, mouseY)));
        });
    });
    update();
}

function update()
{
    requestAnimationFrame(update);

    now = Date.now();
    delta = now - then;
    // Do updates and drawing
    if (delta > interval) 
    {
        scene.update();
        //context.clearRect(0,0,canvas.width,canvas.height);
        scene.draw(context);
        then = now - (delta % interval);
    }
}

function cashOut()
{
    scene.layerstack.layers[0].line.crash = true;
}

window.addEventListener('resize', function(event)
{
    scaleVector = new Vector2D();
    scaleVector.x = window.innerWidth / canvas.width
    scaleVector.y = window.innerHeight / canvas.height
    currentScale.x *= scaleVector.x;
    currentScale.y *= scaleVector.y * heightScale;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight * heightScale;
});

createContext();
