// timer.js (Maneja el temporizador del juego):

// ... (código de inicio de temporizador)
// Iniciar el temporizador
export function startTimer() {
  timerInterval = setInterval(updateTimer, 1000);
}

// ... (código de actualización de temporizador)
// Actualizar el temporizador
export function updateTimer() {
  time++;
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// ... (código de detención de temporizador)
// Detener el temporizador
export function stopTimer() {
  clearInterval(timerInterval);
}