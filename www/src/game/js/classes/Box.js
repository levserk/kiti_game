import * as PIXI from "pixi.js";
import * as planck from "planck-js";

import { Primitive } from "./Primitive";

const { Vec2 } = planck;

export class Box extends Primitive {
  init(x, y, {size}) {
    const body = this.createBody(
      planck.Box(size / 2, size / 2),
      "dynamic",
      Vec2(x, y)
    );
    const sprite = new PIXI.Container();
    const g = new PIXI.Graphics();
    g.lineStyle(1, 0xffffff, 1);
    g.drawRect(
      (-size / 2) * this.scale,
      (-size / 2) * this.scale,
      size * this.scale,
      size * this.scale
    );
    g.endFill();
    g.cacheAsBitmap = true;
    sprite.addChild(g);

    this.body = body;
    this.sprite = sprite;
  }

  getSize() {
    return this.options.size / 2;
  }
}
