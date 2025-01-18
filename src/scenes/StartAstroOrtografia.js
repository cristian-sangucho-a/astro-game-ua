import Phaser from "phaser";

class StartAstroOrtografia extends Phaser.Scene {
    constructor() {
        super({ key: "StartAstroOrtografia" });
    }

    create() {
        console.log("StartAstroOrtografia scene started");

        // Mostrar la historia del juego
        this.add.text(100, 100, "Historia del Juego", {
            fontSize: "32px",
            fill: "#fff",
        });
        console.log("aaaaaaaaaaaaaaaaaaaa");

        this.add.text(100, 150, "Aquí va la historia del juego...", {
            fontSize: "24px",
            fill: "#fff",
        });
        console.log("bbbbbbbbbbbbbbbbb");

        // Botón para iniciar el juego
        const startButton = this.add.text(100, 200, "Iniciar Juego", {
            fontSize: "24px",
            fill: "#0f0",
        });
        console.log("ccccccccccccccccccc");
    }
}

export default StartAstroOrtografia;
