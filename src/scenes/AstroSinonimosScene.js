// Configuración inicial de Phaser
/*const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};*/

//const game = new Phaser.Game(config);
import { Scene } from "phaser";
// Definición de la clase AstroSinonimosScene
export class AstroSinonimosScene extends Scene {
    constructor() {
        super({ key: 'AstroSinonimosScene' });
        this.nave = null;
        this.carriles = [200, 400, 600]; // Carriles en las posiciones X
        this.carrilActual = 1; // Índice del carril inicial (centro)
        this.asteroides = null;
        this.disparos = null;
        this.teclaIzquierda = null;
        this.teclaDerecha = null;
        this.teclaEspacio = null;
        this.lectorPantalla = null;
    }

    preload() {
        this.load.image('nave', '../assets/meteorito_ortografia.svg');
        this.load.image('asteroide', '../assets/meteorito_ortografia.svg');
        this.load.image('laser', 'ruta/laser.png');
    }

    create() {
        // Crear nave
        this.nave = this.physics.add.sprite(this.carriles[this.carrilActual], 500, 'nave');
        this.nave.setCollideWorldBounds(true);
        this.nave.setData('aria-label', 'Nave espacial en el carril central');

        // Crear asteroides
        this.asteroides = this.physics.add.group();
        for (let i = 0; i < 3; i++) {
            const asteroide = this.asteroides.create(this.carriles[i], 200, 'asteroide');
            asteroide.setImmovable(true);
            asteroide.texto = `Texto ${i + 1}`; // Asignar texto al asteroide
            asteroide.setData('aria-label', `Asteroide ${i + 1} en el carril ${i + 1}`); // Accesibilidad
        }

        // Crear grupo de disparos
        this.disparos = this.physics.add.group();

        // Colisiones entre disparos y asteroides
        this.physics.add.overlap(this.disparos, this.asteroides, this.destruirAsteroide, null, this);

        // Controles
        this.teclaIzquierda = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.teclaDerecha = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.teclaEspacio = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Configurar accesibilidad
        this.configurarAccesibilidad();
    }

    update() {
        // Movimiento de la nave entre carriles
        if (Phaser.Input.Keyboard.JustDown(this.teclaIzquierda) && this.carrilActual > 0) {
            this.carrilActual--;
            this.nave.setX(this.carriles[this.carrilActual]);
            this.nave.setData('aria-label', `Nave espacial en el carril ${this.carrilActual + 1}`);
            this.anunciar(`Nave movida al carril ${this.carrilActual + 1}`);
        } else if (Phaser.Input.Keyboard.JustDown(this.teclaDerecha) && this.carrilActual < this.carriles.length - 1) {
            this.carrilActual++;
            this.nave.setX(this.carriles[this.carrilActual]);
            this.nave.setData('aria-label', `Nave espacial en el carril ${this.carrilActual + 1}`);
            this.anunciar(`Nave movida al carril ${this.carrilActual + 1}`);
        }

        // Disparo de la nave
        if (Phaser.Input.Keyboard.JustDown(this.teclaEspacio)) {
            this.disparar();
        }
    }

    disparar() {
        const disparo = this.disparos.create(this.nave.x, this.nave.y - 20, 'laser');
        disparo.setVelocityY(-300);
        this.anunciar('Disparo realizado');
    }

    destruirAsteroide(disparo, asteroide) {
        disparo.destroy(); // Eliminar el disparo
        asteroide.destroy(); // Eliminar el asteroide
        this.anunciar(`Asteroide destruido con texto: ${asteroide.texto}`); // Anunciar destrucción
    }

    configurarAccesibilidad() {
        // Asignar tabindex para navegación por teclado
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.setAttribute('tabindex', '0');
            canvas.setAttribute('role', 'application');
            canvas.setAttribute('aria-label', 'Juego de nave espacial con tres carriles y asteroides');
            canvas.focus(); // Enfocar automáticamente el canvas

            // Gestionar eventos de foco y teclado
            canvas.addEventListener('keydown', (event) => {
                switch (event.key) {
                    case 'ArrowLeft':
                        if (this.carrilActual > 0) {
                            this.carrilActual--;
                            this.nave.setX(this.carriles[this.carrilActual]);
                            this.anunciar(`Nave movida al carril ${this.carrilActual + 1}`);
                        }
                        break;
                    case 'ArrowRight':
                        if (this.carrilActual < this.carriles.length - 1) {
                            this.carrilActual++;
                            this.nave.setX(this.carriles[this.carrilActual]);
                            this.anunciar(`Nave movida al carril ${this.carrilActual + 1}`);
                        }
                        break;
                    case ' ': // Barra espaciadora
                        this.disparar();
                        break;
                }
            });
        }

        // Crear un lector de pantalla invisible
        this.lectorPantalla = document.createElement('div');
        this.lectorPantalla.setAttribute('aria-live', 'polite');
        this.lectorPantalla.setAttribute('role', 'status');
        this.lectorPantalla.style.position = 'absolute';
        this.lectorPantalla.style.left = '-9999px';
        this.lectorPantalla.style.top = '-9999px';
        document.body.appendChild(this.lectorPantalla);
    }

    anunciar(mensaje) {
        if (this.lectorPantalla) {
            this.lectorPantalla.textContent = mensaje;
        }
    }
}
