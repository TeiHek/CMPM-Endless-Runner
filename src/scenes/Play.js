class Play extends Phaser.Scene {
  constructor() {
    super("playScene");
  }
  
  preload() {
    this.load.spritesheet('ground', './assets/ground_tile2.png', {frameWidth: 99, frameHeight: 99, startFrame: 0, endFrame: 10});
    this.load.atlas('runner_atlas', './assets/playersheet.png', './assets/playersheet.json');
    this.load.image('jumpObs', './assets/rock.png');
    this.load.image('slideObs', './assets/vine.png');
    this.load.image('skyBG', './assets/sky_layer.png');
    this.load.image('treeFront', './assets/trees_front.png');
    this.load.image('treeLeaf', './assets/tree_leaves.png');
    this.load.image('treeBG0', './assets/trees_layer_0.png');
    this.load.image('treeBG1', './assets/trees_layer_1.png');
    this.load.image('treeBG2', './assets/trees_layer_2.png');
    this.load.atlas('turkey_atlas', './assets/turkey_sheet.png', './assets/turkey_sheet.json')
    this.load.audio('jump', './assets/jump.wav');
    this.load.audio('hurt', './assets/hurt.wav');
    this.load.audio('lose', './assets/lose.wav');
  }

  create() {
    //Music
    this.bgMusic = this.sound.add('music');
    this.bgMusic.loop = true;
    this.bgMusic.play();

    // Define keys
    keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    let tempConfig = {
      fontFamily: 'FreePixel',
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

    // Background creation
    this.sky = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'skyBG').setOrigin(0, 0);
    this.treeL2 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'treeBG2').setOrigin(0, 0);
    this.treeL1 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'treeBG1').setOrigin(0, 0);
    this.treeL0 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'treeBG0').setOrigin(0, 0);
    this.treeFront = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'treeFront').setOrigin(0, 0);
    this.treeLeaf = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'treeLeaf').setOrigin(0, 0);
    this.treeLeaf.setDepth(2)

    // Score
    this.playerScore = 0
    let tempScoreConfig = {
      fontFamily: 'FreePixel',
      fontSize: '32px',
      backgroundColor: '#F3B141',
      color: '#000000',
      align: 'right',
      padding: {
          top: 5,
          bottom: 5,
      },
      fixedWidth: 100
    }
    this.gameOverText = {
      fontFamily: 'FreePixel',
      fontSize: '32px',
      backgroundColor: '#000000',
      color: '#FFFFFF',
      align: 'right',
      padding: {
          top: 5,
          bottom: 5,
      },
      fixedWidth: 0
    }
    this.score = this.add.text( game.config.width - 150,20, this.score, tempScoreConfig);
    this.score.setDepth(2);

    // Create player and turkey
    this.runner = new Runner(this, game.settings.playerStartPosition, game.config.height/2, 'runner_atlas').setOrigin(0.5, 1);
    this.turkey = new Turkey(this, game.settings.turkeyPosition, game.config.height/2, 'turkey_atlas').setOrigin(0.5, 1);
    this.turkey.setDepth(1);

    // Create ground
    this.anims.create({
      key: 'groundAnim',
      frames: this.anims.generateFrameNumbers('ground', { frames: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ] }),
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

    // Collision between turkey and ground
    this.physics.add.collider(this.turkey, this.groundGroup);

    // Collision between runner and turkey
    this.playerHit = false;
    this.physics.add.collider(this.runner, this.turkey, () => {
      this.playerHit = true;
      //this.runner.pushBack(-2)
      this.runner.setVelocityY(-2500)
      if( !this.lose.isPlaying)this.lose.play()
    });

    // Create Obstacles
    this.obstacles = new ObstacleManager(this, ['jumpObs', 'slideObs']);
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
      //console.log('Speed: ' + this.speedMod)
    }, callbackScope: null, loop: true});

    // Timer to swap between turkey and obstacles
    this.turkeyActive = false;
    this.swapTimer = this.time.delayedCall(game.settings.swapTime, this.resetSwap, null, this);

    this.lose = this.sound.add('lose');
  }

  update(time, delta) {
    // Scene Swapping on game over
    if (this.gameOver) {
      if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
        this.bgMusic.stop();  // Stop music from overlapping
        this.scene.start('menuScene');
      }
      if (this.playerScore > highScore) highScore = this.playerScore;
      this.turkey.rush();
    }
    
    // Turkey anims, since turkey.update is not always called
    if(this.turkey.body.touching.down && !this.turkey.isFlying) {
      this.turkey.play('turkeyRun', true);
    }

    // Scroll BG
    this.sky.tilePositionX += 3;
    this.treeFront.tilePositionX += 7;
    this.treeLeaf.tilePositionX += 7;
    this.treeL0.tilePositionX += 5;
    this.treeL1.tilePositionX += 3;
    this.treeL2.tilePositionX += 1;

    // Main block while gameplay is active
    if(!this.gameOver) {
      if(!this.playerHit) this.runner.update(time, delta);
      this.timeSinceLastObstacle += delta;

      // Handle Score
      this.playerScore++;
      this.score.text = this.playerScore
      
      // Spawning and updating obstacles or turkey attacks, whichever is active
      if(this.turkeyActive && this.obstacles.activeObstacleGroup.getLength() == 0) {
        this.turkey.update(time, delta);
      } else if(this.obstacles.activeObstacleGroup.getLength() == 0 && this.timeSinceLastObstacle > game.settings.obstacleMinSpawnTime) {
        this.obstacles.addObstacle();
        this.timeSinceLastObstacle = 0;
      }
      this.obstacles.update(this.speedMod);
      this.turkey.checkOffscreen();

      // Check if player is offscreen
      if(this.runner.x < 0 || this.runner.x > game.config.width || this.runner.y < 0) {
        this.add.text(game.config.width/2, game.config.height*0.45, 'GAME OVER', this.gameOverText).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height*0.55, 'Press LEFT for MENU', this.gameOverText).setOrigin(0.5);
        this.gameOver = true;
        this.runner.destroy()
      }
    }
  }

  resetSwap() {
    //console.log('swapped!');
    this.turkeyActive = !this.turkeyActive;
    let newTimer = Phaser.Math.Between(game.settings.minSwapTime, game.settings.maxSwapTime);
    //console.log(newTimer);
    if(!this.gameOver) this.swapTimer = this.time.delayedCall(newTimer, this.resetSwap, null, this);
    //console.log(this.swapTimer);
  }

}
