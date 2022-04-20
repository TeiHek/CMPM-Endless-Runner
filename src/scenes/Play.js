class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
    }
    
    preload() {
      this.load.image('ground', './assets/ground.png');
      this.load.image('runner', './assets/player.png');
    }

    create() {
      // Define keys
      keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
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
      this.runner = new Runner(this, 150, 90, 'runner').setOrigin(0.5);
      // Create ground
      this.ground = this.physics.add.sprite(game.config.width/2, game.config.height - 15, 'ground').setOrigin(0.5);
      this.ground.setImmovable(true);
      // Collision between runner and ground
      this.physics.add.collider(this.runner, this.ground);
    }

    update(time, delta) {
      //console.log(time + ", Delta:" + delta);
      // Priority list, temporary
      // 1 (high): Jumping, Obstacles to jump over, simple obstacle collision handling
      // Also 1  : Figure out control scheme and additional buttons
      // 2       : Sliding?, Obstacles to slide under, difficulty scaling/objects speeding up
      // 5       : Button matching minigame to clear collided obstacles
      this.runner.update();
    }
}