/* ============================================
   TIMER.JS - Sistema de Temporizador
   30 minutos con alertas visuales y sonoras
   ============================================ */

const Timer = {
    totalTime: GAME_CONSTANTS.TOTAL_TIME, // 30 minutos en segundos
    remainingTime: GAME_CONSTANTS.TOTAL_TIME,
    intervalId: null,
    isRunning: false,
    lastTickSecond: -1,

    // Inicializar timer
    init() {
        this.remainingTime = this.totalTime;
        this.updateDisplay();
        this.updateTimerStyle();
    },

    // Iniciar el timer
    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.intervalId = setInterval(() => this.tick(), 1000);
    },

    // Pausar el timer
    pause() {
        if (!this.isRunning) return;

        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    },

    // Detener y resetear
    stop() {
        this.pause();
        this.remainingTime = this.totalTime;
        this.updateDisplay();
        this.updateTimerStyle();
    },

    // Cada segundo
    tick() {
        if (this.remainingTime > 0) {
            this.remainingTime--;
            this.updateDisplay();
            this.updateTimerStyle();
            this.checkAlerts();

            // Verificar game over por tiempo
            if (this.remainingTime <= 0) {
                this.pause();
                if (typeof Game !== 'undefined') {
                    Game.gameOver('time');
                }
            }
        }
    },

    // Actualizar display del timer
    updateDisplay() {
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        const display = `⏰ ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = display;
        }
    },

    // Actualizar estilo según tiempo restante
    updateTimerStyle() {
        const timerElement = document.getElementById('timer');
        if (!timerElement) return;

        // Remover clases anteriores
        timerElement.classList.remove('warning', 'danger', 'critical');

        if (this.remainingTime <= 120) { // Últimos 2 minutos
            timerElement.classList.add('critical');
        } else if (this.remainingTime <= 300) { // Últimos 5 minutos
            timerElement.classList.add('danger');
        } else if (this.remainingTime <= 600) { // Últimos 10 minutos
            timerElement.classList.add('warning');
        }
    },

    // Verificar alertas de audio
    checkAlerts() {
        const currentSecond = this.remainingTime;

        // Solo reproducir si cambió el segundo (evitar duplicados)
        if (currentSecond === this.lastTickSecond) return;
        this.lastTickSecond = currentSecond;

        // Últimos 2 minutos - alarma cada 30 segundos
        if (this.remainingTime <= 120 && this.remainingTime > 0) {
            if (this.remainingTime % 30 === 0) {
                AudioManager.playAlarm();
            } else if (this.remainingTime % 5 === 0) {
                AudioManager.playTick();
            }
        }
        // 5-10 minutos - tick cada 30 segundos
        else if (this.remainingTime <= 600 && this.remainingTime % 30 === 0) {
            AudioManager.playTick();
        }

        // Alertas específicas
        if (this.remainingTime === 600) { // 10 minutos
            this.showTimeAlert('⚠️ ¡Quedan 10 minutos!');
        } else if (this.remainingTime === 300) { // 5 minutos
            this.showTimeAlert('⚠️ ¡Solo 5 minutos!');
        } else if (this.remainingTime === 120) { // 2 minutos
            this.showTimeAlert('🚨 ¡ÚLTIMOS 2 MINUTOS!');
        } else if (this.remainingTime === 60) { // 1 minuto
            this.showTimeAlert('🚨 ¡1 MINUTO!');
        } else if (this.remainingTime === 30) { // 30 segundos
            this.showTimeAlert('💀 ¡30 SEGUNDOS!');
        }
    },

    // Mostrar alerta de tiempo
    showTimeAlert(message) {
        // Crear elemento de alerta temporal
        const alert = document.createElement('div');
        alert.className = 'time-alert';
        alert.textContent = message;
        alert.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: #ff4444;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 1.5rem;
            font-weight: bold;
            z-index: 1000;
            animation: alertPulse 0.5s ease-in-out;
            border: 2px solid #ff4444;
        `;

        document.body.appendChild(alert);

        // Remover después de 2 segundos
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transition = 'opacity 0.3s';
            setTimeout(() => alert.remove(), 300);
        }, 2000);
    },

    // Obtener tiempo formateado
    getFormattedTime() {
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },

    // Obtener tiempo usado (para puntuación)
    getTimeUsed() {
        return this.totalTime - this.remainingTime;
    },

    // Obtener tiempo usado formateado
    getTimeUsedFormatted() {
        const used = this.getTimeUsed();
        const minutes = Math.floor(used / 60);
        const seconds = used % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
};
