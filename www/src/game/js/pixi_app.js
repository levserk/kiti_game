const PIXI = require('pixi.js');
import catImg from '../img/cat.png';
import Game from './game.js';

let app;

const PixiApp = () => {
    configure();
    app = createApp();

    let info = createInfo();
    info.x = 10;
    info.y = 10;
    app.stage.addChild(info);
    info.text = `width: ${app.screen.width}, height: ${app.screen.height}`;

    PIXI.loader.add(catImg).load(start);
};

const start = () => {
    let game = new Game({
        width: app.screen.width,
        height: app.screen.height
    });

    app.stage.addChild(game);

    let cats = [];

    for (let i = 0; i < 15; i++) {
        cats.push(createCatSprite(app));
    }

    app.ticker.add((delta) => {
        let cat;
        for (let i = 0; i < cats.length; i++) {
            cat = cats[i];
            cat.y = cat.y +  cat.speed;

            if (cat.y > app.renderer.height) {
                app.stage.removeChild(cat);
                cat = createCatSprite(app);
            }
            cats[i] = cat;
        }
    })
};

const createApp = () => {
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

const configure = () => {
    // Scale mode for all textures, will retain pixelation
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
};

const createInfo = () => {
    let style = new PIXI.TextStyle({
        fontSize: 12
    });
    return new PIXI.Text(``, style)
};

const createCatSprite = (app) => {
    let cat = new PIXI.Container(),
        catSprite = PIXI.Sprite.fromImage(catImg),
        size = 32 + Math.random() * 64;
    size = size - (size % 2);
    catSprite.height = size;
    catSprite.width = size;
    catSprite.tint = Math.random() * 0xFFFFFF;
    cat.addChild(catSprite);
    cat.x = (app.renderer.width - size) * Math.random();
    cat.y = size / 2;
    cat.speed = 1 + Math.random();
    cat.cacheAsBitmap = true;
    app.stage.addChild(cat);
    return cat;
};

export default PixiApp;
