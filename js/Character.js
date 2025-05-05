import Combatant from './Combatant.js'

const gameCanvas = document.querySelector('canvas');
const ctx = gameCanvas.getContext('2d');

class Character {
    constructor({ position, imageSrc, scale = 1, maxFrames = 1, holdFrames = 30, offsetFrame = { x: 0, y: 0 } }) {
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.maxFrames = maxFrames;
        this.currentFrame = 0;
        this.elapsedFrames = 0;
        this.holdFrames = holdFrames;
        this.offsetFrame = offsetFrame;
    }

    draw() {
        ctx.drawImage(this.image, this.currentFrame * (this.image.width / this.maxFrames), 0, this.image.width / this.maxFrames,
            this.image.height, this.position.x - this.offsetFrame.x, this.position.y - this.offsetFrame.y,
            (this.image.width / this.maxFrames) * this.scale, this.image.height * this.scale);
    }

    animateFrames() {
        this.elapsedFrames++;
        if (this.elapsedFrames % this.holdFrames === 0) {
            if (this.currentFrame < this.maxFrames - 1) {
                this.currentFrame++;
            } else {
                if (this instanceof Combatant) { 
                    if (this.health > 0) {
                        this.currentFrame = 0;
                    }
                } else {
                    this.currentFrame = 0;
                }
            }
        }
    }

    update() {
        this.draw();
        this.animateFrames();
    }
}

export const sceneBackground = new Character({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: '/assets/img/background.png'
})

export const storefront = new Character({
    position: {
        x: 620,
        y: 128
    },
    imageSrc: '/assets/img/shop.png',
    scale: 2.75,
    maxFrames: 6,
    holdFrames: 9
})

export default Character;