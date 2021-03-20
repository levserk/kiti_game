const PIXI = require("pixi.js");
import textures from "./textures";
import Game from "./plunkGame.js";

let bindRender;

class PixiApp {
  constructor() {
    configure();
    this.app = this.createApp();
    this.view = this.app.view;

    let info = createInfo();
    info.x = 10;
    info.y = 10;
    this.app.stage.addChild(info);
    info.text = `width: ${this.app.screen.width}, height: ${this.app.screen.height}`;

    const loader = PIXI.Loader.shared;

    loader.add("cat", textures.cat).load((loader, resources) => {
      this.start(resources);
    });

    if (module.hot) {
      module.hot.dispose(() => {
        this.game.destroy();
        PIXI.loader.reset();
      });
    }
    this.renderTime = Date.now();
  }

  start(resources) {
    this.game = new Game(
      {
        width: this.app.screen.width,
        height: this.app.screen.height,
      },
      resources,
      this.app.renderer
    );

    this.app.stage.addChild(this.game);

    this.app.ticker.add((delta) => {
      this.game.update(delta);
    });
    console.log(this.app);
  }

  render() {
    requestAnimationFrame(bindRender);
    console.log(Date.now() - this.renderTime);
    this.game.render();
    this.renderTime = Date.now();
  }

  createApp() {
    let width = document.documentElement.clientWidth,
      height = document.documentElement.clientHeight,
      app = new PIXI.Application({
        width,
        height,
        backgroundColor: 0x1099bb,
        antialiasing: true,
        //antialias: true,
        //forceFXAA: true,
        transparent: false,
        resolution: 1,
      });

    document.body.appendChild(app.view);

    return app;
  }
}

const configure = () => {
  // Scale mode for all textures, will retain pixelation
  //PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
};

const createInfo = () => {
  let style = new PIXI.TextStyle({
    fontSize: 12,
  });
  return new PIXI.Text(``, style);
};

export default PixiApp;
