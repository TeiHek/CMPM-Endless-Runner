let config = {
    type: Phaser.CANVAS,
    width: 1366,
    height: 768,
    //autoCenter: true,
    scene: [ Menu, Play ],
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 2500 },
            debug: false
        }
    }
}

let game = new Phaser.Game(config);
// Reserve key names
let keyUP, keyDOWN, keyLEFT, keyRIGHT;
let groundSize = 99;
let highScore = 0;

// Priority list, temporary
// 1 (high): Jumping, Obstacles to jump over, simple obstacle collision handling
// Also 1  : Figure out control scheme and additional buttons
// 2       : Sliding?, Obstacles to slide under, difficulty scaling/objects speeding up
// 5       : Button matching minigame to clear collided obstacles