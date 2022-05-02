/**
 * Group: Andrew Cho, Adam Fuhrman, Calvin Stephano, and Randy Le
 * Game: Turkey Terror
 * Completed: 5/2/2022
 * Creative Tilt:
 * - Programming: Since I was working with sprites that had drastically differing sizes and the size of the runner was important,
 *                I learned how to make edits to json files (since Aseprite doesn't play nice with different frame sizes) as well
 *                as making changes to the body. This was necessary so the turkey would properly fly over the player, but also
 *                prevent the player from falling through the ground when attempting to slide. I also added a custom typeface to the game!
 * - VisualStyle: (Add a comment here)
 */
let config = {
    type: Phaser.CANVAS,
    width: 1366,
    height: 768,
    autoCenter: true,
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