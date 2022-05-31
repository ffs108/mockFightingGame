//timer rundown
function timeDown(){
    if(timer > 0){
        timerID = setTimeout(timeDown, 1000);
        timer--;
        document.getElementById('timer').innerHTML = timer;
    }
    if(timer === 0){
        gameStatusCheck({player, enemy, timerID});
    }
}


//hitbox collision logic check
function rectCollision({rect1, rect2}){
    return (
        rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
        rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
        rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
        rect1.attackBox.position.y <= rect2.position.y + rect2.height
    )
}

function gameStatusCheck({player, enemy, timerID}){
    clearTimeout(timerID);
    overlay = document.getElementById('result');
    overlay.style.display = 'flex'; overlay.style.backgroundColor = '#ffffff';
    overlay.style.opacity = 0.5; overlay.style.fontWeight = 'bold';
    overlay.style.fontSize = '28px';
    if(player.health <= 0 && enemy.health <=0){
        overlay.innerHTML = 'DOUBLE KO';
    }
    if(player.health === enemy.health){
        overlay.innerHTML = 'TIE';
    }
    else if(player.health > enemy.health){
        overlay.innerHTML = 'THE HUNTRESS WINS \n<br>';
        if(player.health === 100){
            overlay.innerHTML += '<br><small>--FLAWLESS VICTORY--</small>'
        }
    }
    else {
        overlay.innerHTML = 'THE PYROMANCER WINS<br>';
        if(enemy.health === 100){
            overlay.innerHTML += '<br><small>--FLAWLESS VICTORY--</small>'
        }
    }
}

