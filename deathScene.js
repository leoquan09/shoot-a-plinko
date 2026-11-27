export default class deathScene extends Phaser.Scene {
    constructor() {
        super('deathScene');
    }

    init() {
        this.round = localStorage.getItem('level') || 1;
        this.score = localStorage.getItem('cash') || 0;
        this.quota = localStorage.getItem('quota') || 500;
        this.shortfall = Math.max(0, this.quota - this.score);
    }

    preload() {
        this.load.image('bg', 'assets/images/background.jpg');
        this.load.image('title-img', 'assets/images/title_img.png');
    }

    create() {
        const { width, height } = this.cameras.main;

        const bg = this.add.image(width / 2, height / 2, 'bg');
        const scaleX = width / bg.width;
        const scaleY = height / bg.height; 
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale).setScrollFactor(0);

        const titleImg = this.add.image(width / 2, height * 0.22, 'title-img')
            .setScale(10) 
            .setOrigin(0.5, 0.5);

        this.add.text(width / 2, height * 0.40, 'GAME OVER', {
            fontFamily: '"Press Start 2P"',
            fontSize: '56px',
            color: '#000000'
        }).setResolution(window.devicePixelRatio).setOrigin(0.5, 0.5);

        this.add.text(width / 2, height * 0.51, 'YOU DID NOT MEET THE QUOTA', {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: '#1b4f9c'
        }).setResolution(window.devicePixelRatio).setOrigin(0.5, 0.5);

        const statsText = [
            `ROUND: ${this.round}`,
            `OFF BY: ${this.shortfall.toLocaleString()} PTS`
        ].join('\n\n');

        this.add.text(width / 2, height * 0.66, statsText, {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            color: '#000000',
            align: 'center',
            lineSpacing: 16
        }).setResolution(window.devicePixelRatio).setOrigin(0.5, 0.5);

        this.restartText = this.add.text(width / 2, height * 0.86, 'PRESS ANY KEY TO TRY AGAIN', {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            color: '#2563eb'
        }).setResolution(window.devicePixelRatio).setOrigin(0.5, 0.5);

        this.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {
                this.restartText.visible = !this.restartText.visible;
            }
        });
    }

    update() {
        this.input.on('pointerdown', () => {
            this.scene.start('mainScene');
        });

        this.input.keyboard.on('keyup', () => {
            this.scene.start('mainScene');
        });
    }
}
