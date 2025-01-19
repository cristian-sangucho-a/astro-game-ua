import { Game } from "phaser";
import { AstroSinonimosScene } from "./scenes/AstroSinonimosScene";

// More information about config: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    parent: "phaser-container",
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        },
    },
    scene: [AstroSinonimosScene],
};

new Phaser.Game(config);
