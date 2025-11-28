/* ============================================
   GAME.JS - Motor Principal del Juego
   Loop del juego, estados y gestión general
   ============================================ */

const Game = {
    isPlaying: false,
    currentRoom: 'vestibulo',
    collectedObjects: new Set(),
    gameLoopId: null,
    mayordomoGreeted: false,
    interactedWith: new Set(), // Track NPCs/objects already interacted with

    // Información del jugador
    playerInfo: {
        name: 'Analista',
        gender: 'male'  // 'male' o 'female'
    },

    // Sistema de progresión de NPCs
    npcProgress: {
        visited: new Set(),         // NPCs visitados correctamente
        currentStep: 0,             // Índice actual en NPC_PROGRESSION.order
        canCollectInRooms: new Set() // Habitaciones donde puede recolectar objetos
    },

    // Inicializar juego
    init() {
        // Inicializar módulos
        AudioManager.init();
        DialogManager.init();
        RoomManager.init();
        Player.init();
        Inventory.init();
        Timer.init();
        NavigationHint.init();

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

        // Botón de resolución
        const resolutionBtn = document.getElementById('resolution-btn');
        if (resolutionBtn) {
            resolutionBtn.addEventListener('click', () => this.toggleResolution());
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

        // Selección de personaje
        this.setupCharacterSelection();
    },

    // Toggle de resolución para pantallas no 16:9
    toggleResolution() {
        document.body.classList.toggle('scaled');
        const btn = document.getElementById('resolution-btn');
        if (btn) {
            btn.textContent = document.body.classList.contains('scaled') ? '🔍' : '🖥️';
            btn.title = document.body.classList.contains('scaled') ? 'Resolución Normal' : 'Reducir Escala';
        }
    },

    // Configurar selección de personaje
    setupCharacterSelection() {
        const characterOptions = document.querySelectorAll('.character-option');
        const confirmBtn = document.getElementById('confirm-character-btn');
        const nameInput = document.getElementById('player-name');

        // Selección de género
        characterOptions.forEach(option => {
            option.addEventListener('click', () => {
                characterOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.playerInfo.gender = option.dataset.gender;
            });
        });

        // Botón confirmar
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.confirmCharacter());
        }

        // Enter en input de nombre
        if (nameInput) {
            nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.confirmCharacter();
            });
        }
    },

    // Confirmar selección de personaje
    confirmCharacter() {
        const nameInput = document.getElementById('player-name');
        const playerName = nameInput ? nameInput.value.trim() : '';

        // Guardar nombre (usar default si está vacío)
        this.playerInfo.name = playerName || 'Analista';

        // Actualizar sprite del jugador
        this.updatePlayerSprite();

        // Ir a pantalla de inicio
        this.showScreen('start-screen');
    },

    // Actualizar sprite del jugador según selección
    updatePlayerSprite() {
        const playerSprite = document.getElementById('player-sprite');
        if (playerSprite) {
            const spritePath = this.playerInfo.gender === 'female'
                ? 'images/player/personaje_mujer.png'
                : 'images/player/personaje_hombre.png';
            playerSprite.src = spritePath;
        }
    },

    // Verificar contraseña
    checkPassword() {
        const input = document.getElementById('password-input');
        const errorMsg = document.getElementById('login-error');

        if (input.value === 'Teleton25') {
            this.showScreen('character-select-screen');
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
        this.interactedWith = new Set(); // Reset first-time interactions
        this.currentRoom = 'vestibulo';
        this.isPlaying = true;

        // Resetear progresión de NPCs
        this.resetNPCProgress();

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

        // Iniciar música de la habitación actual
        AudioManager.playMusicForRoom(this.currentRoom);
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

        // Cambiar música según la habitación
        AudioManager.playMusicForRoom(roomId);

        // Actualizar hint de navegación
        if (window.NavigationHint) {
            NavigationHint.update();
        }
    },

    // Marcar objeto como recolectado
    markObjectCollected(objectId) {
        this.collectedObjects.add(objectId);
        RoomManager.markObjectCollected(objectId);
    },

    // ============================================
    // SISTEMA DE PROGRESIÓN DE NPCs
    // ============================================

    // Verificar si es el turno correcto para visitar este NPC
    canVisitNPC(npcId) {
        // El conde siempre se puede visitar (para entregar evidencias)
        if (npcId === 'conde') return true;

        // Verificar si ya fue visitado
        if (this.npcProgress.visited.has(npcId)) return true;

        // Verificar si es el siguiente en la secuencia
        const expectedNpc = NPC_PROGRESSION.order[this.npcProgress.currentStep];
        return npcId === expectedNpc;
    },

    // Marcar NPC como visitado y desbloquear su habitación
    markNPCVisited(npcId) {
        console.log(`Attempting to mark NPC visited: ${npcId}`);

        // Siempre añadir a visitados para persistencia
        if (!this.npcProgress.visited.has(npcId)) {
            this.npcProgress.visited.add(npcId);
            console.log(`NPC ${npcId} marked as visited.`);
        }

        // Desbloquear la habitación correspondiente para recolectar objetos
        const room = NPC_PROGRESSION.roomMap[npcId];
        if (room) {
            if (!this.npcProgress.canCollectInRooms.has(room)) {
                this.npcProgress.canCollectInRooms.add(room);
                console.log(`Room unlocked for collection: ${room}`);
            }
        }

        // Verificar si debemos avanzar el paso de la historia
        const expectedNpc = NPC_PROGRESSION.order[this.npcProgress.currentStep];

        // Si visitamos al NPC que esperábamos, avanzamos
        if (npcId === expectedNpc) {
            this.npcProgress.currentStep++;
            console.log(`Story step advanced. New step: ${this.npcProgress.currentStep}`);

            // Actualizar hint de navegación inmediatamente
            if (window.NavigationHint) {
                NavigationHint.update();
            }
        } else {
            console.log(`Visited ${npcId} but expected ${expectedNpc}. Step remains ${this.npcProgress.currentStep}`);
        }

        // Forzar actualización del hint por si acaso cambió algo relevante
        if (window.NavigationHint) {
            NavigationHint.update();
        }
    },

    // Obtener el NPC que desbloquea una habitación
    getUnlockerNPC(roomId) {
        for (const [npcId, room] of Object.entries(NPC_PROGRESSION.roomMap)) {
            if (room === roomId) return npcId;
        }
        return null;
    },

    // Verificar si puede recolectar objetos en una habitación
    canCollectInRoom(roomId) {
        return this.npcProgress.canCollectInRooms.has(roomId);
    },

    // Obtener el hint para cuando visitan NPC fuera de orden
    getWrongOrderHint(npcId) {
        return NPC_PROGRESSION.wrongOrderHints[npcId] ||
            "Aún no es momento de hablar conmigo. Buscad al sabio correcto...";
    },

    // Resetear progresión de NPCs
    resetNPCProgress() {
        this.npcProgress.visited = new Set();
        this.npcProgress.currentStep = 0;
        this.npcProgress.canCollectInRooms = new Set();
    },

    // Victoria
    victory() {
        this.isPlaying = false;
        this.stopGameLoop();
        Timer.pause();

        AudioManager.stopMusic();
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

        AudioManager.stopMusic();
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
