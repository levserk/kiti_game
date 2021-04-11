const app = new PIXI.Application();
document.body.appendChild(app.view);

const graphics = new PIXI.Graphics();
graphics.lineStyle(2, 0xfeeb77, 1);
graphics.beginFill(0x650a5a, 1);
graphics.drawCircle(250, 250, 50);
graphics.endFill();

const texture2 = app.renderer.generateTexture(graphics);

const triangle = new PIXI.SimpleMesh(
  texture2,
  [0, 0, 100, 0, 100, 100],
  [0, 0, 1, 0, 1, 1],
  [0, 1, 2]
);
console.log(triangle.vertices);
triangle.position.set(400, 300);

app.stage.addChild(triangle);

let c = 0;
app.ticker.add((delta) => {
  c = c > 20 ? 0 : c + 1;
  triangle.vertices[2] = 100 - c;
  triangle.vertices[3] = 0 + c;
});
