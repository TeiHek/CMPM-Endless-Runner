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
        game.settings = {
            jumpForce: 800,
            playerStartPosition: 200,
            obstacleBaseSpeed: 400,
            obstacleSpeedScale: 0.2,
            obstacleScaleMax: 2,
            obstacleScaleTime: 5000,
        }
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT)) this.scene.start('playScene');
    }
}