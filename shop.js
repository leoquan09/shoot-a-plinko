export default class Shop extends Phaser.Scene {
    constructor() {
        super({ key: 'shop' });
    }

    create() {  
        let globalUpgrades = JSON.parse(localStorage.getItem('globalUpgrades')) || [{'level': 1, 'name': 'speed up', 'cost': 1500}]
        let pegUpgrades = JSON.parse(localStorage.getItem('pegUpgrades')) || [
            { 'chance': 0.00, 'name': '2x cash peg', 'cost': 300 }
        ]

        this.cash = this.registry.get('cash') || 0;

        this.cameras.main.setViewport(20, 200, 400, 200);
        this.cameras.main.setBackgroundColor('#222222');

        this.cameras.main.setBounds(0, 0, 400, 500);

        let ypos = 0
        globalUpgrades.forEach((e) => {
            let button = this.add.text(15, 15  + ypos++ * 38, `${e.name} (level ${e.level}): ${e.cost}`, { 
                fontSize: '20px', 
                fill: '#ffffff' 
            }).setInteractive();

            button.on('pointerover', () => button.setStyle({ backgroundColor: '#555555' }));
            button.on('pointerout', () => button.setStyle({ backgroundColor: 'transparent' }));
            button.on('pointerup', () => console.log('button clicked'));
        });

        let cashTotal = this.add.text(15, 15 + ypos++ * 38, `Total cash: ${this.cash}`, { 
            fontSize: '20px', 
            fill: '#ffffff' 
        });


        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            const cam = this.cameras.main;
            if (
                pointer.x >= cam.x && 
                pointer.x <= cam.x + cam.width && 
                pointer.y >= cam.y && 
                pointer.y <= cam.y + cam.height
            ) {
                cam.scrollY += deltaY * 0.5;
            }
        });
        this.registry.events.on('changedata-cash', (parent, value) => {
            this.cash = value;
            cashTotal.setText(`Total cash: ${this.cash}`);
        });
    }
}
