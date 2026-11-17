export default class creditsScene extends Phaser.Scene {
    constructor() {
        super('creditsScene');
    }

    preload() {
        this.load.image('bg', 'assets/images/background.jpg');
        this.load.audio('bgMusic', 'assets/audio/background.mp3');
    }

    create() {
        this.game.sound.stopAll();
        const music = this.sound.add("bgMusic", { loop: true });
        music.setVolume(0.25)
        music.play();

        const { width, height } = this.cameras.main;
        const bg = this.add.image(width / 2, height / 2, 'bg');

        const scaleX = width / bg.width;
        const scaleY = height / bg.height; 
        const scale = Math.max(scaleX, scaleY);

        bg.setScale(scale).setScrollFactor(0);

        this.title = this.add.text(625, 50, 'CREDITS', {
            fontFamily: '"Press Start 2P"',
            fontSize: '32px',
            color: '#000000'
        }).setResolution(window.devicePixelRatio).setOrigin(0.5, 0.5);

        this.credits = this.add.text(250, 300,
            'Lead Programmer | Leo Quan\n' +
            'Secondary Programmer | Eldridge Huang\n' +
            'Graphics Designer | Arjun Krishnan\n\n\n' +
            "Music: www.classicals.de | Korobeiniki\n" +
            "Background: www.abposters.com | Pixeleart",
            {
                fontFamily: "Courier, Serif",
                fontSize: "32px",
                color: "#000000"
            }
        )

        this.place = this.add.text(500, 780,
            "HackClub Haven San Jose, CA 2026",
            {
                fontFamily: "Courier, Serif",
                fontSize: "12px",
                color: "#0000000"
            }
        )

        this.next = this.add.text(475, 725, 'Press Any Key', {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            color: '#319ac3'
        })

        this.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {
                this.next.visible = !this.next.visible;
            }
        });
    }

    update() {
        this.input.on('pointerdown', () => {
            this.scene.start('tutorialScene');
        });

        this.input.keyboard.on('keyup', () => {
            this.scene.start('tutorialScene');
        });


    }
}
