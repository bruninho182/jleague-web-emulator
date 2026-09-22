/* ============================================
   PLAYERS-ENCYCLOPEDIA.JS
   Enciclopédia de Jogadores - J.League WE 2000
   Com bandeiras dos países (flag-icons)
   ============================================ */

const PlayersEncyclopedia = (() => {
    let allPlayers = [];
    let filteredPlayers = [];
    let currentFilter = 'all';
    let currentSearch = '';

    /* ============================================
       MAPEAMENTO DE NACIONALIDADE → CÓDIGO DO PAÍS
       (para as bandeiras do flag-icons)
       ============================================ */
    const COUNTRY_CODES = {
        'Japão': 'jp',
        'Brasil': 'br',
        'Coreia do Sul': 'kr',
        'Sérvia': 'rs',
        'Japão/Brasil': 'jp',
        'Argentina': 'ar',
        'Paraguai': 'py',
        'Uruguai': 'uy',
        'Croácia': 'hr',
        'Portugal': 'pt',
        'Espanha': 'es',
        'Itália': 'it',
        'Alemanha': 'de',
        'Holanda': 'nl',
        'Inglaterra': 'gb-eng',
        'Nigéria': 'ng',
        'Camarões': 'cm',
        'Gana': 'gh',
        'Austrália': 'au',
        'China': 'cn',
    };

    /**
     * Retorna o HTML da bandeira do país.
     */
    function getFlag(country) {
        const code = COUNTRY_CODES[country] || 'un';
        return `<span class="fi fi-${code} player-flag"></span>`;
    }

    /**
     * Carrega os jogadores do arquivo JSON.
     */
    async function loadPlayers() {
        try {
            const response = await fetch('data/players.json');
            const data = await response.json();
            allPlayers = data.players;
            filteredPlayers = [...allPlayers];
            return true;
        } catch (error) {
            console.error('[PlayersEncyclopedia] Erro ao carregar jogadores:', error);
            return false;
        }
    }

    /**
     * Renderiza os cards de jogadores.
     */
    function renderPlayers() {
        const grid = document.querySelector('#players-grid');
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
            <div class="player-card" data-id="${player.id}"
                 style="--player-color: ${player.teamColor};">
                <div class="player-card-header">
                    <span class="player-number">${player.number}</span>
                    <span class="player-position">${player.position}</span>
                </div>
                <div class="player-photo-wrap">
                    <img src="${player.photo}" 
                         alt="${player.name}"
                         class="player-photo"
                         loading="lazy"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="player-photo-fallback" style="display: none;">
                        <i class="fas fa-user"></i>
                    </div>
                </div>
                <div class="player-info">
                    <h3 class="player-name">${player.name}</h3>
                    <p class="player-nickname">"${player.nickname}"</p>
                    <p class="player-team">${player.team}</p>
                    <p class="player-nationality">${getFlag(player.nationality)} ${player.nationality}</p>
                </div>
                <div class="player-card-footer">
                    <button class="player-details-btn" data-sound="click">
                        <i class="fas fa-info-circle"></i> Ver Detalhes
                    </button>
                </div>
            </div>
        `).join('');

        // Event listeners
        grid.querySelectorAll('.player-card').forEach(card => {
            card.addEventListener('mouseenter', () => RetroAudio.play('hover'));
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                const player = allPlayers.find(p => p.id === id);
                if (player) openPlayerModal(player);
            });
        });

        grid.querySelectorAll('.player-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.closest('.player-card').dataset.id;
                const player = allPlayers.find(p => p.id === id);
                if (player) openPlayerModal(player);
            });
        });
    }

    /**
     * Abre o modal de detalhes do jogador.
     */
    function openPlayerModal(player) {
        const modal = document.querySelector('#player-modal');
        if (!modal) return;

        const content = modal.querySelector('.player-modal-content');
        content.style.setProperty('--player-color', player.teamColor);

        // Header
        modal.querySelector('#pm-shield').innerHTML = `
            <img src="${player.photo}" 
                 alt="${player.name}"
                 class="pm-photo"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="pm-photo-fallback" style="display: none;">
                <i class="fas fa-user"></i>
            </div>
        `;

        modal.querySelector('#pm-name').textContent = player.name;
        modal.querySelector('#pm-nickname').textContent = `"${player.nickname}"`;
        modal.querySelector('#pm-team').textContent = player.team;

        // Corpo
        const bodyEl = modal.querySelector('#pm-body');
        bodyEl.innerHTML = `
            <div class="pm-info-grid">
                <div class="pm-info-item">
                    <span class="pm-info-label">Posição</span>
                    <span class="pm-info-value">${player.position}</span>
                </div>
                <div class="pm-info-item">
                    <span class="pm-info-label">Número</span>
                    <span class="pm-info-value">${player.number}</span>
                </div>
                <div class="pm-info-item">
                    <span class="pm-info-label">Nacionalidade</span>
                    <span class="pm-info-value">${getFlag(player.nationality)} ${player.nationality}</span>
                </div>
                <div class="pm-info-item">
                    <span class="pm-info-label">Nascimento</span>
                    <span class="pm-info-value">${formatDate(player.birthDate)}</span>
                </div>
                <div class="pm-info-item">
                    <span class="pm-info-label">Altura</span>
                    <span class="pm-info-value">${player.height}</span>
                </div>
            </div>

            <div class="pm-section">
                <h4 class="pm-section-title"><i class="fas fa-scroll"></i> Biografia</h4>
                <p class="pm-bio">${player.bio}</p>
            </div>

            <div class="pm-section">
                <h4 class="pm-section-title"><i class="fas fa-trophy"></i> Conquistas</h4>
                <ul class="pm-achievements">
                    ${player.achievements.map(a => `<li>${a}</li>`).join('')}
                </ul>
            </div>

            <div class="pm-section pm-curiosity">
                <h4 class="pm-section-title"><i class="fas fa-lightbulb"></i> Curiosidade</h4>
                <p>${player.curiosity}</p>
            </div>
        `;

        modal.classList.add('active');
        RetroAudio.play('select');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Fecha o modal.
     */
    function closeModal() {
        const modal = document.querySelector('#player-modal');
        if (!modal) return;
        modal.classList.remove('active');
        RetroAudio.play('close');
        document.body.style.overflow = '';
    }

    /**
     * Formata data para o padrão brasileiro.
     */
    function formatDate(dateStr) {
        if (!dateStr) return '—';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    }

    /**
     * Filtra os jogadores por nome/time/posição.
     */
    function filterPlayers(searchTerm) {
        currentSearch = searchTerm.toLowerCase().trim();

        if (!currentSearch) {
            filteredPlayers = [...allPlayers];
        } else {
            filteredPlayers = allPlayers.filter(p =>
                p.name.toLowerCase().includes(currentSearch) ||
                p.nickname.toLowerCase().includes(currentSearch) ||
                p.team.toLowerCase().includes(currentSearch) ||
                p.position.toLowerCase().includes(currentSearch) ||
                p.nationality.toLowerCase().includes(currentSearch)
            );
        }

        renderPlayers();
    }

    /**
     * Inicializa o módulo.
     */
    async function init() {
        const loaded = await loadPlayers();
        if (!loaded) return;

        renderPlayers();

        // Fecha o modal
        const closeBtn = document.querySelector('#pm-close');
        const modal = document.querySelector('#player-modal');

        closeBtn?.addEventListener('click', closeModal);
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal?.classList.contains('active')) {
                closeModal();
            }
        });

        // Campo de busca
        const searchInput = document.querySelector('#player-search');
        searchInput?.addEventListener('input', (e) => {
            filterPlayers(e.target.value);
        });
    }

    return { init, closeModal };
})();