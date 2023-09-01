// gameLogic.js (Contiene funciones relacionadas con la lógica del juego):

// ... (código de manejo de clics)
// Manejar clic en una celda
export function handleClick(event) {
    if (!boardClickable) return; // Si el tablero no es clickeable, salir
    const cell = event.target;
    if (isFirstClick) { // Si es el primer clic, inicia el temporizador
    isFirstClick = false;
    startTimer();
    }
    if (cell.classList.contains('flagged') || cell.dataset.clicked) return;

    if (!timerInterval) {
    startTimer();
    }

    cell.classList.add('clicked');
    cell.dataset.clicked = true;

    if (cell.dataset.mine) {
    cell.textContent = '💣';
    stopTimer();
    revealMines();
    showGameOverMessage();
    } else {
    const mineCount = getMineCount(cell);
    cell.textContent = mineCount > 0 ? mineCount : '';
    if (mineCount === 0) {
        revealEmptyCells(cell);
    }
    if (checkWinCondition()) {
        stopTimer();
        showWinMessage();
    }
    }
}

// ... (código de revelación de celdas vacías)
// Revelar celdas vacías adyacentes
export function revealEmptyCells(cell) {
    const index = parseInt(cell.dataset.index);
    const row = Math.floor(index / size);
    const col = index % size;

    const offsets = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1]
    ];

    for (const [rowOffset, colOffset] of offsets) {
    const newRow = row + rowOffset;
    const newCol = col + colOffset;
    if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
        const newIndex = newRow * size + newCol;
        const adjacentCell = cells[newIndex];
        if (!adjacentCell.dataset.clicked) {
        handleClick({ target: adjacentCell });
        }
    }
    }
}

// ... (código de verificación de condición de victoria)
// Verificar condición de victoria
export function checkWinCondition() {
    const unrevealedCells = cells.filter(cell => !cell.dataset.clicked);
    const mineCells = cells.filter(cell => cell.dataset.mine);
    return unrevealedCells.length === mineCells.length;
}
  