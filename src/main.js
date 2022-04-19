let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ],
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
}

let game = new Phaser.Game(config);
