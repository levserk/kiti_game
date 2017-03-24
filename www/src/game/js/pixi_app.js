const PIXI = require('pixi.js');
import cat from '../img/c.png';

const PixiApp = () => {
    configure();
    let app = createApp();

    let info = createInfo();
    info.x = 10;
    info.y = 10;
    app.stage.addChild(info);
    info.text = `width: ${app.screen.width}, height: ${app.screen.height}`;

};

const createApp = () => {
    let width = window.innerWidth,
        height = window.innerHeight,
        app = new PIXI.Application(width, height, { backgroundColor: 0x1099bb });
    document.body.appendChild(app.view);

    return app;
};

const configure = () => {
    // Scale mode for all textures, will retain pixelation
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
};

const createInfo = () => {
    let style = new PIXI.TextStyle({
        fontSize: 12
    });
   return new PIXI.Text(``, style)
};

export default PixiApp;
