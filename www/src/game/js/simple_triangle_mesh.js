const app = new PIXI.Application({ antialias: true });
document.body.appendChild(app.view);

let graphics = createGraphics();
const mesh = createMesh(graphics);

graphics.x = 10;
graphics.y = 10;
app.stage.addChild(graphics);

mesh.y = 200;
mesh.x = 200;
app.stage.addChild(mesh);

graphics = new PIXI.Graphics();
graphics.lineStyle(5, 0xffffff, 1);
graphics.beginFill(0xde3249, 1);
graphics.drawCircle(0, 0, 50);
graphics.endFill();

const cmesh = createCircleMesh(graphics);
cmesh.y = 200;
cmesh.x = 500;
app.stage.addChild(cmesh);
graphics.x = 100;
graphics.y = 10;
app.stage.addChild(graphics);

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

function createCircleMesh(graphics, s = 40) {
  const texture = app.renderer.generateTexture(graphics);

  let vertices = [0, 0, s / 2, 0];
  let uvs = [0.5, 0.5, 1, 0.5];
  let indices = [];
  const n = 9;

  for (let i = 1; i < n; i++) {
    const angle = ((Math.PI * 2) / n) * i;
    const dx = Math.cos(angle);
    const dy = -Math.sin(angle);
    uvs = [...uvs, dx * 0.5 + 0.5, dy * 0.5 + 0.5];
    vertices = [...vertices, dx * s * 0.5, dy * s * 0.5];
    indices = [...indices, 0, i, i + 1];
  }
  indices = [...indices, 0, n, 1];

  const triangle = new PIXI.SimpleMesh(texture, vertices, uvs, indices);
  return triangle;
}
