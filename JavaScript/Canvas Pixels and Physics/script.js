


window.addEventListener ('load', function(){
    const canvasElement = document.getElementById('canvas1');
    const canvasContext = canvasElement.getContext('2d');
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;

   
    class Particle {
        constructor(effects, x, y, color){
            this.effect = effect;
            this.x = Math.random () * this.effect.width;
            this.y = Math.random () * this.effect.height;
            this.originX = Math.floor(x);
            this.originY = Math.floor(y);
            this.color = color;
            this.size = this.effect.gap;
            this.vx = 1;
            this.vy = 1;
            this.ease = 0.5;
            this.dx = 1;
            this.dy = 1;
            this.force = 2;
            this.angle = 0;
            this.friction = 0.95;

        } 
        draw(particleShape){
            particleShape.fillStyle = this.color;
            particleShape.fillRect(this.x, this.y, this.size, this.size);

        }   
        updateParticles(){
            this.dx = this.effect.mouse.x - this.x;
            this.dy = this.effect.mouse.y - this.y;
            this.distance = this.dx * this.dx + this.dy * this.dy;
            this.force = -this.effect.mouse.radius / this.distance;

            if (this.distance < this.effect.mouse.radius){
                this.angle = Math.atan2(this.dy, this.dx);
                this.vx += this.force * Math.cos(this.angle);
                this.vy += this.force * Math.sin(this.angle);
            }

            this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
            this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
        }
        warp(){
        this.x = Math.random() * this.effect.width; 
        this.y = Math.random() * this.effect.width; 
        this.ease = 0.06;
        }

    }
    class Effects {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.particlesArray = [];
            this.image1 = document.getElementById ('benderImage');
            this.image2 = document.getElementById ('kameImage');
            this.centerX = this.width * 0.5;
            this.centerY = this.height * 0.5;
            this.x = this.centerX - this.image1.width * 0.5;
            this.y = this.centerY - this.image1.height * 0.5;
            this.gap = 2;
            this.mouse = {
                radius: 3000,
                x: undefined,
                y: undefined,
            }
            window.addEventListener('mousemove', event => {
                this.mouse.x = event.x;
                this.mouse.y = event.y;
            });
        }
        
        init(particleShape){
            particleShape.drawImage (this.image1, this.x, this.y);
            //particleShape.drawImage (this.image2, this.x, this.y);
            const pixels = canvasContext.getImageData(0, 0, this.width, this.height).data;
            for (let y = 0; y < this.height; y += this.gap){
                for (let x = 0; x < this.width; x += this.gap){
                    const i = (y * this.width + x) * 4;
                    const red   = pixels[i];
                    const green = pixels[i + 1];
                    const blue  = pixels[i + 2];
                    const alpha = pixels[i + 3];
                    const color = 'rgb('+ red + ',' + green + ',' + blue + ')';
                    if (alpha > 0){
                        this.particlesArray.push(new Particle(this, x, y, color));
                    }
                }                
            }
        }
        
        //Este metodo desenha varias particulas
        draw(particleShape){       
            this.particlesArray.forEach (particle => particle.draw (particleShape));
   
        }
        
        updateParticles(){
            this.particlesArray.forEach (particle => particle.updateParticles ());
        }

        warp(){
            this.particlesArray.forEach (particle => particle.warp ());
        }

    }

    const effect = new Effects (canvasElement.width, canvasElement.height)
    effect.init(canvasContext);
    console.log(effect)
 

    animationLoop = () => {
        canvasContext.clearRect (0, 0, canvasElement.width, canvasElement.height);
        effect.draw(canvasContext);
        effect.updateParticles();
        requestAnimationFrame(animationLoop);

    }
    
    animationLoop();


    //Warp button beheavior
    const warpButton = document.getElementById('warpButton');
    
    warpButton.addEventListener('click', function(){
        effect.warp()
    });
    
});