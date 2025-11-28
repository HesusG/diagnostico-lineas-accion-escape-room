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
            // Ignorar si está escribiendo en un input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

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

        // Verificar proximidad para interacciones automáticas
        this.checkProximityInteractions();
    },

    // Verificar proximidad con NPCs y objetos para mostrar hints
    checkProximityInteractions() {
        const playerCenter = {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };

        // Verificar NPCs
        for (const npc of Object.values(NPCS)) {
            if (npc.room !== Game.currentRoom) continue;

            const npcElement = document.getElementById(`npc-${npc.id}`);
            if (!npcElement) continue;

            const dist = this.getDistance(playerCenter, {
                x: npc.position.x,
                y: npc.position.y
            });

            const hint = npcElement.querySelector('.interaction-hint');
            if (dist <= GAME_CONSTANTS.INTERACTION_DISTANCE) {
                if (hint) {
                    hint.style.opacity = '1';
                    hint.classList.add('visible');
                }

                // Auto-interactuar la primera vez
                const interactionKey = `npc-${npc.id}`;
                if (!Game.interactedWith.has(interactionKey)) {
                    Game.interactedWith.add(interactionKey);
                    // Pequeño delay para que no sea instantáneo
                    setTimeout(() => {
                        if (npc.isCondeForDelivery) {
                            if (DialogManager.showDeliveryDialog()) {
                                Game.victory();
                            }
                        } else {
                            AudioManager.playInteractionSound();
                            if (npc.id === 'mayordomo' && !Game.mayordomoGreeted) {
                                Game.mayordomoGreeted = true;
                                npcElement.classList.remove('glow');
                                const bubble = npcElement.querySelector('.speech-bubble');
                                if (bubble) bubble.remove();
                            }
                            DialogManager.showNPCDialog(npc);
                        }
                    }, 300);
                }
            } else {
                if (hint) {
                    hint.style.opacity = '0';
                    hint.classList.remove('visible');
                }
            }
        }

        // Verificar objetos (evidencias y distractores)
        const allObjects = [...EVIDENCES, ...DISTRACTORS];
        for (const obj of allObjects) {
            if (obj.room !== Game.currentRoom) continue;
            if (Game.collectedObjects.has(obj.id)) continue;

            const objElement = document.getElementById(`obj-${obj.id}`);
            if (!objElement) continue;

            const dist = this.getDistance(playerCenter, {
                x: obj.position.x + 14,
                y: obj.position.y + 14
            });

            const hint = objElement.querySelector('.interaction-hint');
            if (dist <= GAME_CONSTANTS.INTERACTION_DISTANCE) {
                if (hint) {
                    hint.style.opacity = '1';
                    hint.classList.add('visible');
                }

                // Auto-interactuar la primera vez
                const interactionKey = `obj-${obj.id}`;
                if (!Game.interactedWith.has(interactionKey)) {
                    Game.interactedWith.add(interactionKey);
                    // Pequeño delay para que no sea instantáneo
                    setTimeout(() => {
                        this.tryCollectObject(obj.id);
                    }, 300);
                }
            } else {
                if (hint) {
                    hint.style.opacity = '0';
                    hint.classList.remove('visible');
                }
            }
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

        // Verificar proximidad a objetos y NPCs
        this.checkProximity();
    },

    // Verificar proximidad a objetos y NPCs para mostrar hints
    checkProximity() {
        const playerCenter = {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };

        const interactionDistance = GAME_CONSTANTS.INTERACTION_DISTANCE;

        // Quitar clase nearby de todos los elementos
        document.querySelectorAll('.room-object.nearby, .npc.nearby').forEach(el => {
            el.classList.remove('nearby');
        });

        // Verificar objetos
        document.querySelectorAll('.room-object').forEach(obj => {
            const rect = obj.getBoundingClientRect();
            const roomRect = document.getElementById('room').getBoundingClientRect();
            const objX = rect.left - roomRect.left + rect.width / 2;
            const objY = rect.top - roomRect.top + rect.height / 2;

            const dist = this.getDistance(playerCenter, { x: objX, y: objY });
            if (dist <= interactionDistance) {
                obj.classList.add('nearby');
            }
        });

        // Verificar NPCs
        document.querySelectorAll('.npc').forEach(npc => {
            const rect = npc.getBoundingClientRect();
            const roomRect = document.getElementById('room').getBoundingClientRect();
            const npcX = rect.left - roomRect.left + rect.width / 2;
            const npcY = rect.top - roomRect.top + rect.height / 2;

            const dist = this.getDistance(playerCenter, { x: npcX, y: npcY });
            if (dist <= interactionDistance) {
                npc.classList.add('nearby');
            }
        });
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
                        this.enterRoom(targetRoom, this.getOppositeDirection(currentRoom.id, targetRoom), currentRoom.id);
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
                    this.enterRoom(targetRoom, direction, currentRoom.id);
                }
            }
        }
    },

    // Obtener dirección opuesta para entradas desde pasillo
    getOppositeDirection(fromRoom, toRoom) {
        // Si venimos del pasillo, determinar desde qué dirección entrar
        if (fromRoom === 'pasillo') {
            // Fila SUPERIOR del pasillo (R, 1, 3, 5): entrar desde el SUR
            const upperRooms = ['vestibulo', 'oficina', 'sala-juntas', 'biblioteca'];
            // Fila INFERIOR del pasillo (2, 4, 6): entrar desde el NORTE
            const lowerRooms = ['laboratorio', 'archivo', 'galeria'];

            if (upperRooms.includes(toRoom)) {
                return 'south'; // Entrar desde el sur (puertas arriba del pasillo)
            } else if (lowerRooms.includes(toRoom)) {
                return 'north'; // Entrar desde el norte (puertas abajo del pasillo)
            }
        }
        // Si vamos hacia el pasillo, entrar desde cualquier lado
        return 'north';
    },

    // Entrar a una habitación
    enterRoom(roomId, fromDirection, fromRoom = null) {
        if (!ROOMS[roomId]) return;

        AudioManager.playDoorOpen();

        // Determinar posición de entrada
        const targetRoom = ROOMS[roomId];
        let entryPoint = { ...targetRoom.spawnPoint };

        // Si entramos al pasillo, aparecer frente a la puerta de origen
        if (roomId === 'pasillo' && fromRoom && targetRoom.customDoors) {
            const originDoor = targetRoom.customDoors.find(d => d.id === fromRoom);
            if (originDoor) {
                entryPoint.x = originDoor.x + originDoor.width / 2 - this.width / 2;
                // Si la puerta está arriba (y=0), aparecer abajo de ella
                // Si la puerta está abajo (y=460), aparecer arriba de ella
                entryPoint.y = originDoor.y < 100 ? 80 : 380;
            }
        } else {
            // Habitaciones normales: aparecer centrado frente a la puerta
            switch (fromDirection) {
                case 'north':
                    entryPoint.y = 420;
                    entryPoint.x = 360 + 40 - this.width / 2; // Centrado en puerta
                    break;
                case 'south':
                    entryPoint.y = 80;
                    entryPoint.x = 360 + 40 - this.width / 2;
                    break;
                case 'east':
                    entryPoint.x = 80;
                    break;
                case 'west':
                    entryPoint.x = 720;
                    break;
            }
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
        // Re-acquire DOM element in case it was not available during init
        this.element = document.getElementById('player');
        // Set initial position
        this.x = 384;
        this.y = 300;
        this.updatePosition();
    }
};
