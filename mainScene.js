import Player from './mainSceneScripts/player.js';

export default class mainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'mainScene' });
    }

    preload() {
        // Load shop
        this.scene.launch('shop');

        // Player
        this.load.image('player', 'assets/images/ball.png');

        // Walls
        this.load.image('verticalWall', 'assets/images/walls/wall_vertical.png');
        this.load.image('bottomWall', 'assets/images/walls/wall_bottom.png');
        this.load.image('peg', 'assets/images/walls/peg.png');
        this.load.image('divider', 'assets/images/walls/divider.png');

        // Progress Bar
        this.load.image('fullBar', 'assets/images/progress_bar/full.png');
        this.load.image('emptyBar', 'assets/images/progress_bar/empty.png');

        // Audio
        this.load.audio('theme', 'assets/audio/background.mp3');

        // Font Load
        this.load.font('PressStart2P', 'assets/fonts/PressStart2P-Regular.ttf', 'truetype');

        // Powerups
        this.load.image('cash_power', 'assets/images/powerups/cash32x16.png')
    }

    create() {
        // Player Create
        this.player = new Player(this, 200, 100, 'player');

        // Load Music
        const music = this.sound.add('theme', { loop: true, volume: 0.75 });
        music.play();

        // Powerup Create
        let powerups = this.physics.add.staticGroup()
        // ADD POWERUP CREATE HERE
        
        // Cash Create
        this.cashText = this.add.text(1085, 25, this.player.cash, {
            fontFamily: '"Press Start 2P"',
            fontSize: '32px',
            color: 'black',
            align: 'right'
        }).setOrigin(1, 0);

        // Cash Icon
        powerups.create(1130, 40, 'cash_power').setScale(2).refreshBody()

        // Progress Bar
        this.barBg = this.add.image(200, 50, 'emptyBar').setScale(0.75);
        this.bar = this.add.image(200, 50, 'fullBar').setScale(0.75);
        this.bar.setCrop(0, 0, 0, 60);
        this.progress = 0;

        // World Boundary Collision
        this.physics.world.on('worldbounds', (body, up, down, left, right) => {
            if (body.gameObject === this.player) {
                if (down || left || right) {
                    this.player.reset();
                }
            }
        });

        // Progress Bar + Ball Launch
        this.isCharging = false;

        this.input.keyboard.on('keydown-SPACE', () => {
            this.player.increasePower();
            this.progress += 15;
            this.bar.setCrop(0, 0, this.progress, 60);
        });

        this.input.keyboard.on('keyup-SPACE', () => {
            this.player.shoot();
            this.progress = 0;
            this.bar.setCrop(0, 0, 0, 60);
        });

        this.input.on('pointerdown', () => {
            this.isCharging = true;
        });

        this.input.on('pointerup', () => {
            if (this.isCharging) {
                this.isCharging = false;
                this.player.shoot();
                this.progress = 0;
                this.bar.setCrop(0, 0, 0, 60);
            }
        });

        // Walls
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

        // Per Row
        for (let row = 0; row < 9; row++) {
            // Create Row Offset
            if (row % 2 === 0) {
                x_pos += 32.5;
                num_col -= 1;
            }

            // Per column
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
            x_pos += 50;
        }
        
        // Physics Collider
        this.physics.add.collider(this.player, [borders, pegs, dividers]);
        // Reset Physics Boundaries
        this.scale.on('resize', (gameSize) => {
            this.physics.world.setBounds(0, 0, gameSize.width, gameSize.height);
        });
    }

    update() {
        // Charging for mouse and touch screen
        if (this.isCharging) {
            this.player.increasePower();
            this.progress += 15; 
            this.bar.setCrop(0, 0, this.progress, 60);
        }

        const inXRange = this.player.x >= 446 && this.player.x <= 1046;
        const inYRange = this.player.y >= 700 && this.player.y <= 750;
        const isGrounded = this.player.body.touching.down || this.player.body.blocked.down;

        // Check if in prize box (Make sure player doesn't bounce out)
        if (inXRange && inYRange) {
            this.player.setVelocityX(0)

            if (isGrounded && Math.abs(this.player.body.velocity.y) < 8 && !this.isResetting) {
                this.isResetting = true;
                console.log("Resetting 1")
                this.time.delayedCall(2000, () => {
                    this.player.reset();
                    this.isResetting = false;
                }, [], this);
            } 

        } else if (this.player.body.velocity.x === 0 && inXRange) { 
            this.player.setVelocityX(20)
        }

        this.cashText.setText(this.player.cash)
    }
}
