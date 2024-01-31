class Vector2D
        {
            x;
            y;
            constructor(flt)
            {
                this.x = flt;
                this.y = flt;
            }
        }

        class Particle
        {
            constructor()
            {
                this.position = new Vector2D();
                // * 100 allows for extremely small starting screen size without any problems
                this.position.x = Math.floor(Math.random() * 100 * window.innerWidth / currentScale.x);
                this.position.y = Math.floor(Math.random() * 100 * window.innerHeight * heightScale / currentScale.y);
                this.position.x /= 100;
                this.position.y /= 100;
            }
            update(direction, speed)
            {
                this.position.x += direction.x * speed ;
                this.position.y += direction.y * speed;
                if(this.position.x > window.innerWidth / currentScale.x)
                {
                    this.position.x = 0;
                }
                if(this.position.y > window.innerHeight * heightScale / currentScale.y)
                {
                    this.position.y = 0;
                }
            }
            draw(ctx, size, alpha)
            {
                ctx.beginPath();
                ctx.strokeStyle = "#FFFFFF";
                ctx.globalAlpha = alpha;
                ctx.rect(this.position.x * currentScale.x, this.position.y * currentScale.y, size, size);
                ctx.stroke();
            }
        }
        
        class Layer
        {
            constructor(_alpha, _speed, _size)
            {
                this.alpha = _alpha;
                this.speed = _speed;
                this.size = _size;
                this.particles = [];
                for(let i = 0; i < 1300; i++)
                {
                    this.particles.push(new Particle());
                }
            }
            update(direction)
            {
                for(let i = 0; i < this.particles.length; i++)
                {
                    this.particles[i].update(direction, this.speed);
                }
            }
            draw(ctx)
            {
                for(let i = 0; i < this.particles.length; i++)
                {
                    this.particles[i].draw(ctx, this.size, this.alpha);
                }
            }
        }

        class LayerStack
        {
            constructor()
            {
                this.layers = [];
                this.layers.push(new Layer(1, 4, 1));
                this.layers.push(new Layer(0.8, 2.8, 0.7));
                this.layers.push(new Layer(0.6, 1.6, 0.4));
            }
            update(direction)
            {
                this.layers.forEach(function(layer)
                {
                    layer.update(direction);
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
            update(direction)
            {
                this.layerstack.update(direction);
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
        var heightScale = 8;
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
                scene.update(direction);
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
