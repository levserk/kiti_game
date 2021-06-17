import * as PIXI from "pixi.js";
import * as planck from "planck-js";

import { Circle } from "./Circle";
import { Primitive } from "./Primitive";

const { Vec2 } = planck;

export class SoftBodyMesh extends Primitive {
  init(x, y, { size }) {
    const scale = this.scale;
    this.size = size;
    const texture = this.createTexture();
    const r = size / 4;
    const n = Math.floor((size * Math.PI) / r / 1.2);

    let circles = [];
    let uvs = [0.5, 0.5 /*, 1, 0.5*/];
    let indices = [];

    let center = this.createBody(
      planck.Circle(Vec2(0, 0), r * 2),
      "dynamic",
      Vec2(x, y)
    );

    for (let i = 0; i < n; i++) {
      let angle = (i * 2 * Math.PI) / n;
      let dx = Math.cos(angle) * (size - r);
      let dy = Math.sin(angle) * (size - r);

      circles[i] = this.createBody(
        planck.Circle(Vec2(0, 0), r),
        "dynamic",
        Vec2(x + dx, y + dy)
      );
      circles[i].setFixedRotation(true);

      this.createJoint(circles[i], center);
      if (i > 0) {
        this.createJoint(circles[i], circles[i - 1]);
      }
      if (i === n - 1) {
        this.createJoint(circles[i], circles[0]);
      }

      //mesh
      uvs = [...uvs, dx * 0.5 + 0.5, dy * 0.5 + 0.5];
      //vertices = [...vertices, dx * s * 0.5, dy * s * 0.5];
      if (i > 0) {
        indices = [...indices, 0, i, i + 1];
      }
    }

    circles.unshift(center);

    indices = [...indices, 0, n, 1];

    const vertices = this.bodiesToVertices(circles);

    console.log({ vertices, uvs, indices, circles, n });

    const sprite = new PIXI.SimpleMesh(texture, vertices, uvs, indices);

    this.bodies = circles;
    this.sprite = sprite;
  }

  createTexture() {
    const graphics = new PIXI.Graphics();
    //graphics.lineStyle(5, 0xffffff, 1);
    graphics.beginFill(0xde3249, 1);
    graphics.drawCircle(0, 0, 50);
    graphics.endFill();
    graphics.beginFill(0x153249, 1);
    graphics.drawCircle(0, 0, 30);
    graphics.endFill();

    return this.renderer.generateTexture(graphics);
  }

  update() {
    const pos = this.bodies[0].getPosition();

    this.sprite.position.set(pos.x * this.scale, pos.y * this.scale);
    //this.sprite.rotation = this.bodies[0].getAngle();
    this.sprite.vertices = this.bodiesToVertices(this.bodies);
  }

  bodiesToVertices(bodies) {
    const center = bodies[0].getPosition();
    return bodies.reduce((vertices, b) => {
      const pos = b.getPosition();
      const x = pos.x - center.x;
      const y = pos.y - center.y;

      vertices.push(x * this.scale * 1.3);
      vertices.push(y * this.scale * 1.3);
      return vertices;
    }, []);
  }

  destroy() {
    for (let body of this.bodies) {
      this.world.destroyBody(body);
    }
  }

  checkPoint(x, y) {
    const pos = this.bodies[0].getPosition();
    return Math.sqrt((pos.x - x) ^ (2 + (pos.y - y)) ^ 2) < this.options.size;
  }
}
