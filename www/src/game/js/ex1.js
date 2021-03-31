/**
 * A Box2D / Planck.js demo
 *
 **/

const pscale = 45;

function mpx(m) {
  return m * pscale;
}

function pxm(p) {
  return p / pscale;
}

const global = {
  gameWidth: 700,
  gameHeight: 700,
};

const renderOptions = {
  backgroundColor: 0x000000,
  autoResize: true,
  resolution: window.devicePixelRatio,
  antialias: true,
};
const app = new PIXI.Application(0, 0, renderOptions);
app.renderer.autoResize = true;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.resize(global.gameWidth, global.gameHeight);
document.body.appendChild(app.view);

app.stage.interactive = true;
app.stage.hitArea = app.screen;

app.stage.scale.x = 1;
app.stage.scale.y = 1;

const { Vec2, World, Edge, Circle } = planck;
let world;
let gp;
const group = new PIXI.Container();
app.stage.addChild(group);
const boundaries = [];

const radius = 0.2; //meters!
const ballCanvas = document.createElement("canvas");
ballCanvas.width = mpx(radius) * 2;
ballCanvas.height = mpx(radius) * 2;

const ctx = ballCanvas.getContext("2d");
ctx.beginPath();
ctx.arc(mpx(radius), mpx(radius), mpx(radius), 0, Math.PI * 2);
ctx.strokeStyle = "#FFFFFF";
ctx.lineWidth = 1;
ctx.stroke();

let balls = 0;

const ballFixtureDef = {};
ballFixtureDef.density = 10.0;
ballFixtureDef.position = Vec2(0.0, 0.0);

function addBall() {
  document.getElementById("ballCount").innerText = balls;
  ++balls;

  const body = world.createBody().setDynamic();
  body.setPosition(Vec2(4, 0));
  /*const fd = {};
  fd.density = 10.0;
  fd.position = Vec2(0.0, 0.0);*/
  body.createFixture(Circle(radius), ballFixtureDef);

  const pos = body.getPosition();
  const circle = addCircle(pos.x, pos.y);
  circle.body = body;

  group.addChild(circle);
}

function addBoundaries() {
  const boundaryBottom = world.createBody();
  let width = pxm(global.gameWidth);
  let height = pxm(global.gameHeight);
  boundaryBottom.createFixture(
    Edge(Vec2(-width / 2, 0.0), Vec2(width / 2, 0.0)),
    0.0
  );
  boundaryBottom.setPosition(Vec2(width / 2.0, height));
  const bottom = addEdge(boundaryBottom, global.gameWidth, 0);

  boundaries.push(bottom);

  const boundaryMid = world.createBody();
  let x = 5;
  let y = 8;
  let edgeWidth = 10;
  boundaryMid.createFixture(
    Edge(Vec2(-edgeWidth / 2, 0.0), Vec2(edgeWidth / 2, 0.0)),
    0.0
  );
  boundaryMid.setPosition(Vec2(x, y));
  boundaryMid.setAngle(0.2);
  const mid = addEdge(boundaryMid, mpx(edgeWidth), 0.2);
  boundaries.push(mid);

  let x2 = x + 14;
  let y2 = y + 9;
  const boundaryMid2 = world.createBody();
  boundaryMid2.createFixture(
    Edge(Vec2(-edgeWidth / 2, 0.0), Vec2(edgeWidth / 2, 0.0)),
    0.0
  );
  boundaryMid2.setPosition(Vec2(x2, y2));
  boundaryMid2.setAngle(-0.2);
  const mid2 = addEdge(boundaryMid2, mpx(edgeWidth), -0.2);
  boundaries.push(mid2);

  edgeWidth = height;
  const boundaryleft = world.createBody();
  boundaryleft.createFixture(
    Edge(Vec2(-edgeWidth / 2, 0.0), Vec2(edgeWidth / 2, 0.0)),
    0.0
  );
  boundaryleft.setPosition(Vec2(0, height / 2));
  boundaryleft.setAngle(1.5708);
  const left = addEdge(boundaryleft, mpx(edgeWidth), 1.5708);
  boundaries.push(left);

  const boundaryright = world.createBody();
  boundaryright.createFixture(
    Edge(Vec2(-edgeWidth / 2, 0.0), Vec2(edgeWidth / 2, 0.0)),
    0.0
  );
  boundaryright.setPosition(Vec2(width, height / 2));
  boundaryright.setAngle(1.5708);
  const right = addEdge(boundaryright, mpx(edgeWidth), 1.5708);
  boundaries.push(right);

  boundaries.forEach((child) => app.stage.addChild(child));
}

function addEdge(body, w, angle) {
  const { x, y } = body.getPosition();
  const g = new PIXI.Graphics();
  g.beginFill(0xffffff, 1);
  g.lineStyle(0);
  g.drawRect(0, 0, w, 2);
  g.endFill();

  const t = app.renderer.generateTexture(g);
  const boundary = PIXI.Sprite.from(t);
  boundary.anchor.set(0.5);
  boundary.position.set(mpx(x), mpx(y));
  boundary.rotation = angle;
  boundary.body = body;
  return boundary;
}

function addCircle(x, y) {
  const sprite = PIXI.Sprite.from(ballCanvas);
  sprite.anchor.set(0.5);
  sprite.position.set(x, y);
  return sprite;
}

function updateWorld() {
  for (let i = 0; i < group.children.length; i++) {
    const sprite = group.children[i];
    const pos = sprite.body.getPosition();
    /*if (pos.x < -10 || pos.x > global.width + 10) {
      group.removeChild(sprite);
      boundaries.splice(boundaries.indexOf(sprite.body), 1);
      i--;
    } else*/
    sprite.position.set(mpx(pos.x), mpx(pos.y));
  }
}

//window.onload = function() {
world = World(Vec2(0, 9.8), true);
addBoundaries();

setInterval(() => {
  if (balls < 300) addBall();
}, 50);

//addBall();

/*for(let i = 0;i<120;++i){
addBall();
}*/

function play(delta) {
  world.step(1 / 60, app.ticker.elapsedMS / 1000);
  updateWorld();
}

app.ticker.add(function (delta) {
  play();
});
