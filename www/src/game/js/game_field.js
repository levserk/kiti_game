const PIXI = require('pixi.js');
import GameMap from './game_map.js'
import {colors, VERTICAL_SQUARES_COUNT, HORIZONTAL_SQUARES_COUNT} from './const.js'

const BORDER_COLOR = 0x000000;
const BORDER_WIDTH = 2;
const FIELD_BACKGROUND_COLOR = 0x272d37;

export default class GameField extends PIXI.Container {
    constructor(rectangle, cellSize) {
        super();
        this.fieldWidth = rectangle.width;
        this.fieldHeight = rectangle.height;
        this.cols = HORIZONTAL_SQUARES_COUNT;
        this.rows = VERTICAL_SQUARES_COUNT;
        this.cellSize = cellSize;
        this.drawBorder(rectangle.width, rectangle.height);
        this.gameMap = new GameMap(this.cols, this.rows);
        this.kitties = new Map();
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

    getKittiesRow(kitti) {
        return (kitti.y - kitti.y % this.cellSize) / this.cellSize;
    }

    getKittiesCol(kitti) {
        return (kitti.x - kitti.x % this.cellSize) / this.cellSize;
    }

    checkKittiIntersection(kitti){
        let kittiRow = this.getKittiesRow(kitti) + 1,
            kittiColl = this.getKittiesCol(kitti);

        return this.gameMap.get(kittiRow, kittiColl) !== null
    }

    setKitti(kitti) {
        let kittiRow = this.getKittiesRow(kitti),
            kittiColl = this.getKittiesCol(kitti);

        this.gameMap.set(kittiRow, kittiColl, kitti);
        this.kitties.set(kitti.id, kitti);
        console.log(`-----`);
        this.gameMap.printMap();
        console.log(kittiesArrayToStr(this.gameMap.getRepeats()));
    }

    unsetKitti(kitti) {
        if (!this.kitties.has(kitti.id)) {
            console.error(`game field does't contain kitti`, kitti);
            return;
        }
        this.gameMap.remove(kitti.row, kitti.col);
        this.kitties.delete(kitti.id);
    }

    removeKitti(kitti) {
        this.removeChild(kitti);
        this.unsetKitti(kitti);
    }

}


const kittiesArrayToStr = (kitties) => {
    return kitties.map(kittie => { return kittie ? kittie.value.toString() : '-' });
};