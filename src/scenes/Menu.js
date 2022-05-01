class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {
        // Define keys
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        // show menu text
        this.add.text(20, 20, 'Menu', menuConfig);
        this.add.text(20, 80, 'Press Right to go to Play scene', menuConfig);
        this.add.text(20, 140, 'High score: ' + highScore, menuConfig)
        game.settings = {
            jumpForce: 1250,
            playerStartPosition: 400,
            playerAcceleration: 5,
            playerMaxVelocity: 10,
            playerMaxPosition: game.config.width * 2/3,
            playerBasePush: 200,
            playerJumpCooldown: 100,
            obstacleBaseSpeed: 600,
            obstacleSpeedScale: 0.1,
            obstacleMaxScale: 3,
            obstacleScaleTime: 5000,
            obstacleMinSpawnTime: 500,
            swapTime: 8000,
            minSwapTime: 3000,
            maxSwapTime: 16000,
            turkeyPosition: 100,
            turkeyRushCooldown: 500
        }
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT)) this.scene.start('playScene');
    }
}