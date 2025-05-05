import { hero, villain } from './Combatant.js'
import { sceneBackground, storefront } from './Character.js';
import { loadKeyDownEvents, loadkeyUpEvents } from './Keys.js'

const gameCanvas = document.querySelector('canvas');
const ctx = gameCanvas.getContext('2d');
let timer = 30;
let timerID;
let gameEnded = false;

loadKeyDownEvents(hero, villain);
loadkeyUpEvents(hero, villain);

const onePlayer = document.getElementById('1hero');
const twoPlayers = document.getElementById('2heros');
onePlayer.addEventListener("click", () => {
    intervalBot();
    startGame();
});
twoPlayers.addEventListener("click", () => {
    startGame();
});

function startGame() {
    document.getElementById('menu').style.display = "none";
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    setTimeout(() => {
    animate();
    decreaseTimer();
    document.getElementById('hud').style.display = "flex";
    }, 1000)
}

function decreaseTimer() {
    if (timer > 0) {
        timerID = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    } else {
        determineWinner({ hero, villain, timerID });
    }
}

function animate() {
    window.requestAnimationFrame(animate);
    sceneBackground.update();
    storefront.update();
    update(hero);
    update(villain);
    hero.speed.x = 0;
    villain.speed.x = 0;

    if (!hero.handleMovement() && !hero.isStriking && !hero.isHurt) {
        hero.changeAnimation('idle');
    }

    if (!villain.handleMovement() && !villain.isStriking && !villain.isHurt) {
        villain.changeAnimation('idle')
    }

    hero.strike(villain);
    villain.strike(hero);

    if (!gameEnded) {
        if (villain.health <= 0 || hero.health <= 0) {
            determineWinner({ hero, villain, timerID });
        }
    }
}

function intervalBot() {
    setInterval(botMoves, 1000);
    setInterval(botAttack, 1000);
}

function botMoves() {
    let randomFloat = Math.random();
    if (randomFloat < 0.45) {
        window.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'ArrowLeft' }))
        setTimeout(() => {
            window.dispatchEvent(new KeyboardEvent('keyup', { 'key': 'ArrowLeft' }))
        }, randomFloat * 3000)
    } else if (randomFloat < 0.85) {
        window.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'ArrowRight' }))
        setTimeout(() => {
            window.dispatchEvent(new KeyboardEvent('keyup', { 'key': 'ArrowRight' }))
        }, randomFloat * 3000)
    }
}

function botAttack() {
    if (villain.canStrike && villain.hasHit(hero)) {
        villain.isStriking = true;
        villain.strike(hero);
        setTimeout(() => { villain.isStriking = false; }, 1000)
    }
}

function update(fighter) {
    if (fighter.health > 0) {
        fighter.update();
    } else {
        fighter.animateFrames()
        fighter.draw();
    }
}

function determineWinner({ hero, villain, timerID }) {
    clearTimeout(timerID);
    gameEnded = true;
    document.querySelector('#result').style.display = 'flex'
    if (hero.health === villain.health) {
        document.querySelector('#result').innerHTML = 'Tie!';
    } else if (hero.health > villain.health) {
        document.querySelector('#result').innerHTML = 'Player 1 won!';
        villain.health = 0;
        villain.changeAnimation('death');
    } else {
        document.querySelector('#result').innerHTML = 'Player 2 won!';
        hero.health = 0;
        hero.changeAnimation('death');
    }
}