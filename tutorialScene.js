export default class tutorialScene extends Phaser.Scene {
    constructor() {
        super('tutorialScene');
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

        this.title = this.add.text(625, 50, 'TUTORIAL', {
            fontFamily: '"Press Start 2P"',
            fontSize: '32px',
            color: '#000000'
        }).setResolution(window.devicePixelRatio).setOrigin(0.5, 0.5);

        this.content = this.add.text(300, 150, 
            "SPACE / CLICK -->  LAUNCH POWER\n" +
            "CLICK PRIZE CASH --> BET\n\n\n" +
            "OUT OF BOUNDS --> -100\n\n\n" +
            "GAMBLING --> CLICK REWARD CASH\n" +
            "   NO BET --> + $100\n" +
            "   WIN --> 4x MONEY\n" +
            "   LOSE --> -50% CASH\n\n\n" +
            "SHOP --> POWERUPS\n" +
            "   FORMAT --> NAME (LEVEL): $ PRICE\n" + 
            "   GLOBAL POWERUPS --> GUARENTEED\n" +
            "   PIN POWERUPS --> % CHANCE SPAWN", {
            fontFamily: 'Courier, Serif',
            fontSize: '32px',
            color: '#000000'
        }
        )

        this.next = this.add.text(475, 750, 'Press Any Key', {
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
