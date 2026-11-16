export default class startScene extends Phaser.Scene {
    constructor() {
        super('startScene');
    }

    preload() {
        this.load.image('bg', 'assets/images/background.jpg');
        this.load.audio('bgMusic', 'assets/audio/background.mp3');
        this.load.image('title-img', 'assets/images/title_img.png');
    }

    create() {
        const { width, height } = this.cameras.main;
        const bg = this.add.image(width / 2, height / 2, 'bg');

        const scaleX = width / bg.width;
        const scaleY = height / bg.height; 
        const scale = Math.max(scaleX, scaleY);

        bg.setScale(scale).setScrollFactor(0);

        const title_img = this.add.image(600, 200, 'title-img').setScale(20)

        this.title = this.add.text(625, 460, 'SHOOT A PLINKO', {
            fontFamily: '"Press Start 2P"',
            fontSize: '64px',
            color: '#000000'
        }).setResolution(window.devicePixelRatio).setOrigin(0.5, 0.5);

        this.next = this.add.text(475, 525, 'Press Any Key', {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            color: '#319ac3'
        })

        this.credits = this.add.text(475, 750, 'Press C for Credits', {
            fontFamily: '"Press Start 2P"',
            fontSize: "16px",
            color: '#316bc3'
        })

        this.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {
                this.next.visible = !this.next.visible;
            }
        });
    
        this.game.sound.stopAll();

        const music = this.sound.add('bgMusic', { loop: true });
        music.setVolume(0.25)
        music.play();
    }

    update() {
        this.input.on('pointerdown', () => {
            this.scene.start('tutorialScene');
        });

        this.input.keyboard.on('keyup', () => {
            if (event.keyCode !== Phaser.Input.Keyboard.KeyCodes.C) {
                this.scene.start('tutorialScene');
            } else {
                this.scene.start('creditsScene')
            }
        });


    }
}
