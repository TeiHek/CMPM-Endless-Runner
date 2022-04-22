class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {
        // Define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
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
        this.add.text(20, 80, 'Press space to go to Play scene', menuConfig);
        game.settings = {
            jumpForce: 800,
            playerStartPosition: 200,
            obstacleBaseSpeed: 400,
            obstacleSpeedScale: 0.1,
            obstacleScaleTime: 3000,
        }
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keySPACE)) this.scene.start('playScene');
    }
}