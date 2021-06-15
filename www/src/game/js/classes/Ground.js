import * as PIXI from "pixi.js";
import * as planck from "planck-js";

import { Primitive } from "./Primitive";

const { Vec2 } = planck;

export class Ground extends Primitive {
  init(x, y, { size, type = "horizontal" }) {
    const hs = type === "horizontal" ? size : 0;
    const vs = type === "vertical" ? size : 0;

    const edge = planck.Edge(
      Vec2(x - hs / 2, y - vs / 2),
      Vec2(x + hs / 2, y + vs / 2)
    );

    const body = this.createBody(edge);

    //graphics
    const sprite = new PIXI.Container();
    const g = new PIXI.Graphics();
    g.beginFill(0xffffff, 1);
    g.drawRect(
      (x - hs / 2) * this.scale,
      (y - vs / 2) * this.scale,
      type === "horizontal" ? x + ((2 * hs) / 2) * this.scale : 1,
      type === "vertical" ? y + ((2 * vs) / 2) * this.scale : 1
    );
    g.endFill();
    g.cacheAsBitmap = true;
    sprite.addChild(g);

    this.body = body;
    this.sprite = sprite;
  }
}
