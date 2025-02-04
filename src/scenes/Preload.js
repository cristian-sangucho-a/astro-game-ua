export class Preload extends Phaser.Scene {
    constructor() {
        super({ key: 'Preload' });
    }
    
    preload() {
        this.load.image('nave', 'src/assets/Nave.png');
        this.load.image('asteroide', 'src/assets/Meteorito.png');
        this.load.image('misil', 'src/assets/misil.png'); 
        this.load.image('fondo', 'src/assets/Espacio_fondo.png');
        this.load.image('pausa', 'src/assets/pausa.png');
        this.load.image('botonContinuar', 'src/assets/botonContinuar.png');
    }

    create() {
        this.scene.start('AstroSinonimosScene'); // Cambiar a la escena principal
    }
}
