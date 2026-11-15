export default class Board {
    constructor(scene, textures) {
        this.scene = scene
        this.textures = textures;
    
        this.borders = scene.physics.add.staticGroup();

        this.create_board(scene)
    }

    create_board() {
        this.borders.create(446, 479, this.textures[0]).setScale(1.1).refreshBody();
        this.borders.create(1046, 479, this.textures[0]).setScale(1.1).refreshBody();
        this.borders.create(750, 746, this.textures[1]).setScale(2).refreshBody();
        this.borders.create(200, 125, this.textures[1]).setScale(0.001).refreshBody();
    }
}
