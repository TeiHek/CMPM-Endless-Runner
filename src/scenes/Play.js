class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
    }
    
    preload() {
    }

    create(){
      let tempConfig = {
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
      this.add.text( 20,20, 'Play', tempConfig);
    }
}