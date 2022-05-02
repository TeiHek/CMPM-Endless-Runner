class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.image('title', './assets/Turkey_Title_Screen.png')
        this.load.image('control', './assets/Control_Screen.png')
        this.load.image('credits', './assets/Credit_Screen.png')
    }

    create() {
        // Define keys
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        // menu text configuration
        let menuConfig = {
            fontFamily: 'FreePixel',
            fontSize: '32px',
            backgroundColor: '#050505',
            color: '#FFFFFF',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 300
        }
        // Add Credits, Control, Menu screens
        this.add.image(0, 0, 'title').setOrigin(0);
        this.add.text(115, 300, 'High score: ' + highScore, menuConfig);
        this.control = this.add.image(0,0, 'control').setOrigin(0);
        this.credits = this.add.image(0,0, 'credits').setOrigin(0);
        this.control.visible = false;
        this.credits.visible = false;
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
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT) && !this.control.visible && !this.credits.visible) this.scene.start('playScene');
        if (Phaser.Input.Keyboard.JustDown(keyUP) && !this.control.visible && !this.credits.visible) this.control.visible = true;
        if (Phaser.Input.Keyboard.JustDown(keyDOWN) && !this.control.visible && !this.credits.visible) this.credits.visible = true;
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.control.visible = false;
            this.credits.visible = false;
        }
    }
}