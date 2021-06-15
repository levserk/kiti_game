import * as PIXI from "pixi.js";
import * as planck from "planck-js";

import { Primitive } from "./Primitive";

const { Vec2 } = planck;

export class Triangle extends Primitive {
  init(x, y, {size}) {
    const body = this.createBody(
      planck.Polygon([
        Vec2(-1.0 * size, 0 * size),
        Vec2(0 * size, 1.0 * size),
        Vec2(1.0 * size, 0 * size),
      ]),
      "dynamic",
      Vec2(x, y),
      Math.PI + 0.2
    );
    const sprite = new PIXI.Container();
    const g = new PIXI.Graphics();

    g.lineStyle(1, 0xffffff, 1);
    g.drawPolygon([
      new PIXI.Point(-1 * size * this.scale, 0 * size * this.scale),
      new PIXI.Point(0 * size * this.scale, 1 * size * this.scale),
      new PIXI.Point(1 * size * this.scale, 0 * size * this.scale),
    ]);
    g.endFill();
    g.cacheAsBitmap = true;
    sprite.addChild(g);

    this.body = body;
    this.sprite = sprite;
  }
}
