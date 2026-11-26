import startScene from './startScene.js';
import mainScene from './mainScene.js';
import tutorialScene from './tutorialScene.js'
import creditsScene from './creditsScene.js'
import Shop from './shop.js';
import DeathScene from './deathScene.js';

const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 800,

  scene: [startScene, creditsScene, tutorialScene, mainScene, Shop, DeathScene],
  scale: {
    parent: "game-container",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: "#D0E1F9",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 1000 },
    },
  },
};

const game = new Phaser.Game(config);
