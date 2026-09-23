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
    initBackToTop();
    initDevModal();
    PlayersEncyclopedia.init();
    IngameFiches.init(); 
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

/* ============ NAVEGAÇÃO POR ABAS (SPA) ============ */
function initNavigation() {
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    const allSections = document.querySelectorAll('.section-page');

    /**
     * Ativa uma seção pelo ID (hash).
     * @param {string} hash - Ex: "emulador", "times", "jogadores"
     * @param {boolean} updateHistory - Se deve atualizar a URL
     */
    function activateSection(hash, updateHistory = true) {
        // Remove o "#" se tiver
        const sectionId = hash.replace('#', '');
        const targetSection = document.querySelector(`.section-page[data-section="${sectionId}"]`);

        // Se não achou a seção, ativa a primeira (emulador) por padrão
        if (!targetSection) {
            if (sectionId === '' || sectionId === 'top') {
                activateSection('emulador', false);
                return;
            }
            console.warn(`[Navigation] Seção "${sectionId}" não encontrada.`);
            return;
        }

        // Remove 'active' de todas as seções
        allSections.forEach(section => {
            section.classList.remove('active');
        });

        // Adiciona 'active' à seção alvo
        targetSection.classList.add('active');

        // Atualiza os links do menu
        navLinks.forEach(link => {
            const linkHash = link.getAttribute('href').replace('#', '');
            link.classList.toggle('active', linkHash === sectionId);
        });

        // Força as animações .fade-in a ficarem visíveis
        targetSection.querySelectorAll('.fade-in').forEach(el => {
            el.classList.add('visible');
        });

        // Scroll para o topo da página
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Atualiza a URL (deep linking)
        if (updateHistory) {
            history.pushState(null, '', `#${sectionId}`);
        }

        // Toca som
        RetroAudio.play('click');
    }

    // Expõe para uso global
    window.activateSection = activateSection;

    // Listener nos links do menu
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const hash = link.getAttribute('href');
            activateSection(hash);
        });
    });

    // Listener nos outros links com "#" (footer, botões, etc)
    document.querySelectorAll('a[href^="#"]:not(.main-nav a)').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('href');

            // Se for link para uma seção-page, ativa ela
            const sectionId = target.replace('#', '');
            const sectionExists = document.querySelector(`.section-page[data-section="${sectionId}"]`);

            if (sectionExists) {
                e.preventDefault();
                activateSection(target);
            }
            // Senão, faz scroll normal (ex: link para "top")
            else if (target === '#top') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // Listener no histórico (botões voltar/avançar do navegador)
    window.addEventListener('popstate', () => {
        const hash = window.location.hash || '#emulador';
        activateSection(hash, false);
    });

    // Ativa a seção baseada na URL ao carregar a página
    const initialHash = window.location.hash || '#emulador';
    activateSection(initialHash, false);
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

/* ============ MODAL DO DEV ============ */
function initDevModal() {
    const openBtn = document.querySelector('#open-dev-modal');
    const closeBtn = document.querySelector('#dev-modal-close');
    const modal = document.querySelector('#dev-modal');

    if (!openBtn || !modal) return;

    function openModal() {
        modal.classList.add('active');
        RetroAudio.play('select');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        RetroAudio.play('close');
        document.body.style.overflow = '';
    }

    openBtn.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', closeModal);

    // Fecha ao clicar fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Fecha com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/* ============ PWA - Botão Instalar ============ */
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    // Impede o banner automático do Chrome
    e.preventDefault();
    deferredPrompt = e;

    // Mostra o botão "Instalar" no header
    const installBtn = document.querySelector('#pwa-install-btn');
    if (installBtn) {
        installBtn.style.display = 'inline-flex';
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;

            RetroAudio.play('select');
            deferredPrompt.prompt();

            const { outcome } = await deferredPrompt.userChoice;
            console.log(`[PWA] Escolha do usuário: ${outcome}`);

            deferredPrompt = null;
            installBtn.style.display = 'none';
        });
    }
});

// Se o app já foi instalado, esconde o botão
window.addEventListener('appinstalled', () => {
    console.log('[PWA] App instalado com sucesso!');
    const installBtn = document.querySelector('#pwa-install-btn');
    if (installBtn) installBtn.style.display = 'none';
    deferredPrompt = null;
});