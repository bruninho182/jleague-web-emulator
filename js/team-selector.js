/* ============================================
   TEAM-SELECTOR.JS
   Menu de seleção de times J1/J2 com grade de escudos,
   barras de estatísticas, ficha do time e mapa do Japão
   + Cor do time como identidade visual
   ============================================ */

const TeamSelector = (() => {
    let currentDivision = 'j1';
    let selectedTeam = null;

    /* ============================================
       COORDENADAS DAS CIDADES NO MAPA DO JAPÃO
       (porcentagem % da imagem)
       ============================================ */
    const MAP_COORDS = {
        'Sapporo':    { x: 78, y: 15 },
        'Sendai':     { x: 72, y: 33 },
        'Yamagata':   { x: 70, y: 35 },
        'Niigata':    { x: 68, y: 38 },
        'Mito':       { x: 74, y: 45 },
        'Kashima':    { x: 76, y: 47 },
        'Kashiwa':    { x: 72, y: 47 },
        'Saitama':    { x: 70, y: 47 },
        'Tokyo':      { x: 72, y: 49 },
        'Kawasaki':   { x: 71, y: 50 },
        'Yokohama':   { x: 69, y: 51 },
        'Ichihara':   { x: 74, y: 49 },
        'Hiratsuka':  { x: 67, y: 52 },
        'Kofu':       { x: 66, y: 48 },
        'Shizuoka':   { x: 64, y: 54 },
        'Iwata':      { x: 62, y: 55 },
        'Nagoya':     { x: 57, y: 55 },
        'Kyoto':      { x: 49, y: 58 },
        'Osaka':      { x: 47, y: 60 },
        'Kobe':       { x: 45, y: 61 },
        'Hiroshima':  { x: 33, y: 64 },
        'Tokushima':  { x: 45, y: 69 },
        'Fukuoka':    { x: 22, y: 72 },
        'Tosu':       { x: 24, y: 74 },
        'Oita':       { x: 30, y: 76 },
    };

    /* ============================================
       HELPERS
       ============================================ */

    /**
     * Converte HEX para RGBA (para glows com transparência).
     */
    function hexToRgba(hex, alpha = 1) {
        if (!hex) return `rgba(245, 158, 11, ${alpha})`;
        hex = hex.replace('#', '');
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    /**
     * Aplica a cor do time como CSS variables no container.
     */
    function applyTeamColors(team) {
        const root = document.querySelector('.team-selector');
        if (!root) return;

        root.style.setProperty('--team-color', team.color);
        root.style.setProperty('--team-color2', team.color2 || '#ffffff');
        root.style.setProperty('--team-glow', hexToRgba(team.color, 0.55));
        root.style.setProperty('--team-glow-soft', hexToRgba(team.color, 0.18));
        root.style.setProperty('--team-glow-strong', hexToRgba(team.color, 0.85));
    }

    function fallbackShield(team, size = 60) {
        const initials = team.name.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase();
        return `
            <svg viewBox="0 0 100 120" width="${size}" height="${size * 1.2}"
                 xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="fg-${initials}-${size}" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="${team.color}" />
                        <stop offset="100%" stop-color="${team.color2 || '#000'}" />
                    </linearGradient>
                </defs>
                <path d="M50 5 L95 20 L95 65 Q95 100 50 115 Q5 100 5 65 L5 20 Z"
                      fill="url(#fg-${initials}-${size})" stroke="#000" stroke-width="3"/>
                <text x="50" y="68" text-anchor="middle"
                      font-family="Press Start 2P, monospace" font-size="18"
                      fill="#fff" stroke="#000" stroke-width="0.8">${initials}</text>
            </svg>
        `;
    }

    function renderShield(team, size = 60) {
        return `
            <img src="${team.shield}" alt="${team.name}"
                 width="${size}" height="${size * 1.2}" loading="lazy"
                 style="object-fit: contain; display: block; margin: 0 auto;"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <span style="display: none;">${fallbackShield(team, size)}</span>
        `;
    }

    function renderStats(team) {
        const rows = [
            { label: 'OFFENSE',   value: team.stats.offense,   color: 'red'    },
            { label: 'DEFENSE',   value: team.stats.defense,   color: 'red'    },
            { label: 'POWER',     value: team.stats.power,     color: 'yellow' },
            { label: 'SPEED',     value: team.stats.speed,     color: 'yellow' },
            { label: 'TECHNIQUE', value: team.stats.technique, color: 'yellow' },
        ];
        return rows.map(row => `
            <div class="stat-bar-row">
                <span class="stat-bar-label">${row.label}</span>
                <div class="stat-bar-track">
                    <div class="stat-bar-fill stat-bar-${row.color}"
                         style="width: ${row.value * 10}%;"></div>
                    <span class="stat-bar-value">${row.value}</span>
                </div>
            </div>
        `).join('');
    }

    /**
     * Renderiza a ficha completa do time.
     */
    function renderTeamInfo(team) {
        return `
            <div class="team-info-card">
                <div class="team-info-header">
                    <span class="team-info-title">📋 FICHA DO TIME</span>
                </div>
                <div class="team-info-body">
                    <div class="team-info-row">
                        <span class="info-icon">🏟️</span>
                        <span class="info-label">ESTÁDIO</span>
                        <span class="info-value">${team.stadium}</span>
                    </div>
                    <div class="team-info-row">
                        <span class="info-icon">📅</span>
                        <span class="info-label">FUNDAÇÃO</span>
                        <span class="info-value">${team.founded}</span>
                    </div>
                    <div class="team-info-row">
                        <span class="info-icon">🏆</span>
                        <span class="info-label">TÍTULOS</span>
                        <span class="info-value">${team.titles} ${team.titles === 1 ? 'título' : 'títulos'}</span>
                    </div>
                    <div class="team-info-row">
                        <span class="info-icon">⭐</span>
                        <span class="info-label">ESTRELA</span>
                        <span class="info-value">${team.star}</span>
                    </div>
                    <div class="team-info-fact">
                        <span class="fact-icon">💡</span>
                        <p class="fact-text">${team.fact}</p>
                    </div>
                </div>
            </div>
        `;
    }

    /* ============================================
       RENDERIZAÇÃO DO MAPA
       ============================================ */
    function renderMap() {
        const container = document.querySelector('#japan-map');
        if (!container) return;

        if (!container.dataset.initialized) {
            container.innerHTML = `
                <div class="japan-map-inner">
                    <img src="assets/images/japan-map.png"
                         alt="Mapa do Japão"
                         class="japan-map-img"
                         draggable="false">
                    <div class="map-pins-overlay" id="map-pins-overlay"></div>
                </div>
            `;
            container.dataset.initialized = 'true';
        }

        const overlay = container.querySelector('#map-pins-overlay');
        if (!overlay) return;

        const allTeams = [
            ...APP_CONFIG.teams.j1.map(t => ({ ...t, division: 'j1' })),
            ...APP_CONFIG.teams.j2.map(t => ({ ...t, division: 'j2' })),
        ];

        overlay.innerHTML = allTeams.map(t => {
            const coords = MAP_COORDS[t.city];
            if (!coords) return '';

            const isSelected = selectedTeam?.name === t.name;
            const isCurrentDivision = t.division === currentDivision;

            return `
                <button class="map-pin ${isSelected ? 'selected' : ''} ${!isCurrentDivision ? 'dimmed' : ''}"
                        data-team="${t.name}"
                        data-division="${t.division}"
                        data-city="${t.city}"
                        style="left: ${coords.x}%; top: ${coords.y}%;"
                        title="${t.name} (${t.city})">
                    <span class="pin-dot"></span>
                    <span class="pin-label">${t.city}</span>
                </button>
            `;
        }).join('');

        overlay.querySelectorAll('.map-pin').forEach(pin => {
            pin.addEventListener('mouseenter', () => RetroAudio.play('hover'));
            pin.addEventListener('click', () => {
                const teamName = pin.dataset.team;
                const division = pin.dataset.division;
                const teams = APP_CONFIG.teams[division];
                const idx = teams.findIndex(t => t.name === teamName);
                if (idx < 0) return;

                if (division !== currentDivision) {
                    currentDivision = division;
                    document.querySelectorAll('.division-tab').forEach(tab => {
                        tab.classList.toggle('active', tab.dataset.division === division);
                    });
                    const label = document.querySelector('#division-label');
                    if (label) label.textContent = division === 'j1' ? 'J1 LEAGUE' : 'J2 LEAGUE';
                    renderShieldGrid(division);
                }
                selectTeam(division, idx);
            });
        });
    }

    /* ============================================
       RENDERIZAÇÃO DA GRADE DE ESCUDOS
       ============================================ */
    function renderShieldGrid(division) {
        const grid = document.querySelector('#team-shield-grid');
        if (!grid) return;

        const teams = APP_CONFIG.teams[division];

        grid.innerHTML = teams.map((team, idx) => `
            <button class="shield-btn ${selectedTeam?.name === team.name ? 'selected' : ''}"
                    data-division="${division}"
                    data-index="${idx}"
                    title="${team.name}">
                ${renderShield(team, 42)}
            </button>
        `).join('');

        grid.querySelectorAll('.shield-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => RetroAudio.play('hover'));
            btn.addEventListener('click', () => {
                const div = btn.dataset.division;
                const i = parseInt(btn.dataset.index, 10);
                selectTeam(div, i);
            });
        });
    }

    /* ============================================
       SELEÇÃO DE TIME
       ============================================ */
    function selectTeam(division, index) {
        const team = APP_CONFIG.teams[division][index];
        selectedTeam = team;

        // Aplica as cores do time como CSS variables
        applyTeamColors(team);

        const shieldEl = document.querySelector('#ts-shield');
        const nameEl = document.querySelector('#ts-name');
        const cityEl = document.querySelector('#ts-city');
        const statsEl = document.querySelector('#ts-stats');
        const infoEl = document.querySelector('#ts-info-card');

        if (shieldEl) shieldEl.innerHTML = renderShield(team, 90);
        if (nameEl) nameEl.textContent = team.name;
        if (cityEl) cityEl.textContent = `📍 ${team.city}`;
        if (statsEl) statsEl.innerHTML = renderStats(team);
        if (infoEl) infoEl.innerHTML = renderTeamInfo(team);

        document.querySelectorAll('.shield-btn').forEach(b => b.classList.remove('selected'));
        document.querySelectorAll(`.shield-btn[data-division="${division}"][data-index="${index}"]`)
            .forEach(b => b.classList.add('selected'));

        document.querySelectorAll('.map-pin').forEach(pin => {
            const isSelected = pin.dataset.team === team.name;
            const isCurrentDiv = pin.dataset.division === currentDivision;
            pin.classList.toggle('selected', isSelected);
            pin.classList.toggle('dimmed', !isCurrentDiv);
        });

        RetroAudio.play('select');
    }

    /* ============================================
       TROCA DE DIVISÃO
       ============================================ */
    function switchDivision(division) {
        currentDivision = division;

        document.querySelectorAll('.division-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.division === division);
        });

        const label = document.querySelector('#division-label');
        if (label) {
            label.textContent = division === 'j1' ? 'J1 LEAGUE' : 'J2 LEAGUE';
        }

        renderShieldGrid(division);
        renderMap();
        selectTeam(division, 0);

        RetroAudio.play('click');
    }

    /* ============================================
       FERRAMENTA DE CALIBRAÇÃO (DEV)
       ============================================ */
    function enableCalibrationMode() {
        const mapInner = document.querySelector('.japan-map-inner');
        if (!mapInner) return;

        mapInner.addEventListener('click', (e) => {
            if (!e.ctrlKey) return;
            e.preventDefault();

            const rect = mapInner.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
            const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);

            console.log(
                `%c📍 Coordenada: { x: ${x}, y: ${y} }`,
                'background: #fbbf24; color: #000; padding: 4px 8px; font-weight: bold; border-radius: 3px; font-size: 14px;'
            );

            const marker = document.createElement('div');
            marker.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: ${y}%;
                width: 14px;
                height: 14px;
                background: #22c55e;
                border: 2px solid #fff;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                z-index: 100;
                pointer-events: none;
                box-shadow: 0 0 12px #22c55e, 0 0 4px #fff;
            `;
            mapInner.appendChild(marker);

            setTimeout(() => marker.remove(), 3000);
        });

        console.log(
            '%c🛠️ MODO CALIBRAÇÃO ATIVO',
            'background: #22c55e; color: #000; padding: 6px 12px; font-weight: bold; font-size: 14px; border-radius: 4px;'
        );
        console.log(
            '%c→ Segure Ctrl e clique em qualquer lugar do mapa para obter a coordenada exata em %.',
            'color: #22c55e; font-size: 12px;'
        );
    }

    /* ============================================
       INICIALIZAÇÃO
       ============================================ */
    function init() {
        document.querySelectorAll('.division-tab').forEach(tab => {
            tab.addEventListener('click', () => switchDivision(tab.dataset.division));
            tab.addEventListener('mouseenter', () => RetroAudio.play('hover'));
        });

        switchDivision('j1');
        enableCalibrationMode();
    }

    return {
        init,
        switchDivision,
        selectTeam,
        renderMap,
        enableCalibrationMode,
    };
})();