import Player from './mainSceneScripts/player.js';
import Board from './mainSceneScripts/board.js';

export default class mainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'mainScene' });
    }

    preload() {
        // Background
        this.load.image('background', 'assets/images/background.jpg');

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
        this.load.audio('themeA', 'assets/audio/background.mp3');
        this.load.audio('themeB', 'assets/audio/background2.mp3');

        // Font Load
        this.load.font('PressStart2P', 'assets/fonts/PressStart2P-Regular.ttf', 'truetype');

        // Cash
        this.load.image('cash', 'assets/images/cash32x16.png');

        // Powerups
        this.load.image('2x Cash', 'assets/images/powerups/2x_money32x32.png');
        this.load.image('chance', 'assets/images/powerups/chance32x32.png');
        this.load.image('player_size', 'assets/images/powerups/player_size32x32.png');
        this.load.image('respawn', 'assets/images/powerups/respawn32x16.png');
        this.load.image('shield', 'assets/images/powerups/shield32x32.png');
        this.load.image('speed', 'assets/images/powerups/speed_upgrade32x32.png');
    }

    collectCash(cash) {
        cash.disableBody(true, true);
        let willEarn = 100;
        let bet = false;

        for (const element of this.board.cash_prize_body.getChildren()) {
            if (element.hasBet === true) {
                bet = true;
            }
        }

        if (cash.hasBet && bet) {
            willEarn *= 4;
        } else if (cash.hasBet === false && bet) {
            willEarn /= 2;
        }

        // Apply the 2x peg multiplier and reset it
        willEarn *= this.multiplier;
        this.multiplier = 1;

        this.player.cash += willEarn;
        this.registry.set('cash', this.player.cash);
        localStorage.setItem('cash', this.player.cash);
    }

    playNextTrack() {
        const trackKey = this.playlist[this.currentTrackIndex];
        this.music = this.sound.add(trackKey, { loop: false, volume: 0.25 });
        this.music.play();

        this.music.once('complete', () => {
            this.music.destroy();
            this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
            this.playNextTrack();
        });
    }

    create() {
        // Check users save state
        const CURRENT_SAVE_VERSION = '2';

        if (localStorage.getItem('saveVersion') !== CURRENT_SAVE_VERSION) {
            localStorage.removeItem('pegUpgrades');
            localStorage.removeItem('globalUpgrades');
            localStorage.removeItem('cash');
            localStorage.setItem('saveVersion', CURRENT_SAVE_VERSION);
        }



        // Track round multiplier
        this.multiplier = 1;

        // Music
        this.game.sound.stopAll();
        this.playlist = ["themeB", "themeA"];
        const isPlaying = this.playlist.some((track) => this.sound.get(track));
        if (!isPlaying) {
            this.currentTrackIndex = 0;
            this.playNextTrack();
        }

        // Background
        const { width, height } = this.cameras.main;
        const bg = this.add.image(width / 2, height / 2, 'background');
        const scaleX = width / bg.width;
        const scaleY = height / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale).setScrollFactor(0);

        // Player Create
        this.player = new Player(this, 200, 100, 'player');

        // Powerup Create
        let powerups = this.physics.add.staticGroup();

        // Cash Score Create
        this.cashText = this.add.text(1085, 25, this.player.cash, {
            fontFamily: '"Press Start 2P"',
            fontSize: '32px',
            color: 'black',
            align: 'right'
        }).setOrigin(1, 0);

        // Cash Icon
        powerups.create(1130, 40, 'cash').setScale(2).refreshBody();

        // Progress Bar
        this.barBg = this.add.image(200, 50, 'emptyBar').setScale(0.75);
        this.bar = this.add.image(200, 50, 'fullBar').setScale(0.75);
        this.bar.setCrop(0, 0, 0, 60);
        this.progress = 0;

        // World Boundary Collision
        this.physics.world.on('worldbounds', (body, up, down, left, right) => {
            if (body.gameObject === this.player) {
                if (down || left || right) {
                    this.multiplier = 1;
                    this.resetPegTriggers();
                    this.player.reset(-100);
                }
            }
        });

        // Progress Bar + Ball Launch
        this.isCharging = false;

        this.input.keyboard.on('keydown-SPACE', () => {
            this.player.increasePower(200);
            this.progress += 15;
            this.bar.setCrop(0, 0, this.progress, 60);
        });

        this.input.keyboard.on('keyup-SPACE', () => {
            this.player.shoot(200);
            this.progress = 0;
            this.bar.setCrop(0, 0, 0, 60);
        });

        this.input.on('pointerdown', () => {
            this.isCharging = true;
        });

        this.input.on('pointerup', () => {
            if (this.isCharging) {
                this.isCharging = false;
                this.player.shoot(200);
                this.progress = 0;
                this.bar.setCrop(0, 0, 0, 60);
            }
        });

        // Board Class
        this.board = new Board(this);

        // Cash Collider
        this.physics.add.overlap(
            this.player,
            this.board.cash_prize_body,
            (player, cash) => { this.collectCash(cash); },
            null,
            this
        );

        // Load shop
        this.scene.launch('shop');

        // Wait time powerup
        this.waitTime = 2000;
        const upgrades = this.registry.get('globalUpgrades');
        if (upgrades && Object.values(upgrades)[0] !== undefined) {
            this.waitTime = Object.values(upgrades)[0] * 1000;
        }

        const onLvlChange = (parent, value) => {
            if (value && Object.values(value)[0] !== undefined) {
                this.waitTime = Object.values(value)[0] * 1000;
            }
        };
        this.registry.events.on('changedata-globalUpgrades', onLvlChange);

        // Physics Collider
        this.physics.add.collider(this.player, [
            this.board.borders,
            this.board.dividers,
        ]);

        this.physics.add.collider(this.player, this.board.pegs, (player, peg) => {
            console.log(peg.texture.key);
            if (peg.texture.key === '2x Cash' && !peg.isTriggered) {
                peg.isTriggered = true;
                this.multiplier *= 2;
            }
        });

        // Reset Physics Boundaries
        this.scale.on('resize', (gameSize) => {
            this.physics.world.setBounds(0, 0, gameSize.width, gameSize.height);
        });

        const onCashChange = (parent, value) => {
            this.player.cash = value;
        };
        this.registry.events.on('changedata-cash', onCashChange);
    }

    resetPegTriggers() {
        if (this.board && this.board.pegs) {
            for (const peg of this.board.pegs.getChildren()) {
                peg.isTriggered = false;
            }
        }
    }

    update() {
        // Charging for mouse and touch screen
        if (this.isCharging) {
            this.player.increasePower(20);
            this.progress += 1.5;
            this.bar.setCrop(0, 0, this.progress, 60);
        }

        // Respawning Mechanics
        const inXRange = this.player.x >= 446 && this.player.x <= 1046;
        const inYRange = this.player.y >= 700 && this.player.y <= 750;
        const isGrounded = this.player.body.touching.down || this.player.body.blocked.down;

        // Check if in prize box (Make sure player doesn't bounce out)
        if (inXRange && inYRange) {
            this.player.setVelocityX(0);
            if (isGrounded && Math.abs(this.player.body.velocity.y) < 8 && !this.isResetting) {
                this.isResetting = true;
                this.time.delayedCall(2000, () => {
                    this.multiplier = 1;
                    this.resetPegTriggers();
                    this.board.reset();
                    this.player.reset(0);
                    this.isResetting = false;
                }, [], this);
            }
        } else if (this.player.body.velocity.x === 0 && inXRange) {
            this.player.setVelocityX(20);
        }

        // Update Cash Text
        this.cashText.setText(Math.floor(this.player.cash));
    }
}
