// board.js (Contiene funciones relacionadas con el tablero y las minas):

// ... (código de generación de tablero)
// Generar el tablero y colocar las minas
export function generateBoard() {
  if (gamePaused) return; // Si el juego está en pausa, no genera el tablero
  for (let i = 0; i < size * size; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.dataset.index = i;
  cell.addEventListener('click', handleClick);
  cell.addEventListener('contextmenu', handleRightClick);
  board.appendChild(cell);
  cells.push(cell);
  }
}

// ... (código de colocación de minas)
// Colocar las minas en el tablero
export function placeMines() {
  if (gamePaused) return; // Si el juego está en pausa, no coloca minas
  cells.forEach(cell => {
  cell.removeAttribute('data-mine');
  });

  const shuffledCells = cells.slice();
  for (let i = 0; i < mines; i++) {
  const randomIndex = Math.floor(Math.random() * shuffledCells.length);
  const cell = shuffledCells.splice(randomIndex, 1)[0];
  cell.dataset.mine = true;
  }
}
  