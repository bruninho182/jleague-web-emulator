/* ============================================
   INGAME-FICHES.JS
   Fichas técnicas dos jogadores estilo WE2000
   ============================================ */

const IngameFiches = (() => {
    let allPlayers = [];
    let filteredPlayers = [];
    let currentSearch = '';

    /* Mapeamento dos nomes dos atributos */
    const STAT_LABELS = {
        'OFF': 'OFF',
        'DEFENSE': 'DEFENSE',
        'BODY_B': 'BODY B.',
        'STAM': 'STAM',
        'SPEED': 'SPEED',
        'ACCEL': 'ACCEL.',
        'PAS': 'PAS',
        'S_POW': 'S. POW',
        'S_ACCUR': 'S. ACCUR.',
        'JUMP': 'JUMP',
        'HEAD_A': 'HEAD A.',
        'TECH': 'TECH.',
        'DRIBBL': 'DRIBBL',
        'CURV': 'CURV',
        'AGGR': 'AGGR.',
        'RESP': 'RESP.'
    };

    const COUNTRY_CODES = {
        'JPN': 'jp', 'BRA': 'br', 'KOR': 'kr',
        'YUG': 'rs', 'OTH.': 'un', 'UN': 'un'
    };

    /**
     * Retorna o HTML da bandeira pelo código de 3 letras.
     */
    function getFlag(countryCode) {
        const code = COUNTRY_CODES[countryCode] || 'un';
        return `<span class="fi fi-${code} player-flag"></span>`;
    }

    /**
     * Cor da barra baseada no valor (1-20).
     */
    function getStatColor(value) {
        if (value >= 18) return 'stat-elite';   // dourado
        if (value >= 15) return 'stat-great';   // verde
        if (value >= 12) return 'stat-good';    // azul
        if (value >= 9)  return 'stat-avg';     // laranja
        return 'stat-low';                       // vermelho
    }

    /**
     * Carrega os jogadores do JSON.
     */
    async function loadPlayers() {
        try {
            const response = await fetch('data/ingame-players.json');
            const data = await response.json();
            allPlayers = data.players;
            filteredPlayers = [...allPlayers];
            return true;
        } catch (error) {
            console.error('[IngameFiches] Erro ao carregar:', error);
            return false;
        }
    }

    /**
     * Renderiza os cards dos jogadores.
     */
    function renderCards() {
        const grid = document.querySelector('#ingame-grid');
        if (!grid) return;

        if (filteredPlayers.length === 0) {
            grid.innerHTML = `
                <div class="players-empty">
                    <span class="empty-icon">🔍</span>
                    <p>Nenhum jogador encontrado.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filteredPlayers.map(player => `
            <div class="ingame-card" data-id="${player.id}"
                 style="--player-color: ${player.teamColor};">
                <div class="ingame-card-header">
                    <span class="ingame-number">${player.number}</span>
                    <span class="ingame-position">${player.position}</span>
                </div>
                <div class="ingame-photo-wrap">
                    <img src="${player.photo}"
                         alt="${player.name}"
                         class="ingame-photo"
                         loading="lazy"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="ingame-photo-fallback" style="display: none;">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="ingame-shield-wrap">
                        <img src="${player.shield}"
                             alt="${player.team}"
                             class="ingame-shield"
                             onerror="this.style.display='none';">
                    </div>
                </div>
                <div class="ingame-info">
                    <h3 class="ingame-name">${player.name}</h3>
                    <p class="ingame-team">${player.team}</p>
                    <div class="ingame-quick-stats">
                        <span>${getFlag(player.info.nat)} ${player.info.nat}</span>
                        <span>•</span>
                        <span>${player.info.age} anos</span>
                        <span>•</span>
                        <span>${player.info.foot}</span>
                    </div>
                </div>
                <div class="ingame-card-footer">
                    <button class="ingame-details-btn" data-sound="click">
                        <i class="fas fa-chart-bar"></i> Ver Ficha Completa
                    </button>
                </div>
            </div>
        `).join('');

        // Eventos
        grid.querySelectorAll('.ingame-card').forEach(card => {
            card.addEventListener('mouseenter', () => RetroAudio.play('hover'));
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                const player = allPlayers.find(p => p.id === id);
                if (player) openFiche(player);
            });
        });

        grid.querySelectorAll('.ingame-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.closest('.ingame-card').dataset.id;
                const player = allPlayers.find(p => p.id === id);
                if (player) openFiche(player);
            });
        });
    }

    /**
     * Abre a ficha completa estilo WE2000.
     */
    function openFiche(player) {
        const modal = document.querySelector('#ingame-modal');
        if (!modal) return;

        const content = modal.querySelector('.ingame-modal-content');
        content.style.setProperty('--player-color', player.teamColor);

        // Foto
        modal.querySelector('#if-photo').innerHTML = `
            <img src="${player.photo}"
                 alt="${player.name}"
                 class="if-photo-img"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="if-photo-fallback" style="display: none;">
                <i class="fas fa-user"></i>
            </div>
        `;

        // Info lateral
        modal.querySelector('#if-info').innerHTML = `
            <div class="if-info-row">
                <span class="if-info-label">NAT.</span>
                <span class="if-info-value">${getFlag(player.info.nat)} ${player.info.nat}</span>
            </div>
            <div class="if-info-row">
                <span class="if-info-label">HEIG</span>
                <span class="if-info-value">${player.info.height}</span>
            </div>
            <div class="if-info-row">
                <span class="if-info-label">AGE</span>
                <span class="if-info-value">${player.info.age}</span>
            </div>
            <div class="if-info-row">
                <span class="if-info-label">OUTSIDE</span>
                <span class="if-info-value">${player.info.outside}</span>
            </div>
            <div class="if-info-row">
                <span class="if-info-label">FOOT</span>
                <span class="if-info-value">${player.info.foot}</span>
            </div>
        `;

        // Stats
        const statsEl = modal.querySelector('#if-stats');
        statsEl.innerHTML = Object.entries(player.stats).map(([key, value]) => `
            <div class="if-stat-row">
                <span class="if-stat-label">${STAT_LABELS[key]}</span>
                <span class="if-stat-value">${value}</span>
                <div class="if-stat-bar">
                    <div class="if-stat-bar-fill ${getStatColor(value)}"
                         style="width: ${(value / 20) * 100}%;"></div>
                </div>
            </div>
        `).join('');

        // Header
        modal.querySelector('#if-name').textContent = player.name;
        modal.querySelector('#if-team').textContent = player.team;

        // Escudo
        modal.querySelector('#if-shield').innerHTML = `
            <img src="${player.shield}"
                 alt="${player.team}"
                 onerror="this.style.display='none';">
        `;

        modal.classList.add('active');
        RetroAudio.play('select');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Fecha o modal.
     */
    function closeModal() {
        const modal = document.querySelector('#ingame-modal');
        if (!modal) return;
        modal.classList.remove('active');
        RetroAudio.play('close');
        document.body.style.overflow = '';
    }

    /**
     * Filtra jogadores.
     */
    function filterPlayers(searchTerm) {
        currentSearch = searchTerm.toLowerCase().trim();

        if (!currentSearch) {
            filteredPlayers = [...allPlayers];
        } else {
            filteredPlayers = allPlayers.filter(p =>
                p.name.toLowerCase().includes(currentSearch) ||
                p.team.toLowerCase().includes(currentSearch) ||
                p.position.toLowerCase().includes(currentSearch)
            );
        }

        renderCards();
    }

    /**
     * Inicializa.
     */
    async function init() {
        const loaded = await loadPlayers();
        if (!loaded) return;

        renderCards();

        const closeBtn = document.querySelector('#if-close');
        const modal = document.querySelector('#ingame-modal');

        closeBtn?.addEventListener('click', closeModal);
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal?.classList.contains('active')) {
                closeModal();
            }
        });

        const searchInput = document.querySelector('#ingame-search');
        searchInput?.addEventListener('input', (e) => {
            filterPlayers(e.target.value);
        });
    }

    return { init, closeModal };
})();