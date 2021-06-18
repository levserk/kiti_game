import * as PIXI from "pixi.js";
import * as planck from "planck-js";

import { Primitive } from "./Primitive";

const { Vec2 } = planck;

export class Circle extends Primitive {
  init(x, y, {size}) {
    const body = this.createBody(
      planck.Circle(Vec2(0, 0), size),
      "dynamic",
      Vec2(x, y)
    );
    const sprite = new PIXI.Container();
    const g = new PIXI.Graphics();
    g.lineStyle(1, 0xffffff, 1);
    g.drawCircle(0, 0, size * this.scale);
    g.endFill();
    g.cacheAsBitmap = true;
    sprite.addChild(g);

    this.body = body;
    this.sprite = sprite;
  }
}
