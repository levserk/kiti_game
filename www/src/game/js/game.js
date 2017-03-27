const PIXI = require('pixi.js');

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

export default class Game extends PIXI.Container{
    constructor(options) {
        super();

        this.options = Object.assign({}, defaultOptions, options);
        this.fieldRecatngle = calcFieldSize(this.options.width, this.options.height);
        this.squareSize = calcSquareSize(this.fieldRecatngle.width);
        this.gameField = null;

        console.log(this.fieldRecatngle, this.squareSize);

        this.addGameField();
    }

    addGameField() {
        this.gameField = new GameField(this.fieldRecatngle);
        this.addChild(this.gameField);
        console.log('gf', this.gameField.width);
    }
}

const BORDER_COLOR = 0x000000;
const BORDER_WIDTH = 2;

class GameField extends PIXI.Container {
    constructor(rectangle) {
        super();

        this.drawBorder(rectangle.width, rectangle.height);
    }

    drawBorder(width, height) {
        let graphics = new PIXI.Graphics();
        graphics.lineStyle(BORDER_WIDTH, BORDER_COLOR, 1);
        graphics.drawRect(0, 0, width, height);
        this.addChild(graphics);
    }

}