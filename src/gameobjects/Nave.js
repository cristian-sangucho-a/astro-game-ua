export class Nave extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setScale(0.5);
        this.body.setSize(this.width * 0.5, this.height * 0.5); // Ajustar hitbox
    }

    mover(carriles, carrilActual) {
        this.setX(carriles[carrilActual]);
    }
}
