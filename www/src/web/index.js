import PixiApp from '../game/js/pixi_app.js';

const init = () => {
    window.pixiApp = new PixiApp();
};

init();


if (module.hot) {
    module.hot.accept(['../game/js/pixi_app.js'], () => {
        document.body.removeChild(pixiApp.view);
        init();
    });
}