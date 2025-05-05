export const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false,
    }
}

export function loadKeyDownEvents(hero, villain) {
    window.addEventListener('keydown', (event) => {
        event.preventDefault();
        switch (event.key) {
            case 'd':
                hero.controls.d.pressed = true;
                hero.recentKey = 'd';
                break;
            case 'a':
                hero.controls.a.pressed = true;
                hero.recentKey = 'a';
                break;
            case 'w':
                if (!hero.isJumping) {
                    hero.speed.y = -hero.speedFactor * 4;
                }
                break;
            case ' ':
                hero.isStriking = true;
                hero.recentKey = ' ';
                break;

            case 'ArrowRight':
                villain.controls.ArrowRight.pressed = true;
                villain.recentKey = 'ArrowRight';
                break;
            case 'ArrowLeft':
                villain.controls.ArrowLeft.pressed = true;
                villain.recentKey = 'ArrowLeft';
                break;
            case 'ArrowUp':
                if (!villain.isJumping) {
                    villain.speed.y = -villain.speedFactor * 4;
                }
                break;
            case 'Control':
                villain.isStriking = true;
                villain.recentKey = 'Control'
                break;
        }
    })
}

export function loadkeyUpEvents(hero, villain) {
    window.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'd':
                hero.controls.d.pressed = false;
                break;
            case 'a':
                hero.controls.a.pressed = false;
                break;
            case 'ArrowRight':
                villain.controls.ArrowRight.pressed = false;
                break;
            case 'ArrowLeft':
                villain.controls.ArrowLeft.pressed = false;
                break;
        }
    });
}