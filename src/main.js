import Phaser from "phaser";
import StartAstroOrtografia from "./scenes/StartAstroOrtografia";
import Preloader from "./Preloader"; // Ajusta la ruta de importación

// More information about config: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
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
    scene: [StartAstroOrtografia],
};

new Phaser.Game(config);

