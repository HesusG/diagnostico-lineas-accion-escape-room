/* ============================================
   ROOMS.JS - Sistema de Habitaciones
   Renderizado y gestión de habitaciones
   ============================================ */

const RoomManager = {
    currentRoomId: 'vestibulo',
    roomElement: null,

    // Inicializar
    init() {
        this.roomElement = document.getElementById('room');
    },

    // Renderizar habitación
    renderRoom(roomId) {
        if (!this.roomElement) return;

        const room = ROOMS[roomId];
        if (!room) return;

        this.currentRoomId = roomId;

        // Limpiar habitación actual
        this.roomElement.innerHTML = '';

        // Aplicar clase de estilo
        this.roomElement.className = room.cssClass;

        // Actualizar nombre de ubicación
        const locationElement = document.getElementById('location');
        if (locationElement) {
            locationElement.textContent = `📍 ${room.name}`;
        }

        // Renderizar puertas
        this.renderDoors(room);

        // Renderizar paredes (colisiones)
        this.renderWalls(room);

        // Renderizar mobiliario
        this.renderFurniture(room);

        // Renderizar NPCs
        this.renderNPCs(roomId);

        // Verificar si es la primera vez en el vestíbulo y activar glow del mayordomo
        if (roomId === 'vestibulo' && !Game.mayordomoGreeted) {
            setTimeout(() => {
                const mayordomo = document.getElementById('npc-mayordomo');
                if (mayordomo) {
                    mayordomo.classList.add('glow');

                    // Añadir burbuja de diálogo
                    const bubble = document.createElement('div');
                    bubble.className = 'speech-bubble';
                    bubble.textContent = '¡Ven, acércate a mí!';
                    mayordomo.appendChild(bubble);
                }
            }, 500);
        }

        // Renderizar objetos (evidencias y distractores)
        this.renderObjects(roomId);

        // Actualizar minimapa
        this.renderMinimap();
    },

    // Renderizar puertas
    renderDoors(room) {
        // Lógica para puertas personalizadas (Pasillo Central)
        if (room.customDoors) {
            room.customDoors.forEach(door => {
                // Crear zona de puerta visual
                const doorZone = document.createElement('div');
                doorZone.className = 'door-zone';
                doorZone.style.left = `${door.x}px`;
                doorZone.style.top = `${door.y}px`;
                doorZone.style.width = `${door.width}px`;
                doorZone.style.height = `${door.height}px`;

                // Icono de puerta CSS
                const doorIcon = document.createElement('div');
                doorIcon.className = 'door-css';

                // Etiqueta de puerta - Posicionada según ubicación
                const label = document.createElement('div');
                label.className = 'door-label';
                // Si la puerta está arriba (y < 100), poner etiqueta abajo (top)
                // Si está abajo (y > 400), poner etiqueta arriba (bottom)
                if (door.y < 100) {
                    label.classList.add('door-label-top');
                } else {
                    label.classList.add('door-label-bottom');
                }
                label.textContent = door.label || 'Sala';
                doorZone.appendChild(label);

                // Posicionar icono (centrado en la zona)
                doorIcon.style.left = `${door.x + door.width / 2 - 30}px`;
                doorIcon.style.top = `${door.y + door.height / 2 - 22}px`;

                this.roomElement.appendChild(doorZone);
                this.roomElement.appendChild(doorIcon);
            });
            return;
        }

        if (!room.doorPositions) return;

        for (const [direction, doorPos] of Object.entries(room.doorPositions)) {
            if (!doorPos || !room.doors[direction]) continue;

            // Crear zona de puerta visual
            const doorZone = document.createElement('div');
            doorZone.className = 'door-zone';
            doorZone.style.left = `${doorPos.x}px`;
            doorZone.style.top = `${doorPos.y}px`;
            doorZone.style.width = `${doorPos.width}px`;
            doorZone.style.height = `${doorPos.height}px`;

            // Puerta CSS
            const doorIcon = document.createElement('div');
            doorIcon.className = 'door-css';

            // Posicionar icono según dirección (centrado en la puerta)
            if (direction === 'north' || direction === 'south') {
                doorIcon.style.left = `${doorPos.x + doorPos.width / 2 - 30}px`;
                doorIcon.style.top = `${doorPos.y + doorPos.height / 2 - 22}px`;
            } else {
                doorIcon.style.left = direction === 'west' ? '10px' : `${doorPos.x - 10}px`;
                doorIcon.style.top = `${doorPos.y + doorPos.height / 2 - 20}px`;
            }

            this.roomElement.appendChild(doorZone);
            this.roomElement.appendChild(doorIcon);
        }
    },

    // Renderizar paredes (colisiones visibles)
    renderWalls(room) {
        if (!room.walls) return;

        room.walls.forEach(wall => {
            const wallElement = document.createElement('div');
            wallElement.className = 'wall';
            wallElement.style.left = `${wall.x}px`;
            wallElement.style.top = `${wall.y}px`;
            wallElement.style.width = `${wall.width}px`;
            wallElement.style.height = `${wall.height}px`;
            this.roomElement.appendChild(wallElement);
        });
    },

    // Renderizar mobiliario decorativo
    renderFurniture(room) {
        if (!room.furniture) return;

        room.furniture.forEach((item, index) => {
            const furniture = document.createElement('div');
            furniture.className = 'furniture';
            furniture.style.left = `${item.x}px`;
            furniture.style.top = `${item.y}px`;

            // Verificar si hay imagen para este emoji
            const imagePath = FURNITURE_IMAGES[item.icon];
            if (imagePath) {
                // Usar imagen
                const img = document.createElement('img');
                img.src = imagePath;
                img.alt = item.icon;
                img.className = 'furniture-img';
                img.onerror = () => {
                    // Fallback a emoji si la imagen no carga
                    furniture.textContent = item.icon;
                    img.remove();
                };
                furniture.appendChild(img);
            } else {
                // Fallback a emoji
                furniture.textContent = item.icon;
            }

            this.roomElement.appendChild(furniture);
        });
    },

    // Renderizar NPCs
    renderNPCs(roomId) {
        for (const npc of Object.values(NPCS)) {
            if (npc.room !== roomId) continue;

            const npcElement = document.createElement('div');
            npcElement.className = 'npc';
            npcElement.id = `npc-${npc.id}`;

            // Usar imagen si existe, sino emoji
            const imagePath = NPC_IMAGES && NPC_IMAGES[npc.id];
            if (imagePath) {
                const img = document.createElement('img');
                img.src = imagePath;
                img.alt = npc.name;
                img.className = 'npc-sprite';
                img.onerror = () => {
                    // Fallback a emoji si la imagen no carga
                    img.remove();
                    npcElement.textContent = npc.icon;
                };
                npcElement.appendChild(img);
            } else {
                npcElement.textContent = npc.icon;
            }

            // Ajustar posición para centrar el sprite (64px de ancho/alto)
            // Restar la mitad del tamaño del sprite para centrarlo
            const spriteSize = 64;
            const offsetX = imagePath ? spriteSize / 2 : 0;
            const offsetY = imagePath ? spriteSize / 2 : 0;

            npcElement.style.left = `${npc.position.x - offsetX}px`;
            npcElement.style.top = `${npc.position.y - offsetY}px`;

            // Hint de interacción
            const hint = document.createElement('span');
            hint.className = 'interaction-hint';
            hint.textContent = '[Espacio] Hablar';
            npcElement.appendChild(hint);

            // Etiqueta de nombre
            const nameLabel = document.createElement('div');
            nameLabel.className = 'npc-label';
            nameLabel.textContent = npc.name;
            nameLabel.style.position = 'absolute';
            nameLabel.style.top = '-25px';
            nameLabel.style.left = '50%';
            nameLabel.style.transform = 'translateX(-50%)';
            nameLabel.style.whiteSpace = 'nowrap';
            nameLabel.style.fontSize = '12px';
            nameLabel.style.color = '#4ecca3';
            nameLabel.style.textShadow = '1px 1px 0 #000';
            npcElement.appendChild(nameLabel);

            // Click para interactuar
            npcElement.addEventListener('click', (e) => {
                e.stopPropagation();
                // Calcular distancia para validar si está cerca
                const player = Player;
                const dist = player.getDistance(
                    { x: player.x + player.width / 2, y: player.y + player.height / 2 },
                    { x: npc.position.x + 16, y: npc.position.y + 16 }
                );

                if (dist <= GAME_CONSTANTS.INTERACTION_DISTANCE * 1.5) { // Un poco más permisivo con click
                    // Reproducir sonido de Animal Crossing
                    AudioManager.playInteractionSound();

                    // Remover glow si es el mayordomo
                    if (npc.id === 'mayordomo' && !Game.mayordomoGreeted) {
                        Game.mayordomoGreeted = true;
                        npcElement.classList.remove('glow');
                        const bubble = npcElement.querySelector('.speech-bubble');
                        if (bubble) bubble.remove();
                    }

                    if (npc.isCondeForDelivery) {
                        if (DialogManager.showDeliveryDialog()) {
                            Game.victory();
                        }
                    } else {
                        DialogManager.showNPCDialog(npc);
                    }
                } else {
                    // Feedback visual si está lejos
                    const hint = npcElement.querySelector('.interaction-hint');
                    if (hint) {
                        hint.textContent = '¡Acércate más!';
                        hint.style.opacity = '1';
                        setTimeout(() => {
                            hint.textContent = '[E] Hablar';
                            hint.style.opacity = '';
                        }, 1000);
                    }
                }
            });

            this.roomElement.appendChild(npcElement);
        }
    },

    // Renderizar evidencias y distractores
    renderObjects(roomId) {
        // Evidencias correctas
        EVIDENCES.forEach(evidence => {
            if (evidence.room !== roomId) return;
            if (Game.collectedObjects.has(evidence.id)) return;

            const objElement = document.createElement('div');
            objElement.className = 'room-object evidence';
            objElement.id = `obj-${evidence.id}`;
            objElement.textContent = evidence.icon;
            objElement.style.left = `${evidence.position.x}px`;
            objElement.style.top = `${evidence.position.y}px`;

            // Hint de interacción
            const hint = document.createElement('span');
            hint.className = 'interaction-hint';
            hint.textContent = '[E] Examinar';
            objElement.appendChild(hint);

            // Click para recolectar
            objElement.addEventListener('click', (e) => {
                e.stopPropagation();
                Player.tryCollectObject(evidence.id);
            });

            this.roomElement.appendChild(objElement);
        });

        // Distractores
        DISTRACTORS.forEach(distractor => {
            if (distractor.room !== roomId) return;
            if (Game.collectedObjects.has(distractor.id)) return;

            const objElement = document.createElement('div');
            objElement.className = 'room-object distractor';
            objElement.id = `obj-${distractor.id}`;
            objElement.textContent = distractor.icon;
            objElement.style.left = `${distractor.position.x}px`;
            objElement.style.top = `${distractor.position.y}px`;

            // Hint de interacción
            const hint = document.createElement('span');
            hint.className = 'interaction-hint';
            hint.textContent = '[Espacio] Examinar';
            objElement.appendChild(hint);

            // Click para recolectar
            objElement.addEventListener('click', (e) => {
                e.stopPropagation();
                Player.tryCollectObject(distractor.id);
            });

            this.roomElement.appendChild(objElement);
        });
    },

    // Marcar objeto como recolectado
    markObjectCollected(objectId) {
        const element = document.getElementById(`obj-${objectId}`);
        if (element) {
            element.classList.add('collected');
            // Animación de desaparición
            element.style.transform = 'scale(0)';
            element.style.opacity = '0';
            element.style.transition = 'all 0.3s ease';

            setTimeout(() => {
                element.remove();
            }, 300);
        }
    },

    // Obtener información de habitación
    getRoomInfo(roomId) {
        return ROOMS[roomId] || null;
    },

    // Verificar si es la habitación de entrega
    isDeliveryRoom(roomId) {
        const room = ROOMS[roomId];
        return room && room.isDeliveryRoom;
    },

    // Renderizar minimapa
    renderMinimap() {
        const minimap = document.getElementById('minimap');
        if (!minimap) return;

        minimap.innerHTML = '';

        // Mapa estilo "Palanca de Cambios"
        // R  1  3  5
        //    |  |  |
        //    --H--
        //    |  |  |
        //    2  4  6

        const grid = {
            'vestibulo': { x: 0, y: 0, label: 'R' },
            'pasillo': { x: 1.5, y: 1, label: 'H' }, // Centro
            'oficina': { x: 1, y: 0, label: '1' },
            'laboratorio': { x: 1, y: 2, label: '2' },
            'sala-juntas': { x: 2, y: 0, label: '3' },
            'archivo': { x: 2, y: 2, label: '4' },
            'biblioteca': { x: 3, y: 0, label: '5' },
            'galeria': { x: 3, y: 2, label: '6' }
        };

        // Ajustar coordenadas para centrar
        const offsetX = 8;
        const offsetY = 12;
        const scale = 20;

        // Dibujar líneas de conexión (H-pattern)
        const ctx = document.createElement('canvas');
        ctx.width = 120;
        ctx.height = 100;
        ctx.style.position = 'absolute';
        ctx.style.top = '0';
        ctx.style.left = '0';
        ctx.style.zIndex = '0';
        minimap.appendChild(ctx);

        const c = ctx.getContext('2d');
        c.strokeStyle = '#4ecca3';
        c.lineWidth = 2;
        c.beginPath();
        // Línea horizontal central
        c.moveTo(offsetX + 1 * scale + 15, offsetY + 1 * scale + 15);
        c.lineTo(offsetX + 3 * scale + 15, offsetY + 1 * scale + 15);
        // Líneas verticales
        // 1-2
        c.moveTo(offsetX + 1 * scale + 15, offsetY + 0 * scale + 15);
        c.lineTo(offsetX + 1 * scale + 15, offsetY + 2 * scale + 15);
        // 3-4
        c.moveTo(offsetX + 2 * scale + 15, offsetY + 0 * scale + 15);
        c.lineTo(offsetX + 2 * scale + 15, offsetY + 2 * scale + 15);
        // 5-6
        c.moveTo(offsetX + 3 * scale + 15, offsetY + 0 * scale + 15);
        c.lineTo(offsetX + 3 * scale + 15, offsetY + 2 * scale + 15);
        // R connection
        c.moveTo(offsetX + 0 * scale + 15, offsetY + 0 * scale + 15);
        c.lineTo(offsetX + 0 * scale + 15, offsetY + 1 * scale + 15);
        c.lineTo(offsetX + 1 * scale + 15, offsetY + 1 * scale + 15);
        c.stroke();

        Object.entries(grid).forEach(([id, pos]) => {
            const roomDiv = document.createElement('div');
            roomDiv.className = 'minimap-room';
            if (id === this.currentRoomId) {
                roomDiv.classList.add('active');
            } else {
                roomDiv.classList.add('visited');
            }

            roomDiv.style.left = `${offsetX + pos.x * scale}px`;
            roomDiv.style.top = `${offsetY + pos.y * scale}px`;
            roomDiv.style.width = `${scale}px`;
            roomDiv.style.height = `${scale}px`;
            roomDiv.style.display = 'flex';
            roomDiv.style.justifyContent = 'center';
            roomDiv.style.alignItems = 'center';
            roomDiv.style.fontSize = '8px';
            roomDiv.style.color = '#fff';
            roomDiv.textContent = pos.label;
            roomDiv.style.zIndex = '1';

            minimap.appendChild(roomDiv);
        });
    }
};
