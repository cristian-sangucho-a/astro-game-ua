// Class to preload all the assets
// Remember you can load this assets in another scene if you need it
class Preloader extends Phaser.Scene {
    constructor() {
        super({ key: "Preloader" });
    }

    preload() {
        // Cargar todos los recursos
        this.load.setPath("assets");
        this.load.image("logo", "logo.png");
        this.load.image("floor");
        this.load.image("background", "background.png");

        this.load.image("player", "player/player.png");
        this.load.atlas(
            "propulsion-fire",
            "player/propulsion/propulsion-fire.png",
            "player/propulsion/propulsion-fire_atlas.json"
        );
        this.load.animation(
            "propulsion-fire-anim",
            "player/propulsion/propulsion-fire_anim.json"
        );

        // Balas
        this.load.image("bullet", "player/bullet.png");
        this.load.image("flares");

        // Enemigos
        this.load.atlas(
            "enemy-blue",
            "enemies/enemy-blue/enemy-blue.png",
            "enemies/enemy-blue/enemy-blue_atlas.json"
        );
        this.load.animation(
            "enemy-blue-anim",
            "enemies/enemy-blue/enemy-blue_anim.json"
        );
        this.load.image("enemy-bullet", "enemies/enemy-bullet.png");

        // Fuentes
        this.load.bitmapFont(
            "pixelfont",
            "fonts/pixelfont.png",
            "fonts/pixelfont.xml"
        );
        this.load.image("knighthawks", "fonts/knight3.png");

        // Evento para actualizar la barra de carga
        this.load.on("progress", (progress) => {
            console.log("Loading: " + Math.round(progress * 100) + "%");
        });
    }

    create() {
        // Crear fuente bitmap y cargarla en el caché
        const config = {
            image: "knighthawks",
            width: 31,
            height: 25,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET6,
            charsPerRow: 10,
            spacing: { x: 1, y: 1 },
        };
        this.cache.bitmapFont.add(
            "knighthawks",
            Phaser.GameObjects.RetroFont.Parse(this, config)
        );

        // Cuando todos los recursos están cargados, ir a la siguiente escena
        this.scene.start("StartAstroOrtografia");
    }
}

export default Preloader;

