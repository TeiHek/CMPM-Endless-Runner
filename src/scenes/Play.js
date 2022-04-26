class Play extends Phaser.Scene {
  constructor() {
    super("playScene");
  }
  
  preload() {
    this.load.spritesheet('ground', './assets/ground-sheet.png', {frameWidth: 50, frameHeight: 50, startFrame: 0, endFrame: 8});
    this.load.spritesheet('runner', './assets/player.png', {frameWidth: 40, frameHeight: 80, startFrame: 0, endFrame: 1});
    this.load.image('jumpObs', './assets/obstacle1.png')
    this.load.image('slideObs', './assets/obstacle2.png')
  }

  create() {
    // Define keys
    keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
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

    // Score
    this.playerScore = 0
    let tempScoreConfig = {
      fontFamily: 'Courier',
      fontSize: '28px',
      backgroundColor: '#F3B141',
      color: '#843605',
      align: 'right',
      padding: {
          top: 5,
          bottom: 5,
      },
      fixedWidth: 100
    }
    this.score = this.add.text( game.config.width - 150,20, this.score, tempScoreConfig);
    this.runner = new Runner(this, 150, 90, 'runner').setOrigin(0);
    // Create ground
    this.anims.create({
      key: 'groundAnim',
      frames: this.anims.generateFrameNumbers('ground', { frames: [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ] }),
      frameRate: 60,
      repeat: -1
    });

    this.groundGroup = this.physics.add.group();
    for(let i = 0; i < game.config.width; i += groundSize) {
      let groundTile = this.groundGroup.create(i, game.config.height - groundSize, 'ground').setOrigin(0);
      groundTile.body.immovable = true;
      groundTile.body.allowGravity = false;
      groundTile.play('groundAnim')
    }
    
    // Collision between runner and ground
    this.physics.add.collider(this.runner, this.groundGroup);
    // Create Obstacles
    this.obstacles = new ObstacleManager(this, ['jumpObs', 'slideObs']);
    
    // Create first obstacle
    this.obstacles.addObstacle();
    this.timeSinceLastObstacle = 0;
    // Incrementing numbers for obstacle spawns
    this.speedMod = 1;
    // Game Over state
    this.gameOver = false;
    // Scaling speed timer
    this.speedScaling = this.time.addEvent({ delay: game.settings.obstacleScaleTime, callback: () => {
      if(this.speedMod <= game.settings.obstacleMaxScale) {
        this.speedMod += game.settings.obstacleSpeedScale;
      }
      console.log('Speed: ' + this.speedMod)
    }, callbackScope: null, loop: true});
  }

  update(time, delta) {
    // Scene Swapping on game over
    if(this.gameOver) {
      if (Phaser.Input.Keyboard.JustDown(keyLEFT)) this.scene.start('menuScene');
      if (this.playerScore > highScore) highScore = this.playerScore;
    }
    
    if(!this.gameOver) {
      this.runner.update(time, delta);
      this.timeSinceLastObstacle += delta;
      this.playerScore++;
      this.score.text = this.playerScore
      
      // Spawning and updating obstacles
      if(this.obstacles.activeObstacleGroup.getLength() == 0 && this.timeSinceLastObstacle > game.settings.obstacleMinSpawnTime){
        this.obstacles.addObstacle();
        this.timeSinceLastObstacle = 0;
      }
      this.obstacles.update(this.speedMod);

      // Check if player is offscreen
      if(this.runner.x < 0) {
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER').setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height* 2/3, 'Press LEFT to restart').setOrigin(0.5);
        this.gameOver = true;
      }
    }
  }
}