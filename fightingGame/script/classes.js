class Actor{

    constructor ({position, velocity, color, offset}){
        this.position = position;
        this.velocity = velocity
        this.color = color;
        this.health = 100;
        this.width = 50;
        this.height = 150;
        this.lastIn;
        this.attackBox = {position: {x:this.position.x, y:this.position.y},offset, width: 100, height: 50}
        this.isAttacking;
    }

    render(){
        cons.fillStyle = this.color;
        cons.fillRect(this.position.x, this.position.y, this.width, this.height);
        //attack testing
        if(this.isAttacking){
        cons.fillStyle = 'blue';
        cons.fillRect(this.attackBox.position.x, this.attackBox.position.y, 
            this.attackBox.width, this.attackBox.height);
        }
    }

    update(){
         this.render();
         this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
         this.attackBox.position.y = this.position.y;
         this.position.x += this.velocity.x
         this.position.y += this.velocity.y;
         if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0;
         }
         else{
            this.velocity.y += gravity;
         }
    }

    attack(){
        this.isAttacking = true;
        setTimeout(()=>{
            this.isAttacking = false;
        }, 100);
    }
}

class Sprite{

    constructor ({position, imgSrc, scale = 1, framesMax = 1}){
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
    }

    draw(){
        cons.drawImage(
            this.img,
            this.framesCurrent * (this.img.width/this.framesMax),
            0,
            this.img.width / this.framesMax,
            this.img.height,
            this.position.x,
            this.position.y,
            (this.img.width / this.framesMax) * this.scale,
            this.img.height * this.scale
        );
    }

    update(){
         this.draw();
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
}