import * as PIXI from "pixi.js";
import * as planck from "planck-js";

import { Primitive } from "./Primitive";

const { Vec2 } = planck;

export class Bomb extends Primitive {
  init(x, y, { size, life = 3 }) {
    const body = this.createBody(
      planck.Circle(Vec2(0, 0), size),
      "dynamic",
      Vec2(x, y)
    );
    const sprite = new PIXI.Container();

    this.body = body;
    this.sprite = sprite;
    this.life = life;
  }

  update() {
    super.update();
    this.life--;
  }
}
