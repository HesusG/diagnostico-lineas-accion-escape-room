/* ============================================
   AUDIO.JS - Sistema de Audio con Web Audio API
   Sonidos sintetizados sin archivos externos
   ============================================ */

const AudioManager = {
    context: null,
    muted: false,
    initialized: false,

    // Sistema de música
    currentMusic: null,
    musicVolume: 0.3,
    musicTracks: {
        'theme': 'music/theme.mp3',
        'vestibulo': 'music/theme.mp3',
        'pasillo': 'music/theme.mp3',
        'laboratorio': 'music/laboratorio.mp3',
        'archivo': 'music/archivo.mp3',
        'biblioteca': 'music/biblioteca.mp3',
        'sala-juntas': 'music/sala-juntas.mp3',
        'oficina': 'music/theme.mp3',
        'galeria': 'music/biblioteca.mp3'
    },
    currentTrackName: null,

    // Inicializar contexto de audio (debe llamarse tras interacción del usuario)
    init() {
        if (this.initialized) return;

        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;

            // Cargar preferencia de mute
            const savedMute = localStorage.getItem('escapeRoom_muted');
            this.muted = savedMute === 'true';
            this.updateMuteButton();

            // Crear elemento de audio para música
            this.currentMusic = new Audio();
            this.currentMusic.loop = true;
            this.currentMusic.volume = this.muted ? 0 : this.musicVolume;
        } catch (e) {
            console.warn('Web Audio API no soportada:', e);
        }
    },

    // Toggle mute
    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('escapeRoom_muted', this.muted);
        this.updateMuteButton();

        // Actualizar volumen de música
        if (this.currentMusic) {
            this.currentMusic.volume = this.muted ? 0 : this.musicVolume;
        }

        return this.muted;
    },

    // Actualizar botón de mute en UI
    updateMuteButton() {
        const btn = document.getElementById('mute-btn');
        if (btn) {
            btn.textContent = this.muted ? '🔇' : '🔊';
        }
    },

    // Crear oscilador base
    createOscillator(frequency, type = 'sine', duration = 0.3) {
        if (!this.context || this.muted) return null;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);

        gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        return { oscillator, gainNode, duration };
    },

    // Sonido de éxito (evidencia correcta) - Tono ascendente alegre
    playSuccess() {
        if (!this.context || this.muted) return;

        const now = this.context.currentTime;

        // Acorde ascendente: Do-Mi-Sol
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

        notes.forEach((freq, i) => {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.1);

            gain.gain.setValueAtTime(0, now + i * 0.1);
            gain.gain.linearRampToValueAtTime(0.2, now + i * 0.1 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);

            osc.connect(gain);
            gain.connect(this.context.destination);

            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.4);
        });
    },

    // Sonido de error (distractor) - Tono descendente de alarma
    playError() {
        if (!this.context || this.muted) return;

        const now = this.context.currentTime;

        // Tono descendente de error
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(200, now + 0.3);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        osc.connect(gain);
        gain.connect(this.context.destination);

        osc.start(now);
        osc.stop(now + 0.5);

        // Segundo tono de énfasis
        setTimeout(() => {
            if (this.muted) return;
            const osc2 = this.context.createOscillator();
            const gain2 = this.context.createGain();

            osc2.type = 'square';
            osc2.frequency.setValueAtTime(150, this.context.currentTime);

            gain2.gain.setValueAtTime(0.15, this.context.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.2);

            osc2.connect(gain2);
            gain2.connect(this.context.destination);

            osc2.start();
            osc2.stop(this.context.currentTime + 0.3);
        }, 200);
    },

    // Tick del timer (cuando queda poco tiempo)
    playTick() {
        if (!this.context || this.muted) return;

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.context.currentTime);

        gain.gain.setValueAtTime(0.1, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.context.destination);

        osc.start();
        osc.stop(this.context.currentTime + 0.1);
    },

    // Alarma urgente (últimos 2 minutos)
    playAlarm() {
        if (!this.context || this.muted) return;

        const now = this.context.currentTime;

        // Dos tonos alternantes de alarma
        for (let i = 0; i < 2; i++) {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(i === 0 ? 600 : 400, now + i * 0.15);

            gain.gain.setValueAtTime(0.15, now + i * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.1);

            osc.connect(gain);
            gain.connect(this.context.destination);

            osc.start(now + i * 0.15);
            osc.stop(now + i * 0.15 + 0.15);
        }
    },

    // Sonido de interacción (hablar con NPC, examinar objeto)
    playInteract() {
        if (!this.context || this.muted) return;

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, this.context.currentTime);
        osc.frequency.linearRampToValueAtTime(550, this.context.currentTime + 0.1);

        gain.gain.setValueAtTime(0.15, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(this.context.destination);

        osc.start();
        osc.stop(this.context.currentTime + 0.2);
    },

    // Sonido tipo Animal Crossing al acercarse a NPC
    playInteractionSound() {
        if (!this.context || this.muted) return;

        const now = this.context.currentTime;

        // Crear un tono rápido y agudo característico de Animal Crossing
        const frequencies = [659.25, 783.99]; // E5, G5

        frequencies.forEach((freq, i) => {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now + i * 0.05);

            gain.gain.setValueAtTime(0.08, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.08);

            osc.connect(gain);
            gain.connect(this.context.destination);

            osc.start(now + i * 0.05);
            osc.stop(now + i * 0.05 + 0.1);
        });
    },

    // Sonido de cambio de habitación
    playDoorOpen() {
        if (!this.context || this.muted) return;

        const now = this.context.currentTime;

        // Efecto de "whoosh"
        const noise = this.context.createOscillator();
        const noiseGain = this.context.createGain();
        const filter = this.context.createBiquadFilter();

        noise.type = 'sawtooth';
        noise.frequency.setValueAtTime(100, now);
        noise.frequency.linearRampToValueAtTime(300, now + 0.2);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, now);
        filter.frequency.linearRampToValueAtTime(200, now + 0.2);

        noiseGain.gain.setValueAtTime(0.1, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.context.destination);

        noise.start(now);
        noise.stop(now + 0.3);
    },

    // Sonido de victoria
    playVictory() {
        if (!this.context || this.muted) return;

        const now = this.context.currentTime;

        // Fanfarria simple
        const melody = [
            { freq: 523.25, time: 0, dur: 0.2 },      // C5
            { freq: 659.25, time: 0.2, dur: 0.2 },    // E5
            { freq: 783.99, time: 0.4, dur: 0.2 },    // G5
            { freq: 1046.50, time: 0.6, dur: 0.5 }    // C6
        ];

        melody.forEach(note => {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(note.freq, now + note.time);

            gain.gain.setValueAtTime(0.2, now + note.time);
            gain.gain.exponentialRampToValueAtTime(0.01, now + note.time + note.dur);

            osc.connect(gain);
            gain.connect(this.context.destination);

            osc.start(now + note.time);
            osc.stop(now + note.time + note.dur + 0.1);
        });
    },

    // Sonido de derrota
    playDefeat() {
        if (!this.context || this.muted) return;

        const now = this.context.currentTime;

        // Tono triste descendente
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(150, now + 1);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1);

        osc.connect(gain);
        gain.connect(this.context.destination);

        osc.start(now);
        osc.stop(now + 1.2);
    },

    // ============================================
    // SISTEMA DE MÚSICA DE FONDO
    // ============================================

    // Reproducir música para una habitación
    playMusicForRoom(roomId) {
        if (!this.currentMusic) return;

        const trackPath = this.musicTracks[roomId] || this.musicTracks['theme'];

        // Si ya está reproduciendo la misma pista, no hacer nada
        if (this.currentTrackName === trackPath && !this.currentMusic.paused) {
            return;
        }

        // Fade out actual y cambiar
        this.crossfadeToTrack(trackPath);
    },

    // Crossfade entre pistas
    crossfadeToTrack(trackPath) {
        if (!this.currentMusic) return;

        const fadeOutDuration = 500; // ms
        const fadeInDuration = 1000; // ms

        // Si hay música reproduciéndose, hacer fade out
        if (!this.currentMusic.paused && this.currentTrackName) {
            const startVolume = this.currentMusic.volume;
            const fadeOutStep = startVolume / (fadeOutDuration / 50);

            const fadeOut = setInterval(() => {
                if (this.currentMusic.volume > fadeOutStep) {
                    this.currentMusic.volume -= fadeOutStep;
                } else {
                    clearInterval(fadeOut);
                    this.currentMusic.pause();
                    this.loadAndPlayTrack(trackPath, fadeInDuration);
                }
            }, 50);
        } else {
            this.loadAndPlayTrack(trackPath, fadeInDuration);
        }
    },

    // Cargar y reproducir pista con fade in
    loadAndPlayTrack(trackPath, fadeInDuration) {
        if (!this.currentMusic) return;

        this.currentTrackName = trackPath;
        this.currentMusic.src = trackPath;
        this.currentMusic.volume = 0;

        const playPromise = this.currentMusic.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Fade in
                if (!this.muted) {
                    const targetVolume = this.musicVolume;
                    const fadeInStep = targetVolume / (fadeInDuration / 50);

                    const fadeIn = setInterval(() => {
                        if (this.currentMusic.volume < targetVolume - fadeInStep) {
                            this.currentMusic.volume += fadeInStep;
                        } else {
                            this.currentMusic.volume = targetVolume;
                            clearInterval(fadeIn);
                        }
                    }, 50);
                }
            }).catch(error => {
                console.log('Auto-play bloqueado:', error);
            });
        }
    },

    // Detener música
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentTrackName = null;
        }
    },

    // Pausar música
    pauseMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
        }
    },

    // Reanudar música
    resumeMusic() {
        if (this.currentMusic && this.currentTrackName) {
            this.currentMusic.play().catch(e => console.log('No se pudo reanudar música'));
        }
    }
};
