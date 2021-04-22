const app = new PIXI.Application({ antialias: true });
document.body.appendChild(app.view);

const graphics = createGraphics();
const mesh = createMesh(graphics);

graphics.x = 10;
graphics.y = 10;
app.stage.addChild(graphics);

mesh.y = 200;
mesh.x = 200;
app.stage.addChild(mesh);

function createGraphics() {
  const graphics = new PIXI.Graphics();
  graphics.lineStyle(1, 0xfeeb77, 1);
  graphics.beginFill(0x650a5a, 1);
  graphics.drawPolygon([
    new PIXI.Point(0, 0),
    new PIXI.Point(10, 10),
    new PIXI.Point(20, 0),
  ]);
  graphics.endFill();

  graphics.beginFill(0x320a5a, 1);
  graphics.drawPolygon([
    new PIXI.Point(0, 20),
    new PIXI.Point(10, 10),
    new PIXI.Point(20, 20),
  ]);
  graphics.endFill();

  graphics.beginFill(0x90525a, 1);
  graphics.drawPolygon([
    new PIXI.Point(0, 0),
    new PIXI.Point(10, 10),
    new PIXI.Point(0, 20),
  ]);
  graphics.endFill();

  graphics.beginFill(0x12925a, 1);
  graphics.drawPolygon([
    new PIXI.Point(20, 0),
    new PIXI.Point(10, 10),
    new PIXI.Point(20, 20),
  ]);
  graphics.endFill();

  return graphics;
}

function createMesh(graphics) {
  const texture = app.renderer.generateTexture(graphics);

  // prettier-ignore
  const triangle = new PIXI.SimpleMesh(
  texture,
  [
    0, 0, 
    100, 0, 
    100, -100,
    0, -100,
    -100, -100,
    -100, 0,
    -100, 100,
    0, 100,
    100, 100
  ],
  [
   0.5, 0.5, 
   1,   0.5, 
   1,   0,
   0.5, 0,
   0,   0,
   0,  	0.5,
   0,   1,
   0.5, 1,
   1,   1 
  ],
  [
    0, 1, 2,
    0, 2, 3,
    0, 3, 4,
    0, 4, 5,
    0, 5, 6,
    0, 6, 7,
    0, 7, 8,
    0, 8, 1
  ]
 );
  return triangle;
}
