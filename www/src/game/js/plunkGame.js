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

export default class Game extends PIXI.Container {
  constructor(options, resources, renderer) {
    super();

    this.renderer = renderer;
    this.resources = resources;
    this.options = Object.assign({}, defaultOptions, options);
    this.size = calcSquareSize(this.options.width, this.options.height);
    this.fieldRecatngle = calcFieldSize(
      this.size,
      this.options.width,
      this.options.height
    );

    this.objects = [];
    this.world = World(Vec2(0, 9.8), true);
    this.addGameField();
    this.handleKeyPress();
  }

  handleKeyPress() {
    window.onkeydown = e => {
      console.log(e.keyCode);
      if (e && e.keyCode === 49) {
        //1
        this.addRandomKitti();
      }
      if (e && e.keyCode === 50) {
        //2
        this.createTriangle(
          25 + Math.random() * (this.gameField.width - 50),
          100 + Math.random() * 100,
          this.size + Math.floor((Math.random() * this.size) / 2),
          colors[Math.floor(Math.random() * colors.length)]
        );
      }
      if (e && e.keyCode === 51) {
        //2
        this.createBox(
          100,// + Math.random() * (this.gameField.width - 50),
          500 + Math.random() * 100,
          this.size,
          colors[Math.floor(Math.random() * colors.length)]
        );
      }
      if (e && e.keyCode === 52) {
        //3
        this.createBoxPolygon(
          100, //25 + Math.random() * (this.gameField.width - 50),
          500 + Math.random() * 100,
          this.size,
          colors[Math.floor(Math.random() * colors.length)]
        );
      }
    };
  }

  addGameField() {
    this.gameField = new GameField(this.fieldRecatngle, this.size);
    this.addChild(this.gameField);
    this.gameField.x = 0; //(this.options.width - this.gameField.width) / 2;
    this.gameField.y = (this.options.height - this.gameField.height) / 2 + 1;

    this.addBoundaries();

    for (let i = 0; i <= 3; i++) {
      //this.addRandomKitti();
    }
  }

  addRandomKitti() {
    this.createKitti(
      25 + Math.random() * (this.gameField.width - 50),
      100 + Math.random() * 100,
      this.size + Math.floor(Math.random() * this.size),
      colors[Math.floor(Math.random() * colors.length)]
    );
  }

  addBoundaries() {
    const w = this.gameField.width;
    const h = this.gameField.height;
    this.createBoundary(0 + w / 2, 1, w, 2);
    this.createBoundary(0 + w / 2, h - 1, w, 2);
    this.createBoundary(1, h / 2, 2, h);
    this.createBoundary(w - 1, h / 2, 2, h);
  }

  createBoundary(x, y, w, h) {
    const boundaryWidthpx = 2;
    const boundary = this.world.createBody();
    const width = pxm(w);
    const height = pxm(h);
    boundary.createFixture(
      Edge(Vec2(-width / 2, -height / 2), Vec2(width / 2, height / 2)),
      0.0
    );
    boundary.setPosition(Vec2(pxm(x), pxm(y)));

    const g = new PIXI.Graphics();
    g.beginFill(0xffffff);
    g.lineStyle(1, 0xffffff, 1);
    g.drawRect(0, 0, w, h);
    g.endFill();
    g.x = g.x - 1;
    g.y = g.y - 1;

    const boundarySprite = new PIXI.Container();
    boundarySprite.addChild(g);
    //boundarySprite.pivot.x = width / 2;
    //boundarySprite.pivot.y = height / 2;
    boundarySprite.position.set(x - w / 2, y - h / 2);
    boundarySprite.rotation = 0;
    boundarySprite.body = boundary;
    boundarySprite.cacheAsBitmap = true;
    this.gameField.addChild(boundarySprite);
  }

  createKitti(x, y, size, color) {
    const body = this.world.createBody().setDynamic();
    body.setPosition(Vec2(pxm(x), pxm(y)));
    const ballFixtureDef = {};
    ballFixtureDef.density = 10.0;
    ballFixtureDef.restitution = 0.8;
    ballFixtureDef.position = Vec2(0.0, 0.0);
    body.createFixture(Circle(pxm(size / 2)), ballFixtureDef);

    const imageSprite = new PIXI.Sprite(this.resources.cat.texture);
    imageSprite.height = size;
    imageSprite.width = size;
    imageSprite.tint = color;
    imageSprite.anchor.set(0.5, 0.5);

    imageSprite.position.set(x, y);
    this.addChild(imageSprite);

    this.objects.push({ sprite: imageSprite, body });
  }

  createTriangle(x, y, size, color) {
    const body = this.world.createBody().setDynamic();
    const msize = pxm(size);
    body.setPosition(Vec2(pxm(x), pxm(y)));
    body.createFixture(
      Polygon(Vec2(-1 * msize, 1 * msize), Vec2(0, 2 * msize), Vec2(1 * msize, 1 * msize)),
      {
        density: 10,
        friction: 0.3,
        restitution: 0,
        position: Vec2(0, 0)
      }
    );

    const g = new PIXI.Graphics();
    g.beginFill(color);
    g.lineStyle(1, 0xffffff, 1);
    g.drawPolygon([
      new PIXI.Point(-1 * size, 1 * size),
      new PIXI.Point(0, 2 * size),
      new PIXI.Point(1 * size, 1 * size)
    ]);
    g.endFill();
    g.x = -size / 2;
    g.y = -size;

    const sprite = new PIXI.Container();
    sprite.addChild(g);
    sprite.rotation = 0;
    sprite.cacheAsBitmap = true;
    this.addChild(sprite);

    this.objects.push({ sprite: sprite, body });
  }

  createBoxPolygon(x, y, size, color) {
    const body = this.world.createBody().setDynamic();
    const msize = pxm(size);
    body.setPosition(Vec2(pxm(x), pxm(y)));
    body.createFixture(
      Polygon(
        Vec2(-1 * msize, 1 * msize),
        Vec2(1 * msize, 1 * msize),
        Vec2(1 * msize, -1 * msize),
        Vec2(-1 * msize, -1 * msize)
      ),
      {
        density: 10,
        friction: 0.3,
        restitution: 0,
        // /position: Vec2(0, 0)
      }
    );

    const g = new PIXI.Graphics();
    g.beginFill(color);
    g.lineStyle(1, 0xffffff, 1);
    g.drawPolygon([
      new PIXI.Point(-1 * size, 1 * size),
      new PIXI.Point(1 * size, 1 * size),
      new PIXI.Point(1 * size, -1 * size),
      new PIXI.Point(-1 * size, -1 * size)
    ]);
    g.endFill();
    g.x = 0;
    g.y = 0;

    const sprite = new PIXI.Container();
    sprite.addChild(g);
    sprite.rotation = 0;
    sprite.cacheAsBitmap = true;
    this.addChild(sprite);

    this.objects.push({ sprite: sprite, body });
  }

  createBox(x, y, size, color) {
    const body = this.world.createBody().setDynamic();
    const msize = pxm(size);
    body.setPosition(Vec2(pxm(x), pxm(y)));
    body.createFixture(Box(msize, msize), {
      density: 10,
      restitution: 0,
      //position: Vec2(0, 0)
    });

    const g = new PIXI.Graphics();
    g.beginFill(color);
    g.lineStyle(1, 0xffffff, 1);
    g.drawRect(0, 0, size, size);
    g.endFill();
    g.x = -size / 2;
    g.y = -size / 2;

    const sprite = new PIXI.Container();
    sprite.addChild(g);
    sprite.rotation = 0;
    sprite.cacheAsBitmap = true;
    this.addChild(sprite);

    this.objects.push({ sprite: sprite, body });
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
}
