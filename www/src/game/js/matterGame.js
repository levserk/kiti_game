import GameField from "./game_field";

import Matter from "matter-js";

import { defaultOptions, calcSquareSize, calcFieldSize, colors } from "./const";

const PIXI = require("pixi.js");

const Render = Matter.Render;
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

const createRender = (engine, options) => {
  const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: options.width,
      height: options.height,
      pixelRatio: 1,
      background: "#fafafa",
      wireframeBackground: "#222",
      hasBounds: false,
      enabled: true,
      wireframes: true,
      showSleeping: true,
      showDebug: false,
      showBroadphase: false,
      showBounds: false,
      showVelocity: false,
      showCollisions: false,
      showSeparations: false,
      showAxes: false,
      showPositions: false,
      showAngleIndicator: false,
      showIds: false,
      showShadows: false,
      showVertexNumbers: false,
      showConvexHulls: false,
      showInternalEdges: false,
      showMousePosition: false,
    },
  });
  Render.run(render);
};

export default class Game extends PIXI.Container {
  constructor(options, resources) {
    super();

    this.resources = resources;
    this.options = Object.assign({}, defaultOptions, options);
    this.size = calcSquareSize(this.options.width, this.options.height);
    this.fieldRecatngle = calcFieldSize(
      this.size,
      this.options.width,
      this.options.height
    );

    this.objects = [];

    this.engine = Engine.create();
    Engine.run(this.engine);
    createRender(this.engine, options);
    this.addGameField();

    const mouseConstraint = MouseConstraint.create(this.engine, {
      mouse: Mouse.create(document.querySelector(".scene canvas")),
    });
    
    World.add(this.engine.world, mouseConstraint);
  }

  addGameField() {
    this.gameField = new GameField(this.fieldRecatngle, this.size);
    this.addChild(this.gameField);
    this.gameField.x = 0; //(this.options.width - this.gameField.width) / 2;
    this.gameField.y = (this.options.height - this.gameField.height) / 2;
    //    this.gameField.on('pointermove', this.onPointerMove.bind(this));
    for (let i = 0; i <= 30; i++) {
      this.createKitti(
        50 + Math.random() * (this.gameField.width - 50),
        100 + Math.random() * 100,
        this.size,
        colors[Math.floor(Math.random() * colors.length)]
      );
    }

    World.add(this.engine.world, [
      Bodies.rectangle(
        this.gameField.width / 2,
        this.gameField.height,
        this.gameField.width,
        20,
        {
          isStatic: true,
        }
      ),

      Bodies.rectangle(
        0,
        this.gameField.height / 2,
        20,
        this.gameField.height,
        {
          isStatic: true,
        }
      ),

      Bodies.rectangle(
        this.gameField.width,
        this.gameField.height / 2,
        20,
        this.gameField.height,
        {
          isStatic: true,
        }
      ),
    ]);
  }

  createKitti(x, y, size, color) {
    // Matter Body
    const imageBody = Bodies.circle(x, y, size / 2, {
      friction: 0.001,
      frictionAir: 0.01,
      restitution: 0.5,
    });
    World.addBody(this.engine.world, imageBody);

    const imageSprite = new PIXI.Sprite(this.resources.cat.texture);
    imageSprite.height = size;
    imageSprite.width = size;
    imageSprite.tint = color;
    imageSprite.anchor.set(0.5, 0.5);
    this.addChild(imageSprite);

    this.objects.push({
      body: imageBody,
      sprite: imageSprite,
    });
  }

  update() {
    this.objects.forEach((object) => {
      // Make all pixi sprites follow the position and rotation of their body.
      object.sprite.position = object.body.position;
      object.sprite.rotation = object.body.angle;
    });
  }
}
