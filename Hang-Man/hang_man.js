const words = [
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

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const maxMistakes = 6;

const wordElement = document.querySelector('#word');
const categoryElement = document.querySelector('#category');
const statusElement = document.querySelector('#status');
const keyboardElement = document.querySelector('#keyboard');
const mistakesElement = document.querySelector('#mistakes');
const winsElement = document.querySelector('#wins');
const hintButton = document.querySelector('#hint');
const newGameButton = document.querySelector('#newGame');
const bodyParts = document.querySelectorAll('.body-part');

let currentWord;
let guessedLetters = [];
let unusedWords = [];
let mistakes = 0;
let wins = 0;
let gameOver = false;

function startGame() {
  if (unusedWords.length === 0) {
    for (let i = 0; i < words.length; i += 1) {
      unusedWords.push(words[i]);
    }
  }

  const randomNumber = Math.floor(Math.random() * unusedWords.length);
  currentWord = unusedWords[randomNumber];
  unusedWords.splice(randomNumber, 1);
  guessedLetters = [];
  mistakes = 0;
  gameOver = false;

  categoryElement.textContent = currentWord.category;
  mistakesElement.textContent = mistakes;
  statusElement.textContent = 'Choose a letter to begin.';
  statusElement.className = 'status';
  hintButton.disabled = false;

  renderWord();
  renderKeyboard();
  updateDrawing();
}

function renderWord() {
  wordElement.innerHTML = '';

  for (let i = 0; i < currentWord.word.length; i += 1) {
    const letterElement = document.createElement('span');
    const letter = currentWord.word[i];

    letterElement.className = 'letter';
    if (guessedLetters.includes(letter)) {
      letterElement.textContent = letter;
    } else {
      letterElement.textContent = '\u00a0';
    }

    wordElement.appendChild(letterElement);
  }
}

function renderKeyboard() {
  keyboardElement.innerHTML = '';

  for (let i = 0; i < alphabet.length; i += 1) {
    const letter = alphabet[i];
    const button = document.createElement('button');

    button.className = 'key';
    button.type = 'button';
    button.textContent = letter;
    button.addEventListener('click', function () {
      guess(letter, button);
    });
    keyboardElement.appendChild(button);
  }
}

function guess(letter, button) {
  if (gameOver || guessedLetters.includes(letter)) {
    return;
  }

  guessedLetters.push(letter);
  button.disabled = true;

  if (currentWord.word.includes(letter)) {
    button.classList.add('correct');
    renderWord();

    let wordIsComplete = true;
    for (let i = 0; i < currentWord.word.length; i += 1) {
      if (!guessedLetters.includes(currentWord.word[i])) {
        wordIsComplete = false;
        break;
      }
    }

    if (wordIsComplete) {
      finishGame(true);
    }
  } else {
    button.classList.add('wrong');
    mistakes += 1;
    mistakesElement.textContent = mistakes;
    updateDrawing();

    if (mistakes >= maxMistakes) {
      finishGame(false);
    }
  }
}

function finishGame(won) {
  gameOver = true;
  hintButton.disabled = true;

  const keys = keyboardElement.querySelectorAll('.key');
  for (let i = 0; i < keys.length; i += 1) {
    keys[i].disabled = true;
  }

  if (won) {
    wins += 1;
    winsElement.textContent = wins;
    statusElement.textContent = 'You got it! Great job.';
    statusElement.className = 'status success';
  } else {
    for (let i = 0; i < currentWord.word.length; i += 1) {
      const letter = currentWord.word[i];
      if (!guessedLetters.includes(letter)) {
        guessedLetters.push(letter);
      }
    }

    renderWord();
    statusElement.textContent = 'Game over — the word was ' + currentWord.word + '.';
    statusElement.className = 'status failure';
  }
}

function updateDrawing() {
  for (let i = 0; i < bodyParts.length; i += 1) {
    if (i < mistakes) {
      bodyParts[i].style.opacity = '1';
    } else {
      bodyParts[i].style.opacity = '0';
    }
  }
}

hintButton.addEventListener('click', function () {
  if (gameOver) {
    return;
  }

  const hiddenLetters = [];
  for (let i = 0; i < currentWord.word.length; i += 1) {
    const letter = currentWord.word[i];
    if (!guessedLetters.includes(letter) && !hiddenLetters.includes(letter)) {
      hiddenLetters.push(letter);
    }
  }

  if (hiddenLetters.length === 0) {
    return;
  }

  const randomNumber = Math.floor(Math.random() * hiddenLetters.length);
  const hintLetter = hiddenLetters[randomNumber];
  const keys = keyboardElement.querySelectorAll('.key');
  let hintKey;

  for (let i = 0; i < keys.length; i += 1) {
    if (keys[i].textContent === hintLetter) {
      hintKey = keys[i];
      break;
    }
  }

  guess(hintLetter, hintKey);
  hintButton.disabled = true;
});

newGameButton.addEventListener('click', startGame);
startGame();
