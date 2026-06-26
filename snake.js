const canvas = document.getElementById("snake");
const ctx = canvas.getContext("2d");

ctx.canvas.width = 400;
ctx.canvas.height = 400;

function draw_lines() {
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(150, 150, 150)"
    ctx.fill();
    for (let i = 1; i < 10; i++) {
        ctx.beginPath();
        ctx.rect(i * 40 - 1, 0, 2, canvas.height);
        ctx.fillStyle = "rgb(200, 200, 200)";
        ctx.fill();
        ctx.closePath();
    }
    for (let i = 1; i < 10; i++) {
        ctx.beginPath();
        ctx.rect(0, i * 40 - 1, canvas.width, 2);
        ctx.fillStyle = "rgb(200, 200, 200)";
        ctx.fill();
        ctx.closePath();
    }
}

function init_snake() {
    let snake = [];
    snake.push([80, 80]);
    snake.push([80, 120]);
    snake.push([80, 160]);

    return snake;
}

function draw_snake(snake) {
    snake.forEach((piece) => {
        ctx.beginPath();
        ctx.rect(piece[0], piece[1], 40, 40);
        if (snake.indexOf(piece) === 0) {
            ctx.fillStyle = "rgb(0, 255, 0)";
        }
        else {
            ctx.fillStyle = "rgb(0, 100, 0)";
        }
        ctx.fill();
        ctx.closePath();
    })
}

function snake_next_direction(snake, direction) {
    let next_direction = null;
    if (direction === "left") {
        next_direction = [snake[0][0] - 40, snake[0][1]];
    } else if (direction === "right") {
        next_direction = [snake[0][0] + 40, snake[0][1]];
    } else if (direction === "down") {
        next_direction = [snake[0][0], snake[0][1] + 40];
    } else if (direction === "up") {
        next_direction = [snake[0][0], snake[0][1] - 40];
    }

    return next_direction;
}

function move_snake(snake, next_direction) {
    snake.unshift(next_direction);
    snake.pop();

    snake.forEach((piece) => {
        if (snake[0][0] === piece[0] && snake[0][1] === piece[1] && snake[0] !== piece) {
            location.reload();
        }
    })

    return snake;
}

function get_random_apple_position() {
    return [Math.floor(Math.random() * 9) * 40, Math.floor(Math.random() * 9) * 40]
}

function create_apples(apples_nb) {
    let apples = [];
    for (let i = 0; i < apples_nb; i++) {
        let random_position = get_random_apple_position();
        apples.push(random_position);
    }

    return apples;
}

function draw_apples(apples) {
    apples.forEach((apple) => {
        ctx.beginPath();
        ctx.rect(apple[0], apple[1], 40, 40);
        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.fill();
        ctx.closePath();
    })
}

function check_eat_apple(snake, apples) {
    let eated_apples = -1;
    apples.forEach((apple) => {
        if (snake[0][0] === apple[0] && snake[0][1] === apple[1]) {
            eated_apples = apples.indexOf(apple);
        }
    })
    if (eated_apples !== -1) {
        apples.splice(eated_apples, 1);
        snake.push(snake[snake.length - 1]);
    }
    return apples
}

let snake = init_snake();
let apples = create_apples(10);
function update_canvas() {
    draw_lines();
    draw_snake(snake);
    draw_apples(apples);
}

let direction = "up"
let next_direction = [snake[0][0], snake[0][1] - 40]
function update_snake() {
    next_direction = snake_next_direction(snake, direction)
    snake = move_snake(snake, next_direction);
    apples = check_eat_apple(snake, apples);
}

setInterval(update_canvas, 1);
setInterval(update_snake, 250);

document.addEventListener("keydown", function(event) {
    console.log(event.code);
    if (event.key === "ArrowRight" && direction !== "left") {
        direction = "right";
    } else if (event.key === "ArrowLeft" && direction !== "right") {
        direction = "left";
    } else if (event.key === "ArrowDown" && direction !== "up") {
        direction = "down";
    } else if (event.key === "ArrowUp" && direction !== "down") {
        direction = "up";
    }
});