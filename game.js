const cells = Array.from(document.querySelectorAll('.cell'));
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
function getName(p) { return p === 'X' ? 'איקס' : 'עיגול'; }

function cellLabel(idx) {
  const row = Math.floor(idx / 3) + 1;
  const col = (idx % 3) + 1;
  const content = board[idx] ? getName(board[idx]) : 'ריק';
  return `שורה ${row}, עמודה ${col}, ${content}`;
}

function updateCellA11y(idx) {
  cells[idx].setAttribute('aria-label', cellLabel(idx));
}

function setStatus(text) {
  statusEl.textContent = text;
}

function checkWinner() {
  for (const [a,b,c] of WINS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a,b,c] };
    }
  }
  if (board.every(c => c)) return { winner: null, draw: true };
  return null;
}

function play(idx) {
  if (gameOver || board[idx]) return;

  board[idx] = currentPlayer;
  const cell = cells[idx];
  cell.textContent = getSymbol(currentPlayer);
  cell.classList.add('taken');
  updateCellA11y(idx);

  const result = checkWinner();
  if (result) {
    gameOver = true;
    cells.forEach(c => { c.disabled = true; });
    if (result.draw) {
      setStatus('תיקו! 🤝');
      scores.draw++;
      scoreDraw.textContent = scores.draw;
    } else {
      setStatus(`${getSymbol(result.winner)} ${getName(result.winner)} ניצח! 🎉`);
      result.line.forEach(i => cells[i].classList.add('win'));
      scores[result.winner]++;
      scoreX.textContent = scores.X;
      scoreO.textContent = scores.O;
    }
    restartBtn.focus();
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setStatus(`תור השחקן: ${getSymbol(currentPlayer)} ${getName(currentPlayer)}`);
  }
}

function handleClick(e) {
  play(parseInt(e.currentTarget.dataset.index, 10));
}

// Arrow-key navigation inside the grid (RTL: right arrow moves to the previous column).
function handleKeydown(e) {
  const idx = parseInt(e.currentTarget.dataset.index, 10);
  const row = Math.floor(idx / 3);
  const col = idx % 3;
  let next = null;

  switch (e.key) {
    case 'ArrowUp':    next = row > 0 ? idx - 3 : null; break;
    case 'ArrowDown':  next = row < 2 ? idx + 3 : null; break;
    case 'ArrowRight': next = col > 0 ? idx - 1 : null; break;
    case 'ArrowLeft':  next = col < 2 ? idx + 1 : null; break;
    case 'Home':       next = row * 3; break;
    case 'End':        next = row * 3 + 2; break;
    default: return;
  }

  e.preventDefault();
  if (next !== null) cells[next].focus();
}

function restart() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  cells.forEach((c, i) => {
    c.textContent = '';
    c.classList.remove('taken', 'win');
    c.disabled = false;
    updateCellA11y(i);
  });
  setStatus(`תור השחקן: ${getSymbol(currentPlayer)} ${getName(currentPlayer)}`);
  cells[0].focus();
}

cells.forEach(cell => {
  cell.addEventListener('click', handleClick);
  cell.addEventListener('keydown', handleKeydown);
});
restartBtn.addEventListener('click', restart);
setStatus(`תור השחקן: ${getSymbol(currentPlayer)} ${getName(currentPlayer)}`);
