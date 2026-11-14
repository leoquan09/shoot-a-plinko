import Player from './player.js';

export default class mainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'mainScene' });
    }

    preload() {
        this.load.image('player', 'images/ball.png');
        this.load.image('verticalWall', 'images/wall_vertical.png');
        this.load.image('bottomWall', 'images/wall_bottom.png');
    }

    create() {
        this.player = new Player(this, 200, 300, 'player');
    
        let container = this.physics.add.staticGroup();
        container.create(500, 500, 'verticalWall')
        container.create(300, 300, 'bottomWall');
    }

    update() {
        this.player.shoot(10);
    }
}
