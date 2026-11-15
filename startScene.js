export default class startScene extends Phaser.Scene {
    constructor() {
        super('startScene');
    }

    preload() {
        this.load.image('bg', 'assets/images/background.jpg');
        this.load.audio('bgMusic', 'assets/audio/background.mp3');
    }

    create() {
        const { width, height } = this.cameras.main;
        const bg = this.add.image(width / 2, height / 2, 'bg');

        const scaleX = width / bg.width;
        const scaleY = height / bg.height; 
        const scale = Math.max(scaleX, scaleY);

        bg.setScale(scale).setScrollFactor(0);

        this.add.text(450, 370, 'SHOOT A PLINKO', {
            fontFamily: 'courier',
            fontSize: '32px',
            color: '#000000'
        }).setResolution(window.devicePixelRatio);

        const music = this.sound.add('bgMusic', { loop: true, volume: 1 });
        music.play();
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
