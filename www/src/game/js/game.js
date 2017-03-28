const PIXI = require('pixi.js');
import catImg from '../img/cat.png';

const defaultOptions = {
    width: null,
    height: null
};

const PROPORTIONS_MULT = 1.8;
const VERTICAL_SQUARES_COUNT = 15;
const HORIZONTAL_SQUARES_COUNT = 8;

const calcSquareSize = (width, height) => {
    return Math.min(Math.floor(width / HORIZONTAL_SQUARES_COUNT),Math.floor(height / VERTICAL_SQUARES_COUNT))
};

const calcFieldSize = (size, width, height) => {
   return {
       width: HORIZONTAL_SQUARES_COUNT * size,
       height: VERTICAL_SQUARES_COUNT * size
   }
};

const SPEED_SIZES = 0.3;

export default class Game extends PIXI.Container{
    constructor(options) {
        super();

        this.options = Object.assign({}, defaultOptions, options);
        this.size = calcSquareSize(this.options.width, this.options.height);
        this.fieldRecatngle = calcFieldSize(this.size, this.options.width, this.options.height);

        this.gameField = null;
        this.fallingKitties = [];
        this.removingKitties = [];
        this.speed = this.size * SPEED_SIZES;

        console.log(this.fieldRecatngle, this.size);

        this.addGameField();
    }

    addGameField() {
        this.gameField = new GameField(this.fieldRecatngle, this.size);
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
        this.checkRepeatingKitties();
        this.removeKitties();
    }

    createKitti() {
        if (this.fallingKitties.length || this.removingKitties.length){
            return;
        }
        let kitti = new Kitti(this.size, colors[Math.floor(Math.random()*colors.length)]);
        this.gameField.addChild(kitti);
        kitti.x = Math.floor(Math.random() * this.gameField.cols) * this.gameField.cellSize;
        kitti.y = -this.gameField.cellSize;
        kitti.setSpeed(this.speed);
        this.fallingKitties.push(kitti);
    }

    downfallKitties(delta) {
        let kitti;
        for (let i = 0; i < this.fallingKitties.length; i++) {
            kitti = this.fallingKitties[i];
            kitti.y += kitti.speed * delta;
            this.checkKittiFallDown(kitti)
        }
    }

    checkKittiFallDown(kitti) {
        let kittiRow = this.gameField.getKittiRow(kitti),
            kittiCol = this.gameField.getKittiCol(kitti);

        if (kittiRow >= 0 && (kittiRow === this.gameField.rows -1 || this.gameField.checkKittiIntersection(kitti))) {
            this.stopKittiFailing(kitti);
        }
    }

    stopKittiFailing(kitti) {
        let kittiRow = this.gameField.getKittiRow(kitti);
        kitti.y = kittiRow *  this.gameField.cellSize;
        kitti.setSpeed(0);
        // remove kitti
        this.fallingKitties = [];
        this.gameField.setKitti(kitti);
    }

    checkRepeatingKitties() {
        if (this.fallingKitties.length){
            return;
        }
        this.removingKitties = this.gameField.gameMap.getRepeats();
    }

    removeKitties() {
        for (let i = 0; i < this.removingKitties.length; i++) {
            this.gameField.removeKitti(this.removingKitties[i]);
        }
        this.removingKitties = []
    }
}

const BORDER_COLOR = 0x000000;
const BORDER_WIDTH = 2;
const FIELD_BACKGROUND_COLOR = 0x272d37;

class GameField extends PIXI.Container {
    constructor(rectangle, cellSize) {
        super();
        this.fieldWidth = rectangle.width;
        this.fieldHeight = rectangle.height;
        this.cols = HORIZONTAL_SQUARES_COUNT;
        this.rows = VERTICAL_SQUARES_COUNT;
        this.cellSize = cellSize;
        this.drawBorder(rectangle.width, rectangle.height);
        this.gameMap = new GameMap(this.cols, this.rows);
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

    getKittiRow(kitti) {
        return (kitti.y - kitti.y % this.cellSize) / this.cellSize;
    }

    getKittiCol(kitti) {
        return (kitti.x - kitti.x % this.cellSize) / this.cellSize;
    }

    checkKittiIntersection(kitti){
        let kittiRow = this.getKittiRow(kitti) + 1,
            kittiColl = this.getKittiCol(kitti);

        return this.gameMap.get(kittiRow, kittiColl) !== null
    }

    setKitti(kitti) {
        let kittiRow = this.getKittiRow(kitti),
            kittiColl = this.getKittiCol(kitti);

        this.gameMap.set(kittiRow, kittiColl, kitti);
        console.log(`-----`);
        this.gameMap.printMap();
        console.log(kittiesArrayToStr(this.gameMap.getRepeats()));
    }

    removeKitti(kitti) {
        this.removeChild(kitti);
        this.gameMap.remove(kitti.row, kitti.col);
    }

}

const colors = [0xFF0040, 0xFF00BF] //, 0x00FF00, 0xFF8000, 0x2E2EFE];

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
        this.col = null;
        this.row = null;
        this.value = colors.indexOf(color);
    }

    setSpeed(val) {
        this.speed = val;
    }
}

class GameMap {
    constructor(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.createMap();
    }

    createMap() {
        let arr = [];
        for (let i = 0; i < this.rows; i++){
            let cols = [];
            for (let j = 0; j < this.cols; j++) {
                cols.push(null);
            }
            arr.push(cols);
        }
        this.map = arr;
    }

    get(row, col) {
        return this.map[row][col]
    }

    set(row, col, element) {
        element.row = row;
        element.col = col;
        return this.map[row][col] = element
    }

    remove(row, col) {
        this.map[row][col] = null;
    }

    getRepeats() {
        return findRepeatingElementsInArray(this.map)
    }

    printMap() {
        for (let i = 0; i < this.map.length; i++) {
            console.log(kittiesArrayToStr(this.map[i]));
        }
    }


}

const findRepeatingElementsInArray = (array) => {
    let result = [],
        row,
        cols = [],
        diagonals = [];

    for (let i = 0; i < array.length; i++) {
        row = array[i];
        result = result.concat(findRepeatingElements(row));
        for (let j = 0; j < row.length; j++) {
            cols[j] = cols[j] ? cols[j].concat(row[j]) : [row[j]];
        }
    }

    for (let i = 0; i < cols.length; i++) {
        result = result.concat(findRepeatingElements(cols[i]));
    }

    return result.filter( (el, i, arr) => arr.indexOf(el) === i);
};

const findRepeatingElements = (elements) => {
    let result = [],
        series = [],
        element;

    for (let i = 0; i < elements.length; i++) {
        element = elements[i];
        if (element !== null && (series.length === 0 || series[0].value === element.value)) {
            series.push(element);
            continue;
        }

        if (series.length >= 3) {
            result = result.concat(series);
            series = [];
        }

        if (series.length === 0 && element !== null) {
            series.push(element)
        } else {
            series = element ? [element]:[];
        }
    }

    if (series.length >= 3) {
        result = result.concat(series);
    }

    return result;
};

const kittiesArrayToStr = (kitties) => {
   return kitties.map(kittie => { return kittie ? kittie.value.toString() : '-' });
};