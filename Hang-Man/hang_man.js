// I keep the word choices here so it is easy to add or remove a word later.
const possibleWords = [
  { word: 'JAVASCRIPT', category: 'Technology', hint: 'A language used to make web pages interactive.' },
  { word: 'COMPUTER', category: 'Technology', hint: 'An electronic machine that processes information.' },
  { word: 'KEYBOARD', category: 'Technology', hint: 'A device used to type letters and numbers.' },
  { word: 'TELESCOPE', category: 'Technology', hint: 'An instrument used to view distant objects in space.' },
  { word: 'RAINBOW', category: 'Nature', hint: 'A colorful arc that appears after rain.' },
  { word: 'SUNFLOWER', category: 'Nature', hint: 'A tall flower that usually faces the sun.' },
  { word: 'VOLCANO', category: 'Nature', hint: 'A mountain that can release lava.' },
  { word: 'THUNDERSTORM', category: 'Nature', hint: 'A storm with thunder, lightning, and heavy rain.' },
  { word: 'AVALANCHE', category: 'Nature', hint: 'A large amount of snow falling down a mountain.' },
  { word: 'GUITAR', category: 'Music', hint: 'A stringed instrument with six common strings.' },
  { word: 'PIANO', category: 'Music', hint: 'A musical instrument with black and white keys.' },
  { word: 'DRUMMER', category: 'Music', hint: 'A person who plays drums.' },
  { word: 'MELODY', category: 'Music', hint: 'A sequence of musical notes that sounds pleasant.' },
  { word: 'ELEPHANT', category: 'Animals', hint: 'The largest land animal.' },
  { word: 'DOLPHIN', category: 'Animals', hint: 'A highly intelligent animal that lives in the sea.' },
  { word: 'BUTTERFLY', category: 'Animals', hint: 'An insect with colorful wings.' },
  { word: 'CHAMELEON', category: 'Animals', hint: 'A lizard known for changing color.' },
  { word: 'PORCUPINE', category: 'Animals', hint: 'An animal covered with sharp quills.' },
  { word: 'PIZZA', category: 'Food', hint: 'A round dish topped with cheese and sauce.' },
  { word: 'SANDWICH', category: 'Food', hint: 'Food placed between two pieces of bread.' },
  { word: 'CHOCOLATE', category: 'Food', hint: 'A sweet food made from cocoa.' },
  { word: 'SPAGHETTI', category: 'Food', hint: 'Long, thin pasta usually served with sauce.' },
  { word: 'PINEAPPLE', category: 'Food', hint: 'A tropical fruit with rough skin.' },
  { word: 'BASKETBALL', category: 'Sports', hint: 'A sport played by throwing a ball through a hoop.' },
  { word: 'FOOTBALL', category: 'Sports', hint: 'A popular sport played with a ball and two goals.' },
  { word: 'SKATEBOARDING', category: 'Sports', hint: 'A sport performed on a board with wheels.' },
  { word: 'ARCHERY', category: 'Sports', hint: 'The sport of shooting arrows at a target.' },
  { word: 'TEACHER', category: 'People', hint: 'A person who helps students learn.' },
  { word: 'SCIENTIST', category: 'People', hint: 'A person who studies the natural world.' },
  { word: 'PHOTOGRAPHER', category: 'People', hint: 'A person who takes photographs.' },
  { word: 'LIBRARY', category: 'Places', hint: 'A place where people can borrow books.' },
  { word: 'MOUNTAIN', category: 'Places', hint: 'A very high natural area of land.' },
  { word: 'LIGHTHOUSE', category: 'Places', hint: 'A tower with a light that guides ships.' },
  { word: 'WATERFALL', category: 'Places', hint: 'Water flowing over a steep edge.' },
  { word: 'RESTAURANT', category: 'Places', hint: 'A place where people buy and eat meals.' },
  { word: 'ADVENTURE', category: 'Ideas', hint: 'An exciting or unusual experience.' },
  { word: 'MYSTERY', category: 'Ideas', hint: 'Something difficult to understand or explain.' },
  { word: 'COURAGE', category: 'Ideas', hint: 'The ability to do something difficult or frightening.' },
  { word: 'IMAGINATION', category: 'Ideas', hint: 'The ability to create ideas and pictures in your mind.' },
  { word: 'DISCOVERY', category: 'Ideas', hint: 'Something found for the first time.' }
];

// These are the letters shown on the on-screen keyboard.
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const allowedMistakes = 6;

// These variables connect the JavaScript to the HTML elements.
const wordElement = document.querySelector('#word');
const categoryElement = document.querySelector('#category');
const statusElement = document.querySelector('#status');
const keyboardElement = document.querySelector('#keyboard');
const mistakesElement = document.querySelector('#mistakes');
const winsElement = document.querySelector('#wins');
const hintButton = document.querySelector('#hint');
const newGameButton = document.querySelector('#newGame');
const bodyParts = document.querySelectorAll('.body-part');

// These values change while the player is playing.
let currentWord;
let triedLetters = [];
let mistakeCount = 0;
let winCount = 0;
let gameFinished = false;

// A new word is chosen when the page opens or New game is clicked.
function startGame() {
  // Pick a word for the new game.
  const randomNumber = Math.floor(Math.random() * possibleWords.length);
  currentWord = possibleWords[randomNumber];
  triedLetters = [];
  mistakeCount = 0;
  gameFinished = false;

  categoryElement.textContent = currentWord.category;
  mistakesElement.textContent = mistakeCount;
  statusElement.textContent = 'Choose a letter to begin.';
  statusElement.className = 'status';
  hintButton.disabled = false;

  showWord();
  makeKeyboard();
  drawHangman();
}

// After a letter is chosen, show it here if it belongs to the word.
function showWord() {
  wordElement.innerHTML = '';

  for (let i = 0; i < currentWord.word.length; i += 1) {
    const letterElement = document.createElement('span');
    const letter = currentWord.word[i];

    letterElement.className = 'letter';
    if (triedLetters.includes(letter)) {
      letterElement.textContent = letter;
    } else {
      letterElement.textContent = '\u00a0';
    }

    wordElement.appendChild(letterElement);
  }
}

// Make a button for every letter the player can choose.
function makeKeyboard() {
  keyboardElement.innerHTML = '';

  for (let i = 0; i < alphabet.length; i += 1) {
    const letter = alphabet[i];
    const button = document.createElement('button');

    button.className = 'key';
    button.type = 'button';
    button.textContent = letter;
    button.addEventListener('click', function () {
      checkLetter(letter, button);
    });
    keyboardElement.appendChild(button);
  }
}

// When the player clicks a letter, check whether it is in the word.
function checkLetter(letter, button) {
  if (gameFinished || triedLetters.includes(letter)) {
    return;
  }

  triedLetters.push(letter);
  button.disabled = true;

  // If the letter is in the word, show it to the player.
  if (currentWord.word.includes(letter)) {
    button.classList.add('correct');
    showWord();

    // If every letter is showing, the player wins.
    if (checkWin()) {
      winGame();
    }
  } else {
    // If the letter is not in the word, add one mistake.
    button.classList.add('wrong');
    mistakeCount += 1;
    mistakesElement.textContent = mistakeCount;
    drawHangman();

    if (mistakeCount >= allowedMistakes) {
      loseGame();
    }
  }
}

// Return true when the player has guessed every letter.
function checkWin() {
  for (let i = 0; i < currentWord.word.length; i += 1) {
    if (!triedLetters.includes(currentWord.word[i])) {
      return false;
    }
  }

  return true;
}

// This happens when the player guesses the word.
function winGame() {
  gameFinished = true;
  hintButton.disabled = true;
  winCount += 1;
  winsElement.textContent = winCount;
  statusElement.textContent = 'You got it! Great job.';
  statusElement.className = 'status success';

  const keys = keyboardElement.querySelectorAll('.key');
  for (let i = 0; i < keys.length; i += 1) {
    keys[i].disabled = true;
  }
}

// This happens when the player makes too many mistakes.
function loseGame() {
  gameFinished = true;
  hintButton.disabled = true;

  for (let i = 0; i < currentWord.word.length; i += 1) {
    const letter = currentWord.word[i];
    if (!triedLetters.includes(letter)) {
      triedLetters.push(letter);
    }
  }

  showWord();
  statusElement.textContent = 'Game over — the word was ' + currentWord.word + '.';
  statusElement.className = 'status failure';

  const keys = keyboardElement.querySelectorAll('.key');
  for (let i = 0; i < keys.length; i += 1) {
    keys[i].disabled = true;
  }
}

// Show one more part of the drawing after a wrong guess.
function drawHangman() {
  for (let i = 0; i < bodyParts.length; i += 1) {
    if (i < mistakeCount) {
      bodyParts[i].style.opacity = '1';
    } else {
      bodyParts[i].style.opacity = '0';
    }
  }
}

// When the player clicks Hint, show the first hidden letter.
hintButton.addEventListener('click', function () {
  if (gameFinished) {
    return;
  }

  for (let i = 0; i < currentWord.word.length; i += 1) {
    const letter = currentWord.word[i];

    if (!triedLetters.includes(letter)) {
      triedLetters.push(letter);
      showWord();

      if (checkWin()) {
        winGame();
      }
      break;
    }
  }

  hintButton.disabled = true;
});

newGameButton.addEventListener('click', startGame);
startGame();
