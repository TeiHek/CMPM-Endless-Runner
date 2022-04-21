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
      this.ground = this.groundGroup.create(game.config.width/2, game.config.height - 15, 'ground').setOrigin(0.5);
      this.ground.setImmovable(true);
      // Collision between runner and ground
      this.physics.add.collider(this.runner, this.groundGroup);
      // Create Obstacles
      /*
       * Obstacle Group: activeObstacleGroup
       * Currently active, moving obstacle(s)
       */
      this.activeObstacleGroup = this.physics.add.group({
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
        removeCallback: function(obstacle) {
          // Once removed, put the obstacle into the ActiveObstacleGroup
          obstacle.scene.activeObstacleGroup.add(obstacle);
        }
      });
      // Add collisions for obstacles
      this.physics.add.collider(this.activeObstacleGroup, this.groundGroup);
      this.physics.add.collider(this.obstaclePool, this.groundGroup);
      // Create first obstacle
      this.addObstacle(1, game.config.width);
    }

    update(time, delta) {
      //console.log(this.groundGroup.getLength())
      //console.log(time + ", Delta:" + delta);

      this.runner.update();
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
        // Note: This section has yet to be tested
        let obsNum = Phaser.Math.Between(0, this.obstaclePool.getLength() - 1)
        obstacle = this.obstaclePool.getChildren()[obsNum];
        obstacle.x = posX;
        obstacle.active = true;
        obstacle.visible = true;
        obstacle.setVelocityX(game.settings.obstacleBaseSpeed*-1 * speedMod)
        this.obstaclePool.remove(obstacle);
      } else {
        console.log(obstacle);
        obstacle = this.activeObstacleGroup.create(posX, 100, 'jumpObj'); // NOTE: 100 is placeholder value
        //obstacle.setImmovable(true);  // Not sure if this line is needed, seems to break collision
        obstacle.setVelocityX(game.settings.obstacleBaseSpeed*-1 * speedMod);
        console.log(obstacle.body.velocity);
        
      }
    }
}