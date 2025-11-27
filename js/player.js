/* ============================================
   PLAYER.JS - Sistema de Jugador
   Movimiento, colisiones e interacciones
   ============================================ */

const Player = {
    x: 384,
    y: 300,
    width: GAME_CONSTANTS.PLAYER_SIZE,
    height: GAME_CONSTANTS.PLAYER_SIZE,
    speed: GAME_CONSTANTS.PLAYER_SPEED,
    element: null,

    // Teclas presionadas
    keys: {
        up: false,
        down: false,
        left: false,
        right: false,
        interact: false
    },

    // Inicializar jugador
    init() {
        this.element = document.getElementById('player');
        this.setupControls();
        this.updatePosition();
    },

    // Configurar controles
    setupControls() {
        // Keydown
        document.addEventListener('keydown', (e) => {
            if (DialogManager.hasOpenModal()) return;

            switch (e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    this.keys.up = true;
                    break;
                case 's':
                case 'arrowdown':
                    this.keys.down = true;
                    break;
                case 'a':
                case 'arrowleft':
                    this.keys.left = true;
                    break;
                case 'd':
                case 'arrowright':
                    this.keys.right = true;
                    break;
                case 'e':
                case ' ':
                    e.preventDefault();
                    this.tryInteract();
                    break;
            }
        });

        // Keyup
        document.addEventListener('keyup', (e) => {
            switch (e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    this.keys.up = false;
                    break;
                case 's':
                case 'arrowdown':
                    this.keys.down = false;
                    break;
                case 'a':
                case 'arrowleft':
                    this.keys.left = false;
                    break;
                case 'd':
                case 'arrowright':
                    this.keys.right = false;
                    break;
            }
        });
    },

    // Actualizar movimiento (llamado cada frame)
    update() {
        if (!Game.isPlaying || DialogManager.hasOpenModal()) return;

        let dx = 0;
        let dy = 0;

        if (this.keys.up) dy -= this.speed;
        if (this.keys.down) dy += this.speed;
        if (this.keys.left) dx -= this.speed;
        if (this.keys.right) dx += this.speed;

        // Normalizar diagonal
        if (dx !== 0 && dy !== 0) {
            dx *= 0.707; // 1/√2
            dy *= 0.707;
        }

        // Intentar mover
        if (dx !== 0 || dy !== 0) {
            this.tryMove(dx, dy);
        }
    },

    // Intentar mover con colisiones
    tryMove(dx, dy) {
        const newX = this.x + dx;
        const newY = this.y + dy;

        // Verificar colisiones con paredes
        const currentRoom = ROOMS[Game.currentRoom];
        if (!currentRoom) return;

        // Crear hitbox del jugador en nueva posición
        const playerBox = {
            x: newX,
            y: newY,
            width: this.width,
            height: this.height
        };

        // Verificar colisión con paredes
        let canMoveX = true;
        let canMoveY = true;

        const margin = 2; // Margen para permitir deslizamiento

        currentRoom.walls.forEach(wall => {
            // Verificar movimiento X (reducir altura para evitar pegarse a paredes superior/inferior)
            const testBoxX = {
                x: newX,
                y: this.y + margin,
                width: this.width,
                height: this.height - (margin * 2)
            };
            if (this.boxCollision(testBoxX, wall)) {
                canMoveX = false;
            }

            // Verificar movimiento Y (reducir ancho para evitar pegarse a paredes laterales)
            const testBoxY = {
                x: this.x + margin,
                y: newY,
                width: this.width - (margin * 2),
                height: this.height
            };
            if (this.boxCollision(testBoxY, wall)) {
                canMoveY = false;
            }
        });

        // Verificar límites del área de juego
        if (newX < 0 || newX + this.width > 800) canMoveX = false;
        if (newY < 0 || newY + this.height > 500) canMoveY = false;

        // Aplicar movimiento permitido
        if (canMoveX) this.x = newX;
        if (canMoveY) this.y = newY;

        this.updatePosition();

        // Verificar puertas
        this.checkDoors();
    },

    // Verificar colisión entre dos cajas
    boxCollision(box1, box2) {
        return box1.x < box2.x + box2.width &&
            box1.x + box1.width > box2.x &&
            box1.y < box2.y + box2.height &&
            box1.y + box1.height > box2.y;
    },

    // Actualizar posición visual
    updatePosition() {
        if (this.element) {
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
        }
    },

    // Verificar si está en una puerta
    checkDoors() {
        const currentRoom = ROOMS[Game.currentRoom];
        if (!currentRoom) return;

        const playerCenter = {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };

        // Manejar puertas personalizadas (Pasillo)
        if (currentRoom.customDoors) {
            currentRoom.customDoors.forEach(door => {
                // Verificar si el jugador está en la zona de la puerta
                if (playerCenter.x >= door.x &&
                    playerCenter.x <= door.x + door.width &&
                    playerCenter.y >= door.y &&
                    playerCenter.y <= door.y + door.height) {

                    const targetRoom = door.id;
                    if (targetRoom && ROOMS[targetRoom]) {
                        this.enterRoom(targetRoom, this.getOppositeDirection(currentRoom.id, targetRoom));
                    }
                }
            });
            return;
        }

        // Manejar puertas estándar
        if (!currentRoom.doorPositions) return;

        for (const [direction, doorPos] of Object.entries(currentRoom.doorPositions)) {
            if (!doorPos) continue;

            // Verificar si el jugador está en la zona de la puerta
            if (playerCenter.x >= doorPos.x &&
                playerCenter.x <= doorPos.x + doorPos.width &&
                playerCenter.y >= doorPos.y &&
                playerCenter.y <= doorPos.y + doorPos.height) {

                const targetRoom = currentRoom.doors[direction];
                if (targetRoom) {
                    this.enterRoom(targetRoom, direction);
                }
            }
        }
    },

    // Obtener dirección opuesta para entradas desde pasillo
    getOppositeDirection(fromRoom, toRoom) {
        // Si venimos del pasillo, determinar desde qué dirección entrar
        if (fromRoom === 'pasillo') {
            // El pasillo siempre conecta por el norte para salas superiores
            // y por el sur para salas inferiores y vestíbulo
            const upperRooms = ['oficina', 'sala-juntas', 'biblioteca'];
            const lowerRooms = ['laboratorio', 'archivo', 'galeria', 'vestibulo'];

            if (upperRooms.includes(toRoom)) {
                return 'south'; // Entrar desde el sur
            } else if (lowerRooms.includes(toRoom)) {
                return 'north'; // Entrar desde el norte
            }
        }
        // Si vamos hacia el pasillo, entrar desde cualquier lado
        return 'north';
    },

    // Entrar a una habitación
    enterRoom(roomId, fromDirection) {
        if (!ROOMS[roomId]) return;

        AudioManager.playDoorOpen();

        // Determinar posición de entrada
        const targetRoom = ROOMS[roomId];
        let entryPoint = { ...targetRoom.spawnPoint };

        // Ajustar posición según dirección de entrada
        switch (fromDirection) {
            case 'north':
                entryPoint.y = 420; // Aparece en el sur
                break;
            case 'south':
                entryPoint.y = 80; // Aparece en el norte
                break;
            case 'east':
                entryPoint.x = 80; // Aparece en el oeste
                break;
            case 'west':
                entryPoint.x = 720; // Aparece en el este
                break;
        }

        this.x = entryPoint.x;
        this.y = entryPoint.y;
        this.updatePosition();

        // Cambiar habitación en el juego
        Game.changeRoom(roomId);
    },

    // Intentar interactuar
    tryInteract() {
        if (!Game.isPlaying || DialogManager.hasOpenModal()) return;

        const nearbyObject = this.findNearbyInteractable();

        if (nearbyObject) {
            if (nearbyObject.type === 'npc') {
                // Verificar si es el Conde y tiene todas las evidencias
                if (nearbyObject.data.isCondeForDelivery) {
                    if (DialogManager.showDeliveryDialog()) {
                        Game.victory();
                    }
                } else {
                    DialogManager.showNPCDialog(nearbyObject.data);
                }
            } else if (nearbyObject.type === 'evidence') {
                DialogManager.showObjectInteraction(nearbyObject.data, true);
            } else if (nearbyObject.type === 'distractor') {
                DialogManager.showObjectInteraction(nearbyObject.data, false);
            }
        }
    },

    // Encontrar objeto interactuable cercano
    findNearbyInteractable() {
        const playerCenter = {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };

        const interactionDistance = GAME_CONSTANTS.INTERACTION_DISTANCE;
        let closest = null;
        let closestDistance = interactionDistance;

        // Buscar NPCs
        for (const npc of Object.values(NPCS)) {
            if (npc.room !== Game.currentRoom) continue;

            const distance = this.getDistance(playerCenter, {
                x: npc.position.x + 16,
                y: npc.position.y + 16
            });

            if (distance < closestDistance) {
                closestDistance = distance;
                closest = { type: 'npc', data: npc };
            }
        }

        // Buscar evidencias
        for (const evidence of EVIDENCES) {
            if (evidence.room !== Game.currentRoom) continue;
            if (Game.collectedObjects.has(evidence.id)) continue;

            const distance = this.getDistance(playerCenter, {
                x: evidence.position.x + 14,
                y: evidence.position.y + 14
            });

            if (distance < closestDistance) {
                closestDistance = distance;
                closest = { type: 'evidence', data: evidence };
            }
        }

        // Buscar distractores
        for (const distractor of DISTRACTORS) {
            if (distractor.room !== Game.currentRoom) continue;
            if (Game.collectedObjects.has(distractor.id)) continue;

            const distance = this.getDistance(playerCenter, {
                x: distractor.position.x + 14,
                y: distractor.position.y + 14
            });

            if (distance < closestDistance) {
                closestDistance = distance;
                closest = { type: 'distractor', data: distractor };
            }
        }

        return closest;
    },

    // Calcular distancia entre dos puntos
    getDistance(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    // Mover jugador a posición específica
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.updatePosition();
    },

    // Resetear jugador
    reset() {
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            interact: false
        };
    }
};
