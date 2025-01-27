import { Nave } from '../gameobjects/Nave';
import { Misil } from '../gameobjects/Misil';
import { Asteroide } from '../gameobjects/Asteroide';

export class AstroSinonimosScene extends Phaser.Scene {
    constructor() {
        super({ key: 'AstroSinonimosScene' });
        this.nave = null;
        this.carriles = [133, 266, 399, 532, 665]; // Arreglo para almacenar las posiciones X de los carriles
        this.carrilActual = 1; // Índice del carril inicial (centro)
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
            { pregunta: "Velocidad", correcto: "Rapidez", incorrectos: ["Lentitud", "Distancia", "Altura", "Presicion"] },
            { pregunta: "Casa", correcto: "Hogar", incorrectos: ["Jardín", "Edificio", "Altura", "Presicion"] },
            { pregunta: "Feliz", correcto: "Contento", incorrectos: ["Triste", "Enojado", "Altura", "Presicion"] }
        ];
        this.preguntasDisponibles = [];
        this.progressBarInicial = document.getElementById('progress-bar');
        this.progressBarInicial.style.width = `0%`;
    }

    create() {

        this.configurarAccesibilidad();
        // Fondo
        const bg = this.add.image(0, 0, 'fondo').setOrigin(0, 0);
        bg.setDisplaySize(this.game.config.width, this.game.config.height);
        bg.setAlpha(0.6);
    
        // Crear nave
        this.nave = new Nave(this, this.carriles[this.carrilActual], 500, 'nave');

        // Crear asteroides
        this.asteroides = this.physics.add.group();

        // Configurar preguntas
        this.preguntasDisponibles = Phaser.Utils.Array.Shuffle([...this.preguntasOriginales]);
        
        // Contenedor de pregunta DEBE CREARSE ANTES de generar la primera pregunta
        this.contenedorPregunta = this.add.container(this.game.config.width / 2, 20);
        // Anunciar pregunta INICIAL
        this.anunciar(`Nueva pregunta: ${this.preguntaActual}. Opciones: ${this.obtenerTextoAsteroides()}`);
        // Elementos de texto DEBEN INICIALIZARSE UNA SOLA VEZ
        this.textoPregunta1 = this.add.text(0, 0, '', {
            fontSize: '32px',
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
            classType: Misil, // Especifica la clase que se usará para los disparos
            maxSize: 4, // Número máximo de disparos en el grupo empieza en 0
            runChildUpdate: true // Asegura que se llame a update en cada disparo
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
    
        // Mostrar contador de disparos
        this.textoContador = this.add.text(10, 550, 'Disparos efectuados: 0', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        });
    
        
    
        // Crear un contenedor para los textos de la pregunta
        this.contenedorPregunta = this.add.container(this.game.config.width / 2, 20);
    
        // Texto de la pregunta (primera línea)
        this.textoPregunta1 = this.add.text(
            0, // Posición X relativa al contenedor
            0, // Posición Y relativa al contenedor
            '¿Qué palabra le corresponde al siguiente sinónimo?',
            {
                fontSize: '32px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 3,
                backgroundColor: '#74BCAC',
            }
        ).setOrigin(0.5, 0); // Centrar el texto horizontalmente
    

        // Agregar ambos textos al contenedor
        this.contenedorPregunta.add([this.textoPregunta1, this.textoPregunta2]);
    
        // Configurar accesibilidad
        this.configurarAccesibilidad();
    
        // Anunciar la pregunta inicial
        this.anunciar(`¿Qué palabra le corresponde al siguiente sinónimo? ${this.preguntaActual}`);
        
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

    generarNuevaPregunta() {
    
        if (this.preguntasDisponibles.length === 0) {
            this.progressBarInicial.style.width = `100%`;
            alert('¡Juego terminado! Felicidades.');
            this.anunciar('¡Juego completado! Presiona reiniciar para jugar de nuevo.');
            this.reiniciarContadores();
            this.physics.pause();
            this.scene.restart();
            if (this.reiniciarJuego){ 
                this.contadorDisparos = 0 
                this.contadorAciertos = 0
                this.contadorFallos = 0
            }
            return;
        }

        // Seleccionar y remover la primera pregunta de las disponibles
        const pregunta = this.preguntasDisponibles.shift();
        this.preguntaActual = pregunta.pregunta;
        this.sinonimoCorrecto = pregunta.correcto;

        // Asignar palabras a los asteroides
        const palabras = [pregunta.correcto, ...pregunta.incorrectos];
        
        Phaser.Utils.Array.Shuffle(palabras);

        // Limpiar asteroides y sus textos
        this.asteroides.clear(true, true);
    
        // Crear asteroides con las palabras asignadas
        this.asteroides.clear(true, true); // Limpiar asteroides anteriores
        for (let i = 0; i < palabras.length; i++) {
            if ((i%2) != 0) {
                const asteroide = new Asteroide(this, this.carriles[i], 180, 'asteroide');
                asteroide.setImmovable(true);
                asteroide.setScale(0.7);
                asteroide.body.setSize(asteroide.width * 0.9, asteroide.height * 0.9);
                asteroide.setTexto(palabras[i]); // Asignar palabra al asteroide
                this.asteroides.add(asteroide);
            } else {
                const asteroide = new Asteroide(this, this.carriles[i], 150, 'asteroide');
                asteroide.setImmovable(true);
                asteroide.setScale(0.7);
                asteroide.body.setSize(asteroide.width * 0.7, asteroide.height * 0.7);
                asteroide.setTexto(palabras[i]); // Asignar palabra al asteroide
                this.asteroides.add(asteroide);
            }
            
        }
    
        // Actualizar el texto de la pregunta en el contenedor
        if (this.textoPregunta2) {
            this.textoPregunta2.setText(`${this.preguntaActual}`);
        }
        this.anunciar(`Nueva pregunta: ${this.preguntaActual}. Opciones: ${this.obtenerTextoAsteroides()}`);
        
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
                this.contadorAciertos++; // Incrementar el contador de aciertos
                this.actualizarContadorAciertos(); // Actualizar el texto del contador
                document.getElementById('hit-counter').textContent = this.contadorAciertos;
                this.anunciar(`¡Lo lograste, sinónimo encontrado! Aciertos: ${this.contadorAciertos}`);
                this.generarNuevaPregunta(); // Generar nueva pregunta
                this.anunciar(`Nueva pregunta: ¿Qué palabra le corresponde al siguiente sinónimo? ${this.preguntaActual}`);
            } else {
                this.contadorFallos++;
                this.actualizarContadorFallos();
                document.getElementById('miss-counter').textContent = this.contadorFallos;
                this.anunciar(`Fallaste. ${asteroide.texto} no es el sinónimo de ${this.preguntaActual}`);
            }

            asteroide.destroy();
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
            this.anunciar(`Asteroide con la palabra: ${asteroide.texto}`);
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
            canvas.setAttribute('aria-label', 'Juego de nave espacial con tres carriles y asteroides');
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
