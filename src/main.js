import Phaser from "phaser";
import AstroSinonimosScene from "./scenes/AstroSinonimosScene"; // Ajusta la ruta de importación
import Preloader from "./Preloader"; // Ajusta la ruta de importación

// More information about config: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    parent: "phaser-container",
    width: 800,
    height: 500,
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
        },
    },
    scene: [Preloader, AstroSinonimosScene], // Ajusta el orden de las escenas
};

new Phaser.Game(config);

