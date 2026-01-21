document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    let adminToken = sessionStorage.getItem('adminToken')
    let adminData = {};
    let shopItems = {}; 
    let currentSort = { column: null, direction: 'asc' };
    let statusInterval = null;
    let chaosEvents = {};
    let chatLogs = { 'ALL': [] }; 
    let currentSpyRoom = 'ALL';   
    document.addEventListener('admin:reqRemoveBlacklist', (e) => {
        socket.emit('admin:removeBlacklistWord', { word: e.detail, jwt: adminToken });
    });

    const authContainer = document.getElementById('auth-container');
    const panelContainer = document.getElementById('panel-container');
    const loginBtn = document.getElementById('loginBtn');
    const passwordInput = document.getElementById('adminPasswordInput');
    const authError = document.getElementById('auth-error');
    const logoutBtn = document.getElementById('logoutBtn');
    const contentArea = document.querySelector('.content');
    contentArea.addEventListener('click', (e) => {
        if (e.target.closest('#spy-clear-btn')) {
            const container = document.getElementById('live-chat-spy');
            if (container) container.innerHTML = '';
            chatLogs[currentSpyRoom] = [];
        }
        
        const roomItem = e.target.closest('.spy-room-item');
        if (roomItem) {
            const roomId = roomItem.dataset.roomId; 
            if (roomId) {
                currentSpyRoom = roomId;
                updateSpyRoomList();
                
                const headerName = document.getElementById('spy-current-room-name');
                if(headerName) headerName.textContent = roomId === 'ALL' ? 'Globaler Feed (Alle Räume)' : `Raum: ${roomId}`;

                renderSpyMessages();
            }
        }
    });
    
    contentArea.addEventListener('input', (e) => {
        if (e.target.id === 'spy-filter-input') {
            filterSpyMessages(e.target.value); 
        }
    });

    loginBtn.addEventListener('click', authenticate);
    passwordInput.addEventListener('keyup', (e) => e.key === 'Enter' && authenticate());
    logoutBtn.addEventListener('click', logout);
    document.querySelector('.sidebar-nav').addEventListener('click', handleNavClick);
    contentArea.addEventListener('click', handleContentClick);
    contentArea.addEventListener('input', handleTableSearch);
    
function authenticate() {
    const password = passwordInput.value;
    if (password) socket.emit('admin:authenticate', password);
}

    function logout() {
        sessionStorage.removeItem('adminSecretKey');
        secretKey = null;
        if (statusInterval) clearInterval(statusInterval); 
        authContainer.classList.remove('hidden');
        panelContainer.classList.add('hidden');
    }

socket.on('admin:auth_success', (data) => {
    adminToken = data.token;
    sessionStorage.setItem('adminToken', adminToken);
    authError.textContent = '';
    authContainer.classList.add('hidden');
    panelContainer.classList.remove('hidden');
    adminData = data.adminData;
    shopItems = data.shopItems;
    chaosEvents = data.chaosEvents;
    
    if (data.adminData.chatHistory) {
        chatLogs['ALL'] = data.adminData.chatHistory;
        data.adminData.chatHistory.forEach(msg => {
            if (msg.roomId) {
                if (!chatLogs[msg.roomId]) chatLogs[msg.roomId] = [];
                chatLogs[msg.roomId].push(msg);
            }
        });
    }

    renderView('dashboard');
});

socket.on('admin:aiResult', ({ text, analysis }) => {
    const wrapper = document.getElementById('ai-result-wrapper');
    const scoreVal = document.getElementById('ai-score-val');
    const flagsList = document.getElementById('ai-flags-list');
    const recBox = document.getElementById('ai-recommendation');
    
    if(!wrapper) return;
    wrapper.classList.remove('hidden');

    scoreVal.textContent = analysis.score;
    const scoreColor = analysis.score >= 50 ? '#ef5350' : (analysis.score >= 30 ? '#ffc107' : '#4caf50');
    scoreVal.style.color = scoreColor;
    document.querySelector('.score-circle').style.borderColor = scoreColor;

    if (analysis.flags.length > 0) {
        flagsList.innerHTML = analysis.flags.map(f => `<span class="ai-flag-tag">${f}</span>`).join('');
    } else {
        flagsList.innerHTML = '<span class="ai-flag-tag safe">Keine Auffälligkeiten</span>';
    }

    recBox.innerHTML = `<strong>Fazit:</strong> ${analysis.recommendation}`;
    recBox.style.backgroundColor = analysis.score >= 50 ? 'rgba(239, 83, 80, 0.1)' : 'rgba(76, 175, 80, 0.1)';
    recBox.style.color = scoreColor;
    recBox.style.border = `1px solid ${scoreColor}`;
});

    socket.on('admin:auth_fail', () => authError.textContent = 'Falscher Schlüssel!');
    
    socket.on('admin:statusUpdate', (status) => {
        const playersEl = document.getElementById('status-players-online');
        const roomsEl = document.getElementById('status-active-rooms');
        const uptimeEl = document.getElementById('status-uptime');
        const memoryEl = document.getElementById('status-memory');

        if (playersEl) playersEl.textContent = status.playersOnline;
        if (roomsEl) roomsEl.textContent = status.activeRooms;
        if (uptimeEl) uptimeEl.textContent = status.uptime;
        if (memoryEl) memoryEl.textContent = status.memoryUsage;
    });
    
    socket.on('admin:data_update', (data) => {
    adminData = data;
    const activeView = document.querySelector('.nav-link.active')?.dataset.view || 'dashboard';
    
    if (activeView !== 'moderation') {
        renderView(activeView, false); 
    } else {
        updateSpyRoomList();
    }
    showToast('Daten wurden live aktualisiert!', 'info');
});

socket.on('admin:blacklistUpdate', (words) => {
    const container = document.getElementById('blacklist-container');
    if (!container) return;
    
    if (words.length === 0) {
        container.innerHTML = '<p style="color: var(--text-dark);">Keine Wörter gesperrt.</p>';
        return;
    }

    container.innerHTML = words.map(word => `
    <span class="ai-flag-tag" style="...">
        ${word}
        <i class="material-icons" style="font-size: 14px; cursor: pointer;">close</i>
    </span>
`).join('');
});

socket.on('admin:liveChatLog', (data) => {
    chatLogs['ALL'].push(data);
    if (chatLogs['ALL'].length > 150) chatLogs['ALL'].shift(); 

    if (data.roomId) {
        if (!chatLogs[data.roomId]) chatLogs[data.roomId] = [];
        chatLogs[data.roomId].push(data);
        if (chatLogs[data.roomId].length > 100) chatLogs[data.roomId].shift();
    }

    const container = document.getElementById('live-chat-spy');
    if (container) {
        if (currentSpyRoom === 'ALL' || currentSpyRoom === data.roomId) {
            appendSpyMessageToDOM(data, container);
            
            const autoScrollCheckbox = document.getElementById('spy-autoscroll');
            if (autoScrollCheckbox && autoScrollCheckbox.checked) {
                container.scrollTop = container.scrollHeight;
            }
        }
    }
});
    
    socket.on('admin:playerDetails', (player) => {
        if (!player) {
            showToast('Spielerdetails konnten nicht geladen werden.', 'danger');
            return;
        }
        const inventoryList = player.inventory && player.inventory.length > 0
            ? `<ul>${player.inventory.map(id => `<li>${shopItems[id]?.name || id}</li>`).join('')}</ul>`
            : '<p>Keine Items im Inventar.</p>';
            
        showModal(`Details für ${player.name}`, `
            <h4>Statistiken</h4>
            <p><strong>Level:</strong> ${player.level} | <strong>XP:</strong> ${player.xp}</p>
            <p><strong>Q-Coins:</strong> ${player.qcoins} 🪙</p>
            <p><strong>Gilde:</strong> ${player.guildId || 'Keine'}</p>
            <p><strong>Letzte IP:</strong> ${player.last_known_ip || 'N/A'}</p>
            <h4 style="margin-top: 20px;">Inventar</h4>
            <div style="max-height: 150px; overflow-y: auto; background: var(--bg-dark); padding: 10px; border-radius: var(--radius);">${inventoryList}</div>
        `, null, 'info'); 
    });

    socket.on('admin:action_success', ({ message }) => showToast(message, 'success'));
    socket.on('admin:action_fail', ({ message }) => showToast(message, 'danger'));
    
    socket.on('maintenanceStatus', (status) => {
        const statusEl = document.getElementById('maintenance-status');
        if (statusEl) {
            statusEl.textContent = `Status: ${status.active ? 'Aktiv' : 'Inaktiv'}`;
            statusEl.style.color = status.active ? 'var(--danger)' : 'var(--text-dark)';
        }
    });

    function handleNavClick(e) {
        e.preventDefault();
        const link = e.target.closest('.nav-link');
        if (!link) return;

        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        renderView(link.dataset.view);
    }

    function renderView(viewName, animate = true) {
        if (statusInterval) clearInterval(statusInterval);
        if (animate) currentSort = { column: null, direction: 'asc' };

        let html = '';
        const viewContainer = document.createElement('div');
        if (animate) viewContainer.classList.add('view');

        switch (viewName) {
            case 'dashboard': html = getDashboardHTML(); break;
            case 'players': html = getPlayersHTML(); break;
            case 'guilds': html = getGuildsHTML(); break;
            case 'reports': html = getReportsHTML(); break;
            case 'bans': html = getBansHTML(); break;
            case 'unban-requests': html = getUnbanRequestsHTML(); break;
            case 'ailab': html = getAILabHTML(); break;
            case 'games': html = getGamesHTML(); break;
            case 'updatelog': html = getUpdateLogHTML(); break;
            case 'server': 
                html = getServerHTML();
                socket.emit('admin:getStatus'); 
                statusInterval = setInterval(() => socket.emit('admin:getStatus'), 2000);
                break;
            case 'chatspy':
                html = getChatSpyHTML();
                setTimeout(() => {
                    updateSpyRoomList();
                    renderSpyMessages();
                }, 50);
                break;
            case 'moderation': 
        html = getModerationHTML(); 
        setTimeout(() => socket.emit('admin:getBlacklist', { jwt: adminToken }), 100);
        break;
        }
        viewContainer.innerHTML = html;
        contentArea.innerHTML = ''; 
        contentArea.appendChild(viewContainer);
        
        updateTableHeaders();
        if (viewName === 'players') renderPlayersTable();
        if (viewName === 'guilds') renderGuildsTable();
        if (viewName === 'reports') renderReportsTable();
        if (viewName === 'bans') renderBansTable();
        if (viewName === 'unban-requests') renderUnbanRequestsTable();
        if (viewName === 'games') renderGamesTable();
        if (viewName === 'updatelog') renderUpdateLogTable();
    }

        const renderUpdateLogTable = () => {
        const tableBody = document.getElementById('updatelog-table')?.querySelector('tbody');
        if (!tableBody) return;
        tableBody.innerHTML = (adminData.updateLogs || []).map(log => `
            <tr>
                <td>${log.version}</td>
                <td><span class="log-type-${log.type}">${log.type}</span></td>
                <td>${log.description}</td>
                <td class="action-buttons">
                    <button data-action="edit-log-entry" data-id="${log.id}" title="Bearbeiten"><i class="material-icons">edit</i></button>
                    <button data-action="delete-log-entry" data-id="${log.id}" data-version="${log.version}" class="danger" title="Löschen"><i class="material-icons">delete</i></button>
                </td>
            </tr>`).join('');
    };
    
    const getDashboardHTML = () => `
    <div class="view-header"><h1>Dashboard</h1></div>
    <div class="dashboard-grid">
        <div class="stat-card players">
            <div class="stat-card-icon"><i class="material-icons">people</i></div>
            <div class="stat-card-info">
                <h4>Spieler Gesamt</h4>
                <p>${adminData.stats?.totalPlayers || 0}</p>
            </div>
        </div>
        <div class="stat-card guilds">
            <div class="stat-card-icon"><i class="material-icons">groups</i></div>
            <div class="stat-card-info">
                <h4>Gilden Gesamt</h4>
                <p>${adminData.stats?.totalGuilds || 0}</p>
            </div>
        </div>
        <div class="stat-card reports">
            <div class="stat-card-icon"><i class="material-icons">flag</i></div>
            <div class="stat-card-info">
                <h4>Offene Meldungen</h4>
                <p>${adminData.stats?.pendingReports || 0}</p>
            </div>
        </div>
        <div class="stat-card bans">
            <div class="stat-card-icon"><i class="material-icons">gavel</i></div>
            <div class="stat-card-info">
                <h4>Aktive Banns</h4>
                <p>${adminData.bans?.length || 0}</p>
            </div>
        </div>
    </div>
    <div class="content-box">
        <h2>Letzte Admin-Aktionen</h2>
        <table>
            <thead><tr><th>Zeit</th><th>Aktion</th><th>Ziel</th><th>Details</th></tr></thead>
            <tbody>
                ${(adminData.logs || []).slice(0, 10).map(log => `
                    <tr>
                        <td>${new Date(log.timestamp).toLocaleString('de-DE')}</td>
                        <td>${log.action}</td>
                        <td>${log.target_id || 'N/A'}</td>
                        <td>${log.details || ''}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>`;

    const getAILabHTML = () => `
    <div class="view-header"><h1>KI-Analyse Labor</h1></div>
    <div class="content-box">
        <p style="margin-bottom:20px; color:var(--text-secondary);">Teste Texte gegen den Filter. Die KI erkennt Beleidigungen, Spam und verbotene Wörter.</p>
        
        <div class="ai-input-group">
            <input type="text" id="ai-test-input" placeholder="Tippe einen Satz zum Analysieren..." autocomplete="off">
            <button id="ai-test-btn" class="primary"><i class="material-icons">search</i> Prüfen</button>
        </div>

        <div id="ai-result-wrapper" class="hidden">
            <div class="ai-cards-grid">
                <div class="ai-card score-card">
                    <h3>Risiko-Score</h3>
                    <div class="score-circle">
                        <span id="ai-score-val">0</span>
                    </div>
                </div>

                <div class="ai-card detail-card">
                    <h3>Analyse Details</h3>
                    <div id="ai-flags-list"></div>
                    <div id="ai-recommendation" class="ai-rec-box"></div>
                </div>
            </div>
        </div>
    </div>
`;

const getModerationHTML = () => `
    <div class="view-header"><h1>Filter & Blacklist</h1></div>
    <div class="content-box">
        <p style="color:var(--text-secondary); margin-bottom: 20px;">
            Hier kannst du Wörter definieren, die im Chat automatisch blockiert werden. 
            Klicke auf das "X" neben einem Wort, um es zu löschen.
        </p>
        <div class="ai-input-group">
            <input type="text" id="blacklist-input" placeholder="Neues verbotenes Wort..." autocomplete="off">
            <button id="add-blacklist-btn" class="danger"><i class="material-icons">add</i> Hinzufügen</button>
        </div>
        <div id="blacklist-container" style="display: flex; flex-wrap: wrap; gap: 10px; padding: 20px; background: var(--bg-dark); border-radius: var(--radius); min-height: 200px;">
            <p>Lade Filter...</p>
        </div>
    </div>
`;

const getChatSpyHTML = () => `
    <div class="view-header"><h1>Live Chat Überwachung</h1></div>
    
    <div class="chat-spy-wrapper">
        <div class="chat-spy-sidebar">
            <div class="spy-sidebar-header">Aktive Räume</div>
            <div id="spy-room-list" class="spy-room-scroller">
                </div>
        </div>

        <div class="chat-spy-main">
            <div class="spy-controls-header">
                <div id="spy-current-room-name">Globaler Feed</div>
                <div class="spy-actions">
                    <label class="toggle-switch">
                        <input type="checkbox" id="spy-autoscroll" checked>
                        <span class="slider"></span> Auto-Scroll
                    </label>
                    <button id="spy-clear-btn" class="small-btn">
                        <i class="material-icons">delete_sweep</i> Clear
                    </button>
                </div>
            </div>
            
            <div id="live-chat-spy" class="spy-messages-area"></div>
            
            <div class="spy-input-area">
                 <input type="text" id="spy-filter-input" placeholder="Nachrichten in diesem Feed filtern...">
            </div>
        </div>
    </div>
`;

    const getPlayersHTML = () => `
        <div class="view-header"><h1>Spieler-Verwaltung</h1></div>
        <div class="content-box">
            <div class="table-controls"><input type="text" id="players-search" placeholder="Spieler suchen (Name, Token, IP)..."></div>
            <table id="players-table">
                <thead>
                    <tr>
                        <th data-sort="name">Name <i class="material-icons sort-icon"></i></th>
                        <th data-sort="level">Level <i class="material-icons sort-icon"></i></th>
                        <th data-sort="qcoins">Q-Coins <i class="material-icons sort-icon"></i></th>
                        <th data-sort="guildId">Gilde <i class="material-icons sort-icon"></i></th>
                        <th data-sort="last_known_ip">Letzte IP <i class="material-icons sort-icon"></i></th>
                        <th>Aktionen</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>`;
    
    const getGuildsHTML = () => `
        <div class="view-header"><h1>Gilden-Verwaltung</h1></div>
        <div class="content-box">
            <div class="table-controls"><input type="text" id="guilds-search" placeholder="Gilde suchen (Name, Tag, ID)..."></div>
            <table id="guilds-table">
                <thead>
                    <tr>
                        <th data-sort="name">Name <i class="material-icons sort-icon"></i></th>
                        <th data-sort="id">ID <i class="material-icons sort-icon"></i></th>
                        <th data-sort="weeklyScore">Score <i class="material-icons sort-icon"></i></th>
                        <th>Aktionen</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>`;

const getReportsHTML = () => `
    <div class="view-header"><h1>Offene Meldungen</h1></div>
    <div class="content-box">
        <table id="reports-table">
            <thead>
                <tr>
                    <th>KI-Analyse</th> <th>Melder</th>
                    <th>Beschuldigter</th>
                    <th>Nachricht</th>
                    <th>Kommentar</th>
                    <th>Aktionen</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>`;

    const getBansHTML = () => `
        <div class="view-header"><h1>Aktive Banns</h1></div>
        <div class="content-box">
            <div class="table-controls"><input type="text" id="bans-search" placeholder="Bann suchen (Name, Token, IP)..."></div>
            <table id="bans-table">
                <thead>
                    <tr>
                        <th data-sort="name">Spieler <i class="material-icons sort-icon"></i></th>
                        <th data-sort="ip_address">IP <i class="material-icons sort-icon"></i></th>
                        <th data-sort="reason">Grund <i class="material-icons sort-icon"></i></th>
                        <th data-sort="banned_until">Gebannt bis <i class="material-icons sort-icon"></i></th>
                        <th>Aktion</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>`;

    const getGamesHTML = () => `
    <div class="view-header"><h1>Aktive Spiele</h1></div>
    <div class="content-box">
        <table id="games-table">
            <thead>
                <tr>
                    <th>Raum-ID</th>
                    <th>Host</th>
                    <th>Spieler</th>
                    <th>Zuschauer</th>
                    <th>Modus</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>`;

const renderGamesTable = () => {
    const tableBody = document.getElementById('games-table')?.querySelector('tbody');
    if (!tableBody) return;
    tableBody.innerHTML = (adminData.activeRooms || []).map(r => `
        <tr>
            <td><strong>${r.id}</strong></td>
            <td>${r.host}</td>
            <td>${r.playerCount}</td>
            <td>${r.spectatorCount}</td>
            <td>${r.mode}</td>
            <td class="action-buttons">
                <button data-action="trigger-event" data-room-id="${r.id}" class="warning" title="Chaos-Event starten" style="color: var(--accent); border-color: var(--accent);"><i class="material-icons">flash_on</i></button>
                <button data-action="trigger-bsod" data-room-id="${r.id}" class="danger" title="Fake Absturz (BSOD)"><i class="material-icons">broken_image</i></button>
                <button data-action="force-end-game-direct" data-room-id="${r.id}" class="danger" title="Beenden"><i class="material-icons">stop</i></button>
                <button data-action="spectate-game" data-room-id="${r.id}" class="info" title="Als Admin zuschauen"><i class="material-icons">visibility</i></button>
            </td>
        </tr>`).join('');
};

    const getServerHTML = () => `
        <div class="view-header"><h1>Server-Steuerung</h1></div>
        <div class="content-box" style="margin-bottom: 20px;">
            <h2>Live Server-Status</h2>
            <div class="dashboard-grid">
                <div class="stat-card"><h4>Spieler Online</h4><p id="status-players-online">Lädt...</p></div>
                <div class="stat-card"><h4>Aktive Räume</h4><p id="status-active-rooms">Lädt...</p></div>
                <div class="stat-card"><h4>Laufzeit</h4><p id="status-uptime">Lädt...</p></div>
                <div class="stat-card"><h4>Speicher</h4><p id="status-memory">Lädt...</p></div>
            </div>
        </div>
        <div class="content-box">
            <h2>Aktionen</h2>
            <div class="server-actions-grid">
                <div class="action-card">
                    <label>Serverweite Nachricht</label>
                    <textarea id="broadcast-message" rows="3" placeholder="Diese Nachricht wird allen Spielern angezeigt..."></textarea>
                    <button id="send-broadcast-btn" data-action="send-broadcast">Nachricht senden</button>
                </div>
                <div class="action-card">
                    <label>Spiel beenden</label>
                    <input type="text" id="force-end-room-id" placeholder="Raum-ID eingeben...">
                    <button id="force-end-game-btn" class="danger" data-action="force-end-game">Spiel sofort beenden</button>
                </div>
                <div class="action-card">
                    <label>Wartungs-Modus</label>
                    <textarea id="maintenance-message" rows="3" placeholder="Standardnachricht verwenden..."></textarea>
                    <div style="display: flex; gap: 10px;">
                        <button id="enable-maintenance-btn" class="danger" data-action="enable-maintenance">Aktivieren</button>
                        <button id="disable-maintenance-btn" class="success" data-action="disable-maintenance">Deaktivieren</button>
                    </div>
                    <small id="maintenance-status" style="color: var(--text-dark); margin-top: 5px;">Status: Lädt...</small>
                </div>
            </div>
        </div>`;

        const getUpdateLogHTML = () => `
        <div class="view-header">
            <h1>Update Log Verwaltung</h1>
            <button id="add-log-btn" data-action="add-log-entry" class="success">Neuer Eintrag</button>
        </div>
        <div class="content-box">
            <table id="updatelog-table">
                <thead>
                    <tr>
                        <th>Version</th>
                        <th>Typ</th>
                        <th>Beschreibung</th>
                        <th>Aktionen</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>`;

    const renderTable = (tableId, data, searchInputId, renderRowFunc) => {
        const tableBody = document.getElementById(tableId)?.querySelector('tbody');
        if (!tableBody) return;
        const searchTerm = document.getElementById(searchInputId)?.value.toLowerCase() || '';

        const filteredData = data.filter(item => 
            Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm))
        );
        
        if (currentSort.column) {
            filteredData.sort((a, b) => {
                const valA = a[currentSort.column];
                const valB = b[currentSort.column];
                const comparison = String(valA).localeCompare(String(valB), undefined, { numeric: true });
                return currentSort.direction === 'asc' ? comparison : -comparison;
            });
        }
        
        tableBody.innerHTML = filteredData.map(renderRowFunc).join('');
    };

const renderPlayersTable = () => renderTable('players-table', adminData.players, 'players-search', p => {
    const now = new Date();
    const isMuted = p.mute_until && new Date(p.mute_until) > now;

    const muteButton = isMuted 
        ? `<button data-action="unmute-player" data-token="${p.token}" data-name="${p.name}" class="success" title="Spieler laut schalten"><i class="material-icons">volume_up</i></button>`
        : `<button data-action="mute-player" data-token="${p.token}" data-name="${p.name}" title="Spieler stummschalten"><i class="material-icons">volume_off</i></button>`;

    const removeGuildButton = p.guildId
        ? `<button data-action="remove-from-guild" data-token="${p.token}" data-name="${p.name}" data-guild-id="${p.guildId}" class="danger" title="Aus Gilde entfernen"><i class="material-icons">group_remove</i></button>`
        : '';

    const sanitizedName = DOMPurify.sanitize(p.name);

    let roleIcon = 'person'; 
    let roleColor = 'gray';

    if (p.role === 'owner') {
        roleIcon = 'workspace_premium';
        roleColor = '#d500f9';
    }
    if (p.role === 'admin') { 
        roleIcon = 'security'; 
        roleColor = '#ef5350'; 
    }
    if (p.role === 'mod') { 
        roleIcon = 'verified_user'; 
        roleColor = '#29b6f6'; 
    }

    return `
    <tr>
        <td>
            <i class="material-icons" style="color:${roleColor}; vertical-align:middle; font-size:16px;">${roleIcon}</i>
            ${sanitizedName} 
            ${isMuted ? '<span style="color:var(--danger); font-size:0.8em;">(Muted)</span>' : ''}
        </td>

        <td>${DOMPurify.sanitize(p.level)}</td>
        <td>${DOMPurify.sanitize(p.qcoins)}</td>
        <td>${DOMPurify.sanitize(p.guildId) || 'Keine'}</td>
        <td>${DOMPurify.sanitize(p.last_known_ip) || 'N/A'}</td>

        <!-- Neue Spalte: Rolle -->
        <td>${p.role || 'user'}</td>

        <td class="action-buttons">
            <button data-action="view-player" data-token="${p.token}" title="Details ansehen"><i class="material-icons">visibility</i></button>
            <button data-action="edit-comment" data-token="${p.token}" data-name="${sanitizedName}" title="Kommentar bearbeiten"><i class="material-icons">comment</i></button>
            <button data-action="dm-player" data-token="${p.token}" data-name="${sanitizedName}" title="Nachricht senden"><i class="material-icons">chat</i></button>
            <button data-action="grant-item" data-token="${p.token}" data-name="${sanitizedName}" title="Item geben"><i class="material-icons">card_giftcard</i></button>
            <button data-action="adjust-qcoins" data-token="${p.token}" data-name="${sanitizedName}" title="Q-Coins anpassen"><i class="material-icons">monetization_on</i></button>

            ${muteButton}
            ${removeGuildButton}

            <button data-action="reset-player" data-token="${p.token}" data-name="${sanitizedName}" class="danger" title="Account zurücksetzen"><i class="material-icons">refresh</i></button>
            <button data-action="kick-player" data-token="${p.token}" data-name="${sanitizedName}" class="danger" title="Spieler kicken"><i class="material-icons">directions_run</i></button>
            <button data-action="ban-player" data-token="${p.token}" data-name="${sanitizedName}" class="danger" title="Spieler bannen"><i class="material-icons">gavel</i></button>

            <button data-action="set-role" data-token="${p.token}" data-name="${sanitizedName}" data-current="${p.role || 'user'}" title="Rolle ändern"><i class="material-icons">badge</i></button>
        </td>
    </tr>`;
});
    
    const renderGuildsTable = () => renderTable('guilds-table', adminData.guilds, 'guilds-search', g => `
        <tr>
            <td>[${g.tag}] ${g.name}</td><td>${g.id}</td><td>${g.weeklyScore || 0}</td>
            <td class="action-buttons"><button data-action="delete-guild" data-id="${g.id}" data-name="${g.name}" class="danger" title="Gilde löschen"><i class="material-icons">delete_forever</i></button></td>
        </tr>`);
        
const renderReportsTable = () => {
    const tableBody = document.getElementById('reports-table')?.querySelector('tbody');
    if (!tableBody) return;
    tableBody.innerHTML = (adminData.reports || []).map(r => {
        let aiBadge = '<span class="badge gray">Ausstehend</span>';
        let rowClass = '';
        
        if (r.ai_analysis) {
            try {
                const ai = JSON.parse(r.ai_analysis);
                if (ai.recommendation.includes('Kritisch')) {
                    aiBadge = `<span class="badge red" title="${ai.flags.join(', ')}">🤖 BAN EMPFOHLEN</span>`;
                    rowClass = 'critical-report'; 
                } else if (ai.recommendation.includes('Warnung')) {
                    aiBadge = `<span class="badge yellow" title="${ai.flags.join(', ')}">⚠️ ${ai.flags[0]}</span>`;
                } else {
                    aiBadge = `<span class="badge green">✅ Sauber</span>`;
                }
            } catch (e) { aiBadge = 'Fehler'; }
        }

        return `
        <tr class="${rowClass}">
            <td>${aiBadge}</td> <td>${DOMPurify.sanitize(r.reporterName || 'Unbekannt')}</td>
            <td>${DOMPurify.sanitize(r.reportedName || 'Unbekannt')}</td>
            <td>${DOMPurify.sanitize(r.message)}</td>
            <td>${DOMPurify.sanitize(r.comment || '-')}</td>
            <td class="action-buttons">
                <button data-action="view-context" data-id="${r.id}" title="Chat-Kontext anzeigen"><i class="material-icons">history</i></button>
                <button data-action="resolve-report" data-id="${r.id}" class="success"><i class="material-icons">check_circle</i></button>
                <button data-action="ban-player" data-token="${r.reported_token}" data-name="${r.reportedName}" class="danger"><i class="material-icons">gavel</i></button>
            </td>
        </tr>`;
    }).join('');
};
    
const renderBansTable = () => renderTable('bans-table', adminData.bans, 'bans-search', b => `
    <tr>
        <td>${b.name || 'N/A'}</td><td>${b.ip_address || 'N/A'}</td><td>${DOMPurify.sanitize(b.reason)}</td><td>${b.banned_until ? new Date(b.banned_until).toLocaleString('de-DE') : 'Permanent'}</td>
        <td class="action-buttons">
            <button data-action="unban-player" data-id="${b.id}" data-name="${b.name}" class="success" title="Spieler entbannen"><i class="material-icons">lock_open</i></button>
            <button data-action="edit-ban" data-id="${b.id}" data-name="${b.name}" data-reason="${DOMPurify.sanitize(b.reason)}" title="Banngrund bearbeiten"><i class="material-icons">edit</i></button>
        </td>
    </tr>`);

   function handleContentClick(e) {
        if (e.target.closest('#ai-test-btn')) {
            const input = document.getElementById('ai-test-input');
            const text = input.value.trim();
            if (text) {
                socket.emit('admin:testAI', { text, jwt: adminToken });
            }
            return;
        }
        if (e.target.innerText === 'close' && e.target.closest('.ai-flag-tag')) {
        const span = e.target.closest('.ai-flag-tag');
        const fullText = span.textContent; 
        const word = fullText.replace('close', '').trim();
    
    socket.emit('admin:removeBlacklistWord', { word: word, jwt: adminToken });
    return;
}

        if (e.target.closest('#add-blacklist-btn')) {
        const input = document.getElementById('blacklist-input');
        const word = input.value.trim();
        if (word) {
            socket.emit('admin:addBlacklistWord', { word, jwt: adminToken });
            input.value = '';
        }
        return;
    }
        const button = e.target.closest('button');
        const th = e.target.closest('th');

        if (button?.dataset.action && actionHandlers[button.dataset.action]) {
            actionHandlers[button.dataset.action](button.dataset);
        } else if (th?.dataset.sort) {
            handleTableSort(th.dataset.sort);
        }
    }
    
    function handleTableSearch(e) {
        if (e.target.id === 'players-search') renderPlayersTable();
        if (e.target.id === 'guilds-search') renderGuildsTable();
        if (e.target.id === 'bans-search') renderBansTable();
    }

    function getUnbanRequestsHTML() {
    return `
        <div class="view-header"><h1>Unban-Anträge</h1></div>
        <div class="content-box">
            <table id="unban-requests-table">
                <thead>
                    <tr>
                        <th>Spieler</th>
                        <th>Nachricht</th>
                        <th>Aktionen</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>`;
}

function renderUnbanRequestsTable() {
    const tableBody = document.getElementById('unban-requests-table')?.querySelector('tbody');
    if (!tableBody) return;

    const requests = adminData.unbanRequests || [];
    if (requests.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--text-dark);">Keine offenen Anträge gefunden.</td></tr>';
        return;
    }

    tableBody.innerHTML = requests.map(r => {
        const banEntry = adminData.bans.find(b => b.user_token === r.user_token);
        return `
            <tr>
                <td>${DOMPurify.sanitize(r.name || '<i>Unbekannt</i>')}</td>
                <td style="white-space: pre-wrap; max-width: 500px;">${DOMPurify.sanitize(r.appeal_message)}</td>
                <td class="action-buttons">
                ${banEntry ? `<button data-action="resolve-unban-request-accept" data-id="${r.id}" data-ban-id="${banEntry.id}" class="success" title="Antrag annehmen & Entbannen"><i class="material-icons">check</i> Annehmen</button>` : ''}
                <button data-action="resolve-unban-request-reject" data-id="${r.id}" class="danger" title="Antrag ablehnen"><i class="material-icons">close</i> Ablehnen</button>
                </td>
            </tr>`;
    }).join('');
}
    
    function handleTableSort(column) {
        if (currentSort.column === column) {
            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort.column = column;
            currentSort.direction = 'asc';
        }
        updateTableHeaders();
        const activeView = document.querySelector('.nav-link.active')?.dataset.view;
        if (activeView === 'players') renderPlayersTable();
        if (activeView === 'guilds') renderGuildsTable();
        if (activeView === 'bans') renderBansTable();
    }

function updateSpyRoomList() {
    const list = document.getElementById('spy-room-list');
    if (!list) return;

    let html = `
        <div class="spy-room-item ${currentSpyRoom === 'ALL' ? 'active' : ''}" data-room-id="ALL">
            <i class="material-icons">public</i>
            <span>ALLE RÄUME</span>
        </div>
    `;

    if (adminData.activeRooms) {
        adminData.activeRooms.forEach(room => {
            html += `
                <div class="spy-room-item ${currentSpyRoom === room.id ? 'active' : ''}" data-room-id="${room.id}">
                    <i class="material-icons">meeting_room</i>
                    <div class="room-info-col">
                        <span class="room-id">${room.id}</span>
                        <span class="room-meta">${room.playerCount} Spieler • ${room.mode}</span>
                    </div>
                </div>
            `;
        });
    }
    list.innerHTML = html;
}

window.switchSpyRoom = (roomId) => {
    currentSpyRoom = roomId;
    updateSpyRoomList(); 
    
    const headerName = document.getElementById('spy-current-room-name');
    if(headerName) headerName.textContent = roomId === 'ALL' ? 'Globaler Feed (Alle Räume)' : `Raum: ${roomId}`;

    renderSpyMessages();
};

function renderSpyMessages() {
    const container = document.getElementById('live-chat-spy');
    if (!container) return;
    
    container.innerHTML = '';
    
    const messages = chatLogs[currentSpyRoom] || [];
    
    messages.forEach(msg => {
        appendSpyMessageToDOM(msg, container);
    });
    
    container.scrollTop = container.scrollHeight;
}

function filterSpyMessages(term) {
    const container = document.getElementById('live-chat-spy');
    if (!container) return;
    const entries = container.getElementsByClassName('spy-entry');
    const filter = term.toLowerCase();
    
    Array.from(entries).forEach(entry => {
        const text = entry.textContent.toLowerCase();
        entry.style.display = text.includes(filter) ? 'flex' : 'none';
    });
}

function appendSpyMessageToDOM(data, container) {
    const filterTerm = document.getElementById('spy-filter-input')?.value.toLowerCase();
    if (filterTerm && !JSON.stringify(data).toLowerCase().includes(filterTerm)) return;

    const time = new Date(data.timestamp).toLocaleTimeString('de-DE');
    const entry = document.createElement('div');
    entry.className = 'spy-entry';
    if (data.blocked) entry.classList.add('blocked');

    let icon = 'person';
    if (data.sender === 'System') icon = 'dns';
    
    entry.innerHTML = `
        <div class="spy-avatar-col">
            <div class="spy-icon-circle ${data.sender === 'System' ? 'sys' : ''}">
                <i class="material-icons">${icon}</i>
            </div>
        </div>
        <div class="spy-text-col">
            <div class="spy-msg-header">
                <span class="spy-sendername">${DOMPurify.sanitize(data.sender)}</span>
                <span class="spy-timestamp">${time}</span>
                ${currentSpyRoom === 'ALL' && data.roomId ? `<span class="spy-room-tag">${data.roomId}</span>` : ''}
                ${data.blocked ? '<span class="spy-blocked-tag">BLOCKIERT</span>' : ''}
            </div>
            <div class="spy-msg-content">
                ${DOMPurify.sanitize(data.message)}
            </div>
        </div>
    `;
    container.appendChild(entry);
}
    
    function updateTableHeaders() {
        document.querySelectorAll('th[data-sort]').forEach(th => {
            const icon = th.querySelector('.sort-icon');
            if (currentSort.column === th.dataset.sort) {
                icon.textContent = currentSort.direction === 'asc' ? 'arrow_upward' : 'arrow_downward';
                icon.style.opacity = '1';
            } else {
                icon.textContent = '';
                icon.style.opacity = '0.5';
            }
        });
    }

    const actionHandlers = {
        'view-player': ({ token }) => socket.emit('admin:getPlayerDetails', { token, jwt: adminToken }),
        'ban-player': ({ token, name }) => showModal('Spieler bannen', `
            <p>Spieler: <strong>${name}</strong></p>
            <div class="form-group"><label for="modal-duration">Dauer</label><select id="modal-duration"><option value="12">12 Stunden</option><option value="24">24 Stunden</option><option value="permanent">Permanent</option></select></div>
            <div class="form-group"><label for="modal-reason">Grund</label><textarea id="modal-reason" placeholder="Grund für den Bann..."></textarea></div>`, 
            () => {
                const duration = document.getElementById('modal-duration').value;
                const reason = document.getElementById('modal-reason').value;
                if (!reason) { showToast('Ein Grund ist erforderlich!', 'danger'); return; }
                socket.emit('admin:banPlayer', { token, reason, duration, jwt: adminToken });
            }),
        'delete-log-entry': ({ id, version }) => {
            showModal('Log-Eintrag löschen?', `<p>Soll der Eintrag zur Version <strong>${version}</strong> wirklich gelöscht werden?</p>`,
                () => socket.emit('admin:deleteLogEntry', { id, jwt: adminToken })
            );
        },
        'trigger-bsod': ({ roomId }) => {
    showModal('Fake Absturz auslösen?', `<p>Soll in Raum <strong>${roomId}</strong> ein Bluescreen (BSOD) simuliert werden?</p>`, 
    () => socket.emit('admin:triggerBSOD', { roomId, jwt: adminToken }), 'danger');
},
        'view-context': ({ id }) => {
            const report = adminData.reports.find(r => String(r.id) === String(id));
            
            if (!report) {
                console.error(`Report mit ID ${id} nicht in adminData gefunden. Verfügbare IDs:`, adminData.reports.map(r => r.id));
                return showToast('Report-Daten nicht gefunden (bitte Seite neu laden).', 'danger');
            }

            let contextLines = [];
            try {
                const rawContext = report.context || '[]';
                contextLines = JSON.parse(rawContext);
                
                if (!Array.isArray(contextLines)) {
                    contextLines = [String(contextLines)];
                }
            } catch (e) {
                console.error("Fehler beim Parsen des Contexts:", e);
                contextLines = ["Fehler: Chat-Verlauf ist beschädigt."];
            }

            const contextHtml = contextLines.length > 0 
                ? `<ul style="text-align: left; background: #111; padding: 10px; border-radius: 5px; list-style: none; max-height: 300px; overflow-y: auto; margin: 0;">
                    ${contextLines.map(line => `<li style="border-bottom: 1px solid #333; padding: 4px 0; font-size: 0.9em; color: #ccc;">${DOMPurify.sanitize(line)}</li>`).join('')}
                   </ul>`
                : '<p style="text-align:center; color: #888;">Kein Chat-Verlauf verfügbar.</p>';

            showModal('Chat-Verlauf (Kontext)', contextHtml, null, 'info');
        },
            'edit-comment': ({ token, name }) => {
        const player = adminData.players.find(p => p.token === token);
        const currentComment = player ? player.admin_comment || '' : '';

        showModal(`Kommentar für ${name}`, `
            <p>Dieser Kommentar ist nur für Admins sichtbar.</p>
            <div class="form-group">
                <label for="modal-comment">Admin-Notiz</label>
                <textarea id="modal-comment" rows="5" placeholder="Kein Kommentar vorhanden...">${currentComment}</textarea>
            </div>`, 
        () => {
            const comment = document.getElementById('modal-comment').value;
            socket.emit('admin:updatePlayerComment', { token, comment, jwt: adminToken });
        }, 'success');
    },
            'remove-from-guild': ({ token, name, guildId }) => {
        const guildName = adminData.guilds.find(g => g.id === guildId)?.name || 'unbekannt';
        showModal(
            'Aus Gilde entfernen?',
            `<p>Möchtest du <strong>${name}</strong> wirklich aus der Gilde <strong>${guildName}</strong> entfernen?</p>`,
            () => socket.emit('admin:removeFromGuild', { token, jwt: adminToken })
        );
    },
        'mute-player': ({ token, name }) => showModal('Spieler stummschalten', `
            <p>Spieler: <strong>${name}</strong></p>
            <div class="form-group"><label for="modal-duration">Dauer (in Stunden)</label><input type="number" id="modal-duration" value="1"></div>`, 
            () => {
                const duration = document.getElementById('modal-duration').value;
                socket.emit('admin:mutePlayer', { token, duration, jwt: adminToken });
            }),
        'resolve-unban-request-accept': ({ id, banId }) => {
    socket.emit('admin:unbanPlayer', { banId });
    socket.emit('admin:resolveUnbanRequest', { requestId: id, action: 'accepted', jwt: adminToken });
},
'set-role': ({ token, name, current }) => {
    showModal(`Rolle ändern für ${name}`, `
        <p>Aktuelle Rolle: <strong>${current}</strong></p>
        <div class="form-group">
            <label>Neue Rolle wählen:</label>
            <select id="modal-role-select">
                <option value="user">User (Standard)</option>
                <option value="mod">Moderator</option>
                <option value="admin">Admin</option>
                <option value="owner">Besitzer (Owner)</option> </select>
        </div>
        <p class="warning-text" style="color:var(--danger); font-size:0.9em;">Achtung: Admins & Owner haben vollen Zugriff!</p>
    `, () => {
        const role = document.getElementById('modal-role-select').value;
        socket.emit('admin:setRole', { token, role, jwt: adminToken });
    });
},

'spectate-game': ({ roomId }) => {
    const url = `${window.location.origin}/?room=${roomId}&spectate=true`;
    window.open(url, '_blank');
},
'resolve-unban-request-reject': ({ id }) => {
    socket.emit('admin:resolveUnbanRequest', { requestId: id, action: 'rejected', jwt: adminToken });
},
'unban-player': ({ id, name }) => showModal('Bann aufheben', `<p>...</p>`, () => socket.emit('admin:unbanPlayer', { banId: id }), 'success'),
        'unmute-player': ({ token, name }) => showModal('Stummschaltung aufheben', `<p>Möchtest du die Stummschaltung für <strong>${name}</strong> wirklich aufheben?</p>`, () => socket.emit('admin:unmutePlayer', { token, jwt: adminToken }), 'success'),
        'reset-player': ({ token, name }) => showModal(
    'Account vollständig zurücksetzen?', 
    `<p>Bist du absolut sicher, dass du den Account von <strong>${name}</strong> zurücksetzen willst? Alle Level, Q-Coins, Items, Statistiken, Titel, Erfolge, Perks und die Spielhistorie werden unwiderruflich gelöscht!</p>`, 
    () => socket.emit('admin:resetPlayer', { token, jwt: adminToken })
),
    'edit-ban': ({ id, name, reason }) => showModal('Banngrund bearbeiten', `
        <p>Neuer Grund für: <strong>${name}</strong></p>
        <div class="form-group">
            <label for="modal-reason">Grund</label>
            <textarea id="modal-reason" rows="4">${reason}</textarea>
        </div>`, 
        () => {
            const newReason = document.getElementById('modal-reason').value;
            if (!newReason.trim()) {
                showToast('Der Grund darf nicht leer sein!', 'danger');
                return;
            }
            socket.emit('admin:editBan', { banId: id, newReason, jwt: adminToken });
        }, 'success'),
'resolve-unban-request': ({ id }) => socket.emit('admin:resolveUnbanRequest', { requestId: id, jwt: adminToken }),
'add-log-entry': () => {
    showModal('Neuen Log-Eintrag erstellen', `
        <div class="form-group"><label>Version</label><input type="text" id="modal-version" placeholder="z.B. 2.7.1"></div>
        <div class="form-group"><label>Typ (als Standard für Zeilen ohne Tag)</label>
            <select id="modal-type">
                <option value="info">Info</option>
                <option value="feature">Feature</option>
                <option value="fix">Fix</option>
            </select>
        </div>
        <div class="form-group"><label>Beschreibung</label><textarea id="modal-description" placeholder="Beginne Zeilen mit [NEW], [FIX] oder [INFO] für farbige Markierungen."></textarea></div>
        <small style="color: var(--text-dark);">Tipp: Jede Zeile in der Beschreibung wird zu einem eigenen Punkt in der Liste.</small>`,
        () => {
            const version = document.getElementById('modal-version').value;
            const type = document.getElementById('modal-type').value;
            const description = document.getElementById('modal-description').value;
            if (version && description) {
                const processedDescription = description.split('\n').map(line => {
                    const trimmedLine = line.trim();
                    if (trimmedLine === '') return ''; 
                    if (trimmedLine.startsWith('[')) return line; 
                    return `[${type}] ${line}`; 
                }).filter(Boolean).join('\n'); 

                socket.emit('admin:addLogEntry', { version, type, description: processedDescription, jwt: adminToken });
            }
        }, 'success');
},
'force-end-game-direct': ({ roomId }) => { 
    showModal('Spiel beenden?', `<p>Raum <strong>${roomId}</strong> sofort schließen?</p>`, () => socket.emit('admin:forceEndGame', { roomId, jwt: adminToken }));
},

'trigger-event': ({ roomId }) => {
    let options = '';
    for (const [key, event] of Object.entries(chaosEvents)) {
        options += `<option value="${key}">${event.name}</option>`;
    }

    showModal('Chaos entfesseln', `
        <p>Wähle ein Event, das sofort in Raum <strong>${roomId}</strong> starten soll:</p>
        <div class="form-group">
            <label>Event wählen</label>
            <select id="modal-event-select">
                ${options}
            </select>
        </div>
        <p style="font-size: 0.8em; color: var(--text-dark);">Hinweis: Das Event überschreibt das aktuelle Geschehen.</p>
    `, () => {
        const eventId = document.getElementById('modal-event-select').value;
        socket.emit('admin:triggerEvent', { roomId, eventId, jwt: adminToken });
    }, 'success'); 
},
'edit-log-entry': ({ id }) => {
    const log = adminData.updateLogs.find(l => l.id == id);
    if (!log) return;
    showModal('Log-Eintrag bearbeiten', `
        <div class="form-group"><label>Version</label><input type="text" id="modal-version" value="${log.version}"></div>
        <div class="form-group"><label>Typ (als Standard für Zeilen ohne Tag)</label>
            <select id="modal-type">
                <option value="info" ${log.type === 'info' ? 'selected' : ''}>Info</option>
                <option value="feature" ${log.type === 'feature' ? 'selected' : ''}>Feature</option>
                <option value="fix" ${log.type === 'fix' ? 'selected' : ''}>Fix</option>
            </select>
        </div>
        <div class="form-group"><label>Beschreibung</label><textarea id="modal-description">${log.description}</textarea></div>
        <small style="color: var(--text-dark);">Tipp: Beginne Zeilen mit [NEW], [FIX] oder [INFO], um sie farblich zu markieren.</small>`,
        () => {
            const version = document.getElementById('modal-version').value;
            const type = document.getElementById('modal-type').value;
            const description = document.getElementById('modal-description').value;
            if (version && description) {
                const processedDescription = description.split('\n').map(line => {
                    const trimmedLine = line.trim();
                    if (trimmedLine === '') return ''; 
                    if (trimmedLine.startsWith('[')) return line; 
                    return `[${type}] ${line}`;
                }).filter(Boolean).join('\n'); 

                socket.emit('admin:updateLogEntry', { id, version, type, description: processedDescription, jwt: adminToken });
            }
        }, 'success');
},
        'adjust-qcoins': ({ token, name }) => showModal('Q-Coins anpassen', `
            <p>Spieler: <strong>${name}</strong></p>
            <div class="form-group"><label for="modal-amount">Menge (negativ zum Abziehen)</label><input type="number" id="modal-amount" value="100"></div>`, 
            () => {
                const amount = parseInt(document.getElementById('modal-amount').value, 10);
                if (isNaN(amount)) { showToast('Ungültiger Betrag!', 'danger'); return; }
                socket.emit('admin:adjustQCoins', { token, amount, jwt: adminToken });
            }, 'success'),
        'dm-player': ({ token, name }) => showModal('Direktnachricht senden', `
            <p>Nachricht an: <strong>${name}</strong></p>
            <div class="form-group"><label for="modal-message">Nachricht</label><textarea id="modal-message" placeholder="Diese Nachricht erscheint beim Spieler als Toast..."></textarea></div>`,
            () => {
                const message = document.getElementById('modal-message').value;
                if (!message.trim()) return;
                socket.emit('admin:directMessage', { token, message, jwt: adminToken });
            }, 'success'),
        'grant-item': ({ token, name }) => {
    const itemOptions = Object.values(shopItems).map(item => `<option value="${item.id}">${item.name} (${item.type})</option>`).join('');
    showModal('Gegenstand vergeben', `
        <p>Spieler: <strong>${name}</strong></p>
        <div class="form-group"><label for="modal-item">Gegenstand auswählen</label><select id="modal-item">${itemOptions}</select></div>
        <div class="form-group"><label for="modal-quantity">Menge</label><input type="number" id="modal-quantity" value="1" min="1" max="100"></div>`,
        () => {
            const itemId = document.getElementById('modal-item').value;
            const quantity = document.getElementById('modal-quantity').value;
            socket.emit('admin:grantItem', { token, itemId, quantity, jwt: adminToken });
        }, 'success');
},
        'kick-player': ({ token, name }) => showModal('Spieler kicken', `
        <p>Spieler: <strong>${name}</strong></p>
        <div class="form-group"><label for="modal-reason">Grund (optional)</label><textarea id="modal-reason" placeholder="Grund für den Kick..."></textarea></div>`,
        () => {
            const reason = document.getElementById('modal-reason').value;
            socket.emit('admin:kickPlayer', { token, reason, jwt: adminToken });
        }),
        'delete-guild': ({ id, name }) => showModal('Gilde löschen', `<p>Soll die Gilde <strong>${name}</strong> wirklich gelöscht werden? Dies kann nicht rückgängig gemacht werden.</p>`, () => socket.emit('admin:deleteGuild', { guildId: id, jwt: adminToken })),
        'resolve-report': ({ id }) => socket.emit('admin:resolveReport', { reportId: id, jwt: adminToken }),
        'send-broadcast': () => {
            const message = document.getElementById('broadcast-message').value;
            if (!message.trim()) return;
            showModal('Nachricht senden?', `<p>Folgende Nachricht wird an <strong>alle Spieler</strong> gesendet:</p><p><i>"${message}"</i></p>`, () => socket.emit('admin:broadcastMessage', { message, jwt: adminToken }), 'success');
        },
        'force-end-game': () => {
            const roomId = document.getElementById('force-end-room-id').value.toUpperCase();
            if (!roomId.trim()) return;
            showModal('Spiel beenden?', `<p>Das Spiel im Raum <strong>${roomId}</strong> wird sofort beendet. Bist du sicher?</p>`, () => socket.emit('admin:forceEndGame', { roomId, jwt: adminToken }));
        },
        'enable-maintenance': () => {
            const message = document.getElementById('maintenance-message').value;
            socket.emit('admin:toggleMaintenance', { active: true, message, jwt: adminToken });
        },
        'disable-maintenance': () => {
            socket.emit('admin:toggleMaintenance', { active: false, jwt: adminToken });
        },
    };

    function showModal(title, bodyHtml, onConfirm, confirmClass = 'danger') {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = bodyHtml;
        const confirmBtn = document.getElementById('modal-confirm-btn');
        const cancelBtn = document.querySelector('#generic-modal-overlay .cancel-btn');
        const modal = document.getElementById('generic-modal-overlay');

        confirmBtn.className = 'modal-btn';
        if(confirmClass === 'info') {
            confirmBtn.textContent = 'OK';
            confirmBtn.classList.add('success');
            cancelBtn.classList.add('hidden'); 
        } else {
            confirmBtn.textContent = 'Bestätigen';
            confirmBtn.classList.add(confirmClass);
            cancelBtn.classList.remove('hidden');
        }

        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        const newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        
        const closeModal = () => modal.classList.add('hidden');

        if (onConfirm) {
            newConfirmBtn.addEventListener('click', () => {
                onConfirm();
                closeModal();
            });
        } else {
            newConfirmBtn.addEventListener('click', closeModal);
        }
        
        newCancelBtn.addEventListener('click', closeModal);
        modal.classList.remove('hidden');
    }

    window.removeBlacklistWord = (word) => {
    const adminToken = sessionStorage.getItem('adminToken');
    const event = new CustomEvent('admin:reqRemoveBlacklist', { detail: word });
    document.dispatchEvent(event);
};

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    }

if (adminToken) {
    logout();
}
});