const GRID_SIZE = 800;
const CELL_SIZE = 10;
const FRAME_RATE = 60;

let currentGen;
let columns;
let rows;

function random0or1() {
    return floor(random(2));
}

function randomizeCurrentGen(currentGen) {
    parse2DArray((i, j) => {
        currentGen[i][j] = random0or1();
    });
}

function parse2DArray(fn) {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            fn(i, j);
        }
    }
}

function countAliveNeighbors(grid, x, y) {
    let aliveNeighbors = 0;
    const cellValue = grid[x][y];

    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            const col = (x + i + columns) % columns;
            const row = (y + j + rows) % rows;

            aliveNeighbors += grid[col][row];
        }
    }
    aliveNeighbors -= cellValue;
    return aliveNeighbors;
}

function setup2DArray(columns, rows) {
    const array = new Array(columns);

    for (let i = 0; i < array.length; i++) {
        array[i] = new Array(rows).fill(0);
    }
    return array;
}

function getNextGen(currentGen) {
    let nextGen = setup2DArray(columns, rows);

    parse2DArray((i, j) => {
        const cellValue = currentGen[i][j];

        const aliveNeighbors = countAliveNeighbors(currentGen, i, j);

        if (cellValue === 1) {
            if (aliveNeighbors < 2 || aliveNeighbors > 3) {
                nextGen[i][j] = 0;
            } else {
                nextGen[i][j] = 1;
            }
        } else {
            if (aliveNeighbors === 3) {
                nextGen[i][j] = 1;
            } else {
                nextGen[i][j] = 0;
            }
        }
    });

    return nextGen;
}

function setup() {
    createCanvas(GRID_SIZE * 1.8, GRID_SIZE);
    columns = width / CELL_SIZE;
    rows = height / CELL_SIZE;

    currentGen = setup2DArray(columns, rows);

    randomizeCurrentGen(currentGen);
}

function draw() {
    background(0);
    frameRate(FRAME_RATE);

    const nextGen = getNextGen(currentGen);

    currentGen = nextGen;

    parse2DArray((i, j) => {
        const x = i * CELL_SIZE;
        const y = j * CELL_SIZE;

        const cellValue = currentGen[i][j];

        if (cellValue === 1) {
            fill(255);
            stroke(0);
            rect(x, y, CELL_SIZE - 1, CELL_SIZE - 1);
        }
    });
}
