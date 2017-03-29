const PIXI = require('pixi.js');
import textures from './textures'
import Game from './game.js';

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


        PIXI.loader.add('cat', textures.cat)
            .load(() => { this.start() });


        if (module.hot) {
            module.hot.dispose(() => {
                PIXI.loader.reset();
            })
        }
        this.renderTime = Date.now();
    }

    start() {
        this.game = new Game({
            width: this.app.screen.width,
            height: this.app.screen.height
        });

        this.app.stage.addChild(this.game);

        this.app.ticker.add((delta) => {
            this.game.render(delta)
        });
    }

    render() {
        requestAnimationFrame(bindRender);
        console.log(Date.now() - this.renderTime);
        this.game.render();
        this.renderTime = Date.now();
    }

    createApp()  {
        let width = document.documentElement.clientWidth,
            height = document.documentElement.clientHeight,
            app = new PIXI.Application(width, height, {
                backgroundColor: 0x1099bb,
                //antialiasing: true,
                //antialias: true,
                //forceFXAA: true,
                transparent: false,
                resolution: 1
            });

        document.body.appendChild(app.view);

        return app;
    };
}

const configure = () => {
    // Scale mode for all textures, will retain pixelation
    //PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
};

const createInfo = () => {
    let style = new PIXI.TextStyle({
        fontSize: 12
    });
    return new PIXI.Text(``, style)
};


export default PixiApp;
