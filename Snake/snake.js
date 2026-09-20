var canvas = document.getElementById('game-board');
var context = canvas.getContext('2d');
var scoreElement = document.getElementById('score');
var message = document.getElementById('game-message');
var title = document.getElementById('message-title');
var text = document.getElementById('message-text');
var start = document.getElementById('start-button');

var boardSize = 20;
var squareSize = canvas.width / boardSize;
var snake = [];
var apple = {};
var dx = 1;
var dy = 0;
var score = 0;
var gameTimer;
var gameRunning = false;

function reset() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];
  dx = 1;
  dy = 0;
  score = 0;
  scoreElement.textContent = score;
  putApple();
  draw();
}

function putApple() {
  var goodSpot = false;

  while (!goodSpot) {
    apple.x = Math.floor(Math.random() * boardSize);
    apple.y = Math.floor(Math.random() * boardSize);
    goodSpot = true;

    for (var i = 0; i < snake.length; i++) {
      if (apple.x === snake[i].x && apple.y === snake[i].y) {
        goodSpot = false;
        break;
      }
    }
  }
}

function draw() {
  context.fillStyle = '#dff0b0';
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (var y = 0; y < boardSize; y++) {
    for (var x = 0; x < boardSize; x++) {
      if ((x + y) % 2 === 0) {
        context.fillStyle = '#d4e8a0';
        context.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
      }
    }
  }

  context.fillStyle = '#ee6654';
  context.beginPath();
  context.arc(
    apple.x * squareSize + squareSize / 2,
    apple.y * squareSize + squareSize / 2,
    squareSize / 2 - 2,
    0,
    Math.PI * 2
  );
  context.fill();

  for (var i = 0; i < snake.length; i++) {
    if (i === 0) {
      context.fillStyle = '#26734d';
    } else {
      context.fillStyle = '#38a169';
    }

    context.fillRect(
      snake[i].x * squareSize + 1,
      snake[i].y * squareSize + 1,
      squareSize - 2,
      squareSize - 2
    );
  }
}

function update() {
  var newHead = {
    x: snake[0].x + dx,
    y: snake[0].y + dy
  };

  if (newHead.x < 0 || newHead.x >= boardSize ||
      newHead.y < 0 || newHead.y >= boardSize) {
    stopGame();
    return;
  }

  for (var i = 0; i < snake.length; i++) {
    if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
      stopGame();
      return;
    }
  }

  snake.unshift(newHead);

  if (newHead.x === apple.x && newHead.y === apple.y) {
    score++;
    scoreElement.textContent = score;
    putApple();
  } else {
    snake.pop();
  }

  draw();
}

function stopGame() {
  gameRunning = false;
  clearInterval(gameTimer);
  title.textContent = 'Game over';
  text.textContent = 'Your score was ' + score + '.';
  start.textContent = 'Play again';
  message.classList.remove('hidden');
}

function startGame() {
  clearInterval(gameTimer);
  reset();
  gameRunning = true;
  message.classList.add('hidden');
  gameTimer = setInterval(update, 120);
}

function changeDirection(newDirection) {
  if (!gameRunning) return;

  if (newDirection === 'up' && dy === 0) {
    dx = 0;
    dy = -1;
  } else if (newDirection === 'down' && dy === 0) {
    dx = 0;
    dy = 1;
  } else if (newDirection === 'left' && dx === 0) {
    dx = -1;
    dy = 0;
  } else if (newDirection === 'right' && dx === 0) {
    dx = 1;
    dy = 0;
  }
}

// Stop the arrow keys from moving the page.
document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowUp' || event.key === 'w') {
    event.preventDefault();
    changeDirection('up');
  } else if (event.key === 'ArrowDown' || event.key === 's') {
    event.preventDefault();
    changeDirection('down');
  } else if (event.key === 'ArrowLeft' || event.key === 'a') {
    event.preventDefault();
    changeDirection('left');
  } else if (event.key === 'ArrowRight' || event.key === 'd') {
    event.preventDefault();
    changeDirection('right');
  }
});

document.getElementById('upBtn').onclick = function () {
  changeDirection('up');
};

document.getElementById('downBtn').onclick = function () {
  changeDirection('down');
};

document.getElementById('leftBtn').onclick = function () {
  changeDirection('left');
};

document.getElementById('rightBtn').onclick = function () {
  changeDirection('right');
};
start.onclick = startGame;

reset();
