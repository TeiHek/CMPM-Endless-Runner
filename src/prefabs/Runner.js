class Runner extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        //this.setGravityX(1);
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
    }
}