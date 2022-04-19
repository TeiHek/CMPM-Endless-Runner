class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {
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
      this.add.text(50, 20, 'Menu', menuConfig).setOrigin(0.5);
    }

    update() {

    }
}