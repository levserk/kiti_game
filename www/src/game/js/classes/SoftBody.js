import * as planck from "planck-js";
import * as PIXI from "pixi.js";
import { Primitive } from "./Primitive";
import { Circle } from "./Circle";

const { Vec2 } = planck;

export class SoftBody extends Primitive {
  init(x, y, size) {
    const scale = this.scale;
    const r = size / 3;
    const n = Math.floor((size * Math.PI) / r / 1);
    let circles = [];

    let center = new Circle(this.world, { x, y, size: r * 2, scale });
    circles.push(center);

    for (let i = 0; i < n; i++) {
      let angle = (i * 2 * Math.PI) / n;
      let dx = Math.cos(angle) * size;
      let dy = Math.sin(angle) * size;

      circles[i] = new Circle(this.world, {
        x: x + dx,
        y: y + dy,
        size: r,
        scale,
      });
      circles[i].body.setFixedRotation(true);

      this.createJoint(circles[i].body, center.body);
      if (i > 0) {
        this.createJoint(circles[i].body, circles[i - 1].body);
      }
      if (i === n - 1) {
        this.createJoint(circles[i].body, circles[0].body);
      }
    }

    this.objects = circles;
  }

  update() {
    for (let obj of this.objects) {
      obj.update();
    }
  }

  getChildren() {
    return this.objects.map((b) => b.sprite);
  }
}
