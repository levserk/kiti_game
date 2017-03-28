const PIXI = require('pixi.js');
import catImg from '../img/cat.png';
import {colors, VERTICAL_SQUARES_COUNT, HORIZONTAL_SQUARES_COUNT} from './const.js'
import GameField from './game_field'

const defaultOptions = {
    width: null,
    height: null
};

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
        this.fallingKitties = new Map();
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
        this.findFallingKitties();
    }

    createKitti() {
        if (this.fallingKitties.size || this.removingKitties.length){
            return;
        }
        let kitti = new Kitti(this.size, colors[Math.floor(Math.random()*colors.length)]);
        this.gameField.addChild(kitti);
        kitti.x = Math.floor(Math.random() * this.gameField.cols) * this.gameField.cellSize;
        kitti.y = -this.gameField.cellSize;
        this.failDownKitti(kitti);
    }

    failDownKitti(kitti) {
        kitti.setSpeed(this.speed);
        this.fallingKitties.set(kitti.id, kitti);
    }

    downfallKitties(delta) {
        let kitti;
        this.fallingKitties.forEach((kitti) => {
            kitti.y += kitti.speed * delta;
            this.checkKittiFallDown(kitti)
        });
    }

    checkKittiFallDown(kitti) {
        let kittiRow = this.gameField.getKittiesRow(kitti),
            kittiCol = this.gameField.getKittiesCol(kitti);

        if (kittiRow >= 0 && (kittiRow === this.gameField.rows -1 || this.gameField.checkKittiIntersection(kitti))) {
            this.stopKittiFailing(kitti);
        }
    }

    stopKittiFailing(kitti) {
        let kittiRow = this.gameField.getKittiesRow(kitti);
        kitti.y = kittiRow *  this.gameField.cellSize;
        kitti.setSpeed(0);
        // remove kitti
        if (!this.fallingKitties.has(kitti.id)) {
            console.error(`game does't contain failing kitti`,this.fallingKitties, kitti);
            return;
        }
        this.fallingKitties.delete(kitti.id);
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

    findFallingKitties() {
        let kitties = this.gameField.kitties.values();

        for (let kitti of kitties) {
            if (kitti.row < this.gameField.rows - 1 && !this.gameField.checkKittiIntersection(kitti)) {
                this.gameField.unsetKitti(kitti);
                this.failDownKitti(kitti);
                break;
            }
        }
    }
}

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
        this.id = Date.now() + '_' + Math.round(Math.random()*100000);
    }

    setSpeed(val) {
        this.speed = val;
    }
}
