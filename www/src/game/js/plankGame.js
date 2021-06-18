import planck from "planck-js";

import { Bomb } from "./classes/Bomb";
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

const figures = ["box", "triangle", "circle", "softBodyMesh"];
const colors = ["0xfadadd", "0xffc0cb", "0xd8bfd8", "0xddadaf"];

const COUNT_OBJECTS_TO_CLEAR = 3;

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
    g.beginFill(0xffffff, 1);
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

    for (let i in this.objects) {
      const object = this.objects[i];
      if (object && object.checkPoint(pos.x, pos.y)) {
        this.removePrimitive(object, i);

        this.createPrimitive(
          pos.x,
          pos.y,
          object.options.size * 1.5,
          "bomb",
          5
        );

        return;
      }
    }

    this.createPrimitive(pos.x, pos.y, Math.random() / 2 + 0.6);
    this.removeNearest();
  }

  handleKeyPress() {
    window.onkeydown = (e) => {
      console.log(e.keyCode);
      if (e && e.keyCode > 47) {
        this.createPrimitive(
          0 + Math.random(3) - 1.5,
          -10 + Math.random(3) - 1.5,
          Math.random() / 4 + 0.4,
          figures[e.keyCode - 48]
        );
      }
      if (e && e.keyCode === 32) {
        this.removeNearest();
      }
    };
  }

  removeNearest() {
    let groups = this.findGroups();
    console.log(groups);
    for (let group of groups) {
      if (group.length > 2) {
        for (let i of group) {
          let object = this.objects[i],
            pos = object.getPosition();
          this.removePrimitive(object, i);

          this.createPrimitive(
            pos.x,
            pos.y,
            object.options.size * 1.5,
            "bomb",
            5
          );
        }
      }
    }
  }

  update(delta) {
    this.world.step(1 / 60);

    let removed = 0,
      primitive,
      objectsCount = this.objects.length;

    for (let i = 0; i < objectsCount; i++) {
      primitive = this.objects[i];

      if (primitive) {
        primitive.update();
        if (primitive.life <= 0) {
          this.removePrimitive(primitive, i);
        }
      } else {
        removed++;
      }
    }

    if (removed >= COUNT_OBJECTS_TO_CLEAR) {
      console.log(`!! clear`, objectsCount, removed);

      this.objects = this.objects.filter((o) => !!o);
    }
  }

  initWorld() {
    this.createPrimitive(0, -0.2, 80, "ground");
    this.createPrimitive(
      -worldWidth / 2,
      -worldHeight / 2,
      worldHeight,
      "ground_ver"
    );
    this.createPrimitive(
      +worldWidth / 2,
      -worldHeight / 2,
      worldHeight,
      "ground_ver"
    );
    this.createPrimitive(2, -1, 1, "box");
    this.createPrimitive(-2, -1, 1, "box");
    this.createPrimitive(1, -3, 0.5, "circle");
    this.createPrimitive(-1, -1, 0.8, "triangle");
    this.createPrimitive(0, -10, 0.5, "softBodyMesh");
  }

  createPrimitive(x, y, size, type, life) {
    let primitive;
    type = type || figures[Math.floor(Math.random() * figures.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const options = { x, y, size, scale, color, renderer: this.renderer };

    switch (type) {
      case "box":
        primitive = new Box(this.world, options);
        break;
      case "ground":
        primitive = new Ground(this.world, {
          ...options,
          type: "horizontal",
        });
        break;
      case "ground_ver":
        primitive = new Ground(this.world, {
          ...options,
          type: "vertical",
        });
        break;
      case "circle":
        primitive = new Circle(this.world, options);
        break;
      case "bomb":
        primitive = new Bomb(this.world, { ...options, life });
        break;
      case "triangle":
        primitive = new Triangle(this.world, options);
        break;
      case "softBody":
        primitive = new SoftBody(this.world, options);
        break;
      case "softBodyMesh":
        primitive = new SoftBodyMesh(this.world, options);
        break;
    }

    this.addChild(...primitive.getChildren());
    this.objects.push(primitive);
  }

  removePrimitive(object, i) {
    object.destroy();
    this.removeChild(...object.getChildren());
    if (i >= 0) {
      this.objects[i] = null;
    }
  }

  findGroups() {
    let groups = [],
      objGroups = {},
      a,
      b;
    for (let i = 0; i < this.objects.length; i++) {
      a = this.objects[i];
      if (a && !(a instanceof Ground)) {
        for (let j = 0; j < this.objects.length; j++) {
          b = this.objects[j];
          if (
            b &&
            !(b instanceof Ground) &&
            i !== j &&
            b.options.color === a.options.color &&
            (objGroups[i] === undefined ||
              objGroups[j] === undefined ||
              objGroups[i] !== objGroups[j])
          ) {
            if (checkNearest(a, b)) {
              if (objGroups[i] >= 0 && objGroups[j] === undefined) {
                groups[objGroups[i]].push(j);
                objGroups[j] = objGroups[i];
              } else if (objGroups[i] === undefined && objGroups[j] >= 0) {
                groups[objGroups[j]].push(i);
                objGroups[i] = objGroups[j];
              } else if (
                objGroups[i] === undefined &&
                objGroups[j] === undefined
              ) {
                let gi = groups.push([i, j]) - 1;
                objGroups[i] = gi;
                objGroups[j] = gi;
              } else {
                for (let o of groups[objGroups[j]]) {
                  groups[objGroups[i]].push(o);
                  objGroups[o] = objGroups[i];
                }
              }
            }
          }
        }
      }
    }

    return groups;
  }
}

function checkNearest(a, b) {
  let aPos = a.getPosition(),
    bPos = b.getPosition(),
    aSize = a.getSize(),
    bSize = b.getSize();

  return (
    Math.sqrt(Math.pow(aPos.x - bPos.x, 2) + Math.pow(aPos.y - bPos.y, 2)) <
    aSize + bSize + 0.1
  );
}
