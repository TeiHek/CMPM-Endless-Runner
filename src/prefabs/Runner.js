class Runner extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setAccelerationX(game.settings.playerAcceleration);
        this.isSliding = false;
        this.jumpCooldown = 0;
        console.log(this.body)
        scene.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNames(texture, {
                prefix: 'Sprite-0001 ',
                start: 0,
                end: 5,
                suffix: '.aseprite',
            }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'slide',
            defaultTextureKey: texture,
            frames: [
                { frame: 'Sprite-0001 6.aseprite'}
            ],
            frameRate: 1,
            repeat: -1
        });

        scene.anims.create({
            key: 'jump',
            defaultTextureKey: texture,
            frames: [
                { frame: 'Sprite-0001 7.aseprite'}
            ],
            frameRate: 1,
            repeat: -1
        });

        this.jumpSfx = scene.sound.add('jump',{volume: 0.75});
        this.play('run', true);
    }

    update(time, delta) {
        // console.log(this.y);
        if(this.body.touching.down) {
            if(keyDOWN.isDown) {
                this.jumpCooldown = game.settings.playerJumpCooldown;
                this.play('slide');
                this.isSliding = true;
                this.body.setSize();
            } else {
                this.play('run', true);
                this.isSliding = false;
                this.jumpCooldown -= delta;
                this.body.setSize();
            }
        } else {
            this.play('jump');
        }

        // Jumping
        if(Phaser.Input.Keyboard.JustDown(keyUP) && this.body.touching.down && this.jumpCooldown <= 0) {
            this.jumpSfx.play()
            this.setVelocityY(game.settings.jumpForce * -1)
        }
        // Debug button
        // if(Phaser.Input.Keyboard.JustDown(keyRIGHT)) this.pushBack(1);
        
        // Stops acceleration when max velocity is reached
        if (this.body.velocity.x > game.settings.playerMaxVelocity && this.x < game.settings.playerMaxPosition) {
            this.setVelocityX(game.settings.playerMaxVelocity);
            this.setAccelerationX(0);
            //console.log("Speed capped!");
        }

        // Stops velocity when the player reaches a certain portion of the screen
        if (this.x > game.settings.playerMaxPosition && this.body.velocity.x > 0) {
            this.setVelocityX(0);
            this.setAccelerationX(0);
            //console.log("Distance capped!");
        }

        if(this.x < game.settings.playerMaxPosition && this.body.acceleration.x <= 0 && this.body.velocity.x == 0){
            this.setAccelerationX(game.settings.playerAcceleration);
            this.setDragX(0);
            //console.log("!!!");
        }
        //console.log(this.body.velocity.x);
    }

    pushBack(speedMod) {
        this.setAccelerationX(0);
        this.setVelocityX(game.settings.playerBasePush * -1 * speedMod);
        if(speedMod > 0) this.setDragX(200 * speedMod);
        //console.log('Boop!');
    }
}
