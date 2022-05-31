class Sprite{

    constructor ({position, imgSrc, scale = 1, framesMax = 1, offset={x:0,y:0}}){
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.img = new Image();
        this.img.src = imgSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.frameElapsed = 0;
        this.framesHold = 10; //lower val = faster animation loop
        this.offset = offset;
    }

    render(){
        cons.drawImage(
            this.img,
            this.framesCurrent * (this.img.width / this.framesMax),
            0,
            this.img.width / this.framesMax,
            this.img.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.img.width / this.framesMax) * this.scale,
            this.img.height * this.scale
        );
    }

    animate(){
        this.frameElapsed++
        if(this.frameElapsed % this.framesHold === 0){
            if(this.framesCurrent < this.framesMax - 1){
                this.framesCurrent++;
            }
            else{
                this.framesCurrent = 0;
            }
        }
    }

    update(){
         this.render();
         this.animate();
    }
}


class Actor extends Sprite{

    constructor ({position, velocity, offset={x:0,y:0}, imgSrc, scale = 1, framesMax = 1, sprites, attackBox = {offset:{}, width: undefined, height: undefined}}){
        super({position, imgSrc, scale, framesMax, offset});
        this.velocity = velocity
        this.health = 100;
        this.width = 50;
        this.height = 150;
        this.lastIn;
        this.attackBox = {position: {x:this.position.x, y:this.position.y},offset:attackBox.offset, width: attackBox.width, height: attackBox.height}
        this.isAttacking;
        this.framesCurrent = 0;
        this.frameElapsed = 0;
        this.framesHold = 5; //lower val = faster animation loop
        this.sprites = sprites
        this.dead = false;
        for (const sprite in sprites){
            sprites[sprite].img = new Image();
            sprites[sprite].img.src = sprites[sprite].imgSrc;
        }
    }

    update(){
         this.render();
        if(!this.dead){
            this.animate();
        }
         this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
         this.attackBox.position.y = this.position.y + this.attackBox.offset.y;;
        
        //attackbox testing
        cons.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);

         this.position.x += this.velocity.x
         this.position.y += this.velocity.y;
         if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0;
            this.position.y = 426;
         }
         else{
            this.velocity.y += gravity;
         }
    }

    attack(){
        this.switchSprite('attack1');
        this.isAttacking = true;
        setTimeout(()=>{
            this.isAttacking = false;
        }, 100);
    }

    switchSprite(sprite){
        if(this.img === this.sprites.death.img){
            if(this.framesCurrent === this.sprites.death.framesMax==1){
                this.dead = true;
                return
            }
        }
        if(this.img === this.sprites.attack1.img && this.framesCurrent < this.sprites.attack1.framesMax-1){
            return
        }
        switch(sprite){
            case 'idle':
                if(this.img !== this.sprites.idle.img){
                    this.img = this.sprites.idle.img;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'run':
                if(this.img !== this.sprites.run.img){
                    this.img = this.sprites.run.img;
                    this.framesMax = this.sprites.run.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'jump':
                if(this.img !== this.sprites.jump.img){
                    this.img = this.sprites.jump.img;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'fall':
                if(this.img !== this.sprites.fall.img){
                    this.img = this.sprites.fall.img;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'attack1':
                if(this.img !== this.sprites.attack1.img){
                    this.img = this.sprites.attack1.img;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'death':
                if(this.img !== this.sprites.death.img){
                    this.img = this.sprites.death.img;
                    this.framesMax = this.sprites.death.framesMax;
                    this.framesCurrent = 0;
                }
                break
        }
    }
}