export default class GameMap {
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

export const findRepeatingElementsInArray = (array) => {
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

export const findRepeatingElements = (elements) => {
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


export const kittiesArrayToStr = (kitties) => {
    return kitties.map(kittie => { return kittie ? kittie.value.toString() : '-' });
};