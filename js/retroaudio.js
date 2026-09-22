/* ============================================
   AUDIO.JS - Efeitos sonoros via Web Audio API
   (sem arquivos externos, gerados dinamicamente)
   ============================================ */

const RetroAudio = (() => {
    let ctx = null;
    let enabled = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG?.audio?.enabled) ?? true;
    const masterVolume = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG?.audio?.volume) ?? 0.15;

    /**
     * Inicializa o AudioContext (precisa de gesto do usuário).
     */
    function init() {
        if (ctx) return;
        try {
            const AC = window.AudioContext || window.webkitAudioContext;
            ctx = new AC();
        } catch (e) {
            console.warn('[RetroAudio] Web Audio API não suportada.');
            enabled = false;
        }
    }

    /**
     * Toca um tom simples.
     * @param {number} freq - Frequência em Hz
     * @param {number} duration - Duração em segundos
     * @param {string} type - Tipo de onda ('square', 'sine', 'triangle', 'sawtooth')
     * @param {number} volume - Volume relativo (0..1)
     */
    function tone(freq, duration = 0.1, type = 'square', volume = 1) {
        if (!enabled) return;
        init();
        if (!ctx) return;

        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(masterVolume * volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    }

    /* ===== Sons pré-definidos ===== */
    const sounds = {
        hover: () => tone(880, 0.04, 'square', 0.5),
        click: () => {
            tone(660, 0.05, 'square', 0.8);
            setTimeout(() => tone(990, 0.08, 'square', 0.8), 50);
        },
        select: () => {
            tone(440, 0.06, 'triangle', 0.9);
            setTimeout(() => tone(660, 0.06, 'triangle', 0.9), 60);
            setTimeout(() => tone(880, 0.12, 'triangle', 0.9), 120);
        },
        back: () => {
            tone(660, 0.06, 'square', 0.7);
            setTimeout(() => tone(440, 0.1, 'square', 0.7), 60);
        },
        boot: () => {
            const notes = [523.25, 659.25, 783.99, 1046.5];
            notes.forEach((f, i) => {
                setTimeout(() => tone(f, 0.6, 'sine', 0.7), i * 180);
            });
            setTimeout(() => tone(130.81, 1.2, 'triangle', 0.4), 200);
        },
        open: () => tone(1046.5, 0.08, 'sine', 0.7),
        close: () => tone(523.25, 0.1, 'sine', 0.6),
    };

    return {
        play: (name) => {
            if (sounds[name]) sounds[name]();
        },
        setEnabled: (v) => { enabled = v; },
        isEnabled: () => enabled,
    };
})();