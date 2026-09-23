var boardElement = document.getElementById("board");
var turnText = document.getElementById("turnText");
var message = document.getElementById("message");
var resetButton = document.getElementById("resetButton");

var symbols = {
  wK: "♔", wQ: "♕", wR: "♖", wB: "♗", wN: "♘", wP: "♙",
  bK: "♚", bQ: "♛", bR: "♜", bB: "♝", bN: "♞", bP: "♟"
};

var board;
var turn;
var gameOver;
var selectedRow = null;
var selectedColumn = null;
var whiteKingMoved;
var blackKingMoved;
var whiteRookLeftMoved;
var whiteRookRightMoved;
var blackRookLeftMoved;
var blackRookRightMoved;

// Start a new game
function newGame() {
  board = [
    ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
    ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
    ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"]
  ];

  turn = "w";
  gameOver = false;
  selectedRow = null;
  selectedColumn = null;
  whiteKingMoved = false;
  blackKingMoved = false;
  whiteRookLeftMoved = false;
  whiteRookRightMoved = false;
  blackRookLeftMoved = false;
  blackRookRightMoved = false;
  message.textContent = "Click a piece to select it.";
  drawBoard();
}

function drawBoard() {
  var row;
  var column;
  var square;
  var piece;

  boardElement.innerHTML = "";

  if (gameOver) {
    turnText.textContent = "Game Over";
  } else if (turn === "w") {
    turnText.textContent = "White's Turn";
  } else {
    turnText.textContent = "Black's Turn";
  }

  for (row = 0; row < 8; row++) {
    for (column = 0; column < 8; column++) {
      square = document.createElement("button");
      piece = board[row][column];
      square.type = "button";

      if ((row + column) % 2 === 0) {
        square.className = "square light";
      } else {
        square.className = "square dark";
      }

      square.textContent = symbols[piece] || "";
      square.dataset.row = row;
      square.dataset.column = column;
      square.setAttribute("aria-label", piece || "empty square");

      if (row === selectedRow && column === selectedColumn) {
        square.classList.add("selected");
      }

      if (selectedRow !== null && isPossibleMove(selectedRow, selectedColumn, row, column)) {
        square.classList.add("possible-move");
      }

      square.addEventListener("click", squareClicked);
      boardElement.appendChild(square);
    }
  }
}

function squareClicked(event) {
  var row;
  var column;
  var clickedPiece;

  if (gameOver) {
    return;
  }

  row = Number(event.currentTarget.dataset.row);
  column = Number(event.currentTarget.dataset.column);
  clickedPiece = board[row][column];

  if (selectedRow === null) {
    if (!clickedPiece) {
      message.textContent = "Choose a piece first.";
      return;
    }

    if (clickedPiece[0] !== turn) {
      message.textContent = "It is not that player's turn.";
      return;
    }

    selectPiece(row, column);
    return;
  }

  if (row === selectedRow && column === selectedColumn) {
    selectedRow = null;
    selectedColumn = null;
    message.textContent = "Click a piece to select it.";
    drawBoard();
    return;
  }

  if (clickedPiece && clickedPiece[0] === turn) {
    selectPiece(row, column);
    return;
  }

  if (!isPossibleMove(selectedRow, selectedColumn, row, column)) {
    message.textContent = "That piece cannot move there.";
    return;
  }

  movePiece(row, column);
}

function selectPiece(row, column) {
  selectedRow = row;
  selectedColumn = column;
  message.textContent = "Choose a highlighted square for the move.";
  drawBoard();
}

// Get moves that do not put the king in check
function getMoves(row, column) {
  var basicMoves = getBasicMoves(row, column);
  var legalMoves = [];
  var piece = board[row][column];
  var move;
  var capturedPiece;
  var rook;
  var i;

  for (i = 0; i < basicMoves.length; i++) {
    move = basicMoves[i];

    if (board[move.row][move.column] && board[move.row][move.column][1] === "K") {
      continue;
    }

    capturedPiece = board[move.row][move.column];
    board[row][column] = "";
    board[move.row][move.column] = piece;

    if (move.castle) {
      rook = board[row][move.rookColumn];
      board[row][move.rookColumn] = "";
      board[row][move.rookTarget] = rook;
    }

    if (!isKingInCheck(piece[0])) {
      legalMoves.push(move);
    }

    board[row][column] = piece;
    board[move.row][move.column] = capturedPiece;

    if (move.castle) {
      board[row][move.rookColumn] = board[row][move.rookTarget];
      board[row][move.rookTarget] = "";
    }
  }

  return legalMoves;
}

function isPossibleMove(fromRow, fromColumn, toRow, toColumn) {
  var moves = getMoves(fromRow, fromColumn);
  var i;

  for (i = 0; i < moves.length; i++) {
    if (moves[i].row === toRow && moves[i].column === toColumn) {
      return true;
    }
  }

  return false;
}

function getBasicMoves(row, column) {
  var piece = board[row][column];

  if (!piece) {
    return [];
  }

  if (piece[1] === "P") {
    return getPawnMoves(row, column, piece);
  } else if (piece[1] === "N") {
    return getKnightMoves(row, column, piece);
  } else if (piece[1] === "B") {
    return getSlidingMoves(row, column, piece, "bishop");
  } else if (piece[1] === "R") {
    return getSlidingMoves(row, column, piece, "rook");
  } else if (piece[1] === "Q") {
    return getSlidingMoves(row, column, piece, "queen");
  } else {
    return getKingMoves(row, column, piece);
  }
}

function getPawnMoves(row, column, piece) {
  var moves = [];
  var direction;
  var startRow;
  var nextRow;
  var side;
  var target;

  if (piece[0] === "w") {
    direction = -1;
    startRow = 6;
  } else {
    direction = 1;
    startRow = 1;
  }

  nextRow = row + direction;

  if (isInsideBoard(nextRow, column) && board[nextRow][column] === "") {
    moves.push({ row: nextRow, column: column });
    if (row === startRow && board[row + direction * 2][column] === "") {
      moves.push({ row: row + direction * 2, column: column });
    }
  }

  for (side = -1; side <= 1; side = side + 2) {
    if (isInsideBoard(nextRow, column + side)) {
      target = board[nextRow][column + side];
      if (target && target[0] !== piece[0]) {
        moves.push({ row: nextRow, column: column + side });
      }
    }
  }

  return moves;
}

function getKnightMoves(row, column, piece) {
  var moves = [];
  var rowChanges = [-2, -2, -1, -1, 1, 1, 2, 2];
  var columnChanges = [-1, 1, -2, 2, -2, 2, -1, 1];
  var i;

  for (i = 0; i < 8; i++) {
    if (canMoveTo(row + rowChanges[i], column + columnChanges[i], piece)) {
      moves.push({ row: row + rowChanges[i], column: column + columnChanges[i] });
    }
  }

  return moves;
}

function getKingMoves(row, column, piece) {
  var moves = [];
  var rowChange;
  var columnChange;
  var newRow;
  var newColumn;

  for (rowChange = -1; rowChange <= 1; rowChange++) {
    for (columnChange = -1; columnChange <= 1; columnChange++) {
      if (rowChange !== 0 || columnChange !== 0) {
        newRow = row + rowChange;
        newColumn = column + columnChange;
        if (canMoveTo(newRow, newColumn, piece)) {
          moves.push({ row: newRow, column: newColumn });
        }
      }
    }
  }

  addCastleMoves(moves, row, column, piece);
  return moves;
}

function addCastleMoves(moves, row, column, piece) {
  var leftRookMoved;
  var rightRookMoved;

  if (isKingInCheck(piece[0])) {
    return;
  }

  if (piece[0] === "w") {
    if (whiteKingMoved || row !== 7 || column !== 4) {
      return;
    }
    leftRookMoved = whiteRookLeftMoved;
    rightRookMoved = whiteRookRightMoved;
  } else {
    if (blackKingMoved || row !== 0 || column !== 4) {
      return;
    }
    leftRookMoved = blackRookLeftMoved;
    rightRookMoved = blackRookRightMoved;
  }

  if (!rightRookMoved && board[row][7] === piece[0] + "R" && board[row][5] === "" && board[row][6] === "") {
    if (!isSquareAttacked(row, 5, oppositeColor(piece[0]))) {
      moves.push({ row: row, column: 6, castle: true, rookColumn: 7, rookTarget: 5 });
    }
  }

  if (!leftRookMoved && board[row][0] === piece[0] + "R" && board[row][1] === "" && board[row][2] === "" && board[row][3] === "") {
    if (!isSquareAttacked(row, 3, oppositeColor(piece[0]))) {
      moves.push({ row: row, column: 2, castle: true, rookColumn: 0, rookTarget: 3 });
    }
  }
}

function getSlidingMoves(row, column, piece, type) {
  var moves = [];
  var rowChanges;
  var columnChanges;
  var direction;
  var newRow;
  var newColumn;
  var target;

  if (type === "bishop") {
    rowChanges = [1, 1, -1, -1];
    columnChanges = [1, -1, 1, -1];
  } else if (type === "rook") {
    rowChanges = [1, -1, 0, 0];
    columnChanges = [0, 0, 1, -1];
  } else {
    rowChanges = [1, -1, 0, 0, 1, 1, -1, -1];
    columnChanges = [0, 0, 1, -1, 1, -1, 1, -1];
  }

  for (direction = 0; direction < rowChanges.length; direction++) {
    newRow = row + rowChanges[direction];
    newColumn = column + columnChanges[direction];

    while (isInsideBoard(newRow, newColumn)) {
      target = board[newRow][newColumn];
      if (!target) {
        moves.push({ row: newRow, column: newColumn });
      } else {
        if (target[0] !== piece[0] && target[1] !== "K") {
          moves.push({ row: newRow, column: newColumn });
        }
        break;
      }
      newRow = newRow + rowChanges[direction];
      newColumn = newColumn + columnChanges[direction];
    }
  }

  return moves;
}

function canMoveTo(row, column, piece) {
  if (!isInsideBoard(row, column)) {
    return false;
  }
  if (!board[row][column]) {
    return true;
  }
  return board[row][column][0] !== piece[0] && board[row][column][1] !== "K";
}

function isInsideBoard(row, column) {
  return row >= 0 && row < 8 && column >= 0 && column < 8;
}

function isSquareAttacked(row, column, byColor) {
  var r;
  var c;
  var piece;
  var moves;
  var i;

  for (r = 0; r < 8; r++) {
    for (c = 0; c < 8; c++) {
      piece = board[r][c];

      if (piece && piece[0] === byColor) {
        moves = getAttackMoves(r, c, piece);

        for (i = 0; i < moves.length; i++) {
          if (moves[i].row === row && moves[i].column === column) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

function getAttackMoves(row, column, piece) {
  var moves = [];
  var direction;
  var nextRow;
  var nextColumn;
  var target;
  var changes;
  var i;

  if (piece[1] === "P") {
    if (piece[0] === "w") {
      direction = -1;
    } else {
      direction = 1;
    }
    if (isInsideBoard(row + direction, column - 1)) {
      moves.push({ row: row + direction, column: column - 1 });
    }
    if (isInsideBoard(row + direction, column + 1)) {
      moves.push({ row: row + direction, column: column + 1 });
    }
    return moves;
  }

  if (piece[1] === "N") {
    var knightRows = [-2, -2, -1, -1, 1, 1, 2, 2];
    var knightColumns = [-1, 1, -2, 2, -2, 2, -1, 1];

    for (i = 0; i < 8; i++) {
      if (isInsideBoard(row + knightRows[i], column + knightColumns[i])) {
        moves.push({ row: row + knightRows[i], column: column + knightColumns[i] });
      }
    }
    return moves;
  }

  if (piece[1] === "K") {
    for (i = -1; i <= 1; i++) {
      for (direction = -1; direction <= 1; direction++) {
        if ((i !== 0 || direction !== 0) && isInsideBoard(row + i, column + direction)) {
          moves.push({ row: row + i, column: column + direction });
        }
      }
    }
    return moves;
  }

  if (piece[1] === "B" || piece[1] === "Q") {
    changes = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    moves = addAttackLines(row, column, piece, changes);
  }

  if (piece[1] === "R" || piece[1] === "Q") {
    changes = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    moves = moves.concat(addAttackLines(row, column, piece, changes));
  }

  return moves;
}

function addAttackLines(row, column, piece, changes) {
  var moves = [];
  var i;
  var nextRow;
  var nextColumn;
  var target;

  for (i = 0; i < changes.length; i++) {
    nextRow = row + changes[i][0];
    nextColumn = column + changes[i][1];
    while (isInsideBoard(nextRow, nextColumn)) {
      moves.push({ row: nextRow, column: nextColumn });
      target = board[nextRow][nextColumn];
      if (target) {
        break;
      }
      nextRow = nextRow + changes[i][0];
      nextColumn = nextColumn + changes[i][1];
    }
  }
  return moves;
}

function findKing(color) {
  var row;
  var column;

  for (row = 0; row < 8; row++) {
    for (column = 0; column < 8; column++) {
      if (board[row][column] === color + "K") {
        return { row: row, column: column };
      }
    }
  }
  return null;
}

function isKingInCheck(color) {
  var king = findKing(color);
  if (!king) {
    return true;
  }
  return isSquareAttacked(king.row, king.column, oppositeColor(color));
}

function oppositeColor(color) {
  if (color === "w") {
    return "b";
  }
  return "w";
}

function playerHasMoves(color) {
  var row;
  var column;
  var piece;

  for (row = 0; row < 8; row++) {
    for (column = 0; column < 8; column++) {
      piece = board[row][column];
      if (piece && piece[0] === color && getMoves(row, column).length > 0) {
        return true;
      }
    }
  }
  return false;
}

// Move the piece
function movePiece(row, column) {
  var fromRow = selectedRow;
  var fromColumn = selectedColumn;
  var movingPiece = board[fromRow][fromColumn];
  var moves = getMoves(fromRow, fromColumn);
  var move = null;
  var i;
  var capturedPiece = board[row][column];

  for (i = 0; i < moves.length; i++) {
    if (moves[i].row === row && moves[i].column === column) {
      move = moves[i];
      break;
    }
  }

  // Do not move if the square is not legal.
  if (!move) {
    message.textContent = "That is not a legal move.";
    return;
  }

  board[row][column] = movingPiece;
  board[fromRow][fromColumn] = "";

  if (move.castle) {
    board[fromRow][move.rookTarget] = board[fromRow][move.rookColumn];
    board[fromRow][move.rookColumn] = "";
  }

  updateMovedPieces(movingPiece, fromRow, fromColumn);

  if (movingPiece[1] === "P" && (row === 0 || row === 7)) {
    board[row][column] = movingPiece[0] + "Q";
  }

  selectedRow = null;
  selectedColumn = null;

  if (capturedPiece && capturedPiece[1] === "K") {
    gameOver = true;
    if (movingPiece[0] === "w") {
      message.textContent = "White wins!";
    } else {
      message.textContent = "Black wins!";
    }
    drawBoard();
    return;
  }

  if (turn === "w") {
    turn = "b";
  } else {
    turn = "w";
  }

  if (isKingInCheck(turn)) {
    if (!playerHasMoves(turn)) {
      gameOver = true;
      if (turn === "w") {
        message.textContent = "Checkmate! Black wins!";
      } else {
        message.textContent = "Checkmate! White wins!";
      }
    } else {
      if (turn === "w") {
        message.textContent = "White is in check.";
      } else {
        message.textContent = "Black is in check.";
      }
    }
  } else if (!playerHasMoves(turn)) {
    gameOver = true;
    message.textContent = "Stalemate! The game is a draw.";
  } else {
    message.textContent = "Click a piece to select it.";
  }

  drawBoard();
}

function updateMovedPieces(piece, row, column) {
  if (piece === "wK") {
    whiteKingMoved = true;
  } else if (piece === "bK") {
    blackKingMoved = true;
  } else if (piece === "wR" && row === 7 && column === 0) {
    whiteRookLeftMoved = true;
  } else if (piece === "wR" && row === 7 && column === 7) {
    whiteRookRightMoved = true;
  } else if (piece === "bR" && row === 0 && column === 0) {
    blackRookLeftMoved = true;
  } else if (piece === "bR" && row === 0 && column === 7) {
    blackRookRightMoved = true;
  }
}

resetButton.addEventListener("click", newGame);
newGame();