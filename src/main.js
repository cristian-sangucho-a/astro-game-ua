import { Game } from "phaser";
import { AstroSinonimosScene } from "./scenes/AstroSinonimosScene";
import { Preload } from "./scenes/Preload";
import { PausaScene } from "./scenes/PausaScene";

// More information about config: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-container',
    scene: [Preload, AstroSinonimosScene, PausaScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

new Game(config);
