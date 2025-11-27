/* ============================================
   INVENTORY.JS - Sistema de Inventario
   Manejo de evidencias recolectadas y errores
   ============================================ */

const Inventory = {
    collectedEvidences: [],
    errors: 0,
    maxErrors: GAME_CONSTANTS.MAX_ERRORS,
    totalEvidences: GAME_CONSTANTS.TOTAL_EVIDENCES,

    // Inicializar inventario
    init() {
        this.collectedEvidences = [];
        this.errors = 0;
        this.updateDisplay();
    },

    // Agregar evidencia correcta
    addEvidence(evidence) {
        if (this.hasEvidence(evidence.id)) return false;

        this.collectedEvidences.push({
            id: evidence.id,
            name: evidence.name,
            icon: evidence.icon,
            concept: evidence.concept
        });

        this.updateDisplay();
        AudioManager.playSuccess();
        this.showFeedback(true, `✓ ${evidence.name}`, evidence.concept);

        // Verificar victoria
        if (this.collectedEvidences.length >= this.totalEvidences) {
            // No victoria automática - debe entregar al Conde
        }

        return true;
    },

    // Agregar error (distractor)
    addError(distractor) {
        this.errors++;
        this.updateDisplay();
        AudioManager.playError();
        this.showFeedback(false, distractor.name, distractor.feedback);

        // Verificar game over por errores
        if (this.errors >= this.maxErrors) {
            setTimeout(() => {
                if (typeof Game !== 'undefined') {
                    Game.gameOver('errors');
                }
            }, 2000);
        }

        return this.errors >= this.maxErrors;
    },

    // Verificar si ya tiene una evidencia
    hasEvidence(evidenceId) {
        return this.collectedEvidences.some(e => e.id === evidenceId);
    },

    // Verificar si puede ganar (tiene todas las evidencias)
    canWin() {
        return this.collectedEvidences.length >= this.totalEvidences;
    },

    // Actualizar display del inventario
    updateDisplay() {
        // Actualizar contador de evidencias
        const evidenceCount = document.getElementById('evidence-count');
        if (evidenceCount) {
            evidenceCount.textContent = `📦 ${this.collectedEvidences.length}/${this.totalEvidences}`;

            // Cambiar color si está completo
            if (this.collectedEvidences.length >= this.totalEvidences) {
                evidenceCount.style.color = '#4ecca3';
                evidenceCount.style.fontWeight = 'bold';
            }
        }

        // Actualizar contador de errores
        const errorCount = document.getElementById('error-count');
        if (errorCount) {
            errorCount.textContent = `⚠️ ${this.errors}/${this.maxErrors}`;

            // Cambiar color según errores
            if (this.errors >= this.maxErrors - 1) {
                errorCount.style.color = '#ff4444';
            } else if (this.errors > 0) {
                errorCount.style.color = '#ffc107';
            }
        }

        // Actualizar lista de inventario
        const inventoryItems = document.getElementById('inventory-items');
        if (inventoryItems) {
            inventoryItems.innerHTML = '';

            if (this.collectedEvidences.length === 0) {
                inventoryItems.innerHTML = '<span class="empty-inventory">Sin evidencias aún...</span>';
            } else {
                this.collectedEvidences.forEach(evidence => {
                    const item = document.createElement('div');
                    item.className = 'inventory-item';
                    item.innerHTML = `<span>${evidence.icon}</span> ${evidence.name}`;
                    item.title = evidence.concept;
                    inventoryItems.appendChild(item);
                });
            }
        }
    },

    // Mostrar feedback de recolección
    showFeedback(isSuccess, title, message) {
        const modal = document.getElementById('feedback-modal');
        const icon = document.getElementById('feedback-icon');
        const text = document.getElementById('feedback-text');
        const content = modal.querySelector('.modal-content');

        if (!modal || !icon || !text) return;

        // Configurar contenido
        icon.textContent = isSuccess ? '✓' : '✗';
        text.innerHTML = `<strong>${title}</strong><br><br>${message}`;

        // Configurar estilo
        content.classList.remove('success', 'error');
        content.classList.add(isSuccess ? 'success' : 'error');

        // Mostrar modal
        modal.classList.remove('hidden');

        // Auto-cerrar después de un tiempo
        const closeTime = isSuccess ? 2000 : 4000; // Más tiempo para errores (educativo)
        setTimeout(() => {
            modal.classList.add('hidden');
        }, closeTime);
    },

    // Obtener resumen para pantalla de victoria
    getSummary() {
        return {
            evidences: this.collectedEvidences.length,
            total: this.totalEvidences,
            errors: this.errors,
            maxErrors: this.maxErrors
        };
    },

    // Resetear inventario
    reset() {
        this.collectedEvidences = [];
        this.errors = 0;
        this.updateDisplay();
    }
};
