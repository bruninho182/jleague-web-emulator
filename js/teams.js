/* ============================================
   TEAMS.JS - Renderização de times + modal + escudos
   ============================================ */

const TeamsManager = (() => {

    /**
     * Gera um escudo SVG de FALLBACK (caso a imagem oficial não carregue).
     * @param {object} team
     * @param {number} size
     * @returns {string} SVG em string
     */
    function generateFallbackShield(team, size = 60) {
        const initials = team.name
            .split(' ')
            .map(w => w[0])
            .join('')
            .slice(0, 3)
            .toUpperCase();

        return `
            <svg viewBox="0 0 100 120" width="${size}" height="${size * 1.2}"
                 xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="g-${initials}-${size}" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="${team.color}" />
                        <stop offset="100%" stop-color="${team.color2 || '#000'}" />
                    </linearGradient>
                </defs>
                <path d="M50 5 L95 20 L95 65 Q95 100 50 115 Q5 100 5 65 L5 20 Z"
                      fill="url(#g-${initials}-${size})"
                      stroke="#000" stroke-width="3"/>
                <text x="50" y="68" text-anchor="middle"
                      font-family="Press Start 2P, monospace" font-size="18"
                      fill="#fff" stroke="#000" stroke-width="0.8">
                    ${initials}
                </text>
            </svg>
        `;
    }

    /**
     * Gera o HTML do escudo — usa imagem oficial com fallback SVG.
     * @param {object} team
     * @param {number} size - Altura do escudo em px
     */
    function renderShield(team, size = 60) {
        // Se o time tem escudo oficial definido, usa ele
        if (team.shield) {
            return `
                <img src="${team.shield}"
                     alt="Escudo ${team.name}"
                     width="${size}"
                     height="${size * 1.2}"
                     loading="lazy"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                     style="object-fit: contain; display: block; margin: 0 auto;">
                <span style="display: none;">
                    ${generateFallbackShield(team, size)}
                </span>
            `;
        }
        // Fallback puro (sem imagem)
        return generateFallbackShield(team, size);
    }

    /**
     * Renderiza todos os cards de time.
     */
    function renderGrid() {
        const grid = document.querySelector('#teams-grid');
        if (!grid) return;

        grid.innerHTML = APP_CONFIG.teams.map((team, idx) => `
            <div class="team-card" data-index="${idx}"
                 style="border-color: ${team.color};">
                <div class="team-shield">
                    ${renderShield(team, 60)}
                </div>
                <div class="team-name">${team.name}</div>
                <div class="team-city">${team.city}</div>
                <div class="team-titles">
                    ${'★'.repeat(team.titles) || '☆'}
                </div>
            </div>
        `).join('');

        grid.querySelectorAll('.team-card').forEach(card => {
            card.addEventListener('mouseenter', () => RetroAudio.play('hover'));
            card.addEventListener('click', () => {
                const idx = parseInt(card.dataset.index, 10);
                openModal(APP_CONFIG.teams[idx]);
            });
        });
    }

    /**
     * Abre o modal com detalhes do time.
     */
    function openModal(team) {
        const modal = document.querySelector('#team-modal');
        const shieldEl = document.querySelector('#modal-shield');
        const nameEl = document.querySelector('#modal-team-name');
        const cityEl = document.querySelector('#modal-team-city');
        const bodyEl = document.querySelector('#modal-body');

        shieldEl.innerHTML = renderShield(team, 70);
        nameEl.textContent = team.name;
        cityEl.textContent = `📍 ${team.city}`;

        bodyEl.innerHTML = `
            <div class="stat-line"><span>🏟️ Estádio</span><strong>${team.stadium}</strong></div>
            <div class="stat-line"><span>📅 Fundação</span><strong>${team.founded}</strong></div>
            <div class="stat-line"><span>🏆 Títulos J.League</span><strong>${team.titles}</strong></div>
            <div class="stat-line"><span>⭐ Estrela</span><strong>${team.star}</strong></div>
        `;

        modal.classList.add('active');
        RetroAudio.play('open');
    }

    /**
     * Fecha o modal.
     */
    function closeModal() {
        const modal = document.querySelector('#team-modal');
        if (!modal) return;
        modal.classList.remove('active');
        RetroAudio.play('close');
    }

    /**
     * Inicializa o módulo.
     */
    function init() {
        renderGrid();

        const closeBtn = document.querySelector('#modal-close');
        const modal = document.querySelector('#team-modal');

        closeBtn?.addEventListener('click', closeModal);

        modal?.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    return { init, renderGrid, closeModal };
})();