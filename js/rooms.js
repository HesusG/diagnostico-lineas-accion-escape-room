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

        // Renderizar mobiliario
        this.renderFurniture(room);

        // Renderizar NPCs
        this.renderNPCs(roomId);

        // Renderizar objetos (evidencias y distractores)
        this.renderObjects(roomId);
    },

    // Renderizar puertas
    renderDoors(room) {
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

            // Icono de puerta
            const doorIcon = document.createElement('div');
            doorIcon.className = 'door';
            doorIcon.textContent = '🚪';

            // Posicionar icono según dirección
            if (direction === 'north' || direction === 'south') {
                doorIcon.style.left = `${doorPos.x + doorPos.width / 2 - 16}px`;
                doorIcon.style.top = direction === 'north' ? '5px' : `${doorPos.y - 5}px`;
            } else {
                doorIcon.style.left = direction === 'west' ? '5px' : `${doorPos.x - 5}px`;
                doorIcon.style.top = `${doorPos.y + doorPos.height / 2 - 16}px`;
            }

            this.roomElement.appendChild(doorZone);
            this.roomElement.appendChild(doorIcon);
        }
    },

    // Renderizar mobiliario decorativo
    renderFurniture(room) {
        if (!room.furniture) return;

        room.furniture.forEach((item, index) => {
            const furniture = document.createElement('div');
            furniture.className = 'furniture';
            furniture.textContent = item.icon;
            furniture.style.left = `${item.x}px`;
            furniture.style.top = `${item.y}px`;
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
            npcElement.textContent = npc.icon;
            npcElement.style.left = `${npc.position.x}px`;
            npcElement.style.top = `${npc.position.y}px`;

            // Hint de interacción
            const hint = document.createElement('span');
            hint.className = 'interaction-hint';
            hint.textContent = '[E] Hablar';
            npcElement.appendChild(hint);

            this.roomElement.appendChild(npcElement);
        }
    },

    // Renderizar objetos recolectables
    renderObjects(roomId) {
        // Renderizar evidencias
        EVIDENCES.forEach(evidence => {
            if (evidence.room !== roomId) return;

            const objectElement = this.createObjectElement(evidence, 'evidence');
            if (objectElement) {
                this.roomElement.appendChild(objectElement);
            }
        });

        // Renderizar distractores
        DISTRACTORS.forEach(distractor => {
            if (distractor.room !== roomId) return;

            const objectElement = this.createObjectElement(distractor, 'distractor');
            if (objectElement) {
                this.roomElement.appendChild(objectElement);
            }
        });
    },

    // Crear elemento de objeto
    createObjectElement(object, type) {
        // Verificar si ya fue recolectado
        if (Game.collectedObjects && Game.collectedObjects.has(object.id)) {
            return null;
        }

        const element = document.createElement('div');
        element.className = `room-object ${type}`;
        element.id = `object-${object.id}`;
        element.textContent = object.icon;
        element.style.left = `${object.position.x}px`;
        element.style.top = `${object.position.y}px`;

        // Hint de interacción
        const hint = document.createElement('span');
        hint.className = 'interaction-hint';
        hint.textContent = '[E] Examinar';
        element.appendChild(hint);

        // Data attributes
        element.dataset.objectId = object.id;
        element.dataset.objectType = type;

        return element;
    },

    // Marcar objeto como recolectado
    markObjectCollected(objectId) {
        const element = document.getElementById(`object-${objectId}`);
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
    }
};
