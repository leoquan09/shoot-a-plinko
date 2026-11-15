export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setBounce(0.75);
        this.setSize(20, 20);
        this.body.setDragX(75); 
        this.body.setCircle(10);

        this.cash = Number(localStorage.getItem('cash')) || 0;
        this.scene.registry.set('cash', this.cash); 

        this.power = 0;
        this.hasSetPower = false;

        this.setCollideWorldBounds(true);
        this.body.onWorldBounds = true; 

        scene.registry.events.on('changedata-cash', (parent, value) => {
            if (this.cash !== value) {
                this.cash = value;
                localStorage.setItem('cash', value);
            }
        });
    }

    increasePower(increase) {
        if (this.hasSetPower === false && this.power < 2400) {
            this.power += increase;
        }
    }

    shoot() {
        if (!this.hasSetPower) {
            this.hasSetPower = true;
            this.setVelocityX(this.power);
        }
    }

    reset(cash_amt) {
        this.body.reset(200, 100);
        this.setAngle(0);
        this.setAngularVelocity(0);
        this.power = 0;
        this.hasSetPower = false;
        this.setBounce(0.75);
        this.cash += cash_amt;
        this.scene.registry.set('cash', this.cash);
        localStorage.setItem('cash', this.cash);
    }
}
