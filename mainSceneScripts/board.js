export default class Board {
    constructor(scene, textures) {
        this.scene = scene
        this.textures = textures;
    
        this.borders = scene.physics.add.staticGroup();
        this.pegs = scene.physics.add.staticGroup();
        this.dividers = scene.physics.add.staticGroup();
        this.cash_prize_body = scene.physics.add.staticGroup()

        this.create_board()
        this.create_pegs()
        this.create_dividers()
        this.create_cash()
    }

    create_board() {
        this.borders.create(446, 479, this.textures[0]).setScale(1.1).refreshBody();
        this.borders.create(1046, 479, this.textures[0]).setScale(1.1).refreshBody();
        this.borders.create(750, 746, this.textures[1]).setScale(2).refreshBody();
        this.borders.create(200, 125, this.textures[1]).setScale(0.001).refreshBody();
    }

    create_pegs() {
        // Create pegs
        let x_pos = 485
        let y_pos = 250
        let num_col = 9

        // Per Row
        for (let row = 0; row < 9; row++) {
            // Create Row Offset
            if (row % 2 === 0) {
                x_pos += 32.5;
                num_col -= 1;
            }

            // Per column
            for (let col = 0; col < num_col; col++) {
                this.pegs.create(x_pos, y_pos, 'peg').setScale(0.5).refreshBody().body.setCircle(8)
                x_pos += 65;
            }
            y_pos += 50
            x_pos = 485
            num_col = 9
        }
    }

    create_dividers() {
        let x_pos = 495

        for (let num = 0; num < 11; num++) {
            this.dividers.create(x_pos, 715, 'divider')
            x_pos += 50;
        }
    }

    create_cash() {
        let x_pos = 470
        
        for (let i=0; i < 12; i++) {
            this.cash_prize_body.create(x_pos, 725, 'cash')
            x_pos += 50
        }
    }

    reset() {
        this.borders.clear(true, true);
        this.pegs.clear(true, true);
        this.dividers.clear(true, true);
        this.cash_prize_body.clear(true, true);

        this.create_board();
        this.create_pegs();
        this.create_dividers();
        this.create_cash();
    }
}
