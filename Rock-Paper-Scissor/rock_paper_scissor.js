var moves = ['rock', 'paper', 'scissors'];

var handSigns = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️'
};

var myScore = 0;
var cpuScore = 0;
var playing = false;

var myHand = document.getElementById('playerHand');
var cpuHand = document.getElementById('computerHand');
var myScoreText = document.getElementById('playerScore');
var cpuScoreText = document.getElementById('computerScore');
var result = document.getElementById('result');
var message = document.getElementById('message');
var startButton = document.getElementById('startButton');
var resetButton = document.getElementById('resetButton');
var choiceButtons = document.querySelectorAll('.choice');

startButton.onclick = startGame;
resetButton.onclick = resetGame;

for (var i = 0; i < choiceButtons.length; i++) {
    choiceButtons[i].onclick = chooseMove;
}

function startGame() {
    playing = true;
    startButton.style.display = 'none';
    setChoiceButtons(true);
    result.textContent = 'Pick a move';
    message.textContent = "Let's see what the computer picks.";
}

function chooseMove() {
    var myMove = this.getAttribute('data-choice');
    playRound(myMove);
}

function playRound(myMove) {
    var cpuMove;

    if (!playing) {
        return;
    }

    cpuMove = chooseCpuMove();
    updateHands(myMove, cpuMove);

    if (myMove === cpuMove) {
        showDraw(cpuMove);
    } else if (didIWin(myMove, cpuMove)) {
        showMyWin();
    } else {
        showCpuWin();
    }
}

function chooseCpuMove() {
    var randomPlace = Math.floor(Math.random() * moves.length);
    return moves[randomPlace];
}

function updateHands(myMove, cpuMove) {
    myHand.textContent = handSigns[myMove];
    cpuHand.textContent = handSigns[cpuMove];
}

function didIWin(myMove, cpuMove) {
    return (myMove === 'rock' && cpuMove === 'scissors') ||
        (myMove === 'paper' && cpuMove === 'rock') ||
        (myMove === 'scissors' && cpuMove === 'paper');
}

function showDraw(cpuMove) {
    result.textContent = 'It is a tie!';
    message.textContent = 'You both picked ' + cpuMove + '.';
}

function showMyWin() {
    myScore++;
    myScoreText.textContent = myScore;
    result.textContent = 'Nice one, you win!';
    message.textContent = 'That was a good choice.';
}

function showCpuWin() {
    cpuScore++;
    cpuScoreText.textContent = cpuScore;
    result.textContent = 'The computer wins this round.';
    message.textContent = 'Try a different move next time.';
}

function setChoiceButtons(enabled) {
    for (var i = 0; i < choiceButtons.length; i++) {
        choiceButtons[i].disabled = !enabled;
    }
}

// Start the scores and hands over from the beginning.
function resetGame() {
    myScore = 0;
    cpuScore = 0;
    playing = false;

    myScoreText.textContent = '0';
    cpuScoreText.textContent = '0';
    myHand.textContent = '?';
    cpuHand.textContent = '?';
    result.textContent = 'Press Start Game to begin';
    message.textContent = 'Choose a move to play.';
    startButton.style.display = 'inline-block';
    setChoiceButtons(false);
}

resetGame(); 
