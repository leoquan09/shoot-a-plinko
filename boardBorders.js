class BoardBorders extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, blocks) {
        super(scene, x, y, blocks);
        scene.add.existing(this);
        scene.physics.add.existing(true, this)
        
    }
}   
