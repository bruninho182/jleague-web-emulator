/* ============================================
   MAIN.JS - Ponto de entrada da aplicação
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initStatusBar();
    initSoundEffects();
    initTeamsGrid();
    initEmulatorControls();
    initChat();
    initNavigation();
    initScrollAnimations();
    initBackToTop();
});

/* ============ STATUS BAR (relógio + visitantes) ============ */
function initStatusBar() {
    const clockEl = document.querySelector('#clock');
    const visitorEl = document.querySelector('#visitor-count');

    function updateClock() {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        if (clockEl) clockEl.textContent = `${hh}:${mm}:${ss}`;
    }
    updateClock();
    setInterval(updateClock, 1000);

    if (visitorEl) {
        const stored = parseInt(localStorage.getItem('visitorCount') || '0', 10);
        const count = Math.min(stored + 1, 999);
        localStorage.setItem('visitorCount', count);
        visitorEl.textContent = String(count).padStart(3, '0');
    }
}

/* ============ SOUND EFFECTS ============ */
function initSoundEffects() {
    document.querySelectorAll('[data-sound]').forEach(el => {
        el.addEventListener('mouseenter', () => RetroAudio.play('hover'));
        el.addEventListener('click', () => RetroAudio.play('click'));
    });
}

/* ============ GRID DE TIMES ============ */
function initTeamsGrid() {
    TeamSelector.init();
}

/* ============ CONTROLES DO EMULADOR ============ */
function initEmulatorControls() {
    const romInput = document.querySelector('#rom-upload');
    const biosInput = document.querySelector('#bios-upload');
    const btnFullscreen = document.querySelector('#btn-fullscreen');
    const btnSave = document.querySelector('#btn-save');
    const btnLoad = document.querySelector('#btn-load');
    const btnReset = document.querySelector('#btn-reset');

    let selectedBios = null;

    romInput?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size < 1024 * 100) {
            alert('⚠️ O arquivo parece ser muito pequeno para ser uma ROM de PS1.');
            return;
        }

        RetroAudio.play('select');
        EmulatorLoader.startEmulator(file, selectedBios);
    });

    biosInput?.addEventListener('change', (e) => {
        selectedBios = e.target.files?.[0] || null;
        if (selectedBios) RetroAudio.play('select');
    });

    btnFullscreen?.addEventListener('click', () => EmulatorLoader.toggleFullscreen());

    btnReset?.addEventListener('click', () => {
        if (confirm('Deseja reiniciar o jogo? Todo progresso não salvo será perdido.')) {
            EmulatorLoader.reset();
        }
    });

    btnSave?.addEventListener('click', () => {
        alert('💾 Use o menu interno do emulador (tecla ESC) para salvar/carregar estados.');
    });

    btnLoad?.addEventListener('click', () => {
        alert('📂 Use o menu interno do emulador (tecla ESC) para carregar estados.');
    });
}

/* ============ CHAT ============ */
function initChat() {
    const form = document.querySelector('#chat-form');
    const input = document.querySelector('#chat-input');
    const messages = document.querySelector('#chat-messages');

    if (!form || !input || !messages) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const text = input.value.trim();
        if (!text) return;

        const safeText = text.replace(/[<>&"]/g, (char) => ({
            '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;',
        }[char]));

        const msg = document.createElement('div');
        msg.className = 'chat-msg';
        msg.innerHTML = `<span class="user">Você:</span> ${safeText}`;
        messages.appendChild(msg);

        while (messages.children.length > APP_CONFIG.chat.maxMessages) {
            messages.removeChild(messages.firstChild);
        }

        messages.scrollTop = messages.scrollHeight;
        input.value = '';
        input.focus();
        RetroAudio.play('click');
    });
}

/* ============ NAVEGAÇÃO SUAVE ============ */
function initNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ============ ANIMAÇÕES NO SCROLL ============ */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

/* ============ BOTÃO VOLTAR AO TOPO ============ */
function initBackToTop() {
    const btn = document.querySelector('#back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}