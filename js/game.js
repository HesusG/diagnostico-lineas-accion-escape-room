/* ============================================
   GAME.JS - Motor Principal del Juego
   Loop del juego, estados y gestión general
   ============================================ */

const Game = {
    isPlaying: false,
    currentRoom: 'vestibulo',
    collectedObjects: new Set(),
    gameLoopId: null,

    // Inicializar juego
    init() {
        // Inicializar módulos
        AudioManager.init();
        DialogManager.init();
        RoomManager.init();
        Player.init();
        Inventory.init();
        Timer.init();

        // Configurar botones
        this.setupButtons();

        // Mostrar pantalla de login
        this.showScreen('login-screen');

        // Cargar mejor tiempo
        this.loadBestTime();

        // Mostrar intro
        this.showIntro();
    },

    // Configurar botones
    setupButtons() {
        // Botón de inicio
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startGame());
        }

        // Botones de reinicio
        document.querySelectorAll('[id^="play-again"]').forEach(btn => {
            btn.addEventListener('click', () => this.restartGame());
        });

        // Botón de mute
        const muteBtn = document.getElementById('mute-btn');
        if (muteBtn) {
            muteBtn.addEventListener('click', () => AudioManager.toggleMute());
        }

        // Botón de login
        const loginBtn = document.getElementById('login-btn');
        const passwordInput = document.getElementById('password-input');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.checkPassword());
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.checkPassword();
            });
        }
    },

    // Verificar contraseña
    checkPassword() {
        const input = document.getElementById('password-input');
        const errorMsg = document.getElementById('login-error');
        
        if (input.value === 'Teleton25') {
            this.showScreen('start-screen');
            // Reproducir sonido de éxito si es posible (aunque el audio requiere interacción previa)
        } else {
            errorMsg.classList.remove('hidden');
            input.value = '';
            input.focus();
            
            // Ocultar error después de unos segundos
            setTimeout(() => {
                errorMsg.classList.add('hidden');
            }, 2000);
        }
    },

    // Mostrar intro con lore
    showIntro() {
        const startContent = document.querySelector('.start-content');
        if (!startContent) return;

        // Actualizar contenido con el lore
        const narrative = startContent.querySelector('.narrative');
        if (narrative) {
            narrative.innerHTML = LORE.intro;
        }

        const controlsInfo = startContent.querySelector('.controls-info');
        if (controlsInfo) {
            controlsInfo.innerHTML = LORE.controls;
        }

        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.textContent = LORE.startButton;
        }
    },

    // Iniciar juego
    startGame() {
        // Inicializar audio con interacción del usuario
        AudioManager.init();

        // Resetear estado
        this.collectedObjects = new Set();
        this.currentRoom = 'vestibulo';
        this.isPlaying = true;

        // Resetear módulos
        Inventory.reset();
        Timer.init();
        Player.reset();

        // Posicionar jugador en spawn
        const startRoom = ROOMS[this.currentRoom];
        if (startRoom && startRoom.spawnPoint) {
            Player.setPosition(startRoom.spawnPoint.x, startRoom.spawnPoint.y);
        }

        // Renderizar habitación inicial
        RoomManager.renderRoom(this.currentRoom);

        // Mostrar pantalla de juego
        this.showScreen('game-screen');

        // Iniciar timer
        Timer.start();

        // Iniciar game loop
        this.startGameLoop();

        // Incrementar intentos
        this.incrementAttempts();
    },

    // Loop principal del juego
    startGameLoop() {
        const loop = () => {
            if (!this.isPlaying) return;

            Player.update();
            this.gameLoopId = requestAnimationFrame(loop);
        };

        this.gameLoopId = requestAnimationFrame(loop);
    },

    // Detener game loop
    stopGameLoop() {
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
            this.gameLoopId = null;
        }
    },

    // Cambiar habitación
    changeRoom(roomId) {
        if (!ROOMS[roomId]) return;

        this.currentRoom = roomId;
        RoomManager.renderRoom(roomId);
    },

    // Marcar objeto como recolectado
    markObjectCollected(objectId) {
        this.collectedObjects.add(objectId);
        RoomManager.markObjectCollected(objectId);
    },

    // Victoria
    victory() {
        this.isPlaying = false;
        this.stopGameLoop();
        Timer.pause();

        AudioManager.playVictory();

        // Guardar mejor tiempo
        this.saveBestTime();

        // Actualizar pantalla de victoria
        const finalTime = document.getElementById('final-time');
        const finalErrors = document.getElementById('final-errors');

        if (finalTime) {
            finalTime.textContent = Timer.getTimeUsedFormatted();
        }
        if (finalErrors) {
            finalErrors.textContent = Inventory.errors;
        }

        // Mostrar pantalla de victoria
        setTimeout(() => {
            this.showScreen('victory-screen');
        }, 500);
    },

    // Game Over
    gameOver(reason) {
        this.isPlaying = false;
        this.stopGameLoop();
        Timer.pause();

        AudioManager.playDefeat();

        // Mostrar pantalla correspondiente
        setTimeout(() => {
            if (reason === 'time') {
                this.showScreen('defeat-time-screen');
            } else if (reason === 'errors') {
                this.showScreen('defeat-errors-screen');
            }
        }, 500);
    },

    // Reiniciar juego
    restartGame() {
        this.startGame();
    },

    // Mostrar pantalla
    showScreen(screenId) {
        // Ocultar todas las pantallas
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });

        // Mostrar la pantalla solicitada
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.remove('hidden');
        }
    },

    // Cargar mejor tiempo
    loadBestTime() {
        const bestTime = localStorage.getItem('escapeRoom_bestTime');
        const attempts = localStorage.getItem('escapeRoom_attempts') || 0;
        const completed = localStorage.getItem('escapeRoom_completed') === 'true';

        const display = document.getElementById('best-time-display');
        if (display) {
            if (completed && bestTime) {
                display.innerHTML = `🏆 Mejor tiempo: ${bestTime} | Intentos: ${attempts}`;
            } else if (attempts > 0) {
                display.innerHTML = `Intentos: ${attempts} | Aún no has completado la misión`;
            } else {
                display.innerHTML = '';
            }
        }
    },

    // Guardar mejor tiempo
    saveBestTime() {
        const currentTime = Timer.getTimeUsedFormatted();
        const bestTime = localStorage.getItem('escapeRoom_bestTime');

        // Convertir tiempos a segundos para comparar
        const currentSeconds = Timer.getTimeUsed();
        let bestSeconds = Infinity;

        if (bestTime) {
            const parts = bestTime.split(':');
            bestSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }

        if (currentSeconds < bestSeconds) {
            localStorage.setItem('escapeRoom_bestTime', currentTime);
        }

        localStorage.setItem('escapeRoom_completed', 'true');
    },

    // Incrementar intentos
    incrementAttempts() {
        const attempts = parseInt(localStorage.getItem('escapeRoom_attempts') || 0) + 1;
        localStorage.setItem('escapeRoom_attempts', attempts);
    }
};

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
