/* ============================================
   NAVIGATION.JS - Sistema de Hints de Navegación
   ============================================ */

const NavigationHint = {
    element: null,
    textElement: null,

    init() {
        this.element = document.getElementById('navigation-hint');
        this.textElement = document.getElementById('nav-hint-text');
        this.update();
    },

    update() {
        if (!this.textElement) return;

        // Mapeo de habitaciones a nombres amigables
        const roomNames = {
            'vestibulo': 'Vestíbulo',
            'pasillo': 'Pasillo Central',
            'oficina': 'Sala 1 - Oficina',
            'laboratorio': 'Sala 2 - Laboratorio',
            'sala-juntas': 'Sala 3 - Sala de Juntas',
            'archivo': 'Sala 4 - Archivo',
            'biblioteca': 'Sala 5 - Biblioteca',
            'galeria': 'Sala 6 - Galería'
        };

        // Determinar siguiente objetivo según progresión de NPCs
        const currentStep = Game.npcProgress.currentStep;
        const npcOrder = NPC_PROGRESSION.order;

        console.log(`Updating Navigation Hint. Step: ${currentStep}, Room: ${Game.currentRoom}`);

        if (currentStep >= npcOrder.length) {
            // Ya visitó todos los NPCs, debe regresar al Conde
            this.textElement.textContent = '🎯 Regresa al Vestíbulo - Habla con el Conde';
            return;
        }

        const nextNPC = npcOrder[currentStep];
        const nextRoom = NPC_PROGRESSION.roomMap[nextNPC];
        const roomName = roomNames[nextRoom] || nextRoom;

        // Obtener nombre del NPC para el hint
        let npcName = "al personaje";
        if (NPCS[nextNPC]) {
            npcName = NPCS[nextNPC].name;
        }

        // Lógica de mensajes más robusta
        if (currentStep === 0) {
            // Caso especial: Inicio del juego
            if (Game.currentRoom === 'vestibulo') {
                this.textElement.textContent = '🎯 Habla con el Mayordomo aquí en el Vestíbulo';
            } else {
                this.textElement.textContent = '🎯 Regresa al Vestíbulo para hablar con el Mayordomo';
            }
        } else if (Game.currentRoom === nextRoom) {
            // Está en la habitación correcta
            this.textElement.textContent = `🎯 Habla con ${npcName} aquí`;
        } else if (Game.currentRoom === 'pasillo') {
            // Está en el pasillo, indicar claramente a dónde ir
            this.textElement.textContent = `🎯 Ve a ${roomName}`;
        } else {
            // Está en otra habitación incorrecta
            this.textElement.textContent = `🎯 Ve a ${roomName} (Sal al Pasillo primero)`;
        }
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
