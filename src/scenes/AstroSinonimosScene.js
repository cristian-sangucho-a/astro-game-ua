// Configuración inicial de Phaser
const config = {
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
};

const game = new Phaser.Game(config);

let nave;
let carriles = [200, 400, 600]; // Carriles en las posiciones X
let carrilActual = 1; // Índice del carril inicial (centro)
let asteroides;
let disparos;
let teclaIzquierda;
let teclaDerecha;
let teclaEspacio;
let lectorPantalla;

function preload() {
    this.load.image('nave', 'ruta/nave.png');
    this.load.image('asteroide', 'ruta/asteroide.png');
    this.load.image('laser', 'ruta/laser.png');
}

function create() {
    // Crear nave
    nave = this.physics.add.sprite(carriles[carrilActual], 500, 'nave');
    nave.setCollideWorldBounds(true);
    nave.setData('aria-label', 'Nave espacial en el carril central');

    // Crear asteroides
    asteroides = this.physics.add.group();
    for (let i = 0; i < 3; i++) {
        const asteroide = asteroides.create(carriles[i], 200, 'asteroide');
        asteroide.setImmovable(true);
        asteroide.texto = `Texto ${i + 1}`; // Asignar texto al asteroide
        asteroide.setData('aria-label', `Asteroide ${i + 1} en el carril ${i + 1}`); // Accesibilidad
    }

    // Crear grupo de disparos
    disparos = this.physics.add.group();

    // Colisiones entre disparos y asteroides
    this.physics.add.overlap(disparos, asteroides, destruirAsteroide, null, this);

    // Controles
    teclaIzquierda = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    teclaDerecha = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    teclaEspacio = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Configurar accesibilidad
    configurarAccesibilidad();
}

function update() {
    // Movimiento de la nave entre carriles
    if (Phaser.Input.Keyboard.JustDown(teclaIzquierda) && carrilActual > 0) {
        carrilActual--;
        nave.setX(carriles[carrilActual]);
        nave.setData('aria-label', `Nave espacial en el carril ${carrilActual + 1}`);
        anunciar(`Nave movida al carril ${carrilActual + 1}`);
    } else if (Phaser.Input.Keyboard.JustDown(teclaDerecha) && carrilActual < carriles.length - 1) {
        carrilActual++;
        nave.setX(carriles[carrilActual]);
        nave.setData('aria-label', `Nave espacial en el carril ${carrilActual + 1}`);
        anunciar(`Nave movida al carril ${carrilActual + 1}`);
    }

    // Disparo de la nave
    if (Phaser.Input.Keyboard.JustDown(teclaEspacio)) {
        disparar.call(this);
    }
}

function disparar() {
    const disparo = disparos.create(nave.x, nave.y - 20, 'laser');
    disparo.setVelocityY(-300);
    anunciar('Disparo realizado');
}

function destruirAsteroide(disparo, asteroide) {
    disparo.destroy(); // Eliminar el disparo
    asteroide.destroy(); // Eliminar el asteroide
    anunciar(`Asteroide destruido con texto: ${asteroide.texto}`); // Anunciar destrucción
}

function configurarAccesibilidad() {
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
                    if (carrilActual > 0) {
                        carrilActual--;
                        nave.setX(carriles[carrilActual]);
                        anunciar(`Nave movida al carril ${carrilActual + 1}`);
                    }
                    break;
                case 'ArrowRight':
                    if (carrilActual < carriles.length - 1) {
                        carrilActual++;
                        nave.setX(carriles[carrilActual]);
                        anunciar(`Nave movida al carril ${carrilActual + 1}`);
                    }
                    break;
                case ' ': // Barra espaciadora
                    disparar.call(this);
                    break;
            }
        });
    }

    // Crear un lector de pantalla invisible
    lectorPantalla = document.createElement('div');
    lectorPantalla.setAttribute('aria-live', 'polite');
    lectorPantalla.setAttribute('role', 'status');
    lectorPantalla.style.position = 'absolute';
    lectorPantalla.style.left = '-9999px';
    lectorPantalla.style.top = '-9999px';
    document.body.appendChild(lectorPantalla);
}

function anunciar(mensaje) {
    if (lectorPantalla) {
        lectorPantalla.textContent = mensaje;
    }
}
