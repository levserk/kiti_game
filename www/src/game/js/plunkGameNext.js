import GameField from "./game_field";
import {
  defaultOptions,
  calcSquareSize,
  calcFieldSize,
  colors,
  pxm,
  mpx,
} from "./const";
import planck from "planck-js";
const { Vec2, Box, World, Edge, Circle, Polygon } = planck;

const PIXI = require("pixi.js");

export default class Game extends PIXI.Container {
  constructor(options, resources, renderer) {
    super();

    this.renderer = renderer;
    this.resources = resources;
    this.options = Object.assign({}, defaultOptions, options);
    this.size = calcSquareSize(this.options.width, this.options.height);

    this.objects = [];
    this.world = World(Vec2(0, 9.8), true);
    this.addGameField();
    this.handleKeyPress();
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
    this.objects.forEach(({ sprite, body }) => {
      const pos = body.getPosition();
      // Make all pixi sprites follow the position and rotation of their body.

      sprite.position.set(mpx(pos.x), mpx(pos.y));
      sprite.rotation = body.getAngle();
    });
  }

  initWorld() {
    const groundBody = createBody(this.world, Edge(Vec2(-40, 0), Vec2(40, 0)));
    const groundImage = new PIXI.Container();
    const g = new PIXI.Graphics();
    
  }
}

const createBody = (world, shape, type = "static", position = Vec2(0, 0)) => {
  const body = world.createBody({
    type,
    position,
  });
  body.createFixture(shape, {
    density: 1.0,
    friction: 0.3,
  });
};
