export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setBounce(0.75);
        this.setSize(20, 20);
        this.body.setDragX(75); 
        this.body.setCircle(10);

        this.cash = 0;
        this.power = 0;
        this.hasSetPower = false;
    }

    increasePower() {
        if (this.hasSetPower === false) {
            this.power += 200;
        }
    }

    shoot() {
        if (!this.hasSetPower) {
            this.hasSetPower = true;
            this.setVelocityX(this.power);
        }
    }
}
