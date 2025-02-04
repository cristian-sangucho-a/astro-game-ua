export class PausaScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PausaScene' });
        this.parentScene = null;
    }

    init(data) {
        this.parentScene = data.parentScene;
    }

    create() {
        // Fondo semi-transparente
        const background = this.add.rectangle(
            this.game.config.width / 2, 
            this.game.config.height / 2, 
            this.game.config.width, 
            this.game.config.height, 
            0x000000, 
            0.7
        );

        // Título de Pausa
        this.add.text(
            this.game.config.width / 2, 
            this.game.config.height / 2 + 150, 
            'Reanudar', 
            {
                fontSize: '64px',
                fill: '#74BCAC',
                fontFamily: 'Arial',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5);

        // Botón de Continuar
        const botonContinuar = this.add.image(
            this.game.config.width / 2, 
            this.game.config.height / 2, 
            'botonContinuar'
        )
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.reanudarJuego();
        });

        // Configurar tecla ESC globalmente
        this.input.keyboard.on('keydown-ESC', () => {
            this.reanudarJuego();
        });
    }

    reanudarJuego() {
        this.scene.resume('AstroSinonimosScene');
        this.scene.stop('PausaScene');
    }
}