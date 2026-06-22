// set constant to use later
const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");

// set the canvas width the half of the height because in original Tetris the height of the grid is 2 time bigger
// than the width
const clientHeight = document.documentElement.clientHeight;
ctx.canvas.height = clientHeight;
ctx.canvas.width = clientHeight * 0.5;
const blockSize = clientHeight / 20;

// create board to set the use cell
let board = new Array(20)
let color_board = new Array(20)
for (let i = 0; i < board.length; i++) {
    board[i] = new Array(10).fill(0)
    color_board[i] = new Array(10).fill("black")
}

// make a function to draw rectangle
function drawBlock(x, y, color) {
    ctx.beginPath();
    ctx.rect(x, y, blockSize, blockSize);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function check_destroy_lines() {
    for (let y = 0; y < board.length; y++) {
        let count = 0;
        for (let x = 0; x < board[y].length; x++) {
            count += board[y][x];
        }

        if (count === 10) {
            board[y] = new Array(10).fill(0);
            color_board[y] = new Array(10).fill("black");
        }
    }
}

const shapes = [
    // I = 0
    [[[0, 0], [0, 1], [0, 2], [0, 3]],
    [[0, 0], [1, 0], [2, 0], [3, 0]]],
    // L = 1
    [[[0, 0], [0, 1], [0, 2], [1, 2]],
    [[0, 0], [1, 0], [2, 0], [0, 1]],
    [[0, 0], [1, 0], [1, 1], [1, 2]],
    [[2, 0], [0, 1], [1, 1], [2, 1]]],
    // J = 2
    [[[1, 0], [1, 1], [0, 2], [1, 2]],
    [[0, 0], [0, 1], [1, 1], [2, 1]],
    [[0, 0], [1, 0], [0, 1], [0, 2]],
    [[0, 0], [1, 0], [2, 0], [2, 1]]],
    // O = 3
    [[[0, 0], [1, 0], [0, 1], [1, 1]]],
    // S = 4
    [[[1, 0], [2, 0], [0, 1], [1, 1]],
    [[0, 0], [0, 1], [1, 1], [1, 2]]],
    // Z = 5
    [[[0, 0], [1, 0], [1, 1], [2, 1]],
    [[1, 0], [0, 1], [1, 1], [0, 2]]],
    // T = 6
    [[[1, 0], [0, 1], [1, 1], [2, 1]],
    [[0, 0], [0, 1], [1, 1], [0, 2]],
    [[0, 0], [1, 0], [2, 0], [1, 1]],
    [[1, 0], [0, 1], [1, 1], [1, 2]]]
];
const colors = [
    "cyan",
    "orange",
    "blue",
    "yellow",
    "green",
    "red",
    "purple"
];

function getNextTetrominos() {
    let random_tetromino = Math.floor(Math.random() * shapes.length);
    return new Tetromino(shapes[random_tetromino], colors[random_tetromino], board);
}

// make class to have better manipulation on the Tetrominos physic and movement
class Tetromino {
    constructor(shape, color) {
        this.shape = shape;
        this.shape_rotation = 0
        this.color = color;
        this.position = {x: 0, y: 0};
        this.is_set = false;
    }

    draw() {
        for (let i = 0; i < this.shape[this.shape_rotation].length; i++) {
            const [dx, dy] = this.shape[this.shape_rotation][i];
            drawBlock((this.position.x + dx) * blockSize, (this.position.y + dy) * blockSize, this.color);
        }
    }

    check_fall() {
        let can_fall = this._can_fall()
        if (can_fall) {
            this._fall()
        } else if (!this.is_set) {
            this._set()
        }
    }

    _can_fall() {
        for (let i = 0; i < this.shape[this.shape_rotation].length; i++) {
            const [dx, dy] = this.shape[this.shape_rotation][i];
            if (this.position.y + dy === 19) {
                return false
            } else if (board[this.position.y + dy + 1][this.position.x + dx] === 1) {
                return false
            }
        }
        return true;
    }

    _fall() {
        this.position.y += 1;

        //console.log(this.position);
    }

    _set() {
        for (let i = 0; i < this.shape[this.shape_rotation].length; i++) {
            const [dx, dy] = this.shape[this.shape_rotation][i];
            const blockY = this.position.y + dy;
            const blockX = this.position.x + dx;
            board[blockY][blockX] = 1;
            color_board[blockY][blockX] = this.color;
        }
        this.is_set = true;
    }

    check_move(add_value) {
        let can_move = this._can_move_horizontally(add_value);
        if (can_move) {
            this._move(add_value);
        }
        //console.log(this.position.x)
    }

    _can_move_horizontally(add_value) {
        for (let i = 0; i < this.shape[this.shape_rotation].length; i++) {
            const [dx, dy] = this.shape[this.shape_rotation][i];
            if (this.position.x + dx === 0 && add_value === -1) {
                return false
            } else if (this.position.x + dx === 9 && add_value === 1) {
                return false
            } else if (board[this.position.y + dy][this.position.x + dx + add_value] === 1) {
                return false
            }
        }
        return true;
    }

    _move(add_value) {
        this.position.x += add_value;
    }

    check_rotation() {
        let can_rotate = this._can_rotate();
        if (can_rotate) {
            this._rotate();
        }
    }

    _can_rotate() {
        const next_rotation_requested = (this.shape_rotation + 1) % this.shape.length;
        for (let i = 0; i < this.shape[next_rotation_requested].length; i++) {
            const [dx, dy] = this.shape[next_rotation_requested][i];
            /*console.log("this block position x :", this.position.x + dx);
            console.log("board value :" + board[this.position.y +dy][this.position.x + dx])*/
            if (this.position.x + dx > 9) {
                return false;
            } else if (board[this.position.y + dy][this.position.x + dx] === 1) {
                return false;
            }
        }
        return true;
    }

    _rotate() {
        this.shape_rotation = (this.shape_rotation + 1) % this.shape.length;
    }
}

let new_tetromino = getNextTetrominos()
setInterval(() => {new_tetromino.check_fall()}, 1000);

function update_canvas() {
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            const blockX = x * blockSize;
            const blockY = y * blockSize;
            drawBlock(blockX, blockY, color_board[y][x]);
        }
    }
    new_tetromino.draw();
    ctx.closePath();
}

function loop() {
    if (new_tetromino.is_set) {
        new_tetromino = getNextTetrominos()
    }
    update_canvas()
    check_destroy_lines();
}

setInterval(loop, 1);

document.addEventListener("keydown", function(event) {
    /*console.log(`key pressed code: ${event.code}`)
    console.log(`key pressed key: ${event.key}`)*/
    if (event.code === "ArrowRight") {
        new_tetromino.check_move(1);
    } else if (event.code === "ArrowLeft") {
        new_tetromino.check_move(-1);
    } else if (event.code === "KeyC") {
        new_tetromino.check_rotation();
    }
})
