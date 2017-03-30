const PIXI = require('pixi.js');

import {colors, VERTICAL_SQUARES_COUNT, HORIZONTAL_SQUARES_COUNT} from './const.js'
import GameField from './game_field'

const resources = PIXI.loader.resources;

const defaultOptions = {
    width: null,
    height: null,
    speed: 0.3, // sizes
    delayBetweenCreations: 1500
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

export default class Game extends PIXI.Container{
    constructor(options) {
        super();

        this.options = Object.assign({}, defaultOptions, options);
        this.size = calcSquareSize(this.options.width, this.options.height);
        this.fieldRecatngle = calcFieldSize(this.size, this.options.width, this.options.height);

        this.gameField = null;
        this.fallingKitties = new Map();
        this.removingKitties = [];
        this.speed = this.size * this.options.speed;
        this.draggingKitti = null;

        this.addGameField();
    }

    addGameField() {
        this.gameField = new GameField(this.fieldRecatngle, this.size);
        this.addChild(this.gameField);
        this.gameField.x = (this.options.width - this.gameField.width) / 2;
        this.gameField.y = (this.options.height - this.gameField.height) / 2;
        this.gameField.on('pointermove', this.onPointerMove.bind(this))
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
        if (this.fallingKitties.size || this.removingKitties.length
            || (this.timeLastCreate && Date.now() - this.timeLastCreate < this.options.delayBetweenCreations)){
            return;
        }
        let kitti = new Kitti(this.size, colors[Math.floor(Math.random()*colors.length)]);
        this.timeLastCreate = Date.now();
        this.gameField.addChild(kitti);
        kitti.x = Math.floor(Math.random() * this.gameField.cols) * this.gameField.cellSize;
        kitti.y = -this.gameField.cellSize;

        kitti.on('pointerdown', (e) => this.onKittiPointerDown(e, kitti))
            .on('pointerup', (e) => this.onKittiPointerUp(e, kitti))
            .on('pointerupoutside', (e) => this.onKittiPointerUp(e, kitti));

        this.failDownKitti(kitti);
    }

    failDownKitti(kitti) {
        kitti.setSpeed(this.speed);
        this.fallingKitties.set(kitti.id, kitti);
    }

    downfallKitties(delta) {
        let kitti;
        this.fallingKitties.forEach((kitti) => {
            // todo: check before and after
            if (!this.checkKittiFallDown(kitti)) {
                kitti.y = Math.floor(kitti.y + kitti.speed * delta);
                this.checkKittiFallDown(kitti);
            }
        });
    }

    checkKittiFallDown(kitti) {
        let kittiRow = this.gameField.getKittiesRow(kitti),
            kittiCol = this.gameField.getKittiesCol(kitti);

        if (this.draggingKitti && this.draggingKitti.col === kittiCol && this.draggingKitti.row === kittiRow + 1) {
            this.stopDraggingKitti();
            return this.stopKittiFailing(kitti);
        }

        if (kittiRow >= 0 && (kittiRow === this.gameField.rows -1 || this.gameField.checkBelowKittiIntersection(kitti))) {
            return this.stopKittiFailing(kitti);
        }

        return false;
    }

    stopKittiFailing(kitti) {
        let kittiRow = this.gameField.getKittiesRow(kitti);
        kitti.y = kittiRow *  this.gameField.cellSize;
        kitti.setSpeed(0);
        // remove kitti
        if (!this.fallingKitties.has(kitti.id)) {
            console.error(`game does't contain failing kitti`,this.fallingKitties, kitti);
            return false;
        }
        this.fallingKitties.delete(kitti.id);
        this.gameField.setKitti(kitti);

        if (kittiRow === 0) {
            console.log(`Game over`);
            this.gameField.clear();
        }

        return true;
    }

    checkRepeatingKitties() {
        if (this.fallingKitties.length){
            return;
        }
        this.removingKitties = this.gameField.gameMap.getRepeats();
    }

    removeKitties() {
        for (let i = 0; i < this.removingKitties.length; i++) {
            // call this after animation end
            this.gameField.removeKitti(this.removingKitties[i]);
        }
        this.removingKitties = []
    }

    findFallingKitties() {
        let kitties = this.gameField.kitties.values();

        for (let kitti of kitties) {
            if (kitti.row < this.gameField.rows - 1 && !this.gameField.checkBelowKittiIntersection(kitti)) {
                this.gameField.unsetKitti(kitti);
                this.failDownKitti(kitti);
                break;
            }
        }
    }

    onPointerMove(e) {
        if (!this.draggingKitti){
            return;
        }

        if (this.draggingKitti && this.gameField.checkAboveKittiIntersection(this.draggingKitti)) {
            this.stopDraggingKitti(this.draggingKitti);
            return;
        }

        let point = e.data.getLocalPosition(this.gameField);
        this.dragKittiToPointer(point);
    }

    onKittiPointerDown(e, kitti) {
        console.log('d', e.data.getLocalPosition(this.gameField));
        if (this.draggingKitti || !kitti.buttonMode || this.gameField.checkAboveKittiIntersection(kitti)){
            return;
        } else {
            this.startDraggingKitti(kitti);
        }

    }

    onKittiPointerUp(e, kitti) {
        console.log('u', e.data.getLocalPosition(this.gameField));
        if (this.draggingKitti === kitti) {
            this.stopDraggingKitti(kitti);
        }
    }

    stopDraggingKitti() {
        if (!this.draggingKitti) {
            console.warn(`there isn't dragging kitti!`);
            return;
        }
        this.draggingKitti.setDragging(false);
        this.gameField.setKitti(this.draggingKitti);
        this.gameField.gameMap.printMap();
        console.log('kitties[id]', this.gameField.kitties.get(this.draggingKitti.id));
        this.draggingKitti = null;
        this.findFallingKitties();
    }

    startDraggingKitti(kitti) {
        console.log(`start drag ${kitti.id}`, kitti);
        this.draggingKitti = kitti;
        kitti.setDragging(true);
        this.gameField.unsetKitti(kitti);
        this.gameField.gameMap.printMap();
        console.log('kitties[id]', this.gameField.kitties.get(kitti.id))
    }

    dragKittiToPointer(point) {
        let pointerRow = this.gameField.getKittiesRow(point),
            pointerCol = this.gameField.getKittiesCol(point),
            kitti = this.draggingKitti,
            kittiRow = this.gameField.getKittiesRow(kitti),
            kittiCol = this.gameField.getKittiesCol(kitti);

        console.log(pointerRow, kittiRow, pointerCol, kittiCol);

        if (this.gameField.checkPointInBounds({row: pointerRow, col: pointerCol})
            && (kittiCol !== pointerCol || kittiRow !== pointerRow)
            && !this.gameField.checkRowColIntersection(pointerRow, pointerCol)) {
            // todo: check failing kittie is here
            kitti.setPosition(this.gameField.getRowColPositionPoint(pointerRow, pointerCol));
        }
    }

    reset() {

    }
}

class Kitti extends PIXI.Container {
    constructor(size, color) {
        super();

        let catSprite = new PIXI.Sprite(resources.cat.texture);
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
        this.interactive = true;
    }

    setDragging(value) {
        if (value) {
            this.alpha = 0.5
        } else {
            this.alpha = 1;
        }
    }

    setSpeed(val) {
        this.speed = val;
    }

    setPosition(point) {
        this.x = point.x;
        this.y = point.y;
    }
}
