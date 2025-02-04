import { Nave } from '../gameobjects/Nave';
import { Misil } from '../gameobjects/Misil';
import { Asteroide } from '../gameobjects/Asteroide';

export class AstroSinonimosScene extends Phaser.Scene {
    constructor() {
        super({ key: 'AstroSinonimosScene' });
        this.nave = null;
        this.carriles = [133, 266, 399, 532, 665]; // Arreglo para almacenar las posiciones X de los carriles
        this.carrilActual = 2; // Índice del carril inicial (centro)
        this.asteroides = null;
        this.disparos = null;
        this.teclaIzquierda = null;
        this.teclaDerecha = null;
        this.teclaEspacio = null;
        this.lectorPantalla = null;
        this.contadorDisparos = 0; // Contador de disparos
        this.contadorAciertos = 0; // Contador de aciertos
        this.contadorFallos = 0; // Contador de fallos
        this.textoContador = null; // Texto para mostrar el contador de disparos
        this.textoAciertos = null; // Texto para mostrar el contador de aciertos
        this.textoFallos = null
        this.preguntaActual = null; // Pregunta actual (sinónimo)
        this.sinonimoCorrecto = null; // Sinónimo correcto para la pregunta
        this.textoPregunta = null; // Texto para mostrar la pregunta en pantalla
        this.preguntasUtilizadas = []; // Arreglo para almacenar las preguntas ya utilizadas
        this.preguntasOriginales = [
            { pregunta: "Velocidad", correcto: "Rapidez", incorrectos: ["Lentitud", "Distancia", "Altura", "Presición"] },
            { pregunta: "Casa", correcto: "Hogar", incorrectos: ["Jardín", "Edificio", "Altura", "Presición"] },
            { pregunta: "Feliz", correcto: "Contento", incorrectos: ["Triste", "Enojado", "Altura", "Presición"] }
        ];
        this.preguntasDisponibles = [];
        this.progressBarInicial = document.getElementById('progress-bar');
        this.progressBarInicial.style.width = `0%`;
        
    }

    create() {
        // Configurar preguntas al inicio
        this.preguntasDisponibles = Phaser.Utils.Array.Shuffle([...this.preguntasOriginales]);
        
        // Configurar accesibilidad primero
        this.configurarAccesibilidad();

        // Fondo
        const bg = this.add.image(0, 0, 'fondo').setOrigin(0, 0);
        bg.setDisplaySize(this.game.config.width, this.game.config.height);
        bg.setAlpha(0.6);
    
        // Crear nave
        this.nave = new Nave(this, this.carriles[this.carrilActual], 500, 'nave');

        // Crear asteroides
        this.asteroides = this.physics.add.group();
        
        // Crear contenedor de pregunta
        this.contenedorPregunta = this.add.container(this.game.config.width / 2, 20);
        
        // Crear texto de pregunta
        this.textoPregunta1 = this.add.text(0, 0, "Pregunta",{
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
        }).setOrigin(0.5, 0);

        this.textoPregunta2 = this.add.text(0, 35, '', {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 3,
            backgroundColor: '#74BCAC',
        }).setOrigin(0.5, 0);

        this.contenedorPregunta.add([this.textoPregunta1, this.textoPregunta2]);

        // Generar primera pregunta
        this.generarNuevaPregunta();
    
        // Crear grupo de disparos
        this.disparos = this.physics.add.group({
            classType: Misil,
            maxSize: 4,
            runChildUpdate: true
        });
    
        // Colisiones
        this.physics.add.overlap(
            this.disparos,
            this.asteroides,
            this.destruirAsteroide,
            null,
            this
        );
    
        // Controles
        this.teclaIzquierda = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.teclaDerecha = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.teclaEspacio = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.teclaEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    
        // Mostrar contador de disparos
        this.textoContador = this.add.text(10, 550, 'Disparos efectuados: 0', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        });
        this.botonPausa = this.add.image(this.game.config.width -50, this.game.config.height - 50, 'pausa')
        .setInteractive()
        .setScale(0.8)
        .on('pointerdown', () => {
            this.anunciar('Juego pausado. Presiona ESC para continuar.');
            this.scene.pause('AstroSinonimosScene');
            this.scene.launch('PausaScene', { 
                parentScene: this 
            });
        });
    }

    obtenerTextoAsteroides() {
        return this.asteroides.getChildren()
            .map(ast => ast.texto)
            .join(', ');
    }


    reiniciarJuego() {
        // Lógica para reiniciar el juego
        this.scene.restart();
    }


    mostrarPopupCorrecto(textoCorrecto) {
        // Crear texto de feedback visual
        const textoPopup = this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2,
            '¡Correcto!\n' + textoCorrecto,
            {
                fontSize: '34px',
                fill: '#00FF00',
                backgroundColor: '',
                padding: { x: 20, y: 10 },
                align: 'center'
            }
        )
        .setOrigin(0.5)
        .setDepth(1000);
    
        // Crear elemento ARIA para lectores de pantalla
        const ariaPopup = document.createElement('div');
        ariaPopup.setAttribute('aria-live', 'assertive');
        ariaPopup.textContent = `¡Correcto! ${textoCorrecto} es el sinónimo correcto.`;
       
    
        // Eliminar después de 4 segundos
        this.time.delayedCall(4000, () => {
            textoPopup.destroy();
        });
    }

    mostrarPopupIncorrecto(textoIncorrecto) {
        // Crear texto de feedback visual
        const textoPopup = this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2,
            '¡INCORRECTO!\n' + textoIncorrecto,
            {
                fontSize: '48px',
                fill: '#FF0000',
                backgroundColor: '',
                padding: { x: 20, y: 10 },
                align: 'center'
            }
        )
        .setOrigin(0.5)
        .setDepth(1000);
    
        // Crear elemento ARIA para lectores de pantalla
        const ariaPopup = document.createElement('div');
        ariaPopup.setAttribute('aria-live', 'assertive');
        ariaPopup.textContent = `Incorrecto. ${textoIncorrecto} no es el sinónimo correcto.`;
    
        // Eliminar después de 4 segundos
        this.time.delayedCall(4000, () => {
            textoPopup.destroy();
        });
    }

    generarNuevaPregunta() {
        // Verificar si hay preguntas disponibles
        if (this.preguntasDisponibles.length === 0) {
            this.progressBarInicial.style.width = `100%`;
            this.anunciar(`¡Juego completado! Has obtenido ${this.contadorAciertos} aciertos. 
                Presiona reiniciar para jugar de nuevo.`);
            this.reiniciarContadores();
            this.physics.pause();
            this.scene.restart();
            return;
        }

        // Seleccionar y remover la primera pregunta de las disponibles
        const pregunta = this.preguntasDisponibles.shift();
        this.preguntaActual = pregunta.pregunta;
        this.sinonimoCorrecto = pregunta.correcto;

        // Asignar palabras a los asteroides
        const palabras = [pregunta.correcto, ...pregunta.incorrectos];
        Phaser.Utils.Array.Shuffle(palabras);

        // Limpiar asteroides anteriores
        this.asteroides.clear(true, true);
    
        // Crear nuevos asteroides
        for (let i = 0; i < palabras.length; i++) {
            const asteroide = new Asteroide(
                this, 
                this.carriles[i], 
                i % 2 === 0 ? 150 : 180, 
                'asteroide'
            );
            asteroide.setImmovable(true);
            asteroide.setScale(0.7);
            asteroide.body.setSize(asteroide.width * 0.8, asteroide.height * 0.8);
            asteroide.setTexto(palabras[i]);
            this.asteroides.add(asteroide);
        }
    
        // Actualizar texto de pregunta
        if (this.textoPregunta2) {
            this.textoPregunta2.setText(`¿Qué sinónimo corresponde a: ${this.preguntaActual}?`);
        }

        // Anunciar la nueva pregunta
        const opciones = this.obtenerTextoAsteroides();
        const mensajeAnuncio = `Nueva pregunta: ¿Qué sinónimo corresponde a: ${this.preguntaActual}? Las opciones son: ${opciones}`;
        
        this.anunciar(mensajeAnuncio);
    }

    disparar() {
        const disparo = this.disparos.get(this.nave.x, this.nave.y - 30, 'misil');
        if (disparo) {
            disparo.setActive(true).setVisible(true);
            disparo.setVelocityY(-300);
            disparo.setScale(0.3);
            disparo.body.setSize(disparo.width * 0.1, disparo.height * 0.1);
            disparo.setData('activo', true);

            // Incrementar y actualizar el contador de disparos
            this.anunciar('Disparo realizado, te quedan ' + (3 - this.contadorDisparos) + ' disparos');
            this.contadorDisparos++;
            
            this.actualizarContador();
            this.anunciar('Disparo realizado');
        }
    }

    destruirAsteroide(disparo, asteroide) {
        if (disparo.getData('activo')) {
            disparo.setData('activo', false);
            disparo.destroy();
    
            // Verificar si el asteroide impactado es el correcto
            if (asteroide.texto === this.sinonimoCorrecto) {
                this.contadorAciertos++;
                this.actualizarContadorAciertos();
                
                // Mostrar popup y anunciar
                this.mostrarPopupCorrecto(asteroide.texto);
                this.anunciar(`¡Correcto! ${asteroide.texto} es el sinónimo de ${this.preguntaActual}.`);
    
                // Retrasar la siguiente acción
                this.time.delayedCall(4000, () => {
                    asteroide.destroy();
                    this.generarNuevaPregunta();
                    this.anunciar(`Nueva pregunta: ${this.preguntaActual}. Opciones: ${this.obtenerTextoAsteroides()}`);
                });
            } else {
                this.contadorFallos++;
                this.actualizarContadorFallos();
                
                // Mostrar popup y anunciar
                this.mostrarPopupIncorrecto(asteroide.texto);
                this.anunciar(`Incorrecto. ${asteroide.texto} no es el sinónimo de ${this.preguntaActual}.`);
    
                // Destruir el asteroide inmediatamente
                asteroide.destroy();
            }
        }
    }
    // En la clase AstroSinonimosScene
    destroy() {
        // Limpiar el botón si es necesario
        if (this.botonReiniciar) {
            this.botonReiniciar.removeListener('click');
            this.botonReiniciar.destroy();
        }
        super.destroy();
    }

    actualizarContador() {
        this.textoContador.setText(`Disparos: ${this.contadorDisparos}`);
        
    }

    actualizarContadorAciertos() {
        document.getElementById('hit-counter').textContent = this.contadorAciertos;
        // Calcular progreso basado en aciertos
        const totalPreguntas = this.preguntasOriginales.length;
        const progreso = (this.contadorAciertos / totalPreguntas) * 100;
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progreso}%`;
        }
    }

    actualizarContadorFallos() {
        document.getElementById('miss-counter').textContent = this.contadorFallos;
    }

    update() {
        if (this.scene.isPaused()) return; // Detener controles si está pausado
    
        // Añadir comprobación de tecla ESC
        if (Phaser.Input.Keyboard.JustDown(this.teclaEsc)) {
            this.anunciar('Juego pausado. Presiona ESC para continuar.');
            this.scene.pause('AstroSinonimosScene');
            this.scene.launch('PausaScene', { 
                parentScene: this 
            });
        }
    
        // Resto del código de update existente
        if (Phaser.Input.Keyboard.JustDown(this.teclaIzquierda) && this.carrilActual > 0) {
            this.carrilActual--;
            this.nave.mover(this.carriles, this.carrilActual);
            this.anunciarAsteroideApuntado();
        } else if (Phaser.Input.Keyboard.JustDown(this.teclaDerecha) && this.carrilActual < this.carriles.length - 1) {
            this.carrilActual++;
            this.nave.mover(this.carriles, this.carrilActual);
            this.anunciarAsteroideApuntado();
        }
    
        if (Phaser.Input.Keyboard.JustDown(this.teclaEspacio)) {
            this.disparar();
        }
    }

    anunciarAsteroideApuntado() {
        const asteroide = this.asteroides.getChildren()[this.carrilActual];
        if (asteroide) {
            this.anunciar(`Te has movido al carril ${this.carrilActual + 1} de ${this.carriles.length}. 
                El asteroide en este carril dice: ${asteroide.texto}`);
        }
    }

    reiniciarContadores() {
        this.contadorDisparos = 0;
        this.contadorAciertos = 0;
        this.contadorFallos = 0;
        this.actualizarContador();
        this.actualizarContadorAciertos();
        this.actualizarContadorFallos();
    }

    configurarAccesibilidad() {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.setAttribute('tabindex', '0');
            canvas.setAttribute('role', 'application');
            canvas.setAttribute('aria-label', 'Juego de nave espacial con cinco carriles y asteroides');
            canvas.focus();
            this.lectorPantalla = document.createElement('div');
            this.lectorPantalla.setAttribute('aria-live', 'polite');
            this.lectorPantalla.setAttribute('role', 'status');
            this.lectorPantalla.style.position = 'absolute';
            this.lectorPantalla.style.left = '-9999px';
            this.lectorPantalla.style.top = '-9999px';
            document.body.appendChild(this.lectorPantalla);
        }
    }

    anunciar(mensaje) {
        if (this.lectorPantalla) {
            this.lectorPantalla.textContent = mensaje;
        }
    }
}
