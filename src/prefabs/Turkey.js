class Turkey extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setMaxVelocity(1200, 10000)
        scene.anims.create({
            key: 'turkeyRun',
            frames: this.anims.generateFrameNames(texture, {
                prefix: 'TurkeyRunning_',
                start: 1,
                end: 12,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 30,
            repeat: -1
        });
        this.rushCooldown = 0;
        this.ready = true;
        this.scene = scene;
    }

    update(time, delta) {
        if(this.ready && this.rushCooldown <= 0) {
            this.ready = false;
            this.rushCooldown = game.settings.turkeyRushCooldown;
            if(Phaser.Math.Between(0,1)) {
                this.shoot();
            } else {
                this.rush();
            }
        }
        if(this.ready && this.body.touching.down)
            this.rushCooldown -= delta;
    }

    rush() {
        // Play animation
        // When animation is done:
        this.setAccelerationX(800);
    }

    shoot() {
        this.setAccelerationY(-1900);
        let target = new Phaser.Math.Vector2(this.x, this.y - 50);
        this.scene.physics.moveToObject(this, target, 125);
        this.setAccelerationX(800);
    }

    checkOffscreen() {
        if(this.x + this.width > game.config.width * 1.2)
        {
            this.setAcceleration(0, 0);
            this.setVelocityX(0);
            this.x = game.settings.turkeyPosition;
            this.y = 0;
            this.ready = true;
        }
        
    }
}