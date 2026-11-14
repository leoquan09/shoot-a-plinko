import startScene from './startScene.js';
import mainScene from './mainScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    scene: [startScene, mainScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#D0E1F9',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 500 }
        }
    }
};

const game = new Phaser.Game(config);
