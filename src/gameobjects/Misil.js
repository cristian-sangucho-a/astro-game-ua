export class Misil extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.3);
        this.body.setSize(this.width * 0.1, this.height * 0.1); // Ajustar el hitbox
        this.setVelocityY(-300); // Velocidad inicial hacia arriba
    }
}
