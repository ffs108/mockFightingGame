/*
    Canvas Mani
*/
const canvas = document.getElementById('gameScreen');
const cons = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

cons.fillRect(0, 0, canvas.width, canvas.height);
var timer = 91;
var timerID;



/*
    player objects and character movement
*/
const gravity = 0.25;
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

    constructor ({position, imgSrc}){
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.img = new Image();
        this.img.src = imgSrc;
    }

    draw(){
        cons.drawImage(this.img, this.position.x, this.position.y);
    }

    update(){
         this.draw();
    }
}

const bg = new Sprite({position:{x:0, y:0}, imgSrc:'img/background.png'});
const floor = new Sprite({position:{x:100, y:100}, imgSrc:'img/floor.png'});
const player = new Actor({position:{x:0, y:0}, velocity:{x:0,y:0}, color:'red', offset:{x:0,y:-50}});
const enemy = new Actor({position:{x:950, y:0}, velocity:{x:0,y:0}, color:'orange', offset:{x:-50,y:0}});

const inputs = {
    right:{pressed: false},
    left:{pressed: false}, 
    up:{pressed: false},
    d:{pressed: false}, 
    a:{pressed: false}, 
    w:{pressed: false}
};


timeDown()



function animate(){
    window.requestAnimationFrame(animate);
    cons.fillStyle = 'black';
    cons.fillRect(0, 0, canvas.width, canvas.height);
    bg.update();
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;
    //player movement
    if(inputs.right.pressed && player.lastIn === 'ArrowRight'){
        player.velocity.x = 3;
    }
    else if(inputs.left.pressed  && player.lastIn === 'ArrowLeft'){
        player.velocity.x = -3;
    }
    else if(inputs.up.pressed  && player.lastIn === 'ArrowUp'){
        player.velocity.y = -3;
    }
    //enemy movement
    if(inputs.d.pressed && enemy.lastIn === 'd'){
        enemy.velocity.x = 3;
    }
    else if(inputs.a.pressed  && enemy.lastIn === 'a'){
        enemy.velocity.x = -3;
    }
    else if(inputs.w.pressed  && enemy.lastIn === 'w'){
        enemy.velocity.y = -3;
    }

    //hitbox detection
    if(rectCollision({rect1:player, rect2:enemy}) && player.isAttacking){
        player.isAttacking = false;
        enemy.health -= 10;
        document.querySelector('#eHealth').style.width = enemy.health + "%";
        console.log('hit');
    }
    if(rectCollision({rect1:enemy, rect2:player}) && enemy.isAttacking){
        enemy.isAttacking = false;
        player.health -= 10;
        document.querySelector('#pHealth').style.width = player.health + "%";
        console.log('hit');
    }
    //ending game based on health
    if(enemy.health <= 0 || player.health <= 0){
        gameStatusCheck({player, enemy, timerID});
    }
}
animate();

window.addEventListener('keydown', (event)=>{
    switch(event.key){
        case 'ArrowRight':
            inputs.right.pressed = true;
            player.lastIn = 'ArrowRight';
            break;
        case 'ArrowLeft':
            inputs.left.pressed = true;
            player.lastIn = 'ArrowLeft';
            break;
        case 'ArrowUp':
            player.velocity.y = -10;
            inputs.up.pressed = true;
            break;
        case '0':
            player.attack();
            break
        case 'd':
            inputs.d.pressed = true;
            enemy.lastIn = 'd';
            break;
        case 'a':
            inputs.a.pressed = true;
            enemy.lastIn = 'a';
            break;
        case 'w':
            enemy.velocity.y = -10;
            inputs.w.pressed = true;
            break;
        case ' ':
            enemy.attack();
            break
    }
});

window.addEventListener('keyup', (event)=>{
    switch(event.key){
        case 'ArrowRight':
            inputs.right.pressed = false;
            break;
        case 'ArrowLeft':
            inputs.left.pressed = false;
            break;
        case 'ArrowUp':
            inputs.up.pressed = false;
        break
    }
    switch(event.key){
        case 'd':
            inputs.d.pressed = false;
            break;
        case 'a':
            inputs.a.pressed = false;
            break;
        case 'w':
            inputs.w.pressed = false;
        break
    }
});