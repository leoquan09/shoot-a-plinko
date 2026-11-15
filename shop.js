export default class Shop extends Phaser.Scene {
    constructor() {
        super({ key: 'shop' });
    }

    create() {  
        let powerups = JSON.parse(localStorage.getItem('powerups')) || [{ 'level': 0, 'name': 'board', 'cost': 500 }, {'level': 0, 'name': 'split', 'cost': 1500}]

        this.cameras.main.setViewport(50, 250, 300, 200);
        this.cameras.main.setBackgroundColor('#222222');

        this.cameras.main.setBounds(0, 0, 300, 200);

        let ypos = 0
        powerups.forEach((e) => {
        let button = this.add.text(15, 15  + ypos++ * 38, `${e.name} (level ${e.level}): ${e.cost}`, { 
            fontSize: '20px', 
            fill: '#ffffff' 
        }).setInteractive();

            button.on('pointerover', () => button.setStyle({ backgroundColor: '#555555' }));
            button.on('pointerout', () => button.setStyle({ backgroundColor: 'transparent' }));
            button.on('pointerup', () => console.log('button clicked'));
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
    }
}
