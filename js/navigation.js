/* ============================================
   NAVIGATION.JS - Sistema de Hints de Navegación
   ============================================ */

const NavigationHint = {
    element: null,
    textElement: null,

    init() {
        console.log('NavigationHint.init() called');
        this.element = document.getElementById('navigation-hint');
        this.textElement = document.getElementById('nav-hint-text');
        console.log('NavigationHint elements:', {
            element: this.element,
            textElement: this.textElement
        });
        this.update();
    },

    update() {
        console.log('NavigationHint.update() called');

        if (!this.textElement || !window.Game) {
            console.error('NavigationHint not properly initialized or Game not available');
            return;
        }

        // Obtener el progreso actual
        const currentStep = Game.npcProgress.currentStep;
        const npcOrder = NPC_PROGRESSION.order;

        console.log('Current step:', currentStep, '/', npcOrder.length);

        // Si ya completó todos los NPCs, dirigir al Conde
        if (currentStep >= npcOrder.length) {
            if (Game.collectedObjects.size >= GAME_CONSTANTS.TOTAL_EVIDENCES) {
                this.textElement.textContent = '🎯 Regresa al Vestíbulo para hablar con el Conde';
            } else {
                this.textElement.textContent = '🎯 Busca más evidencias antes de ver al Conde';
            }
            return;
        }

        // Obtener el siguiente NPC que debe visitar
        const nextNpcId = npcOrder[currentStep];
        const nextNpc = NPCS[nextNpcId];

        if (!nextNpc) {
            console.error(`NPC ${nextNpcId} not found in NPCS`);
            this.textElement.textContent = '🎯 Explora el castillo';
            return;
        }

        const nextRoom = nextNpc.room;
        const npcName = nextNpc.name;
        const roomData = ROOMS[nextRoom];
        const roomName = roomData ? roomData.name : nextRoom;

        console.log('Next NPC:', nextNpcId, 'in room:', nextRoom);

        // Mapa de códigos de habitación
        const ROOM_CODES = {
            'vestibulo': 'R',
            'oficina': '1',
            'laboratorio': '2',
            'sala-juntas': '3',
            'archivo': '4',
            'biblioteca': '5',
            'galeria': '6'
        };

        const roomCode = ROOM_CODES[nextRoom] ? `(${ROOM_CODES[nextRoom]})` : '';

        // Determinar el mensaje según dónde está el jugador
        if (Game.currentRoom === nextRoom) {
            // Está en la habitación correcta, hablar con el NPC
            this.textElement.textContent = `🎯 Habla con ${npcName} aquí`;
        } else if (Game.currentRoom === 'pasillo') {
            // Está en el pasillo, indicar claramente a qué habitación ir
            this.textElement.textContent = `🎯 Ve a ${roomName} ${roomCode}`;
        } else {
            // Está en otra habitación y necesita ir a otra.
            // Como todas conectan al pasillo, primero debe ir al pasillo.
            // Excepción: Si ya está en la habitación correcta (cubierto arriba)

            this.textElement.textContent = `🎯 Ve al Pasillo Central`;
        }

        console.log('Hint text set to:', this.textElement.textContent);
    },

    hide() {
        if (this.element) {
            this.element.style.display = 'none';
        }
    },

    show() {
        if (this.element) {
            this.element.style.display = 'block';
        }
    }
};

// Expose to window for access from other modules
window.NavigationHint = NavigationHint;
