// userInterface.js (Maneja la interfaz de usuario):


// ... (código de actualización de contadores)
// Actualizar contador de banderas y minas restantes
export function updateFlagCounter() {
    flagCounterElement.textContent = flagsPlaced;
    mineCounterElement.textContent = minesRemaining;
}
  
// ... (código de mensaje de fin de juego por derrota)
// Mostrar mensaje de fin de juego por derrota
export function showGameOverMessage() {
    const messageOverlay = document.createElement('div');
    messageOverlay.classList.add('message-overlay');
    messageOverlay.textContent = 'GAME OVER';
    document.body.appendChild(messageOverlay);
    boardClickable = false; // Deshabilitar el tablero
}

// ... (código de mensaje de fin de juego por victoria)
// Mostrar mensaje de fin de juego por victoria
export function showWinMessage() {
    const messageOverlay = document.createElement('div');
    messageOverlay.classList.add('message-overlay');
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    messageOverlay.textContent = `HAS GANADO\nTiempo: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    document.body.appendChild(messageOverlay);
    document.body.appendChild(newRestartButton);
    gameEnded = true;
    boardClickable = false; // Deshabilitar el tablero
}
  