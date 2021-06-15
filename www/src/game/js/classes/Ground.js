import * as planck from "planck-js";
import * as PIXI from "pixi.js";
import { Primitive } from "./Primitive";

const { Vec2 } = planck;

export class Ground extends Primitive {
  init(x, y, size) {
    const body = this.createBody(
      planck.Edge(Vec2(x - size / 2, y), Vec2(x + size / 2, y))
    );

    const sprite = new PIXI.Container();
    const g = new PIXI.Graphics();
    g.beginFill(0xffffff, 1);
    g.drawRect(
      x - (size / 2) * this.scale,
      y,
      x + ((2 * size) / 2) * this.scale,
      1
    );
    g.endFill();
    g.cacheAsBitmap = true;
    sprite.addChild(g);

    this.body = body;
    this.sprite = sprite;
  }
}
