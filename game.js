// game.js

// import { generateBoard, placeMines } from './board.js';
// import { startTimer, updateTimer, stopTimer } from './timer.js';
// import { handleClick, revealEmptyCells, checkWinCondition } from './gameLogic.js';
// import { updateFlagCounter, showGameOverMessage, showWinMessage } from './userInterface.js';

// Selecciona los elementos del DOM que necesitaremos
const board = document.querySelector('.board');
const flagCounterElement = document.getElementById('flag-counter');
const mineCounterElement = document.getElementById('mine-counter');
const timerElement = document.getElementById('timer');
const scoreGame = document.getElementById('no-games');
const regGame = document.getElementById('reg');
const mensajeReg = document.querySelector('.reglas');
const restartButton = document.createElement('button');

// Tamaño del tablero y número de minas
const size = 10;
const widthSize = 10;
const mines = 20;

// Arreglo para almacenar las celdas del tablero
let cells = [];

// Variables para el temporizador
let timerInterval;
let time = 0;

// Variables para contar banderas, minas restantes y numero de juegos
let flagsPlaced, score = 0;
let minesRemaining = mines;

// Bandera para controlar el primer clic
let isFirstClick = true;

// Bandera para controlar si el juego ha terminado
let gameEnded = false;

// Bandera para controlar si el tablero es clickeable o no
let boardClickable = false;

// Bandera para controlar si el juego ha empezado
let gameStarted = false;

// bandera para el mensaje de reglas
let displayMensaje = false;

// Función para formatear números a dos dígitos (agregar ceros a la izquierda si es necesario)
function formatTwoDigits(number) {
    return number < 10 ? `0${number}` : `${number}`;
}

//Mostrar reglas al hacer clic en el boton
function viewReg() {
    // 
    mensajeReg.style.display = 'block'
    displayMensaje = true;
}

// Actualizar el temporizador
function updateTimer() {
    
    timerElement.style.color = 'black'
    const seconds = 59 - (time) % 60;
    const minutes = 1 - Math.floor(time / 60) % 60;
    const formatoTime = `${formatTwoDigits(minutes)}:${formatTwoDigits(seconds)}`
    timerElement.textContent = "Tiempo: " + formatoTime;
    if (minutes == 0 && seconds >= 1){
        timerElement.style.color = 'red'
    } else if (minutes == 0 && seconds < 1) {
        timerElement.textContent = "Se acabó el TIRMPO!!";
        timerElement.style.color = 'green'
        stopTimer()
        showGameOverMessage()
        revealMines()
        time = 0;
    }
    time++;
}

// Iniciar el temporizador
function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

// Detener el temporizador
function stopTimer() {
    clearInterval(timerInterval);
    // timerElement.style.color = 'black'
}

// Mostrar las minas al finalizar el juego
function revealMines() {
    cells.forEach(cell => {
        if (cell.dataset.mine) {
        cell.textContent = '💣';
        }
    });
}

// Mostrar mensaje de fin de juego por derrota
function showGameOverMessage() {
    const messageOverlay = document.createElement('div');
    messageOverlay.classList.add('message-overlay');
    messageOverlay.textContent = 'GAME OVER';
    document.body.appendChild(messageOverlay);
    boardClickable = false; // Deshabilitar el tablero
}

// Obtener la cantidad de minas alrededor de una celda
function getMineCount(cell) {
    const index = parseInt(cell.dataset.index);
    const row = Math.floor(index / size);
    const col = index % size;
    let count = 0;
  
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
        if (adjacentCell.dataset.mine) {
          count++;
        }
      }
    }
  
    return count;
}

// Revelar celdas vacías adyacentes
function revealEmptyCells(cell) {
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

// Verificar condición de victoria
function checkWinCondition() {
    const unrevealedCells = cells.filter(cell => !cell.dataset.clicked);
    const mineCells = cells.filter(cell => cell.dataset.mine);
    return unrevealedCells.length === mineCells.length;
}

// Mostrar mensaje de fin de juego por victoria
function showWinMessage() {
    const messageOverlay = document.createElement('div');
    messageOverlay.classList.add('message-overlay');
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const mensVict = `HAS GANADO<br>Score:<br>
    Tiempo de juego: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}\n
    numero de juegos: perdidos y ganados\n
    Nivel:`
    messageOverlay.textContent = mensVict;
    document.body.appendChild(messageOverlay);
    
    document.body.appendChild(newRestartButton);
    gameEnded = true;
    boardClickable = false; // Deshabilitar el tablero
}

// Manejar clic en una celda
function handleClick(event) {
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

// Manejar clic derecho para colocar banderas
function handleRightClick(event) {
    event.preventDefault();
    if (!boardClickable) return; // Si el juego ha terminado, salir de la función sin hacer nada

    const cell = event.target;
    if (!cell.dataset.clicked && !gameEnded) {
      cell.classList.toggle('flagged');
      if (cell.classList.contains('flagged')) {
        flagsPlaced++;
        minesRemaining--;
      } else {
        flagsPlaced--;
        minesRemaining++;
      }
      updateFlagCounter();
    }
}

// Generar el tablero y colocar las minas
function generateBoard() {
    if (gameStarted) return; // Si es true, el juego comenzo y no genera tablero
    
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

// Colocar las minas en el tablero
function placeMines() {
    if (gameStarted) return; // Si es true, el juego comenzo, no coloca minas
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

// Actualizar contador de banderas y minas restantes
function updateFlagCounter() {
    flagCounterElement.textContent = "Banderas: " + flagsPlaced;
    mineCounterElement.textContent = "Minas restantes: " + minesRemaining;
}

// Inicia o Reinicia el juego el juego
function startGame() {

    // limpia el tablero y cambiar boton a reiniciar juego
    cells.forEach(cell => {
        cell.classList.remove('clicked', 'flagged');
        cell.textContent = '';
        cell.removeAttribute('data-clicked');
        cell.removeAttribute('data-mine');
    });
    const messageOverlays = document.querySelectorAll('.message-overlay');
    messageOverlays.forEach(overlay => overlay.remove());
    restartButton.textContent = 'Reiniciar Juego'; // Cambia el texto del botón
    // Generar el tablero

    // Minas en el tablero
    
    minesRemaining = mines;
    
    // contador de banderas
    flagsPlaced = 0;
    updateFlagCounter();
    placeMines();
    
    gameEnded = false;

    // Reiniciar las banderas isFirstClick y gameEnded
    isFirstClick = true;
    gameEnded = false;
    boardClickable = true;

    // Cotador del tiempo
    time = 0;
    stopTimer();
    timerInterval = null;
    timerElement.textContent = 'Tiempo: 00:00';
    timerElement.style.color = 'black'

    // Numero de juegos
    score++;
    scoreGame.textContent = "Numero de Juegos: " + `${formatTwoDigits(score)}`
}

// Logica de manipulacion del juego

// Generar el tablero vacio
generateBoard();

// Configura el botón de Inicio o Reinicio del Juego
restartButton.textContent = 'Player';
restartButton.classList.add('button');
restartButton.addEventListener('click', () => {
    startGame();
});
document.body.appendChild(restartButton); // Agregar boton de Inicio en el DOM
mensajeReg.style.width = 30*widthSize + 'px'
regGame.addEventListener('click', () => {
    if (!displayMensaje) {
        regGame.textContent = 'Volver al Juego'
        boardClickable = false;
        stopTimer();
        viewReg();
        restartButton.style.visibility = "hidden"
    } else if (displayMensaje){
        regGame.textContent = 'Reglas del juego';
        mensajeReg.style.display = 'none';
        
        displayMensaje = false;
        boardClickable = true;
        // startTimer();
        restartButton.style.visibility = "visible"
        if (isFirstClick) return;
        startTimer();
    }
    
}); 














