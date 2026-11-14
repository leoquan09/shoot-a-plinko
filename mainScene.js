import Player from './player.js';

export default class mainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'mainScene' });
    }

    preload() {
        this.load.image('player', 'images/ball.png');
        this.load.image('verticalWall', 'images/wall_vertical.png');
        this.load.image('bottomWall', 'images/wall_bottom.png');
        this.load.image('peg', 'images/peg.png');
        this.load.image('divider', 'images/divider.png');
        this.load.image('fullBar', 'images/full.png');
        this.load.image('emptyBar', 'images/empty.png');
    }

    create() {
        this.barBg = this.add.image(200, 50, 'emptyBar').setScale(0.75);
        this.bar = this.add.image(200, 50, 'fullBar').setScale(0.75);
        this.bar.setCrop(0, 0, 0, 60);
        this.progress = 0;

        this.player = new Player(this, 200, 100, 'player');

        this.physics.world.on('worldbounds', (body, up, down, left, right) => {
            if (body.gameObject === this.player) {
                if (up || down || left || right) {
                    this.player.reset();
                    this.progress = 0;
                    this.bar.setCrop(0, 0, 0, 60);
                }
            }
        });
        
        this.input.keyboard.on('keydown-SPACE', () => {
            this.player.increasePower();
            this.progress += 10;
            this.bar.setCrop(0, 0, this.progress, 60);
        });

        this.input.keyboard.on('keyup-SPACE', () => this.player.shoot());


        let borders = this.physics.add.staticGroup();
        borders.create(446, 479, 'verticalWall').setScale(1.1).refreshBody();
        borders.create(1046, 479, 'verticalWall').setScale(1.1).refreshBody();
        borders.create(750, 746, 'bottomWall').setScale(2).refreshBody();
        borders.create(200, 125, 'bottomWall').setScale(0.5).refreshBody();

        // Create pegs
        let pegs = this.physics.add.staticGroup();
        let x_pos = 485
        let y_pos = 250
        let num_col = 9

        for (let row = 0; row < 9; row++) {
            if (row % 2 === 0) {
                x_pos += 32.5
                num_col -= 1
            }
            for (let col = 0; col < num_col; col++) {
                pegs.create(x_pos, y_pos, 'peg').setScale(0.5).refreshBody().body.setCircle(8)
                x_pos += 65;
            }
            y_pos += 50
            x_pos = 485
            num_col = 9
        }
        
        // Create prize dividers
        let dividers = this.physics.add.staticGroup();
        x_pos = 495

        for (let num = 0; num < 11; num++) {
            dividers.create(x_pos, 715, 'divider')
            x_pos += 50
        }
        

        // Physics Collider
        this.physics.add.collider(this.player, [borders, pegs, dividers]);

        // reset physics boudaries
        this.scale.on('resize', (gameSize) => {
            this.physics.world.setBounds(0, 0, gameSize.width, gameSize.height);
        });
    }

    update() {
    }
}
