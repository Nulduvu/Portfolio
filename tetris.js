const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");
var clientHeight = document.documentElement.clientHeight;

ctx.canvas.height = clientHeight;
ctx.canvas.width = clientHeight * 0.5;

var blockSize = clientHeight / 20;

function draw_block(x, y, color) {
    ctx.beginPath();
    ctx.rect(x, y, blockSize, blockSize);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

class Piece {
    constructor(shape, color) {
        this.shape = shape;
        this.color = color;
        this.position = {x: 0,y: 0 };
    }

    draw() {
        for (let i = 0; i < this.shape.length; i++) {
            var [dx, dy] = this.shape[i];
            draw_block((this.position.x + dx) * blockSize, (this.position.y + dy) * blockSize, this.color);
        }
    }

    fall() {
        this.position.y += 1;
    }
}

Tpiece = new Piece([[0, 0], [1, 0], [2, 0], [1, 1]], "purple");

for (let i = 0; i < 10; i++) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    Tpiece.draw();
    Tpiece.fall();
}
