import { DistanceJoint, Vec2 } from "planck-js";

export class Primitive {
  constructor(world, options) {
    const { scale, x, y, renderer } = options;
    this.options = options;
    this.world = world;
    this.scale = scale;
    this.renderer = renderer;
    this.init(x, y, options);
  }

  init(x, y, { size }) {
    this.body = null;
    this.sprite = null;
  }

  update() {
    const pos = this.body.getPosition();

    this.sprite.position.set(pos.x * this.scale, pos.y * this.scale);
    this.sprite.rotation = this.body.getAngle();
  }

  createBody(shape, type = "static", position = Vec2(0, 0), angle = 0) {
    const body = this.world.createBody({
      type,
      position,
      angle
    });
    body.createFixture(shape, {
      density: 1.0,
      friction: 0.3
    });

    return body;
  }

  getChildren() {
    return [this.sprite];
  }

  createJoint(a, b) {
    return this.world.createJoint(
      DistanceJoint({
        bodyA: a,
        localAnchorA: Vec2(0, 0),
        bodyB: b,
        localAnchorB: Vec2(0, 0),
        frequencyHz: 12,
        dampingRatio: 0.5
      })
    );
  }

  destroy() {
    this.world.destroyBody(this.body);
    this.destroyed = true;
  }

  checkPoint(x, y) {
    const pos = this.getPosition();
    return (
      Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)) <
      this.getSize()
    );
  }

  getPosition() {
    return this.body.getPosition();
  }

  getSize() {
    return this.options.size;
  }
}
