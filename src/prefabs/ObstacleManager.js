 class ObstacleManager {
    constructor(scene, textures) {
        /*
         * Obstacle Group: activeObstacleGroup
         * Currently active, moving obstacle(s)
        */
        this.activeObstacleGroup = scene.physics.add.group({
            immovable: true,
            allowGravity: false,
        });
        // Add collisions for obstalces and player
        scene.physics.add.overlap(scene.runner, this.activeObstacleGroup, this.handleCollision, null, this);
        
        this.scene = scene;
        this.textures = textures;
    }

    update(speedMod) {
        this.activeObstacleGroup.getChildren().forEach(obstacle => {
            obstacle.setVelocityX(game.settings.obstacleBaseSpeed*-1 * speedMod)
        });
        this.cleanOffscreen()        
    }
    // Notes to anyone attempting to program addObstacle:
    /*
    var value = Phaser.Math.Between(min, max); to pick a number
    group.getChildren()[value]; to get item in group
    to get max number, use this.group.getLength() - 1; max is inclusive.
    */
    addObstacle() {
        let obstacle;
        if(Phaser.Math.Between(0,1)) {
            obstacle = this.activeObstacleGroup.create(game.config.width, game.config.height - groundSize*4.5, this.textures[1]).setOrigin(0); // NOTE: Y param is placeholder value
            obstacle.canSlide = true;
        } else {
            obstacle = this.activeObstacleGroup.create(game.config.width, game.config.height - groundSize*2, this.textures[0]).setOrigin(0); // NOTE: Y param is placeholder value
            obstacle.canSlide = false;
        }
        // console.log(obstacle.body.velocity);
        // console.log(this.activeObstacleGroup.getLength());
    }

    handleCollision(runner, obstacle){
        console.log(obstacle.canSlide)
        if( (!runner.isSliding && obstacle.canSlide) || !obstacle.canSlide){
          runner.pushBack(this.scene.speedMod)
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