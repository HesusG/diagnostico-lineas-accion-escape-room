/* ============================================
   DIALOG.JS - Sistema de Diálogos y Modales
   Manejo de interacciones con NPCs y objetos
   ============================================ */

const DialogManager = {
    currentModal: null,
    currentObject: null,
    isOpen: false,
    // Para diálogos multi-página
    currentNPC: null,
    currentDialogPages: [],
    currentPageIndex: 0,

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

        // Botón de siguiente página en diálogo
        const nextDialogBtn = document.getElementById('btn-next-dialog');
        if (nextDialogBtn) {
            nextDialogBtn.addEventListener('click', () => this.nextDialogPage());
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

        // Guardar NPC actual
        this.currentNPC = npc;

        // Verificar si es el conde (caso especial - siempre se puede hablar)
        if (npc.isCondeForDelivery) {
            this.showRegularDialog(npc, modal, npcIcon, npcName, dialogText);
            return;
        }

        // Verificar si puede visitar este NPC según la progresión
        if (!Game.canVisitNPC(npc.id)) {
            // Mostrar hint de orden incorrecto
            this.showWrongOrderDialog(npc, modal, npcIcon, npcName, dialogText);
            return;
        }

        // Verificar si ya fue visitado
        const alreadyVisited = Game.npcProgress.visited.has(npc.id);

        // Marcar como visitado inmediatamente si es el paso correcto
        // Esto asegura que la progresión se guarde incluso si el usuario cierra el diálogo
        if (!alreadyVisited) {
            Game.markNPCVisited(npc.id);
        }

        // Si tiene diálogos multi-página y es primera visita (usamos el estado previo)
        if (npc.dialogPages && npc.dialogPages.length > 0 && !alreadyVisited) {
            this.showMultiPageDialog(npc, modal, npcIcon, npcName, dialogText);
        } else {
            // Diálogo normal (o repetido)
            this.showRegularDialog(npc, modal, npcIcon, npcName, dialogText);
        }
    },

    // Mostrar diálogo regular (una página)
    showRegularDialog(npc, modal, npcIcon, npcName, dialogText) {
        // Configurar contenido
        npcIcon.textContent = npc.icon;
        npcName.innerHTML = `${npc.name} <small style="opacity: 0.7">${npc.title || ''}</small>`;
        dialogText.innerHTML = npc.dialog;

        // Ocultar botón siguiente, mostrar continuar
        this.hideNextButton();
        this.hidePageIndicator();

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

    // Mostrar diálogo multi-página
    showMultiPageDialog(npc, modal, npcIcon, npcName, dialogText) {
        // Guardar páginas
        this.currentDialogPages = npc.dialogPages;
        this.currentPageIndex = 0;

        // Configurar cabecera
        npcIcon.textContent = npc.icon;
        npcName.innerHTML = `${npc.name} <small style="opacity: 0.7">${npc.title || ''}</small>`;

        // Mostrar primera página
        dialogText.innerHTML = this.currentDialogPages[0];

        // Mostrar controles de página
        this.updatePageControls();

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

    // Avanzar a siguiente página de diálogo
    nextDialogPage() {
        if (this.currentDialogPages.length === 0) return;

        this.currentPageIndex++;

        // Verificar si hay más páginas
        if (this.currentPageIndex < this.currentDialogPages.length) {
            const dialogText = document.getElementById('dialog-text');
            if (dialogText) {
                dialogText.innerHTML = this.currentDialogPages[this.currentPageIndex];
            }
            this.updatePageControls();
            AudioManager.playInteract();
        }
    },

    // Actualizar controles de página (botones e indicador)
    updatePageControls() {
        const nextBtn = document.getElementById('btn-next-dialog');
        const closeBtn = document.getElementById('btn-close-dialog');
        const indicator = document.getElementById('dialog-page-indicator');

        const isLastPage = this.currentPageIndex >= this.currentDialogPages.length - 1;

        // Mostrar/ocultar botón siguiente
        if (nextBtn) {
            if (isLastPage) {
                nextBtn.classList.add('hidden');
            } else {
                nextBtn.classList.remove('hidden');
            }
        }

        // Cambiar texto del botón cerrar
        if (closeBtn) {
            closeBtn.textContent = isLastPage ? 'Continuar' : 'Saltar';
        }

        // Actualizar indicador de página
        if (indicator) {
            indicator.classList.remove('hidden');
            indicator.textContent = `${this.currentPageIndex + 1}/${this.currentDialogPages.length}`;
        }
    },

    // Mostrar diálogo cuando visitan NPC en orden incorrecto
    showWrongOrderDialog(npc, modal, npcIcon, npcName, dialogText) {
        npcIcon.textContent = npc.icon;
        npcName.innerHTML = `${npc.name} <small style="opacity: 0.7">${npc.title || ''}</small>`;

        // Obtener hint vago
        const hint = Game.getWrongOrderHint(npc.id);
        dialogText.innerHTML = `<em>${hint}</em>`;

        // Ocultar botón siguiente
        this.hideNextButton();
        this.hidePageIndicator();

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

    // Ocultar botón siguiente
    hideNextButton() {
        const nextBtn = document.getElementById('btn-next-dialog');
        if (nextBtn) {
            nextBtn.classList.add('hidden');
        }
        const closeBtn = document.getElementById('btn-close-dialog');
        if (closeBtn) {
            closeBtn.textContent = 'Continuar';
        }
    },

    // Ocultar indicador de página
    hidePageIndicator() {
        const indicator = document.getElementById('dialog-page-indicator');
        if (indicator) {
            indicator.classList.add('hidden');
        }
    },

    // Cerrar diálogo
    closeDialog() {
        const modal = document.getElementById('dialog-modal');
        if (modal) {
            modal.classList.add('hidden');
        }

        // Si había un diálogo multi-página, marcar NPC como visitado
        // Si había un diálogo multi-página, ya se marcó como visitado al abrir
        // (Logic moved to showNPCDialog)

        // Limpiar estado de diálogo multi-página
        this.currentDialogPages = [];
        this.currentPageIndex = 0;
        this.currentNPC = null;

        this.isOpen = false;
        this.currentModal = null;

        // Reanudar timer
        if (typeof Timer !== 'undefined' && typeof Game !== 'undefined' && Game.isPlaying) {
            Timer.start();
        }
    },

    // Mostrar modal de interacción con objeto
    showObjectInteraction(object, isEvidence) {
        // Verificar si puede recolectar en esta habitación
        const objectRoom = object.room;
        if (!Game.canCollectInRoom(objectRoom)) {
            this.showBlockedObjectDialog(objectRoom);
            return;
        }

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

        // Parsear markdown simple (tablas)
        let content = object.content;
        content = this.parseMarkdown(content);

        body.innerHTML = content;

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

    // Mostrar diálogo cuando intenta recolectar sin haber hablado con el NPC
    showBlockedObjectDialog(roomId) {
        // Encontrar el nombre de la habitación
        const room = ROOMS[roomId];
        const roomName = room ? room.name : 'esta sala';

        this.showCustomDialog(
            '🚫',
            'Pergamino Protegido',
            `Este documento está protegido por el sabio de <strong>${roomName}</strong>.

<em>Debéis hablar primero con el guardián de esta cámara antes de poder examinar sus pergaminos.</em>

Buscad al sabio y aprended de su sabiduría.`
        );
    },

    // Recolectar item actual
    collectItem() {
        if (!this.currentObject) return;

        // Save the object before closing
        const objectToCollect = this.currentObject;

        // Cerrar modal de interacción
        this.closeInteraction();

        // Procesar recolección
        if (objectToCollect.isEvidence) {
            // Es una evidencia correcta
            Inventory.addEvidence(objectToCollect);

            // Marcar como recolectado en el juego
            if (typeof Game !== 'undefined') {
                Game.markObjectCollected(objectToCollect.id);
            }
        } else {
            // Es un distractor
            Inventory.addError(objectToCollect);

            // Marcar como recolectado
            if (typeof Game !== 'undefined') {
                Game.markObjectCollected(objectToCollect.id);
            }
        }
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
        // Verificar si el modal de diálogo está abierto y cerrarlo correctamente
        // para asegurar que se guarde el progreso
        const dialogModal = document.getElementById('dialog-modal');
        if (dialogModal && !dialogModal.classList.contains('hidden')) {
            this.closeDialog();
        }

        // Cerrar otros modales
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
    },

    // Parser simple de Markdown para tablas
    parseMarkdown(text) {
        if (!text) return '';

        // Reemplazar tablas Markdown
        // Busca bloques que parecen tablas: | col | col |
        // Permite espacios antes del primer pipe por si hay indentación
        const tableRegex = /(\s*)\|(.+)\|\n\s*\|([-:| ]+)\|\n((?:(?:\s*)\|.*\|\n?)+)/g;

        return text.replace(tableRegex, (match, indent, header, separator, body) => {
            const headers = header.split('|').map(h => h.trim()).filter(h => h);
            const rows = body.trim().split('\n');

            let html = '<table><thead><tr>';
            headers.forEach(h => {
                html += `<th>${h}</th>`;
            });
            html += '</tr></thead><tbody>';

            rows.forEach(row => {
                // Ignorar líneas vacías
                if (!row.trim()) return;

                const cells = row.split('|').map(c => c.trim());
                // El split puede generar strings vacíos al inicio/final por los pipes externos
                // Filtramos solo si son vacíos Y están en los extremos (el regex garantiza pipes externos)
                // Una estrategia más segura es filtrar vacíos pero cuidado con celdas vacías reales
                // En este caso simple, asumimos que no hay celdas vacías intencionales o que el trim las mata
                const cleanCells = cells.filter((c, i) => {
                    // Mantener celdas intermedias aunque estén vacías, pero eliminar las de los extremos generadas por el split
                    return i > 0 && i < cells.length - 1;
                });

                // Si el filtro anterior falló (ej. estructura diferente), fallback a filtrar todo vacío
                const finalCells = cleanCells.length > 0 ? cleanCells : cells.filter(c => c !== '');

                html += '<tr>';
                finalCells.forEach(c => {
                    html += `<td>${c}</td>`;
                });
                html += '</tr>';
            });

            html += '</tbody></table>';
            return html;
        });
    }
};
