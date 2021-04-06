import planck from "planck-js";

import { calcScale, calcSquareSize, defaultOptions } from "./const";

const { Vec2, Box, World, Edge, Circle, Polygon } = planck;

const PIXI = require("pixi.js");

const metersPerPixel = 0.01;
let scale = 1 / metersPerPixel;

const PointToVec2 = p => Vec2(p.x / scale, p.y / scale);

const worldWidth = 7;
const worldHeight = 15;

const shapes =  ["box", "circle", "triangle"];

export default class Game extends PIXI.Container {
  constructor(options, resources, renderer) {
    super();

    this.interactive = true;
    this.renderer = renderer;
    this.resources = resources;
    this.options = Object.assign({}, defaultOptions, options);

    scale = calcScale(
      worldWidth,
      worldHeight,
      this.options.width,
      this.options.height
    );

    this.objects = [];
    this.world = World(Vec2(0, 9.8), true);
    this.handleKeyPress();
    this.position.set(this.options.width / 2, this.options.height);

    this.addBackground();
    this.initWorld();

    this.on("pointerdown", this.onPointerDown);
  }

  addBackground() {
    const g = new PIXI.Graphics();
    g.beginFill(0x000000, 1);
    g.lineStyle(1, 0x000000, 1);
    g.drawRect(
      (-worldWidth / 2) * scale,
      -worldHeight * scale,
      worldWidth * scale,
      worldHeight * scale
    );
    g.endFill();
    g.cacheAsBitmap = true;
    this.addChild(g);
  }

  onPointerDown(e) {
    let point = e.data.getLocalPosition(this);
    console.log(point, PointToVec2(point));
    const pos = PointToVec2(point);
    this.createPrimitive(pos.x, pos.y, Math.random() * 1 + 0.5, shapes[Math.floor(Math.random() * shapes.length)] );
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

    this.createPrimitive(2, -1, 1, "box");
    this.createPrimitive(-2, -1, 1, "box");
    this.createPrimitive(0, -3, 0.2, "box");
    this.createPrimitive(0.0, -10, 0.1, "circle");
    this.createPrimitive(0.1, -11, 0.2, "circle");
    this.createPrimitive(0, -1, 0.15, "polygonbox");
    this.createPrimitive(-1, -1, 0.3, "triangle");
  }

  createPrimitive(x, y, size, type = "box") {
    let primitive;

    switch (type) {
      case "box":
        primitive = createBox(this.world, x, y, size);
        break;
      case "polygonbox":
        primitive = createPolygonBox(this.world, x, y, size);
        break;
      case "circle":
        primitive = createCircle(this.world, x, y, size);
        break;
      case "triangle":
        primitive = createPolygonTriangle(this.world, x, y, size);
        break;
    }

    this.addChild(primitive.sprite);
    this.objects.push(primitive);
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
    new PIXI.Point(1 * size * scale, 0 * size * scale)
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
