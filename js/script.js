const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const BOX_SIZE = 32; // px
const FPS = 80;

// Field size: 17x15
const FIELD_WIDTH = 17;
const FIELD_HEIGHT = 15;

const GROUND_IMAGE = new Image();
GROUND_IMAGE.src = "./img/background.png";

const FOOD_IMAGE = new Image();
FOOD_IMAGE.src = "./img/apple.png";

const LOSE_MESSAGE = "HA-HA-HA, YOU ARE LOSER! xD";

function spawnApple(){
    let rnd = (min, max) => {
        return Math.floor(Math.random() * max + min) * BOX_SIZE
    };

    return {
        x: rnd(1, FIELD_WIDTH),
        y: rnd(3, FIELD_HEIGHT)
    }
}

let score = 0;

let apple = spawnApple();

let snake = [];
snake[0] = {
    x: Math.ceil(FIELD_WIDTH / 2) * BOX_SIZE,
    y: Math.ceil(FIELD_HEIGHT / 2) * BOX_SIZE ,
};

let direction; // key direction

function changeDirection(e){
    if (e.keyCode === 37 && direction !== "right"){
        direction = "left";
    } else if (e.keyCode === 38 && direction !== "down"){
        direction = "up";
    } else if (e.keyCode === 39 && direction !== "left"){
        direction = "right";
    } else if (e.keyCode === 40 && direction !== "up"){
        direction = "down";
    }
}

document.addEventListener("keydown", changeDirection);

function eatSelf(head, tail){
    for (let i = 0; i < tail.length; i++) {
        if (head.x === tail[i].x && head.y === tail[i].y){
            return false;
        }
    }
}

function game_loop(){
    ctx.drawImage(GROUND_IMAGE, 0, 0);

    ctx.drawImage(FOOD_IMAGE, apple.x, apple.y);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "green": "red";
        ctx.fillRect(snake[i].x, snake[i].y, BOX_SIZE, BOX_SIZE);
    }

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(score, BOX_SIZE * 2, BOX_SIZE * 1.5);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (snakeX === apple.x && snakeY === apple.y){
        score++;
        apple = spawnApple();
    }

    else {
        snake.pop();
    }

    let head = {
        x: snakeX,
        y: snakeY
    };

    let tail = snake.slice(1, snake.length);

    if (snakeX < BOX_SIZE || snakeX > FIELD_WIDTH * BOX_SIZE
        || snakeY < 3 * BOX_SIZE || snakeY > FIELD_WIDTH * BOX_SIZE
        || eatSelf(head, tail) === false
    ){
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText(LOSE_MESSAGE, BOX_SIZE * 4, BOX_SIZE * 1.5);
        console.log("Game over");
        clearInterval(game);
    }

    if (direction === "left") snakeX -= BOX_SIZE;
    if (direction === "right") snakeX += BOX_SIZE;
    if (direction === "down") snakeY += BOX_SIZE;
    if (direction === "up") snakeY -= BOX_SIZE;

    let new_head = {
        x: snakeX,
        y: snakeY
    };
    snake.unshift(new_head);
}

let game = setInterval(game_loop, FPS);
