export default class startScene extends Phaser.Scene {
    constructor() {
        super('startScene');
    }

    create() {
        this.add.text(450, 400, 'SHOOT A PLINKO', {
            fontFamily: 'courier',
            fontSize: '32px',
            color: '#000000'
        }).setResolution(window.devicePixelRatio);
    }

    update() {
        this.input.once('pointerdown', () => {
            this.scene.start('mainScene');
        });
    }
}
