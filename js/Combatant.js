import Character from './Character.js'
const gameCanvas = document.querySelector('canvas');

gameCanvas.width = 1024;
gameCanvas.height = 576;
const gravityForce = 1;

class Combatant extends Character {
    constructor({ id, initialPosition, hitboxOffset, characterImage, sizeScale, frameCount, frameDelay, spriteOffset = { x: 0, y: 0 }, animations, controls, strikeDelay }) {
        super({ position: initialPosition, imageSrc: characterImage, scale: sizeScale, maxFrames: frameCount, holdFrames: frameDelay, offsetFrame: spriteOffset });
        this.id = id;
        this.height = 150;
        this.width = 50;
        this.speed = { x: 0, y: 0 };
        this.speedFactor = 6;
        this.recentKey;
        this.isJumping = false;
        this.isStriking = false;
        this.health = 100;
        this.strikeZone = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offSet: hitboxOffset,
            width: 150,
            height: 150
        };
        this.animations = animations;
        for (const animation in this.animations) {
            animations[animation].image = new Image();
            animations[animation].image.src = animations[animation].imageSrc;
        }
        this.controls = controls;
        this.strikeDelay = strikeDelay;
        this.canStrike = true;
        this.isHurt = false;
    }

    strike(opponent) {
        if (this.isStriking && this.health > 0 && this.canStrike) {
            this.canStrike = false;
            setTimeout(() => { this.canStrike = true }, 1000)
            this.changeAnimation('attack')
            if (this.hasHit(opponent)) {
                opponent.health -= 20;
                gsap.to('#' + opponent.id + 'Health', { width: opponent.health + '%' });
                opponent.changeAnimation('takehit');
                opponent.isHurt = true;
            }
        }
    }

    hasHit(opponent) {
        return (this.strikeZone.position.x + this.strikeZone.width >= opponent.position.x &&
            this.strikeZone.position.x <= opponent.position.x + opponent.width &&
            this.strikeZone.position.y + this.strikeZone.height >= opponent.position.y &&
            this.strikeZone.position.y <= opponent.position.y + opponent.height)
    }

    handleMovement() {
        let isMoving = false;
        if (this.health > 0) {
            if (Object.values(this.controls)[0].pressed && (this.recentKey === 'a' || this.recentKey === 'ArrowLeft') && this.position.x >= 0) {
                this.speed.x = -this.speedFactor;
                this.changeAnimation('run')
                isMoving = true;
            } else if (Object.values(this.controls)[1].pressed && (this.recentKey === 'd' || this.recentKey === 'ArrowRight') && this.position.x <= (gameCanvas.width - this.width)) {
                this.speed.x = this.speedFactor;
                this.changeAnimation('run')
                isMoving = true;
            }
        }
        return isMoving;
    }

    update() {
        super.update();
        this.strikeZone.position.x = this.position.x + this.strikeZone.offSet.x;
        this.strikeZone.position.y = this.position.y;
        this.position.y += this.speed.y;
        this.position.x += this.speed.x;

        if (this.position.y + this.height + this.speed.y >= gameCanvas.height - 95) {
            this.speed.y = 0;
            this.isJumping = false;
        } else {
            this.speed.y += gravityForce;
            if (this.speed.y > 0) {
                this.changeAnimation('fall');
            } else {
                this.isJumping = true;
                this.changeAnimation('jump');
            }
        }
    }

    changeAnimation(animationName) {
        switch (animationName) {
            case 'idle':
                if (this.image !== this.animations.idle.image && !this.isJumping && this.health > 0) {
                    this.image = this.animations.idle.image;
                    this.maxFrames = this.animations.idle.maxFrames;
                    this.currentFrame = 0;
                }
                break;
            case 'run':
                if (!this.isStriking && !this.isHurt) {
                    this.image = this.animations.run.image;
                    this.maxFrames = this.animations.run.maxFrames;
                }
                break;
            case 'jump':
                if (this.image !== this.animations.attack1.image) {
                    this.image = this.animations.jump.image;
                    this.maxFrames = this.animations.jump.maxFrames;
                    this.currentFrame = 0;
                }
                break;
            case 'fall':
                if (this.image !== this.animations.attack1.image) {
                    this.image = this.animations.fall.image;
                    this.maxFrames = this.animations.fall.maxFrames;
                    this.currentFrame = 0;
                }
                break;
            case 'death':
                this.image = this.animations.death.image;
                this.maxFrames = this.animations.death.maxFrames;
                this.currentFrame = 0;
                break;
            case 'attack':
                this.image = this.animations.attack1.image;
                this.maxFrames = this.animations.attack1.maxFrames;
                this.currentFrame = 0;
                setTimeout(() => { this.isStriking = false }, this.strikeDelay)
                break;
            case 'takehit':
                this.image = this.animations.takeHit.image;
                this.maxFrames = this.animations.takeHit.maxFrames;
                this.currentFrame = 0;
                setTimeout(() => { this.isHurt = false }, 500);
                break;
        }
    }
}

export const hero = new Combatant({
    id: "hero",
    initialPosition: {
        x: 0,
        y: 0
    },
    hitboxOffset: {
        x: 75,
        y: 0
    },
    characterImage: '/assets/img/samuraiMack/Idle.png',
    sizeScale: 2.5,
    frameCount: 8,
    frameDelay: 4,
    spriteOffset: { x: 215, y: 154 },
    animations: {
        idle: {
            imageSrc: '/assets/img/samuraiMack/Idle.png',
            maxFrames: 8,
        },
        run: {
            imageSrc: '/assets/img/samuraiMack/Run.png',
            maxFrames: 8,
        },
        jump: {
            imageSrc: '/assets/img/samuraiMack/Jump.png',
            maxFrames: 2,
        },
        fall: {
            imageSrc: '/assets/img/samuraiMack/Fall.png',
            maxFrames: 2,
        },
        death: {
            imageSrc: '/assets/img/samuraiMack/Death.png',
            maxFrames: 6,
        },
        attack1: {
            imageSrc: '/assets/img/samuraiMack/Attack1.png',
            maxFrames: 6,
        },
        takeHit: {
            imageSrc: '/assets/img/samuraiMack/Take hit White.png',
            maxFrames: 4,
        }
    },
    controls: {
        'a': {
            pressed: false
        },
        'd': {
            pressed: false
        },
        'w': {
            pressed: false
        },
        ' ': {
            pressed: false
        }
    },
    strikeDelay: 400
})

export const villain = new Combatant({
    id: "villain",
    initialPosition: {
        x: 950,
        y: 0
    },
    hitboxOffset: {
        x: -160,
        y: 0
    },
    characterImage: '/assets/img/kenji/Idle.png',
    sizeScale: 2.5,
    frameCount: 4,
    frameDelay: 6,
    spriteOffset: { x: 215, y: 172 },
    animations: {
        idle: {
            imageSrc: '/assets/img/kenji/Idle.png',
            maxFrames: 4,
        },
        run: {
            imageSrc: '/assets/img/kenji/Run.png',
            maxFrames: 8,
        },
        jump: {
            imageSrc: '/assets/img/kenji/Jump.png',
            maxFrames: 2,
        },
        fall: {
            imageSrc: '/assets/img/kenji/Fall.png',
            maxFrames: 2,
        },
        death: {
            imageSrc: '/assets/img/kenji/Death.png',
            maxFrames: 7,
        },
        attack1: {
            imageSrc: '/assets/img/kenji/Attack1.png',
            maxFrames: 4,
        },
        takeHit: {
            imageSrc: '/assets/img/kenji/Take hit white.png',
            maxFrames: 3,
        }
    },
    controls: {
        'ArrowLeft': {
            pressed: false
        },
        'ArrowRight': {
            pressed: false
        },
        'ArrowUp': {
            pressed: false
        },
        'Control': {
            pressed: false
        }
    },
    strikeDelay: 350
});

export default Combatant;