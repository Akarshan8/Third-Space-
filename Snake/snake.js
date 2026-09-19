const canvas = document.getElementById('game-board');
const context = canvas.getContext('2d');
const boardSize = 20;
const cellSize = canvas.width / boardSize;
const scoreText = document.getElementById('score');
const bestScoreText = document.getElementById('best-score');
const gameMessage = document.getElementById('game-message');
const messageTitle = document.getElementById('message-title');
const messageText = document.getElementById('message-text');
const startButton = document.getElementById('start-button');

let snake;
let apple;
let direction;
let nextDirection;
let score = 0;
let timer;
let isPlaying = false;
let bestScore = Number(localStorage.getItem('snake-best-score')) || 0;

bestScoreText.textContent = bestScore;

function resetGame() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];

  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  scoreText.textContent = score;

  placeApple();
  drawBoard();
}

function startGame() {
  clearInterval(timer);
  resetGame();
  isPlaying = true;
  gameMessage.classList.add('hidden');
  timer = setInterval(moveSnake, 115);
}

function endGame() {
  isPlaying = false;
  clearInterval(timer);
  messageTitle.textContent = 'Game over!';
  messageText.textContent = `You scored ${score}. Have another go?`;
  startButton.textContent = 'Play again';
  gameMessage.classList.remove('hidden');
}

function moveSnake() {
  direction = nextDirection;

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
    endGame();
    return;
  }

  if (snake.some(part => part.x === head.x && part.y === head.y)) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    score += 1;
    scoreText.textContent = score;

    if (score > bestScore) {
      bestScore = score;
      bestScoreText.textContent = bestScore;
      localStorage.setItem('snake-best-score', bestScore);
    }

    placeApple();
  } else {
    snake.pop();
  }

  drawBoard();
}

function placeApple() {
  do {
    apple = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize)
    };
  } while (snake.some(part => part.x === apple.x && part.y === apple.y));
}

function drawBoard() {
  context.fillStyle = '#dff0b0';
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < boardSize; y += 1) {
    for (let x = 0; x < boardSize; x += 1) {
      if ((x + y) % 2 === 0) {
        context.fillStyle = 'rgba(255, 255, 255, .12)';
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  drawApple();
  drawSnake();
}

function drawSnake() {
  snake.forEach((part, index) => {
    const x = part.x * cellSize + 2.5;
    const y = part.y * cellSize + 2.5;
    const size = cellSize - 5;

    context.fillStyle = index === 0 ? '#26734d' : '#38a169';
    context.beginPath();
    context.roundRect(x, y, size, size, 5);
    context.fill();

    if (index === 0) {
      context.fillStyle = '#f4f7ee';
      const eyeX = direction.x === -1 ? x + 5 : direction.x === 1 ? x + size - 8 : x + 7;
      const eyeY = direction.y === -1 ? y + 5 : direction.y === 1 ? y + size - 8 : y + 7;

      context.beginPath();
      context.arc(eyeX, eyeY, 2, 0, Math.PI * 2);
      context.fill();
    }
  });
}

function drawApple() {
  const x = apple.x * cellSize + cellSize / 2;
  const y = apple.y * cellSize + cellSize / 2 + 1;

  context.fillStyle = '#ee6654';
  context.beginPath();
  context.arc(x - 3, y, 6, 0, Math.PI * 2);
  context.arc(x + 3, y, 6, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = '#26734d';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(x, y - 5);
  context.lineTo(x + 2, y - 9);
  context.stroke();
}

function changeDirection(name) {
  let newDirection;

  if (name === 'up') newDirection = { x: 0, y: -1 };
  if (name === 'down') newDirection = { x: 0, y: 1 };
  if (name === 'left') newDirection = { x: -1, y: 0 };
  if (name === 'right') newDirection = { x: 1, y: 0 };

  if (!isPlaying || !newDirection) return;

  if (newDirection.x === -direction.x && newDirection.y === -direction.y) {
    return;
  }

  nextDirection = newDirection;
}

document.addEventListener('keydown', event => {
  let name;

  if (event.key === 'ArrowUp' || event.key === 'w') name = 'up';
  if (event.key === 'ArrowDown' || event.key === 's') name = 'down';
  if (event.key === 'ArrowLeft' || event.key === 'a') name = 'left';
  if (event.key === 'ArrowRight' || event.key === 'd') name = 'right';

  if (name) {
    event.preventDefault();
    changeDirection(name);
  }
});

document.querySelectorAll('.direction').forEach(button => {
  button.addEventListener('click', () => {
    changeDirection(button.dataset.direction);
  });
});

startButton.addEventListener('click', startGame);
resetGame();
