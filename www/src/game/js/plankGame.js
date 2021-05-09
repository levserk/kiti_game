import planck from "planck-js";
import { Box } from "./classes/Box";
import { Circle } from "./classes/Circle";
import { Ground } from "./classes/Ground";
import { SoftBody } from "./classes/SoftBody";
import { SoftBodyMesh } from "./classes/SoftBodyMesh";
import { Triangle } from "./classes/Triangle";

import { calcScale, defaultOptions } from "./const";

const { Vec2, World } = planck;

const PIXI = require("pixi.js");

const metersPerPixel = 0.01;
let scale = 1 / metersPerPixel;

const PointToVec2 = (p) => Vec2(p.x / scale, p.y / scale);

const worldWidth = 7;
const worldHeight = 15;

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
    this.createPrimitive(pos.x, pos.y, Math.random() / 4 + 0.4, "softBody");
  }

  handleKeyPress() {
    window.onkeydown = (e) => {
      console.log(e.keyCode);
      if (e && e.keyCode === 49) {
      }
    };
  }

  update(delta) {
    this.world.step(1 / 60);
    this.objects.forEach((primitive) => {
      primitive.update();
    });
  }

  initWorld() {
    this.createPrimitive(0, 0, 80, "ground");
    this.createPrimitive(2, -1, 1, "box");
    this.createPrimitive(-2, -1, 1, "box");
    this.createPrimitive(0, -3, 0.2, "box");
    this.createPrimitive(1, -3, 0.5, "circle");
    this.createPrimitive(-1, -1, 0.3, "triangle");
    this.createPrimitive(0, -10, 0.5, "softBodyMesh");
  }

  createPrimitive(x, y, size, type = "box") {
    let primitive;

    switch (type) {
      case "box":
        primitive = new Box(this.world, { x, y, size, scale });
        break;
      case "ground":
        primitive = new Ground(this.world, { x, y, size, scale });
        break;
      case "circle":
        primitive = new Circle(this.world, { x, y, size, scale });
        break;
      case "triangle":
        primitive = new Triangle(this.world, { x, y, size, scale });
        break;
      case "softBody":
        primitive = new SoftBody(this.world, { x, y, size, scale });
        break;
      case "softBodyMesh":
        primitive = new SoftBodyMesh(this.world, {
          x,
          y,
          size,
          scale,
          renderer: this.renderer,
        });
        break;
    }

    this.addChild(...primitive.getChildren());
    this.objects.push(primitive);
  }
}
