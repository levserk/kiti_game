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
        this.interactive = true;
    }

    drawBorder(width, height) {
        let background = new PIXI.Container();
        let graphics = new PIXI.Graphics();
        graphics.beginFill(FIELD_BACKGROUND_COLOR);
        graphics.lineStyle(BORDER_WIDTH, BORDER_COLOR, 1);
        graphics.drawRect(0, 0, width + 2 * BORDER_WIDTH, height + 2 * BORDER_WIDTH);
        graphics.endFill();
        background.addChild(graphics);
        background.cacheAsBitmap = true;
        graphics.x = graphics.x - BORDER_WIDTH;
        graphics.y = graphics.y - BORDER_WIDTH;
        this.addChild(background);
    }

    getKittiesRow(kitti) {
        return (kitti.y - kitti.y % this.cellSize) / this.cellSize;
    }

    getKittiesCol(kitti) {
        return (kitti.x - kitti.x % this.cellSize) / this.cellSize;
    }

    getRowColPositionPoint(kittiRow, kittiColl) {
        return {
            x: kittiColl * this.cellSize,
            y: kittiRow * this.cellSize
        }
    }

    checkRowColIntersection(kittiRow, kittiColl) {
        return this.gameMap.get(kittiRow, kittiColl) !== null
    }

    checkBelowKittiIntersection(kitti){
        let kittiRow = this.getKittiesRow(kitti) + 1,
            kittiColl = this.getKittiesCol(kitti);

        return kittiRow >= this.rows || this.gameMap.get(kittiRow, kittiColl) !== null
    }

    checkAboveKittiIntersection(kitti) {
        let kittiRow = this.getKittiesRow(kitti) - 1,
            kittiColl = this.getKittiesCol(kitti);

        return kittiRow < 0 || this.gameMap.get(kittiRow, kittiColl) !== null
    }

    checkPointInBounds(point) {
        if (point.row) {
            return point.row >= 0 && point.row < this.rows && point.col >=0 && point.col < this.cols
        }
        return false;
    }

    setKitti(kitti) {
        let kittiRow = this.getKittiesRow(kitti),
            kittiColl = this.getKittiesCol(kitti),
            oldKitti = this.gameMap.get(kittiRow, kittiColl);

        if (oldKitti) {
            console.warn(`previous kitti exists! oldId: ${oldKitti.id}, newId: ${kitti.id}`);
            this.removeKitti(oldKitti);
        }

        this.gameMap.set(kittiRow, kittiColl, kitti);
        this.kitties.set(kitti.id, kitti);
        kitti.buttonMode = true;
        //console.log(`-----`);
        //this.gameMap.printMap();
        //console.log(kittiesArrayToStr(this.gameMap.getRepeats()));
    }

    unsetKitti(kitti) {
        if (!this.kitties.has(kitti.id)) {
            console.error(`game field does't contain kitti ${kitti.id}`, kitti);
            return;
        }
        this.gameMap.remove(kitti.row, kitti.col);
        this.kitties.delete(kitti.id);
        kitti.buttonMode = false;
    }

    removeKitti(kitti) {
        kitti.destroy();
        this.removeChild(kitti);
        this.unsetKitti(kitti);
    }

    clear() {
        for (let kitti of this.kitties.values()) {
            this.removeKitti(kitti)
        }

        this.kitties = new Map();
    }
}


const kittiesArrayToStr = (kitties) => {
    return kitties.map(kittie => { return kittie ? kittie.value.toString() : '-' });
};