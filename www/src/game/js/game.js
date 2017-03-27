const PIXI = require('pixi.js');
import catImg from '../img/cat.png';

const defaultOptions = {
    width: null,
    height: null
};

const PROPORTIONS_MULT = 1.8;
const HORIZONTAL_SQUARES_COUNT = 10;

const calcSquareSize = (width) => {
    return Math.floor(width / HORIZONTAL_SQUARES_COUNT)
};

const calcFieldSize = (width, height) => {
    width-=2*BORDER_WIDTH;
    height-=2*BORDER_WIDTH;
    // height ~= 2 * width
    if (height >= width * PROPORTIONS_MULT) {
        width -= (width % HORIZONTAL_SQUARES_COUNT);
        return {
            width: width,
            height: width * PROPORTIONS_MULT
        }
    } else {
        height -= (height % (HORIZONTAL_SQUARES_COUNT * PROPORTIONS_MULT));
        return {
            width: height / PROPORTIONS_MULT,
            height: height
        }
    }
};

const SPEED = 5;

export default class Game extends PIXI.Container{
    constructor(options) {
        super();

        this.options = Object.assign({}, defaultOptions, options);
        this.fieldRecatngle = calcFieldSize(this.options.width, this.options.height);
        this.size = calcSquareSize(this.fieldRecatngle.width);
        this.gameField = null;
        this.fallingKitties = [];

        console.log(this.fieldRecatngle, this.size);

        this.addGameField();
    }

    addGameField() {
        this.gameField = new GameField(this.fieldRecatngle);
        this.addChild(this.gameField);
        this.gameField.x = (this.options.width - this.gameField.width) / 2;
        this.gameField.y = (this.options.height - this.gameField.height) / 2;
        console.log('gf', this.gameField.width);
    }

    render(delta) {
        // render game world

        // add new kitti if there are't falling kitties
        this.createKitti();
        // downFall kitties if they can
        this.downfallKitties(delta);
        // remove lines
    }

    createKitti() {
        if (this.fallingKitties.length){
            return;
        }
        let kitti = new Kitti(this.size, colors[Math.floor(Math.random()*colors.length)]);
        this.gameField.addChild(kitti);
        kitti.x = (Math.random() * (this.fieldRecatngle.width - this.size));
        kitti.y = 10;
        kitti.x -= kitti.x % this.size;
        kitti.setSpeed(SPEED);
        this.fallingKitties.push(kitti)
        console.log(kitti);
    }

    downfallKitties(delta) {
        let kitti;
        for (let i = 0; i < this.fallingKitties.length; i++) {
            kitti = this.fallingKitties[i];
            kitti.y += kitti.speed;
            this.checkKittiFall(kitti)
        }
    }

    checkKittiFall(kitti) {
        if (kitti.y >= this.fieldRecatngle.height - this.size) {
            kitti.y = this.fieldRecatngle.height - this.size;
            kitti.setSpeed(0);
            // remove kitti
            this.fallingKitties = [];
        }
    }
}

const BORDER_COLOR = 0x000000;
const BORDER_WIDTH = 2;
const FIELD_BACKGROUND_COLOR = 0x272d37;

class GameField extends PIXI.Container {
    constructor(rectangle) {
        super();

        this.drawBorder(rectangle.width, rectangle.height);
    }

    drawBorder(width, height) {
        let graphics = new PIXI.Graphics();
        graphics.beginFill(FIELD_BACKGROUND_COLOR);
        graphics.lineStyle(BORDER_WIDTH, BORDER_COLOR, 1);
        graphics.drawRect(0, 0, width + 2 * BORDER_WIDTH, height + 2 * BORDER_WIDTH);
        graphics.endFill();
        this.addChild(graphics);
        graphics.x = graphics.x - BORDER_WIDTH;
        graphics.y = graphics.y - BORDER_WIDTH;
    }

}

const colors = [0xFF0040, 0xFF00BF, 0x00FF00, 0xFF8000, 0x2E2EFE];

class Kitti extends PIXI.Container {
    constructor(size, color) {
        super();

        let catSprite = PIXI.Sprite.fromImage(catImg);
        catSprite.height = size;
        catSprite.width = size;
        catSprite.tint = color;
        this.addChild(catSprite);
        this.cacheAsBitmap = true;
        this.speed = 0;
    }

    setSpeed(val) {
        this.speed = val;
    }
}