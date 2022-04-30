class Turkey extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setMaxVelocity(1200, 10000)
        // Create Turkey Animations
        scene.anims.create({
            key: 'turkeyRun',
            frames: this.anims.generateFrameNames(texture, {
                prefix: 'turkey_sheet ',
                start: 0,
                end: 11,
                suffix: '.ase',
            }),
            frameRate: 30,
            repeat: -1
        });
        scene.anims.create({
            key: 'turkeyFlyStart',
            frames: this.anims.generateFrameNames(texture, {
                prefix: 'turkey_sheet ',
                start: 12,
                end: 20,
                suffix: '.ase',
            }),
            frameRate: 30,
            repeat: 0
        });
        scene.anims.create({
            key: 'turkeyFly',
            frames: this.anims.generateFrameNames(texture, {
                prefix: 'turkey_sheet ',
                start: 21,
                end: 24,
                suffix: '.ase',
            }),
            frameRate: 30,
            repeat: -1
        });
        // Variables for Turkey
        this.rushCooldown = 0;
        this.isFlying = false;
        this.body.setSize(this.width * 1/2, this.height, true);
        this.ready = true;
        this.scene = scene;
    }

    update(time, delta) {
        if(this.ready && this.rushCooldown <= 0) {
            this.ready = false;
            this.rushCooldown = game.settings.turkeyRushCooldown;
            if(Phaser.Math.Between(0,1)) {
                console.log('Fly');
                this.isFlying = true;
                this.play('turkeyFlyStart', true);
                this.shoot();
            } else {
                this.rush();
            }
        }
        if(this.ready && this.body.touching.down) this.rushCooldown -= delta;

        if(this.isFlying && !this.isPlaying){
            this.play('turkeyFly', true)
        }

    }

    // Charge
    rush() {
        this.setAccelerationX(800);
    }

    // Fly (originally meant for fireball)
    shoot() {
        this.setAccelerationY(-2400);
        let target = new Phaser.Math.Vector2(this.x, this.y - 100);
        this.scene.physics.moveToObject(this, target, 175);
        this.setAccelerationX(800);
    }

    // Reset turkey to original position after going offscreen
    checkOffscreen() {
        if(this.x + this.width > game.config.width * 1.2)
        {
            this.setAcceleration(0, 0);
            this.setVelocityX(0);
            this.play('turkeyFly', true)
            this.isFlying = false;
            this.x = game.settings.turkeyPosition;
            this.y = 0;
            this.ready = true;
        }
        
    }
}