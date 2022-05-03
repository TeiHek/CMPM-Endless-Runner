/**
 * Group: Andrew Cho, Adam Fuhrman, Calvin Stephano, and Randy Le
 * Game: Turkey Terror
 * Completed: 5/2/2022
 *
 *
 * Creative Tilt:
 *
 * - Programming:   Since I (Randy) was working with sprites that had drastically differing sizes and the size of 
 *                  the runner was important, I learned how to make edits to json files (Aseprite doesn't play nice
 *                  with different frame sizes) as well as making changes to the body. This was necessary so the
 *                  turkey would properly fly over the player, but also to prevent the player from falling through
 *                  the ground when attempting to slide. I also added a custom typeface to the game!
 *
 * - Art:   We felt that pixel art best fit the gameplay of an arcade-styled project that is of a relatively small 
 *          scope. The artists of the team divided the work amongst ourselves. Andrew did the turkey and its 
 *          animations, as well as the title screen and the UI of the extra screens. Adam did the player and its 
 *          animations. I (Calvin) made the backgrounds, music, and found a typeface that best suited our artistic
 *          direction. Coordinating the size of the artwork got a bit difficult; we decided to scale the artwork; we
 *          made the dimensions of one “pixel” 3x3 rather than a true 1x1, so that the player could see the screen
 *          easier, and this caused some miscommunication in measurements along the way. We also had to navigate
 *          the issue of contrasting art styles and skill levels. Overall, we are quite pleased with the result,
 *          though there are aspects that have room for refinement.
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
