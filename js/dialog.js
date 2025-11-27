/* ============================================
   DIALOG.JS - Sistema de Diálogos y Modales
   Manejo de interacciones con NPCs y objetos
   ============================================ */

const DialogManager = {
    currentModal: null,
    currentObject: null,
    isOpen: false,

    // Inicializar
    init() {
        this.setupEventListeners();
    },

    // Configurar event listeners
    setupEventListeners() {
        // Botón de cerrar diálogo
        const closeDialogBtn = document.getElementById('btn-close-dialog');
        if (closeDialogBtn) {
            closeDialogBtn.addEventListener('click', () => this.closeDialog());
        }

        // Botones de recolección
        const collectBtn = document.getElementById('btn-collect');
        const leaveBtn = document.getElementById('btn-leave');

        if (collectBtn) {
            collectBtn.addEventListener('click', () => this.collectItem());
        }
        if (leaveBtn) {
            leaveBtn.addEventListener('click', () => this.closeInteraction());
        }

        // Cerrar modales con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeAll();
            }
        });

        // Click fuera del modal para cerrar
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAll();
                }
            });
        });
    },

    // Mostrar diálogo de NPC
    showNPCDialog(npc) {
        const modal = document.getElementById('dialog-modal');
        const npcIcon = document.getElementById('npc-icon');
        const npcName = document.getElementById('npc-name');
        const dialogText = document.getElementById('dialog-text');

        if (!modal || !npcIcon || !npcName || !dialogText) return;

        // Configurar contenido
        npcIcon.textContent = npc.icon;
        npcName.innerHTML = `${npc.name} <small style="opacity: 0.7">${npc.title || ''}</small>`;
        dialogText.innerHTML = npc.dialog;

        // Mostrar modal
        modal.classList.remove('hidden');
        this.isOpen = true;
        this.currentModal = modal;

        // Pausar timer durante diálogo
        if (typeof Timer !== 'undefined') {
            Timer.pause();
        }

        AudioManager.playInteract();
    },

    // Cerrar diálogo
    closeDialog() {
        const modal = document.getElementById('dialog-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.isOpen = false;
        this.currentModal = null;

        // Reanudar timer
        if (typeof Timer !== 'undefined' && typeof Game !== 'undefined' && Game.isPlaying) {
            Timer.start();
        }
    },

    // Mostrar modal de interacción con objeto
    showObjectInteraction(object, isEvidence) {
        const modal = document.getElementById('interaction-modal');
        const icon = document.getElementById('modal-icon');
        const title = document.getElementById('modal-title');
        const body = document.getElementById('modal-body');

        if (!modal || !icon || !title || !body) return;

        // Guardar objeto actual
        this.currentObject = { ...object, isEvidence };

        // Configurar contenido
        icon.textContent = object.icon;
        title.textContent = object.name;
        body.innerHTML = object.content;

        // Mostrar modal
        modal.classList.remove('hidden');
        this.isOpen = true;
        this.currentModal = modal;

        // Pausar timer
        if (typeof Timer !== 'undefined') {
            Timer.pause();
        }

        AudioManager.playInteract();
    },

    // Recolectar item actual
    collectItem() {
        if (!this.currentObject) return;

        // Cerrar modal de interacción
        this.closeInteraction();

        // Procesar recolección
        if (this.currentObject.isEvidence) {
            // Es una evidencia correcta
            Inventory.addEvidence(this.currentObject);

            // Marcar como recolectado en el juego
            if (typeof Game !== 'undefined') {
                Game.markObjectCollected(this.currentObject.id);
            }
        } else {
            // Es un distractor
            Inventory.addError(this.currentObject);

            // Marcar como recolectado
            if (typeof Game !== 'undefined') {
                Game.markObjectCollected(this.currentObject.id);
            }
        }

        this.currentObject = null;
    },

    // Cerrar modal de interacción
    closeInteraction() {
        const modal = document.getElementById('interaction-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.isOpen = false;
        this.currentModal = null;
        this.currentObject = null;

        // Reanudar timer
        if (typeof Timer !== 'undefined' && typeof Game !== 'undefined' && Game.isPlaying) {
            Timer.start();
        }
    },

    // Cerrar todos los modales
    closeAll() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        this.isOpen = false;
        this.currentModal = null;
        this.currentObject = null;

        // Reanudar timer
        if (typeof Timer !== 'undefined' && typeof Game !== 'undefined' && Game.isPlaying) {
            Timer.start();
        }
    },

    // Mostrar modal de entrega al Conde
    showDeliveryDialog() {
        if (!Inventory.canWin()) {
            // No tiene todas las evidencias
            this.showCustomDialog(
                '🧛',
                'Conde Von Donativo',
                `Aún no tenéis todas las evidencias, joven analista.

Necesito <strong>${GAME_CONSTANTS.TOTAL_EVIDENCES} pergaminos de verdad</strong> para el Gran Consejo.

Habéis recolectado <strong>${Inventory.collectedEvidences.length}</strong> hasta ahora.

¡Seguid buscando!`
            );
            return false;
        }

        // Tiene todas las evidencias - Victoria
        return true;
    },

    // Mostrar diálogo personalizado
    showCustomDialog(icon, name, message) {
        const modal = document.getElementById('dialog-modal');
        const npcIcon = document.getElementById('npc-icon');
        const npcName = document.getElementById('npc-name');
        const dialogText = document.getElementById('dialog-text');

        if (!modal || !npcIcon || !npcName || !dialogText) return;

        npcIcon.textContent = icon;
        npcName.textContent = name;
        dialogText.innerHTML = message;

        modal.classList.remove('hidden');
        this.isOpen = true;
        this.currentModal = modal;

        if (typeof Timer !== 'undefined') {
            Timer.pause();
        }
    },

    // Verificar si hay modal abierto
    hasOpenModal() {
        return this.isOpen;
    }
};
