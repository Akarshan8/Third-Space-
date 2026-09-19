const moves = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️'
};

const choices = ['rock', 'paper', 'scissors'];
const roundSeconds = 5;
const breakSeconds = 2;

let playerScore = 0;
let computerScore = 0;
let timeLeft = 0;
let computerChoice = '';
let gameStarted = false;
let timer;
let nextRoundTimer;
let revealTimer;

const playerHand = document.getElementById('playerHand');
const computerHand = document.getElementById('computerHand');
const playerScoreText = document.getElementById('playerScore');
const computerScoreText = document.getElementById('computerScore');
const timerText = document.getElementById('timer');
const timerLabel = document.getElementById('timerLabel');
const timerBox = document.querySelector('.round-timer');
const result = document.getElementById('result');
const message = document.getElementById('message');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const choiceButtons = document.querySelectorAll('.choice');

choiceButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        playRound(button.dataset.choice);
    });
});

startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);

function startGame() {
    gameStarted = true;
    startButton.hidden = true;
    startRound();
}

function startRound() {
    clearInterval(timer);
    clearTimeout(nextRoundTimer);
    clearTimeout(revealTimer);

    playerHand.textContent = '?';
    computerHand.textContent = '?';
    computerChoice = choices[Math.floor(Math.random() * choices.length)];
    timeLeft = roundSeconds;

    timerBox.classList.remove('resting', 'urgent');
    timerLabel.textContent = 'Time to choose';
    timerText.textContent = timeLeft;
    setButtonsDisabled(false);

    timer = setInterval(function () {
        timeLeft -= 1;
        timerText.textContent = timeLeft;

        if (timeLeft <= 2) {
            timerBox.classList.add('urgent');
        }

        if (timeLeft === 0) {
            clearInterval(timer);
            timeUp();
        }
    }, 1000);
}

function playRound(playerChoice) {
    if (!gameStarted || computerChoice === '') {
        return;
    }

    clearInterval(timer);
    clearTimeout(revealTimer);
    setButtonsDisabled(true);

    const chosenComputerMove = computerChoice;
    computerChoice = '';
    playerHand.textContent = moves[playerChoice];
    computerHand.textContent = '...';
    result.textContent = 'Computer is choosing...';
    message.textContent = 'Wait for the computer move.';

    revealTimer = setTimeout(function () {
        computerHand.textContent = moves[chosenComputerMove];

        if (playerChoice === chosenComputerMove) {
            result.textContent = 'Draw!';
            message.textContent = 'You both chose ' + chosenComputerMove + '.';
        } else if (
            (playerChoice === 'rock' && chosenComputerMove === 'scissors') ||
            (playerChoice === 'paper' && chosenComputerMove === 'rock') ||
            (playerChoice === 'scissors' && chosenComputerMove === 'paper')
        ) {
            playerScore += 1;
            playerScoreText.textContent = playerScore;
            result.textContent = 'You win!';
            message.textContent = 'Your move beats the computer move.';
        } else {
            computerScore += 1;
            computerScoreText.textContent = computerScore;
            result.textContent = 'Computer wins!';
            message.textContent = 'The computer move beats yours.';
        }

        startBreak();
    }, 1000);
}

function timeUp() {
    if (computerChoice === '') {
        return;
    }

    computerHand.textContent = moves[computerChoice];
    playerHand.textContent = '-';
    computerScore += 1;
    computerScoreText.textContent = computerScore;
    result.textContent = 'Time is up!';
    message.textContent = 'The computer gets a point because you did not choose.';
    computerChoice = '';
    setButtonsDisabled(true);
    startBreak();
}

function startBreak() {
    clearInterval(timer);

    timerBox.classList.remove('urgent');
    timerBox.classList.add('resting');
    timerLabel.textContent = 'Next round in';
    timeLeft = breakSeconds;
    timerText.textContent = timeLeft;
    setButtonsDisabled(true);

    timer = setInterval(function () {
        timeLeft -= 1;
        timerText.textContent = timeLeft;

        if (timeLeft === 0) {
            clearInterval(timer);
            startRound();
        }
    }, 1000);
}

function setButtonsDisabled(disabled) {
    choiceButtons.forEach(function (button) {
        button.disabled = disabled;
    });
}

function resetGame() {
    clearInterval(timer);
    clearTimeout(nextRoundTimer);
    clearTimeout(revealTimer);

    playerScore = 0;
    computerScore = 0;
    computerChoice = '';
    gameStarted = false;

    playerScoreText.textContent = '0';
    computerScoreText.textContent = '0';
    playerHand.textContent = '?';
    computerHand.textContent = '?';
    result.textContent = 'Press Start Game to begin';
    message.textContent = 'You will have five seconds to choose.';
    timerLabel.textContent = 'Ready';
    timerText.textContent = '-';
    timerBox.classList.remove('urgent');
    timerBox.classList.add('resting');
    startButton.hidden = false;
    setButtonsDisabled(true);
}

resetGame();
