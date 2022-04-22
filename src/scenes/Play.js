class Play extends Phaser.Scene {
  constructor() {
    super("playScene");
  }
  
  preload() {
    this.load.image('ground', './assets/ground.png');
    this.load.image('runner', './assets/player.png');
    this.load.image('jumpObj', './assets/obstacle1.png')
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
      removeCallback: function(obstacle) {
        // Once removed, put the obstacle into the (inactive) obstaclePool
        obstacle.scene.obstaclePool.add(obstacle);
      }
    });
    /*
      * Obstacle Group: obstaclePool
      * Inactive obstacles ready to be adedd into the scene
      */
    this.obstaclePool = this.physics.add.group({
      immovable: true,
      allowGravity: false,
      removeCallback: function(obstacle) {
        // Once removed, put the obstacle into the ActiveObstacleGroup
        obstacle.scene.activeObstacleGroup.add(obstacle);
      }
    });
    // Add collisions for obstacles and ground
    this.physics.add.collider(this.activeObstacleGroup, this.groundGroup);
    this.physics.add.collider(this.obstaclePool, this.groundGroup);
    // Add collisions for obstalces and player
    this.physics.add.overlap(this.runner, this.activeObstacleGroup, this.handleCollision, null, this);
    // Create first obstacle
    this.addObstacle(1, game.config.width);
    // Time since last obstacle, for "random" spawns
    this.timeSinceLastObstacle = 0
    // Incrementing numbers for obstacle spawns
    this.speedMod = 1;
    // Game Over state
    this.gameOver = false;
    // Scaling speed timer
    this.speedScaling = this.time.addEvent({ delay: game.settings.obstacleScaleTime, callback: () => {
      this.speedMod += game.settings.obstacleSpeedScale
    }, callbackScope: null, loop: !this.gameOver});
  }

  update(time, delta) {
    //console.log(this.activeObstacleGroup.getLength() + ", " + this.obstaclePool.getLength())
    //if(this.obstaclePool.getLength() && !this.gameOver) this.addObstacle(1, game.config.width);
    //console.log(time + ", Delta:" + delta);
    if(!this.gameOver) {
      this.runner.update();
      if(this.activeObstacleGroup.getLength() == 0){
        this.addObstacle(this.speedMod, game.config.width);
      }
      this.cleanOffscreen()
    }
  }

  // Notes to anyone attempting to program addObstacle:
  /*
    var value = Phaser.Math.Between(min, max); to pick a number
    group.getChildren()[value]; to get item in group
    to get max number, use this.group.getLength() - 1; max is inclusive.
  */
  addObstacle(speedMod, posX, placeholder = true) {
    let obstacle;
    if(this.obstaclePool.getLength()) { // True if not empty
      let obsNum = Phaser.Math.Between(0, this.obstaclePool.getLength() - 1)
      obstacle = this.obstaclePool.getChildren()[obsNum];
      this.obstaclePool.remove(obstacle);
      obstacle.x = posX;
      obstacle.active = true;
      obstacle.visible = true;
      obstacle.setVelocityX(game.settings.obstacleBaseSpeed*-1 * speedMod)
      
    } else {
      
      obstacle = this.activeObstacleGroup.create(posX, game.config.height - this.ground.height*2, 'jumpObj').setOrigin(0.5); // NOTE: 100 is placeholder value
      obstacle.setVelocityX(game.settings.obstacleBaseSpeed*-1 * speedMod);
      console.log(obstacle.body.velocity);
      console.log(this.activeObstacleGroup.getLength());
    }
  }
  
  handleCollision(runner, obstacle){
    this.gameOver = true;
    this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER').setOrigin(0.5);
    this.activeObstacleGroup.killAndHide(obstacle);
    this.activeObstacleGroup.remove(obstacle);
  }

  cleanOffscreen() {
    let front = this.activeObstacleGroup.getFirstAlive()
    if(front && front.x < 0) {
      this.activeObstacleGroup.killAndHide(front);
      this.activeObstacleGroup.remove(front);
    }
  }
}