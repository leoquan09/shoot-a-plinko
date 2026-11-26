export default class DeathScene extends Phaser.Scene {
    constructor() {
        super({ key: 'deathScene' });
    }

    create() {
        console.log('u died');
    }
}
