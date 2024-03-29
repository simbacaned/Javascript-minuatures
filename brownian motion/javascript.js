class Vector2D
{
    x;
    y;
    constructor(flt1, flt2)
    {
        if(flt2 == undefined)
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
    static dot(vec1, vec2)
    {
        return (vec1.x * vec2.x) + (vec1.y * vec2.y);
    }
    static magnitude(vec)
    {
        return Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2));
    }
    static normalise(vec)
    {
        let division = this.magnitude(vec);
        return new Vector2D((vec.x/division),(vec.y/division));
    }
    static multiply(vec1, vec2)
    {
        if(vec2 instanceof Vector2D)
        {
            return new Vector2D((vec1.x * vec2.x),(vec1.y * vec2.y));
        }
        else
        {
            return new Vector2D((vec1.x * vec2),(vec1.y * vec2));
        }
    }
    static divide(vec1, vec2)
    {
        if(vec2 instanceof Vector2D)
        {
            return new Vector2D((vec1.x / vec2.x),(vec1.y / vec2.y));
        }
        else
        {
            return new Vector2D((vec1.x / vec2),(vec1.y / vec2));
        }
    }
}
class Particle
{
    constructor(_size)
    {
        this.size = _size;
        this.position = new Vector2D();
        this.direction = new Vector2D();
        this.direction.x = ((Math.random() * 200)/100) - 1;
        this.direction.y = ((Math.random() * 200)/100) - 1;
        this.magnitude = Vector2D.magnitude(this.direction);
        // * 100 allows for extremely small starting screen size without any problems
        this.position.x = Math.floor(Math.random() * 100 * window.innerWidth / currentScale.x);
        this.position.y = Math.floor(Math.random() * 100 * window.innerHeight * heightScale / currentScale.y);
        this.position.x /= 100;
        this.position.y /= 100;
    }
    update()
    {
        this.position.x += this.direction.x ;
        this.position.y += this.direction.y ;
        if(this.position.x > window.innerWidth / currentScale.x || this.position.x < 0)
        {
            this.direction.x = -this.direction.x;
        }
        if(this.position.y > window.innerHeight * heightScale / currentScale.y || this.position.y < 0)
        {
            this.direction.y = -this.direction.y;
        }
    }
    draw(ctx, alpha)
    {
        ctx.beginPath();
        ctx.strokeStyle = "#FFFFFF";
        ctx.globalAlpha = alpha;
        ctx.arc(this.position.x * currentScale.x, this.position.y * currentScale.y, this.size, 0, 2 * Math.PI, true);
        ctx.stroke();
    }
}
class Layer
{
    constructor(_alpha, _size)
    {
        this.alpha = _alpha;
        this.particles = [];
        this.size = _size;
        for(let i = 0; i < 300; i++)
        {
            this.particles.push(new Particle(_size));
        }
    }
    update()
    {
        for(let i = 0; i < this.particles.length; i++)
        {
            for(let j = 0; j < this.particles.length; j++)
            {
                if(i != j)
                {
                    let distance = Math.sqrt(Math.pow(this.particles[i].position.x - this.particles[j].position.x, 2) + Math.pow(this.particles[i].position.y - this.particles[j].position.y, 2));
                    if(distance < this.size * 2)
                    {
                        let iTojVec = new Vector2D();
                        iTojVec = Vector2D.normalise(new Vector2D((this.particles[i].position.x - this.particles[j].position.x),(this.particles[i].position.y - this.particles[j].position.y)));
                        let iTojVecPerp = new Vector2D((iTojVec.x),(-iTojVec.y))
                        let normalisedDir = Vector2D.normalise(this.particles[i].direction);
                        let cosTheta = Vector2D.dot(normalisedDir, iTojVec);
                        let sinTheta = Math.sin(Math.acos(cosTheta));
                        this.particles[i].direction = Vector2D.multiply(iTojVecPerp, cosTheta);
                        console.log(sinTheta)

                    }
                }
            }
            this.particles[i].update();
        }
    }
    draw(ctx)
    {
        for(let i = 0; i < this.particles.length; i++)
        {
            this.particles[i].draw(ctx, this.alpha);
        }
    }
}
class LayerStack
{
    constructor()
    {
        this.layers = [];
        this.layers.push(new Layer(1, 4));
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
var interval = 1000/fps;
var delta;
var context;
var canvas;
var heightScale = 1;
var currentScale = new Vector2D();

function createContext() 
{
    canvas = document.getElementById("myCanvas");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight * heightScale;
    currentScale.x = 1920 / window.innerWidth;
    currentScale.y = 977 / window.innerHeight;
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
        context.clearRect(0,0,canvas.width,canvas.height);
        scene.draw(context);
        then = now - (delta % interval);
    }
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