/* ============================================
   MINIMAP.JS - Control del Minimapa
   ============================================ */

const Minimap = {
    container: null,
    toggleBtn: null,
    isMinimized: false,

    init() {
        this.container = document.getElementById('minimap-container');
        this.toggleBtn = document.getElementById('minimap-toggle');

        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggle());
        }
    },

    toggle() {
        if (!this.container) return;

        this.isMinimized = !this.isMinimized;

        if (this.isMinimized) {
            this.container.classList.add('minimized');
            if (this.toggleBtn) this.toggleBtn.textContent = '+';
        } else {
            this.container.classList.remove('minimized');
            if (this.toggleBtn) this.toggleBtn.textContent = '−';
        }
    },

    show() {
        if (this.container) this.container.classList.remove('hidden');
    },

    hide() {
        if (this.container) this.container.classList.add('hidden');
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    Minimap.init();
});
