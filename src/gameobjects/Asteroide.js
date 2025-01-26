export class Asteroide extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        
        // Añadir física CORRECTAMENTE
        scene.physics.world.enable(this);
        scene.add.existing(this);

        // Configurar cuerpo físico
        this.body.setSize(80, 80); // Tamaño adecuado para la colisión
        this.body.offset.set(20, 20); // Ajuste preciso del área de colisión
        this.setScale(0.7);

        this.texto = '';
        this.textoObjeto = null;
    }

    setTexto(texto) {
        this.texto = texto;
        if (this.textoObjeto) this.textoObjeto.destroy();
        
        this.textoObjeto = this.scene.add.text(this.x, this.y , texto, {
            fontSize: '20px',
            fontFamily: 'Arial',
            backgroundColor: '#242C4C',
            color: '#FFA500',
        }).setOrigin(0.5);
    }

    destroy() {
        if (this.textoObjeto) this.textoObjeto.destroy();
        super.destroy();
    }
    
}