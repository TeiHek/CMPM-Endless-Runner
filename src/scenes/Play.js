class Play extends Phaser.Scene {
  constructor() {
    super("playScene");
  }
  
  preload() {
    this.load.image('ground', './assets/ground.png');
    this.load.image('runner', './assets/player.png');
    this.load.image('jumpObs', './assets/obstacle1.png')
    this.load.image('slideObs', './assets/obstacle2.png')
  }

  create() {
    // Define keys
    keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
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
    this.groundGroup = this.physics.add.staticGroup();
    this.ground = this.groundGroup.create(game.config.width/2, game.config.height - 16, 'ground').setOrigin(0.5);
    this.ground.setImmovable(true);
    // Collision between runner and ground
    this.physics.add.collider(this.runner, this.groundGroup);
    // Create Obstacles
    /*
      * Obstacle Group: activeObstacleGroup
      * Currently active, moving obstacle(s)
      */
    this.activeObstacleGroup = this.physics.add.group({
      immovable: true,
      allowGravity: false,
    });
    // Add collisions for obstacles and ground
    this.physics.add.collider(this.activeObstacleGroup, this.groundGroup);
    // Add collisions for obstalces and player
    this.physics.add.overlap(this.runner, this.activeObstacleGroup, this.handleCollision, null, this);
    // Create first obstacle
    this.addObstacle(1, game.config.width);
    // Incrementing numbers for obstacle spawns
    this.speedMod = 1;
    // Game Over state
    this.gameOver = false;
    // Scaling speed timer
    this.speedScaling = this.time.addEvent({ delay: game.settings.obstacleScaleTime, callback: () => {
      this.speedMod += game.settings.obstacleSpeedScale;
    }, callbackScope: null, loop: !this.gameOver});
  }

  update(time, delta) {
    //console.log(this.activeObstacleGroup.getLength() + ", " + this.obstaclePool.getLength())
    //if(this.obstaclePool.getLength() && !this.gameOver) this.addObstacle(1, game.config.width);
    //console.log(time + ", Delta:" + delta);
    console.log(this.runner.isSliding);
    if(!this.gameOver) {
      this.runner.update();
      if(this.activeObstacleGroup.getLength() == 0){
        this.addObstacle(this.speedMod, game.config.width);
      }
      this.cleanOffscreen()
    }

    this.activeObstacleGroup.getChildren().forEach(obstacle => {
      obstacle.setVelocityX(game.settings.obstacleBaseSpeed*-1 * this.speedMod)
    });
  }

  // Notes to anyone attempting to program addObstacle:
  /*
    var value = Phaser.Math.Between(min, max); to pick a number
    group.getChildren()[value]; to get item in group
    to get max number, use this.group.getLength() - 1; max is inclusive.
  */
  addObstacle(speedMod, posX, placeholder = true) {
    let obstacle;
    if(Phaser.Math.Between(0,1)) {
      obstacle = this.activeObstacleGroup.create(posX, game.config.height - this.ground.height*2, 'slideObs').setOrigin(0.5); // NOTE: 100 is placeholder value
      obstacle.canSlide = true;
    } else {
      obstacle = this.activeObstacleGroup.create(posX, game.config.height - this.ground.height*2, 'jumpObs').setOrigin(0.5); // NOTE: 100 is placeholder value
      obstacle.canSlide = false;
    }
    // console.log(obstacle.body.velocity);
    // console.log(this.activeObstacleGroup.getLength());
  }
  
  handleCollision(runner, obstacle){
    console.log(obstacle.canSlide)
    if( (!runner.isSliding && obstacle.canSlide) || !obstacle.canSlide){
      this.gameOver = true;
      this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER').setOrigin(0.5);
      this.activeObstacleGroup.killAndHide(obstacle);
      this.activeObstacleGroup.remove(obstacle);
    }
  }

  cleanOffscreen() {
    let front = this.activeObstacleGroup.getFirstAlive()
    if(front && front.x < 0) {
      this.activeObstacleGroup.killAndHide(front);
      this.activeObstacleGroup.remove(front);
    }
  }
}