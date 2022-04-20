class Runner extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setGravityY(game.settings.playerGravity);
    }

    create() {
       
        //this.setVelocityY(game.settings.jumpForce)
    }

    update() {
        console.log(this.y);
    }
}