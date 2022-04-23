class Runner extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setAccelerationX(game.settings.playerAcceleration);
        this.isSliding = false;
        scene.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers(texture, { frames: [ 0 ] }),
            frameRate: 1,
            repeat: -1
        });

        scene.anims.create({
            key: 'slide',
            frames: this.anims.generateFrameNumbers(texture, { frames: [ 1 ] }),
            frameRate: 1,
            repeat: -1
        });
        
    }

    create() {
       
    }

    update() {
        // console.log(this.y);
        // Jumping
        if(Phaser.Input.Keyboard.JustDown(keyUP) && this.body.touching.down) this.setVelocityY(game.settings.jumpForce * -1)
        if(keyDOWN.isDown && this.body.touching.down) {
            this.play('slide');
            this.isSliding = true;
        } else {
            this.play('run');
            this.isSliding = false;
        }
        // Debug button
        // if(Phaser.Input.Keyboard.JustDown(keyRIGHT)) this.pushBack(1);
        
        // Stops acceleration when max velocity is reached
        if (this.body.velocity.x > game.settings.playerMaxVelocity && this.x < game.settings.playerMaxPosition) {
            this.setVelocityX(game.settings.playerMaxVelocity);
            this.setAccelerationX(0);
            console.log("Speed capped!");
        }

        // Stops velocity when the player reaches a certain portion of the screen
        if (this.x > game.settings.playerMaxPosition && this.body.velocity.x > 0) {
            this.setVelocityX(0);
            this.setAccelerationX(0);
            console.log("Distance capped!");
        }

        if(this.x < game.settings.playerMaxPosition && this.body.acceleration.x <= 0 && this.body.velocity.x == 0){
            this.setAccelerationX(game.settings.playerAcceleration);
            this.setDragX(0);
            console.log("!!!");
        }
        //console.log(this.body.velocity.x);
    }

    pushBack(speedMod) {
        this.setAccelerationX(0);
        this.setVelocityX(game.settings.playerBasePush * -1 * speedMod);
        this.setDragX(100 * speedMod);
        console.log('Boop!');
    }
}