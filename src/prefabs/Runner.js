class Runner extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    create() {
       
    }

    update() {
        // console.log(this.y);
        // Jumping
        if(Phaser.Input.Keyboard.JustDown(keyUP) && this.body.touching.down) this.setVelocityY(game.settings.jumpForce * -1)
    }
}