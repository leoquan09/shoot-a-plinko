export default class Shop extends Phaser.Scene {
    constructor() {
        super({ key: 'shop' });
    }

    create() {
        const loadSave = (key, fallback) => {
            try {
                const saved = localStorage.getItem(key);
                return saved ? JSON.parse(saved) : fallback;
            } catch (error) {
                localStorage.removeItem(key);
                return fallback;
            }
        };

        this.globalUpgrades = loadSave('globalUpgrades', [
            { level: 2, name: 'Respawn Time', cost: 1500 },
        ]);

        this.pegUpgrades = loadSave('pegUpgrades', [
            { chance: 0.25, name: '2x Cash', cost: 700 },
        ]);

        this.cash = this.registry.get('cash') || 0;
        this.registry.set('globalUpgrades', this.globalUpgrades);
        this.registry.set('pegUpgrades', this.pegUpgrades);

        // Camera & Viewport setup
        this.cameras.main.setViewport(20, 200, 400, 300);
        this.cameras.main.setBackgroundColor('#222222');
        this.cameras.main.setBounds(0, 0, 400, 500);

        this.ypos = 0;

        // Global Upgrades Section
        this.globalLabel = this.add.text(15, 15 + this.ypos++ * 38, 'GLOBAL UPGRADES', { 
            fontSize: '20px', 
            fill: '#dcbaba' 
        });

        this.globalUpgrades.forEach((e) => {
            let button = this.add.text(15, 15 + this.ypos++ * 38, `${e.name} (Time: ${e.level}): ${e.cost}`, { 
                fontSize: '20px', 
                fill: '#ffffff' 
            }).setInteractive({ useHandCursor: true });

            button.on('pointerover', () => button.setStyle({ backgroundColor: '#555555' }));
            button.on('pointerout', () => button.setStyle({ backgroundColor: 'transparent' }));
            button.on('pointerup', () => {
                if (this.cash >= e.cost && e.level >= 0.5) {
                    this.cash -= e.cost;
                    e.cost = Math.round(e.cost * 1.075);
                    e.level -= 0.25;

                    button.setText(`${e.name} (time: ${e.level}): ${e.cost}`);

                    localStorage.setItem('globalUpgrades', JSON.stringify(this.globalUpgrades));
                    this.registry.set('globalUpgrades', this.globalUpgrades);
                    
                    localStorage.setItem('cash', this.cash.toString());
                    this.registry.set('cash', this.cash);
                }
            });
        });

        this.makeExtraSpace(15);

        // Peg Upgrades Section
        this.add.text(15, 15 + this.ypos++ * 38, 'PEG UPGRADES', { 
            fontSize: '20px', 
            fill: '#a1cc97' 
        });

        this.pegUpgrades.forEach((e) => {
            let button = this.add.text(15, 15 + this.ypos++ * 38, `${e.name} (Rate: ${e.chance}%): ${e.cost}`, { 
                fontSize: '20px', 
                fill: '#ffffff' 
            }).setInteractive({ useHandCursor: true });

            button.on('pointerover', () => button.setStyle({ backgroundColor: '#555555' }));
            button.on('pointerout', () => button.setStyle({ backgroundColor: 'transparent' }));
            
            button.on('pointerup', () => {
                if (this.cash >= e.cost) {
                    this.cash -= e.cost;
                    e.cost = Math.round(e.cost * 1.2);
                    e.chance += 0.25;

                    button.setText(`${e.name} (rate: ${e.chance}%): ${e.cost}`);

                    // FIXED: Added JSON.stringify() here
                    localStorage.setItem('pegUpgrades', JSON.stringify(this.pegUpgrades));
                    this.registry.set('pegUpgrades', this.pegUpgrades);
                    
                    localStorage.setItem('cash', this.cash.toString());
                    this.registry.set('cash', this.cash);
                }
            });
        });

        // Mouse wheel scrolling within viewport
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

        // Sync cash changes from other scenes
        const onCashChange = (parent, value) => {
            this.cash = value;
        };
        this.registry.events.on('changedata-cash', onCashChange);

        this.events.once('shutdown', () => {
            this.registry.events.off('changedata-cash', onCashChange);
        });
    }

    makeExtraSpace(size) {
        this.add.text(15, 15 + this.ypos++ * 38, ' ', { 
            fontSize: `${size}px` 
        });
    }
}
