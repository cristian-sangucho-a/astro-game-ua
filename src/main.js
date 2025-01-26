import { Game } from "phaser";
import { AstroSinonimosScene } from "./scenes/AstroSinonimosScene";
import { Preload } from "./scenes/Preload";

// More information about config: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    parent: "phaser-container", // Asegúrate de que este ID coincida con el contenedor en el HTML
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        },
    },
    scene: [Preload, AstroSinonimosScene],
};

new Game(config);
