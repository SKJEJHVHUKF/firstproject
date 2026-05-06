const cells = document.querySelectorAll('.cell');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const scoreDraw = document.getElementById('score-draw');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
let scores = { X: 0, O: 0, draw: 0 };

const WINS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function getSymbol(p) { return p === 'X' ? '❌' : '⭕'; }

function checkWinner() {
  for (const [a,b,c] of WINS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a,b,c] };
    }
  }
  if (board.every(c => c)) return { winner: null, draw: true };
  return null;
}

function handleClick(e) {
  const idx = parseInt(e.target.dataset.index);
  if (gameOver || board[idx]) return;

  board[idx] = currentPlayer;
  e.target.textContent = getSymbol(currentPlayer);
  e.target.classList.add('taken');

  const result = checkWinner();
  if (result) {
    gameOver = true;
    if (result.draw) {
      statusEl.textContent = 'תיקו! 🤝';
      scores.draw++;
      scoreDraw.textContent = scores.draw;
    } else {
      statusEl.textContent = `${getSymbol(result.winner)} ניצח! 🎉`;
      result.line.forEach(i => cells[i].classList.add('win'));
      scores[result.winner]++;
      scoreX.textContent = scores.X;
      scoreO.textContent = scores.O;
    }
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusEl.textContent = `תור השחקן: ${getSymbol(currentPlayer)}`;
  }
}

function restart() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  cells.forEach(c => {
    c.textContent = '';
    c.classList.remove('taken', 'win');
  });
  statusEl.textContent = `תור השחקן: ${getSymbol(currentPlayer)}`;
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restart);
