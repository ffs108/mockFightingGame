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

//background
const bg = new Sprite({position:{x:0, y:0}, imgSrc:'img/background.png'});
const bgLayer2 = new Sprite({position:{x:0, y:150}, imgSrc:'img/layer_2.png'});
const floor = new Sprite({position:{x:0, y:480}, imgSrc:'img/floor.png'});

//player 1 object creation
const player = new Actor({
    position:{x:0, y:0},
    velocity:{x:0,y:0}, 
    offset:{x:150,y:190}, 
    imgSrc: './img/huntress/Sprites/Idle.png',
    scale: 3.5,
    framesMax: 8,
    sprites:{
        idle:{imgSrc:'./img/huntress/Sprites/Idle.png', framesMax:8},
        run: {imgSrc:'./img/huntress/Sprites/Run.png', framesMax:8},
        jump: {imgSrc:'./img/huntress/Sprites/Jump.png', framesMax:2},
        fall: {imgSrc:'./img/huntress/Sprites/Fall.png', framesMax:2},
        attack1: {imgSrc:'./img/huntress/Sprites/Attack1.png', framesMax:5},
        death: {imgSrc:'./img/huntress/Sprites/Death.png', framesMax:8}
    },
    attackBox:{
        offset:{x:150, y:50},
        width: 145,
        height: 50
    }
});

//player 2 object creation
const enemy = new Actor({
    position:{x:950, y:0}, 
    velocity:{x:0,y:0},
    offset:{x:270,y:192},
    imgSrc: './img/evilWizard/Sprites/Idle.png',
    scale: 3.5,
    framesMax: 8,
    sprites:{
        idle:{imgSrc:'./img/evilWizard/Sprites/Idle.png', framesMax:8},
        run: {imgSrc:'./img/evilWizard/Sprites/Run.png', framesMax:8},
        jump: {imgSrc:'./img/evilWizard/Sprites/Jump.png', framesMax:4},
        fall: {imgSrc:'./img/evilWizard/Sprites/Fall.png', framesMax:5},
        attack1: {imgSrc:'./img/evilWizard/Sprites/Attack1.png', framesMax:8},
        death: {imgSrc:'./img/evilWizard/Sprites/Fall.png', framesMax:5}
    },
    attackBox:{
        offset:{x:-240, y:50},
        width: 145,
        height: 50
    }
});

const inputs = {
    right:{pressed: false},
    left:{pressed: false}, 
    up:{pressed: false},
    d:{pressed: false}, 
    a:{pressed: false}, 
    w:{pressed: false}
};


timeDown();


/*
Updates background layers and player models onto the canvas
for a visual representation as well as changes the image src
for each input
*/
function animate(){
    window.requestAnimationFrame(animate);
    cons.fillStyle = 'black';
    cons.fillRect(0, 0, canvas.width, canvas.height);
    bg.update();
    bgLayer2.update();
    floor.update();
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;
    
    //player movement and animation
    player.switchSprite('idle');
    if(inputs.right.pressed && player.lastIn === 'ArrowRight'){
        player.velocity.x = 3;
        player.switchSprite('run');
    }
    else if(inputs.left.pressed  && player.lastIn === 'ArrowLeft'){
        player.velocity.x = -3;
        player.switchSprite('run');
    }
    else if(inputs.up.pressed  && player.lastIn === 'ArrowUp'){
        player.velocity.y = -3;
    }
    else{
        player.switchSprite('idle');
    }

    if(player.velocity.y < 0){
        player.switchSprite('jump');
    }
    else if(player.velocity.y > 0){
        player.switchSprite('fall');
    }


    //enemy movement and animation
    enemy.switchSprite('idle');
    if(inputs.d.pressed && enemy.lastIn === 'd'){
        enemy.velocity.x = 3;
        enemy.switchSprite('run');
    }
    else if(inputs.a.pressed  && enemy.lastIn === 'a'){
        enemy.velocity.x = -3;
        enemy.switchSprite('run');
    }
    else if(inputs.w.pressed  && enemy.lastIn === 'w'){
        enemy.velocity.y = -3;
    }
    else{
        enemy.switchSprite('idle');
    }

    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump');
    }
    else if(enemy.velocity.y > 0){
        enemy.switchSprite('fall');
    }

    //hitbox detection
    if(rectCollision({rect1:player, rect2:enemy}) && player.isAttacking){
        player.isAttacking = false;
        enemy.health -= 10;
        document.querySelector('#eHealth').style.width = enemy.health + "%";
        console.log('hit');
        if(enemy.health <= 0){
            enemy.switchSprite('death');
        }
    }
    if(rectCollision({rect1:enemy, rect2:player}) && enemy.isAttacking){
        enemy.isAttacking = false;
        player.health -= 10;
        document.querySelector('#pHealth').style.width = player.health + "%";
        console.log('hit');
        if(player.health <= 0){
            console.log('here')
            player.switchSprite('death');
        }
    }
    //ending game based on health
    if(enemy.health <= 0 || player.health <= 0){
        gameStatusCheck({player, enemy, timerID});
    }
}
animate();



/*
dynamically listen to button press for control of player model
*/
window.addEventListener('keydown', (event)=>{
    if(!player.dead){
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
        }
    }
    if(!enemy.dead){
        switch(event.key){
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
    }
});

/*
added to the stop the infitite movement caused from only having an input record
*/
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