import Player from './player.js';

export default class mainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'mainScene' });
    }

    preload() {
        this.load.image('player', 'images/ball.png');
        this.load.image('verticalWall', 'images/wall_vertical.png');
        this.load.image('bottomWall', 'images/wall_bottom.png');
        this.load.image('peg', 'images/peg.png')
    }

    create() {
        this.player = new Player(this, 200, 100, 'player');
        this.input.keyboard.on('keydown-SPACE', () => {
            this.player.increasePower();
            console.log(this.player.power);
        });

        this.input.keyboard.once('keyup-SPACE', () => this.player.shoot());

    
        // Create Walls and Platforms
        let borders = this.physics.add.staticGroup();
        borders.create(446, 479, 'verticalWall').setScale(1.1).refreshBody();
        borders.create(1046, 479, 'verticalWall').setScale(1.1).refreshBody();
        borders.create(750, 746, 'bottomWall').setScale(2).refreshBody();
        borders.create(200, 125, 'bottomWall').setScale(0.5).refreshBody()

        // Create pegs
        let pegs = this.physics.add.staticGroup();

        let x_pos = 480
        let y_pos = 250
        let num_col = 9

        for (let row = 0; row < 7; row++) {
            if (row % 2 === 0) {
                x_pos += 25
                num_col -= 1
            }

            for (let col = 0; col < num_col; col++) {
                pegs.create(x_pos, y_pos, 'peg').setScale(0.5).refreshBody().body.setCircle(8)
                x_pos += 50;
            }

            y_pos += 50
            x_pos = 480
            num_col = 9
        }
        
        // Create prize dividers
        let dividers = this.physics.add.staticGroup();

        // for (let )

        // Physics Collider
        this.physics.add.collider(this.player, [borders, pegs, this.platform]);
    }

    update() {
    }
}
