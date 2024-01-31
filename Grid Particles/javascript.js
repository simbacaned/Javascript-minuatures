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
    divide(int)
    {
        return new Vector2D(this.x/int, this.y/int);
    }
}
class Parameter
{
    constructor()
    {
        // Distance from edge, Distance from nearest particle, Time Alive
        this.attribs = [[0,0],[1,0],[2,0]];
        var arr = [];
        while(arr.length < 2){
            var r = Math.floor(Math.random() * 3);
            if(arr.indexOf(r) === -1) arr.push(r);
        }
        for(var i = 0; i < 3; i++)
        {
            if(arr.includes(i))
            {
                this.attribs[i][1] = Math.floor(Math.random() * (256)) / 255;
            }
        }
    }

    update(position, time)
    {

    }
}
class Action
{
    constructor()
    {
        //                  up                 down                left                right
        this.actions = [new Vector2D(0,1), new Vector2D(0,-1), new Vector2D(-1,0), new Vector2D(1,0)];
        this.forwards = new Vector2D(0);
        this.randomMovement = new Vector2D(0);
    }
}
class Connection
{
    constructor(parameter, arr)
    {
        this.actions = arr;
        this.parameter = parameter;
        this.strength = Math.floor(Math.random() * 100)/100;
    }
}
class Gene
{
    constructor()
    {
        this.connections = [];
    }
}
class Colour
{
    constructor(flt1, flt2, flt3, flt4)
    {
        if(flt1 == null)
        {
            this.r = Math.floor(Math.random() * (256));
            this.g = 100;
            this.b = Math.floor(Math.random() * (256));
            this.a = 255;
        }
        else
        {
            if(flt1 > 1)
            {
                this.r = flt1;
                this.g = flt2;
                this.b = flt3;
                if(flt4 == null)
                {
                    flt4 = 255;
                }
                this.a = flt4;
            }
            else
            {
                this.r = flt1 * 255;
                this.g = flt2 * 255;
                this.b = flt3 * 255;
                if(flt4 == null)
                {
                    flt4 = 1;
                }
                this.a = flt4 * 255;
            }
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

class Particle
{
    constructor(index)
    {
        this.param = new Parameter();
        this.colour = new Colour(this.param.attribs[0][1], this.param.attribs[1][1], this.param.attribs[2][1]);
        this.myAction = new Action();
        this.addConnections();
        this.position = getPosition();
        this.index = index;
        this.positions = [];
    }
    update()
    {
        this.param.update();
        if(!pause && this.positions.length < 201)
        {
            this.doMovement();
        }
        else
        {
            if(goForward && this.positions.length < 201)
            {
                this.doMovement();
            }
            if(goBack && this.positions.length > 0)
            {
                this.position = this.positions.pop();
                takenGrid[this.index] = new Vector2D(this.position.x, this.position.y).divide(5);
            }
        }
    }
    draw(ctx)
    {
        ctx.fillStyle = this.colour.getColour();
        ctx.beginPath();
        ctx.arc(this.position.x + 3, this.position.y + 3, 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    doMovement()
    {
        if(this.colour.r > 0.5 && this.position.x < 400 && this.checkMovement(1,0))
        {
            this.position.x += 5;
        }
        this.positions.push(new Vector2D(this.position.x, this.position.y));
    }

    checkMovement(x, y)
    {
        var match = false;
        for (var i = 0; i < takenGrid.length; i++)
        {
            if((this.position.x / 5) + x == takenGrid[i].x && (this.position.y / 5) + y == takenGrid[i].y)
            {
                match = true;
                break;
            }
        }
        if(!match)
        {
            return true;
        }
        return false;
    }

    addConnections()
    {
        var arr = [];
        for(var i = 0; i < 2; i++)
        {
            var r = Math.floor(Math.random() * 4);
            if(!arr.includes(r))
            {
                arr.push(r);
            }
        }
        this.connection = new Connection(this.param.attribs[0][1], arr);
        console.log(this.connection);
    }
}

class Layer
{
    constructor()
    {

    }
    update()
    {

    }
    draw(ctx)
    {    

    }
}

class ParticleLayer extends Layer
{
    constructor()
    {
        super();
        this.createParticles();
    }
    update()
    {
        if(doReset)
        {
            reset();
            this.createParticles();
        }
        this.updateParticles();
        goForward = false;
        goBack = false;
    }
    draw(ctx)
    {
        this.particles.forEach(function(particle)
        {
            particle.draw(ctx);
        });
    }
    createParticles()
    {
        this.particles = [];
        for (var i = 0; i < 1000; i++)
        { 
            var particle = new Particle(i);
            this.particles.push(particle);
        }
    }
    updateParticles()
    {
        for (var i = 0; i < 1000; i++)
        { 
            this.particles[i].update();
        }
    }
} 

class GridLayer extends Layer
{
    constructor()
    {
        super();
    }
    draw(ctx)
    {
        if(doGrid)
        {
            drawGrid(ctx);
        }
    }
} 

class LayerStack
{
    constructor()
    {
        this.layers = [];
        this.particleLayer = new ParticleLayer();
        this.gridLayer = new GridLayer();
        this.layers.push(this.particleLayer);
        this.layers.push(this.gridLayer);
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
var interval = 3000/fps;
var delta;
var context;
var canvas;
var heightScale = 8;
var currentScale = new Vector2D();
var doGrid = false;
var doReset = false;
var pause = true;
var goBack = false;
var goForward = false;
var takenGrid = [];

function createContext() 
{
    canvas = document.getElementById("myCanvas");
    canvas.width  = 641;
    canvas.height = 641;
    currentScale.x = 640 / window.innerWidth;
    currentScale.y = 640 / window.innerHeight;
    context = canvas.getContext("2d");
    context.clearRect(0,0,canvas.width,canvas.height);
    createScene();
}

function createScene()
{
    scene = new Scene();
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
        context.fillStyle = '#FFF';
        context.fillRect(0,0,canvas.width,canvas.height);
        scene.draw(context);
        then = now - (delta % interval);
    }
}

function drawGrid(ctx)
{                

    ctx.fillStyle = '#777';
    for (var i = 0; i < 129; i++)
    {
        ctx.fillRect(0, 5 * i, canvas.width, 1);
        ctx.fillRect(5 * i, 0, 1, canvas.height);
    }
}

function reset()
{
    takenGrid = [];
    doReset = false;
}

function getPosition()
{
    var x = Math.floor(Math.random() * (129)) * 5;
    var y = Math.floor(Math.random() * (129)) * 5;
    var myVec = new Vector2D(x,y);
    var match = false;
    if(takenGrid.length < 1)
    {
        takenGrid.push(myVec.divide(5));
        return myVec;
    }
    else
    {
        for (var i = 0; i < takenGrid.length; i++)
        {
            if(x == takenGrid[i].x && y == takenGrid[i].y)
            {
                match = true;
                break;
            }
        }
        if(match)
        {
            return getPosition();
        }
        else
        {
            takenGrid.push(myVec.divide(5));
            return myVec;
        }
    }
}

window.addEventListener('resize', function(event)
{

    canvas.width  = 641;
    canvas.height = 641;
});

window.addEventListener('keydown', function(event)
{
    event.preventDefault();
    if (event.isComposing || event.keyCode === 71) {
        doGrid = !doGrid;
    }
    if (event.isComposing || event.keyCode === 82) {
        doReset = true;
    }
    if (event.isComposing || event.keyCode === 32) {
        pause = !pause;
    }
    // Go back one step
    if (event.isComposing || event.keyCode === 37) {
        goBack = true;
    }
    // Go forward one step
    if (event.isComposing || event.keyCode === 39) {
        goForward = true;
    }
    //console.log(event.keyCode);
});

createContext();