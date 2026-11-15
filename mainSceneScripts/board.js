export default class Board {
    constructor(scene) {
        this.scene = scene
    
        this.borders = scene.physics.add.staticGroup();
        this.pegs = scene.physics.add.staticGroup();
        this.dividers = scene.physics.add.staticGroup();
        this.cash_prize_body = scene.physics.add.staticGroup();

        this.create_board()
        this.create_pegs()
        this.create_dividers()
        this.create_cash()

        scene.registry.events.on('changedata-pegUpgrades', (parent, value) => {
            this.pegUpgrades = value
        });

        this.callBackFns = {
            '2x': () => {
                this.scene.player.cash *= 2;
                this.scene.registry.set('cash', this.scene.player.cash);
                localStorage.setItem('cash', this.scene.player.cash);
            }
        }
    }

    create_board() {
        this.borders.create(446, 479, 'verticalWall').setScale(1.1).refreshBody();
        this.borders.create(1046, 479, 'verticalWall').setScale(1.1).refreshBody();
        this.borders.create(750, 746, 'bottomWall').setScale(2).refreshBody();
        this.borders.create(200, 125, 'bottomWall').setScale(0.001).refreshBody();
    }

    create_pegs() {
        this.pegUpgrades = this.scene.registry.get('pegUpgrades') || JSON.parse(localStorage.getItem('pegUpgrades')) || [];

        // Create pegs
        let x_pos = 485;
        let y_pos = 250;
        let num_col = 9;

        // Per Row
        for (let row = 0; row < 9; row++) {
            // Create Row Offset
            if (row % 2 === 0) {
                x_pos += 32.5;
                num_col -= 1;
            }

            // Per column
            for (let col = 0; col < num_col; col++) {
                let name = 'peg';
                if (this.pegUpgrades.length > 0) {
                    for (const element of this.pegUpgrades) {
                        let rand_num = Math.random() * 100;
                        
                        if (rand_num <= element.chance) {
                            name = element.name;
                            console.log(element.name)
                            break
                        } else {
                            name = "peg";
                        }
                    }
                }
                this.pegs.create(x_pos, y_pos, name).setScale(0.5).refreshBody().body.setCircle(8)
                        x_pos += 65;
            };
                    
            y_pos += 50;
            x_pos = 485;
            num_col = 9;
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
        let x_pos = 470;
        let hasBet = false;
        for (let i = 0; i < 12; i++) {
            const cash = this.cash_prize_body.create(x_pos, 725, 'cash')
                .setInteractive()
                .setTint(0xFFD700);
            
            cash.hasBet = false;

            cash.on('pointerdown', (pointer, localX, localY, event) => {
                if (!hasBet) {
                    cash.setTint(0xEFBF04);
                    cash.setScale(1.4);
                    cash.hasBet = true;
                    hasBet = true;   
                }
                if (event) {
                    event.stopPropagation();
                }
            });
            x_pos += 50;
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
