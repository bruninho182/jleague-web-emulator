/* ============================================
   LOADER.JS - Gerencia o EmulatorJS
   ============================================ */

const EmulatorLoader = (() => {
    let isLoaded = false;
    let currentBlobUrl = null;
    let currentBiosUrl = null;

    /**
     * Tabela de traduções:
     * Converte rótulos do padrão Xbox/Nintendo (do EmulatorJS)
     * para o padrão PlayStation.
     */
    const LABEL_REPLACEMENTS = {
        // ===== BOTÕES DE AÇÃO =====
        'A:':  '○:',
        'B:':  '✕:',
        'X:':  '△:',
        'Y:':  '□:',
        'BUTTON_1': '✕', 
        'BUTTON_2': '○', 
        'BUTTON_3': '□', 
        'BUTTON_4': '△', 

        // ===== OMBROS (SHOULDERS) =====
        'ESQ:':    'L1:',
        'DIR:':    'R1:',
        'ESQ 2:':  'L2:',
        'DIR 2:':  'R2:',
        'ESQ 3:':  'L3:',
        'DIR 3:':  'R3:',
        'LEFT_TOP_SHOULDER':    'L1',
        'RIGHT_TOP_SHOULDER':   'R1',
        'LEFT_BOTTOM_SHOULDER': 'L2',
        'RIGHT_BOTTOM_SHOULDER':'R2',
        'LEFT_STICK':           'L3',
        'RIGHT_STICK':          'R3',

        // ===== DIREÇÃO (opcional, mas deixa mais limpo) =====
        'CIMA:':      '↑:',
        'BAIXO:':     '↓:',
        'ESQUERDA:':  '←:',
        'DIREITA:':   '→:',
        'DIRECIONAL - CIMA':     'D-PAD ↑',
        'DIRECIONAL - BAIXO':    'D-PAD ↓',
        'DIRECIONAL - ESQUERDA': 'D-PAD ←',
        'DIRECIONAL - DIREITA':  'D-PAD →',
    };

    /**
     * Substitui os rótulos dos botões na tela de configuração
     * de controles do EmulatorJS, trocando os nomes de Xbox
     * (A, B, X, Y) e genéricos (LEFT_TOP_SHOULDER, etc.) pelos
     * símbolos e nomes do PlayStation.
     */
    function translateControlLabels() {
        // Elementos folha (sem filhos) — onde o texto "puro" fica
        document.querySelectorAll('label, td, th, span, div, p').forEach((el) => {
            if (el.children.length > 0) return;

            const text = el.textContent.trim();
            if (LABEL_REPLACEMENTS[text]) {
                el.textContent = LABEL_REPLACEMENTS[text];
            }
        });

        // Também trata <option> de selects, caso existam
        document.querySelectorAll('option').forEach((opt) => {
            const text = opt.textContent.trim();
            if (LABEL_REPLACEMENTS[text]) {
                opt.textContent = LABEL_REPLACEMENTS[text];
            }
        });
    }

    /**
     * Observa mutações no DOM para reaplicar a tradução sempre
     * que a tela de configuração de controles for (re)renderizada.
     */
    function watchControlPanel() {
        const observer = new MutationObserver(() => {
            translateControlLabels();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Aplica imediatamente também
        translateControlLabels();
    }

    /**
     * Inicializa o EmulatorJS com uma ROM fornecida pelo usuário.
     * @param {File} romFile - Arquivo da ROM (.bin, .cue, .iso, .zip)
     * @param {File|null} biosFile - Arquivo da BIOS (opcional)
     */
    function startEmulator(romFile, biosFile = null) {
    if (!romFile) {
        console.error('[EmulatorLoader] Nenhuma ROM fornecida.');
        return false;
    }

    if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
    if (currentBiosUrl) URL.revokeObjectURL(currentBiosUrl);

    currentBlobUrl = URL.createObjectURL(romFile);

    // ===== GAMEPAD VIRTUAL COM BOTÕES DE PLAYSTATION =====
    window.EJS_VirtualGamepadSettings = [
        // Triângulo (topo)
        { type: 'button', text: '△', id: 'y', location: 'right', left: 40, bold: true, input_value: 3 },
        // Quadrado (esquerda)
        { type: 'button', text: '□', id: 'x', location: 'right', top: 40, bold: true, input_value: 2 },
        // Círculo (direita)
        { type: 'button', text: '○', id: 'b', location: 'right', left: 81, top: 40, bold: true, input_value: 1 },
        // X / Cruz (baixo)
        { type: 'button', text: '✕', id: 'a', location: 'right', left: 40, top: 80, bold: true, input_value: 0 },
        // D-Pad
        { type: 'dpad', location: 'left', left: '50%', top: '50%', joystickInput: false, inputValues: [4, 5, 6, 7] },
        // L1 / L2
        { type: 'button', text: 'L1', id: 'l1', location: 'left', left: 20, top: 0, bold: true, input_value: 10 },
        { type: 'button', text: 'L2', id: 'l2', location: 'left', left: 40, top: 0, bold: true, input_value: 11 },
        // R1 / R2
        { type: 'button', text: 'R1', id: 'r1', location: 'right', left: 20, top: 0, bold: true, input_value: 8 },
        { type: 'button', text: 'R2', id: 'r2', location: 'right', left: 0, top: 0, bold: true, input_value: 9 },
        // Start / Select
        { type: 'button', text: 'START', id: 'start', location: 'center', left: 60, fontSize: 15, block: true, input_value: 5 },
        { type: 'button', text: 'SELECT', id: 'select', location: 'center', left: -5, fontSize: 15, block: true, input_value: 4 },
    ];

    // ===== CONFIGURAÇÃO DO EMULATORJS =====
    window.EJS_player = '#emulator-container';
    window.EJS_core = APP_CONFIG.emulator.core;
    window.EJS_gameUrl = currentBlobUrl;
    window.EJS_gameName = APP_CONFIG.emulator.gameName;
    window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';
    window.EJS_backgroundColor = APP_CONFIG.emulator.backgroundColor;
    window.EJS_startOnLoaded = true;
    window.EJS_volume = APP_CONFIG.emulator.volume;
    window.EJS_defaultOptions = {
        'save-state-location': 'browser',
    };

    if (biosFile) {
        currentBiosUrl = URL.createObjectURL(biosFile);
        window.EJS_biosUrl = currentBiosUrl;
    }

    const container = document.querySelector('#emulator-container');
    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
    script.onload = () => {
        isLoaded = true;
        console.log('[EmulatorLoader] EmulatorJS carregado com sucesso.');
        watchControlPanel();
    };
    script.onerror = () => {
        console.error('[EmulatorLoader] Falha ao carregar EmulatorJS.');
        container.innerHTML =
            '<div class="emulator-placeholder">' +
            '❌ Erro ao carregar o emulador. Verifique sua conexão.' +
            '</div>';
    };
    document.body.appendChild(script);

    return true;
}

    function reset() {
        if (typeof window.EJS_emulator !== 'undefined' && window.EJS_emulator) {
            window.EJS_emulator.restart();
        }
    }

    function toggleFullscreen() {
        const el = document.querySelector('#emulator-container');
        if (!document.fullscreenElement) {
            el.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    }

    return {
        startEmulator,
        reset,
        toggleFullscreen,
        translateControlLabels,
        isLoaded: () => isLoaded,
    };
})();