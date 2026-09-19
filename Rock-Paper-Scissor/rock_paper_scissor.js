const hands = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️'
};

const moves = Object.keys(hands);
let playerScore = 0;
let computerScore = 0;
let roundTimer;
let timerInterval;
let computerRevealTimer;
let currentComputerChoice;
let gameStarted = false;
let timeLeft = 5;
const roundTime = 5;
const breakTime = 2;

const playerHand = document.querySelector('#playerHand');
const computerHand = document.querySelector('#computerHand');
const result = document.querySelector('#result');
const message = document.querySelector('#message');
const playerScoreText = document.querySelector('#playerScore');
const computerScoreText = document.querySelector('#computerScore');
const timerText = document.querySelector('#timer');
const timerLabel = document.querySelector('#timerLabel');
const timerDisplay = document.querySelector('.round-timer');
const choiceButtons = document.querySelectorAll('.choice');
const startButton = document.querySelector('#startButton');

choiceButtons.forEach((button) => {
    button.addEventListener('click', () => playRound(button.dataset.choice));
});

startButton.addEventListener('click', startGame);
document.querySelector('#resetButton').addEventListener('click', resetGame);

function playRound(playerChoice) {
    if (!gameStarted || !currentComputerChoice) return;

    clearInterval(timerInterval);
    clearTimeout(roundTimer);
    clearTimeout(computerRevealTimer);
    setChoicesDisabled(true);

    const computerChoice = currentComputerChoice;
    playerHand.textContent = hands[playerChoice];
    computerHand.textContent = '…';
    result.textContent = 'The computer is choosing…';
    message.textContent = 'One second… let’s see what they played.';
    currentComputerChoice = null;

    computerRevealTimer = setTimeout(() => {
        computerHand.textContent = hands[computerChoice];
        const winner = getWinner(playerChoice, computerChoice);
        showResult(winner, playerChoice, computerChoice);
        beginNextRound();
    }, 1000);
}

function startGame() {
    gameStarted = true;
    startButton.hidden = true;
    startRound();
}

function startRound() {
    clearInterval(timerInterval);
    clearTimeout(computerRevealTimer);
    playerHand.textContent = '?';
    computerHand.textContent = '?';
    currentComputerChoice = moves[Math.floor(Math.random() * moves.length)];
    timeLeft = roundTime;
    timerDisplay.classList.remove('resting');
    timerLabel.textContent = 'Time to choose';
    updateTimer();
    setChoicesDisabled(false);

    timerInterval = setInterval(() => {
        timeLeft -= 1;
        updateTimer();

        if (timeLeft === 0) {
            clearInterval(timerInterval);
            finishTimedOutRound();
        }
    }, 1000);
}

function updateTimer() {
    timerText.textContent = timeLeft;
    timerDisplay.classList.toggle('urgent', !timerDisplay.classList.contains('resting') && timeLeft <= 2);
}

function beginNextRound() {
    clearInterval(timerInterval);
    clearTimeout(roundTimer);
    setChoicesDisabled(true);
    timerDisplay.classList.add('resting');
    timerLabel.textContent = 'Next round in';
    timeLeft = breakTime;
    updateTimer();

    timerInterval = setInterval(() => {
        timeLeft -= 1;
        updateTimer();

        if (timeLeft === 0) {
            clearInterval(timerInterval);
            startRound();
        }
    }, 1000);
}

function finishTimedOutRound() {
    if (!currentComputerChoice) return;

    setChoicesDisabled(true);
    computerHand.textContent = hands[currentComputerChoice];
    playerHand.textContent = '—';
    result.textContent = 'Time is up.';
    message.textContent = `The computer wins with ${currentComputerChoice}. Choose faster next time.`;
    computerScore += 1;
    computerScoreText.textContent = computerScore;
    currentComputerChoice = null;
    beginNextRound();
}

function getWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) return 'draw';

    const playerWins =
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper');

    return playerWins ? 'player' : 'computer';
}

function showResult(winner, playerChoice, computerChoice) {
    const playerName = capitalize(playerChoice);
    const computerName = capitalize(computerChoice);

    if (winner === 'draw') {
        result.textContent = 'A draw.';
        message.textContent = `You both picked ${computerName.toLowerCase()}. Great minds think alike.`;
    } else if (winner === 'player') {
        playerScore += 1;
        result.textContent = 'You got it!';
        message.textContent = `${playerName} beats ${computerName.toLowerCase()}. Nicely played.`;
    } else {
        computerScore += 1;
        result.textContent = 'The computer wins.';
        message.textContent = `${computerName} beats ${playerChoice}. Better luck next round.`;
    }

    playerScoreText.textContent = playerScore;
    computerScoreText.textContent = computerScore;
}

function setChoicesDisabled(disabled) {
    choiceButtons.forEach((button) => {
        button.disabled = disabled;
    });
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function resetGame() {
    clearTimeout(roundTimer);
    clearTimeout(computerRevealTimer);
    clearInterval(timerInterval);
    playerScore = 0;
    computerScore = 0;
    playerScoreText.textContent = '0';
    computerScoreText.textContent = '0';
    playerHand.textContent = '?';
    computerHand.textContent = '?';
    computerHand.classList.remove('thinking');
    result.textContent = 'Make your move';
    message.textContent = 'You have five seconds. Pick the one that feels right.';
    currentComputerChoice = null;
    gameStarted = false;
    startButton.hidden = false;
    timerDisplay.classList.remove('urgent');
    timerDisplay.classList.add('resting');
    timerLabel.textContent = 'Ready when you are';
    timerText.textContent = '—';
    setChoicesDisabled(true);
}

resetGame();
