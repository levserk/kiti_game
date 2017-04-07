const PIXI = require('pixi.js');

const WHITE = 0xffffff;

class Particle extends PIXI.Graphics {
    constructor(size, color) {
        super();

        this.size = size > 3 ? size : 3;
        this.color = color;
        this.timeCreation = Date.now();
        this.hspeed = 0;
        this.vspeed = 0;
        this.haccel = 0;
        this.vaccel = 0;

        this.draw();
    }

    draw() {
        this.drawFilledCircleWithoutBounds(this.size, this.color, 1);
        this.drawFilledCircleWithoutBounds(this.size * 0.6, WHITE, 0.5);
        this.drawFilledCircleWithoutBounds(this.size * 0.4, WHITE, 0.9);
    }

    drawFilledCircleWithoutBounds(radius, color, alpha) {
        this.lineStyle(0);
        this.beginFill(color, alpha);
        this.drawCircle(0, 0, radius);
        this.endFill();
    }

    render() {
        this.hspeed += this.haccel;
        this.vspeed += this.vaccel;
        this.x += this.hspeed;
        this.y += this.vspeed;
    }
}

export default Particle;
