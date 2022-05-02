class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.image('title', './assets/Turkey_Title_Screen.png')
        this.load.image('control', './assets/Control_Screen.png')
        this.load.image('credits', './assets/Credit_Screen.png')
        this.load.audio('start', './assets/start_turkey_noise.wav');
        this.load.audio('fwd', './assets/menufwd.wav');
        this.load.audio('back', './assets/menuback.wav');
        this.load.audio('music', './assets/soundtrack.wav');
    }

    create() {
        // Stop music to prevent overlapping from previous gameplays
        

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
        this.menu = this.add.image(0, 0, 'title').setOrigin(0);
        this.hs = this.add.text(115, 300, 'High score: ' + highScore, menuConfig);
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

        this.startSFX = this.sound.add('start');
        this.fwdSFX = this.sound.add('fwd');
        this.backSFX = this.sound.add('back');
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT) && !this.control.visible && !this.credits.visible && !this.startSFX.isPlaying) {
            this.startSFX.play()
            this.menu.visible = false;
            this.hs.visible = false;
            this.time.delayedCall(800, () => {
                this.scene.start('playScene');
              }, null, this);
        }
        if (Phaser.Input.Keyboard.JustDown(keyUP) && !this.control.visible && !this.credits.visible && !this.startSFX.isPlaying) {
            this.fwdSFX.play();
            this.control.visible = true;
        }
        if (Phaser.Input.Keyboard.JustDown(keyDOWN) && !this.control.visible && !this.credits.visible && !this.startSFX.isPlaying) {
            this.fwdSFX.play();
            this.credits.visible = true;
        }
        if (Phaser.Input.Keyboard.JustDown(keyLEFT) && (this.control.visible || this.credits.visible)) {
            this.backSFX.play();
            this.control.visible = false;
            this.credits.visible = false;
        }
    }
}
