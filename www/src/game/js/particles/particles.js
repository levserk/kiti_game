const PIXI = require("pixi.js");

import Particle from "./particle";

const MAX = 5000;
const TIME_LIFE = 15000;
const SPEED = 5;
const FRIC = 0.98;
const MAX_SIZE = 8;

const options = {
  scale: true,
  position: true,
  rotation: false,
  uvs: false,
  alpha: true
};

class Particles extends PIXI.Container {
  constructor(width, height) {
    super(MAX, options);

    this.maxWidht = width;
    this.maxHeight = height;
  }

  render(delta) {
    let removing = [];

    for (let particle of this.children) {
      particle.render(delta);
      particle.update(delta);
      if (this.checkParticle(particle)) {
        removing.push(particle);
      }
    }

    for (let i = 0; i < removing.length; i++) {
      this.removeChild(removing[i]);
      removing[i].destroy();
    }
  }

  checkParticle(particle) {
    return (
      Date.now() - particle.timeCreation > TIME_LIFE ||
      //particle.x < 0 - particle.width ||
      //particle.y < 0 - particle.height ||
      //particle.x > this.maxWidht + particle.width ||
      //particle.y > this.maxHeight + particle.height ||
      particle.alpha < 0.05
    );
  }

  create(x, y, color, count = 50) {
    console.log(`CreateParticles`, x, y, color, count);
    for (let i = 0; i < count; i++) {
      this.createParticle(x, y, color);
    }
  }

  createParticle(x, y, color) {
    let particle = new Particle(Math.random() * MAX_SIZE, color);
    this.addChild(particle);
    particle.angle = Math.random() * 2 * Math.PI;
    particle.speed = SPEED / 2 + (Math.random() * SPEED) / 3;
    particle.fric = FRIC - (Math.random() * 3) / 100;
    particle.x = x;
    particle.y = y;
    particle.hspeed = particle.speed * Math.cos(particle.angle);
    particle.vspeed = particle.speed * Math.sin(particle.angle);
    particle.vaccel = 0.3;
  }
}

export default Particles;
