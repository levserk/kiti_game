import planck from "planck-js";

import {
  calcFieldSize,
  calcSquareSize,
  colors,
  defaultOptions,
  mpx,
  pxm
} from "./const";
import GameField from "./game_field";

const { Vec2, Box, World, Edge, Circle, Polygon } = planck;

const PIXI = require("pixi.js");

const metersPerPixel = 0.01;
const scale = 1 / metersPerPixel;

export default class Game extends PIXI.Container {
  constructor(options, resources, renderer) {
    super();

    this.renderer = renderer;
    this.resources = resources;
    this.options = Object.assign({}, defaultOptions, options);
    this.size = calcSquareSize(this.options.width, this.options.height);

    this.objects = [];
    this.world = World(Vec2(0, 9.8), true);
    this.handleKeyPress();
    this.position.set(this.options.width / 2, this.options.height / 2);
    this.initWorld();
  }

  handleKeyPress() {
    window.onkeydown = e => {
      console.log(e.keyCode);
      if (e && e.keyCode === 49) {
      }
    };
  }

  update(delta) {
    this.world.step(1 / 60);
    this.objects.forEach(({ sprite, body }) => {
      const pos = body.getPosition();
      // Make all pixi sprites follow the position and rotation of their body.

      sprite.position.set(pos.x * scale, pos.y * scale);
      sprite.rotation = body.getAngle();
    });
  }

  initWorld() {
    const ground = createGround(this.world);
    this.addChild(ground.sprite);
    let box;
    box = createBox(this.world, 2, -1, 1);
    this.addChild(box.sprite);
    this.objects.push(box);

    box = createBox(this.world, -2, -1, 1);
    this.addChild(box.sprite);
    this.objects.push(box);

    box = createBox(this.world, 0, -3, 0.2);
    this.addChild(box.sprite);
    this.objects.push(box);

    box = createBox(this.world, -0.1, -2, 0.2);
    this.addChild(box.sprite);
    this.objects.push(box);

    box = createBox(this.world, 0.1, -1, 0.2);
    this.addChild(box.sprite);
    this.objects.push(box);

    box = createCircle(this.world, 0.0, -10, 0.1);
    this.addChild(box.sprite);
    this.objects.push(box);

    box = createCircle(this.world, 0.1, -11, 0.2);
    this.addChild(box.sprite);
    this.objects.push(box);
    

    box = createPolygonBox(this.world, 0, -1, 0.1);
    this.addChild(box.sprite);
    this.objects.push(box);

    box = createPolygonTriangle(this.world, -1, -1, 0.3);
    this.addChild(box.sprite);
    this.objects.push(box);
  }
}

const createGround = world => {
  const body = createBody(world, Edge(Vec2(-40, 0), Vec2(40, 0)));
  const sprite = new PIXI.Container();
  const g = new PIXI.Graphics();
  g.beginFill(0xffffff, 1);
  g.drawRect(-40 * scale, 0, 2 * 40 * scale, 1);
  g.endFill();
  g.cacheAsBitmap = true;
  sprite.addChild(g);

  return {
    body,
    sprite
  };
};

const createBox = (world, x, y, size) => {
  const body = createBody(
    world,
    Box(size / 2, size / 2),
    "dynamic",
    Vec2(x, y)
  );
  const sprite = new PIXI.Container();
  const g = new PIXI.Graphics();
  //g.beginFill(0xffffff, 1);
  g.lineStyle(1, 0xffffff, 1);
  g.drawRect(
    (-size / 2) * scale,
    (-size / 2) * scale,
    size * scale,
    size * scale
  );
  g.endFill();
  g.cacheAsBitmap = true;
  sprite.addChild(g);
  //sprite.pivot.x = -(size * scale) / 2;
  //sprite.pivot.y = -(size * scale) / 2;

  return {
    body,
    sprite
  };
};

const createCircle = (world, x, y, size) => {
  const body = createBody(
    world,
    Circle(Vec2(0, 0), size),
    "dynamic",
    Vec2(x, y)
  );
  const sprite = new PIXI.Container();
  const g = new PIXI.Graphics();
  //g.beginFill(0xffffff, 1);
  g.lineStyle(1, 0xffffff, 1);
  g.drawCircle(0, 0, size * scale);
  g.endFill();
  g.cacheAsBitmap = true;
  sprite.addChild(g);
  return {
    body,
    sprite
  };
};

const createPolygonBox = (world, x, y, size) => {
  const body = createBody(
    world,
    Polygon([
      Vec2(-1.0 * size, 1.0 * size),
      Vec2(1.0 * size, 1.0 * size),
      Vec2(1.0 * size, -1.0 * size),
      Vec2(-1.0 * size, -1.0 * size)
    ]),
    "dynamic",
    Vec2(x, y),
    Math.PI / 4 + 0.2
  );
  const sprite = new PIXI.Container();
  const g = new PIXI.Graphics();
  //g.beginFill(0xffffff, 1);
  g.lineStyle(1, 0xffffff, 1);
  g.drawPolygon([
    new PIXI.Point(-1 * size * scale, 1 * size * scale),
    new PIXI.Point(1 * size * scale, 1 * size * scale),
    new PIXI.Point(1 * size * scale, -1 * size * scale),
    new PIXI.Point(-1 * size * scale, -1 * size * scale)
  ]);
  g.endFill();
  g.cacheAsBitmap = true;
  sprite.addChild(g);
  return {
    body,
    sprite
  };
};
const createPolygonTriangle = (world, x, y, size) => {
  const body = createBody(
    world,
    Polygon([
      Vec2(-1.0 * size, 0 * size),
      Vec2(0 * size, 1.0 * size),
      Vec2(1.0 * size, 0 * size)
    ]),
    "dynamic",
    Vec2(x, y),
    Math.PI + 0.2
  );
  const sprite = new PIXI.Container();
  const g = new PIXI.Graphics();
  //g.beginFill(0xffffff, 1);
  g.lineStyle(1, 0xffffff, 1);
  g.drawPolygon([
    new PIXI.Point(-1 * size * scale, 0 * size * scale),
    new PIXI.Point(0 * size * scale, 1 * size * scale),
    new PIXI.Point(1 * size * scale, 0 * size * scale),
  ]);
  g.endFill();
  g.cacheAsBitmap = true;
  sprite.addChild(g);
  return {
    body,
    sprite
  };
};

const createBody = (
  world,
  shape,
  type = "static",
  position = Vec2(0, 0),
  angle = 0
) => {
  const body = world.createBody({
    type,
    position,
    angle
  });
  body.createFixture(shape, {
    density: 1.0,
    friction: 0.3
  });

  return body;
};
