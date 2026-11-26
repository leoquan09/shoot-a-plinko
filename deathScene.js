export default class DeathScene extends Phaser.Scene {
    constructor() {
        super({ key: 'deathScene' });
    }

    create() {
        this.shotsLeftText = this.add.text(600, 400, `The debt collectors GOT YOU`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '20px',
            color: 'black',
            align: 'right'
        }).setOrigin(0.5);
    }
}
