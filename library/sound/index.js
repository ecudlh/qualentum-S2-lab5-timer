import './SoundComponent.js';

// Escucha el evento global emitido por el timer
window.addEventListener('timer-finish', () => {
    const sound = document.querySelector('#finish-sound');
    sound?.play();
});