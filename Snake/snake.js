const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const bestElement = document.getElementById('best-score');
const message = document.getElementById('game-message');
const messageTitle = document.getElementById('message-title');
const messageText = document.getElementById('message-text');
const startButton = document.getElementById('start-button');

const tiles = 20;
const tileSize = canvas.width / tiles;
const startingSnake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];

let snake;
let apple;
let direction;
let nextDirection;
let score = 0;
let bestScore = Number(localStorage.getItem('snake-best-score')) || 0;
let gameTimer;
let playing = false;

bestElement.textContent = bestScore;

function resetGame() {
    snake = startingSnake.map(part => ({ ...part }));
    direction = { x: 1, y: 0 };
    nextDirection = { ...direction };
    score = 0;
    scoreElement.textContent = score;
    placeApple();
    draw();
}

function startGame() {
    clearInterval(gameTimer);
    resetGame();
    playing = true;
    message.classList.add('hidden');
    gameTimer = setInterval(moveSnake, 115);
}

function endGame() {
    playing = false;
    clearInterval(gameTimer);
    messageTitle.textContent = 'Game over!';
    messageText.textContent = `You scored ${score}. Have another go?`;
    startButton.textContent = 'Play again';
    message.classList.remove('hidden');
}

function moveSnake() {
    direction = nextDirection;
    const head = snake[0];
    const newHead = { x: head.x + direction.x, y: head.y + direction.y };

    if (hitWall(newHead) || hitSelf(newHead)) {
        endGame();
        return;
    }

    snake.unshift(newHead);
    if (newHead.x === apple.x && newHead.y === apple.y) {
        score += 1;
        scoreElement.textContent = score;
        if (score > bestScore) {
            bestScore = score;
            bestElement.textContent = bestScore;
            localStorage.setItem('snake-best-score', bestScore);
        }
        placeApple();
    } else {
        snake.pop();
    }

    draw();
}

function hitWall(head) {
    return head.x < 0 || head.x >= tiles || head.y < 0 || head.y >= tiles;
}

function hitSelf(head) {
    return snake.some(part => part.x === head.x && part.y === head.y);
}

function placeApple() {
    do {
        apple = { x: Math.floor(Math.random() * tiles), y: Math.floor(Math.random() * tiles) };
    } while (snake && snake.some(part => part.x === apple.x && part.y === apple.y));
}

function draw() {
    ctx.fillStyle = '#dff0b0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // The subtle checkerboard makes the play area easier to read.
    for (let y = 0; y < tiles; y += 1) {
        for (let x = 0; x < tiles; x += 1) {
            if ((x + y) % 2 === 0) {
                ctx.fillStyle = 'rgba(255, 255, 255, .12)';
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }

    drawApple();
    snake.forEach((part, index) => drawSnakePart(part, index === 0));
}

function drawSnakePart(part, isHead) {
    const gap = 2.5;
    const x = part.x * tileSize + gap;
    const y = part.y * tileSize + gap;
    const size = tileSize - gap * 2;
    ctx.fillStyle = isHead ? '#26734d' : '#38a169';
    roundRect(x, y, size, size, 5);
    ctx.fill();

    if (isHead) {
        ctx.fillStyle = '#f4f7ee';
        const eyeX = direction.x === -1 ? x + 5 : direction.x === 1 ? x + size - 8 : x + 7;
        const eyeY = direction.y === -1 ? y + 5 : direction.y === 1 ? y + size - 8 : y + 7;
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawApple() {
    const centerX = apple.x * tileSize + tileSize / 2;
    const centerY = apple.y * tileSize + tileSize / 2 + 1;
    ctx.fillStyle = '#ee6654';
    ctx.beginPath();
    ctx.arc(centerX - 3, centerY, 6, 0, Math.PI * 2);
    ctx.arc(centerX + 3, centerY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#26734d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 5);
    ctx.lineTo(centerX + 2, centerY - 9);
    ctx.stroke();
}

function roundRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
}

function changeDirection(newDirection) {
    if (!playing) return;
    const isOpposite = newDirection.x === -direction.x && newDirection.y === -direction.y;
    if (!isOpposite) nextDirection = newDirection;
}

const directions = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
};

document.addEventListener('keydown', event => {
    const keys = { ArrowUp: 'up', w: 'up', ArrowDown: 'down', s: 'down', ArrowLeft: 'left', a: 'left', ArrowRight: 'right', d: 'right' };
    const choice = keys[event.key];
    if (choice) {
        event.preventDefault();
        changeDirection(directions[choice]);
    }
});

document.querySelectorAll('.direction').forEach(button => {
    button.addEventListener('click', () => changeDirection(directions[button.dataset.direction]));
});

startButton.addEventListener('click', startGame);
resetGame();
