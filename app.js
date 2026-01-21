const socket = io({
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

const safeSanitize = (str) => {
    if (typeof window.DOMPurify !== 'undefined') {
        return window.DOMPurify.sanitize(str);
    }
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

const coinImg = '<img src="assets/Coin.png" class="coin-icon" alt="Coins">';

let myPlayerToken = null;
let shopItems = {};
let achievements = {};
let chaosEvents = {};
let titles = {}; 
let currentGuilds = {};
let myPlayerData = {};
let currentGameState = null;
let currentPlayerProfile = null;
let previousGameState = null;
let decoyActive = false;
let discoActive = false;
let discoAudio = null;
let confettiInterval = null;
let decoyMouseMoveListener = null;
let autocorrectActive = false;
let autocorrectListener = null;
let isCaptchaActive = false;
let abductedElement = null;
const jumpscareAudio = new Audio('assets/jumpscare/jumpscare.mp3');
let hasJumpscarePlayedThisRound = false;    
let maintenanceLottieAnimation = null;
let earDestroyerSounds = [];
let earDestroyerActive = false;
let updateLogData = [];
let pikaSqueakActive = false;
let pikaAudio = null;
let pikaKeyListener = null;
let isLagMonsterActive = false;
let lagKeyListener = null;
let lagInterval = null;
let lagQueue = [];
let travelTimerInterval = null;

const getEl = (id) => document.getElementById(id);
const DOMElements = {
    lobbyScreen: getEl('lobbyScreen'),
    gameScreen: getEl('gameScreen'),
    playerNameInput: getEl('playerNameInput'),
    avatarSelector: getEl('avatarSelector'),
    createRoomBtn: getEl('createRoomBtn'),
    joinRoomBtn: getEl('joinRoomBtn'),
    spectateRoomBtn: getEl('spectateRoomBtn'),
    roomIdInput: getEl('roomIdInput'),
    lobbyMessage: getEl('lobbyMessage'),
    roundsInput: getEl('roundsInput'),
    durationInput: getEl('durationInput'),
    difficultySelect: getEl('difficultySelect'),
    gameModeSelect: getEl('gameModeSelect'),
    roomIdDisplay: getEl('roomIdDisplay'),
    spectatorCount: getEl('spectatorCount'),
    playerList: getEl('playerList'),
    gameStatusDisplay: getEl('gameStatusDisplay'),
    activeEventIndicator: getEl('activeEventIndicator'),
    automaticEventIndicator: getEl('automaticEventIndicator'),
    startGameBtn: getEl('startGameBtn'),
    timerContainer: getEl('timer-container'),
    timerBar: getEl('timer-bar'),
    roundCounter: getEl('round-counter'),
    problemCard: getEl('problemCard'),
    problemTitle: getEl('problemTitle'),
    problemDescription: getEl('problemDescription'),
    problemHint: getEl('problemHint'),
    solutionWrapper: getEl('solution-wrapper'),
    solutionInput: getEl('solutionInput'),
    submitBtn: getEl('submitBtn'),
    powerupContainer: getEl('powerupContainer'),
    waitingMessage: getEl('waitingMessage'),
    waitingRoomView: getEl('waitingRoomView'), 
    backToLobbyBtnNew: getEl('backToLobbyBtnNew'), 
    eliminatedActionsPanel: getEl('eliminated-actions-panel'),
    spectatorBettingPanel: getEl('spectator-betting-panel'), 
    countdownOverlay: getEl('countdownOverlay'),
    countdownText: getEl('countdownOverlay').querySelector('span'),
    eliminationOverlay: getEl('eliminationOverlay'),
    eliminatedPlayerName: getEl('eliminationOverlay').querySelector('.eliminated-player-name'),
    categoryChoiceOverlay: getEl('categoryChoiceOverlay'),
    categoryChooserName: getEl('categoryChooserName'),
    categoryButtonsContainer: getEl('categoryButtonsContainer'),
    eventVotingOverlay: getEl('eventVotingOverlay'),
    eventVoteTimer: getEl('eventVoteTimer'),
    eventChoicesContainer: getEl('eventChoicesContainer'),
    bettingOverlay: getEl('bettingOverlay'),
    bettingTimer: getEl('bettingTimer'),
    betAmountInput: getEl('betAmountInput'),
    placeBetBtn: getEl('placeBetBtn'),
    betConfirmationMsg: getEl('betConfirmationMsg'),
    gameOverOverlay: getEl('gameOverOverlay'),
    winnerAnnouncement: getEl('winner-announcement'),
    finalRanking: getEl('final-ranking'),
    backToLobbyBtn: getEl('backToLobbyBtn'),
    playAgainBtn: getEl('playAgainBtn'),
    suddenDeathOverlay: getEl('suddenDeathOverlay'),
    suddenDeathParticipants: getEl('suddenDeathParticipants'),
    playerChoiceOverlay: getEl('playerChoiceOverlay'),
    playerEventChoicesContainer: getEl('playerEventChoicesContainer'),
    rulesOverlay: getEl('rulesOverlay'),
    closeRulesBtn: getEl('closeRulesBtn'),
    rulesNav: getEl('rulesNav'), 
    rulesNavBtns: document.querySelectorAll('.rules-nav-btn'), 
    rulesSections: document.querySelectorAll('.rules-section'),
    finalBountyOverlay: getEl('finalBountyOverlay'),
    finalBountyPlayerList: getEl('finalBountyPlayerList'),
    chatToggleBtn: getEl('chat-toggle-btn'),
    chatContainer: getEl('chat-container'),
    chatForm: getEl('chat-form'),
    chatInput: getEl('chat-input'),
    chatMessages: getEl('chat-messages'),
    chatOpenBtn: getEl('chat-open-btn'),
    shopOverlay: getEl('shopOverlay'),
    closeShopBtn: getEl('closeShopBtn'),
    shopItemsContainer: getEl('shopItemsContainer'),
    shopQCoinsDisplay: getEl('shop-qcoins'),
    profileOverlay: getEl('profileOverlay'),
    closeProfileBtn: getEl('closeProfileBtn'),
    profileName: getEl('profile-name'),
    profileQCoins: getEl('profile-qcoins-display'),
    profileWins: getEl('profile-wins'),
    profileGames: getEl('profile-games'),
    profileWinrate: getEl('profile-winrate'),
    profileAchievementsList: getEl('profile-achievements-list'),
    profileAvatarImg: getEl('profile-avatar-img'),
    profileAvatarLevel: getEl('profile-avatar-level'),
    profileAvatarXpFill: getEl('profile-avatar-xp-fill'),
    profileAvatarXpText: getEl('profile-avatar-xp-text'),
    profileTitlesList: getEl('profile-titles-list'),
    guildOverlay: getEl('guildOverlay'),
    guildView: getEl('guild-view'), 
    noGuildView: getEl('no-guild-view'),
    closeGuildBtn: getEl('closeGuildBtn'),
    createGuildBtn: getEl('createGuildBtn'),
    joinGuildBtn: getEl('joinGuildBtn'),
    createGuildNameInput: getEl('createGuildNameInput'),
    createGuildTagInput: getEl('createGuildTagInput'),
    joinGuildIdInput: getEl('joinGuildIdInput'),
    missionsOverlay: getEl('missionsOverlay'),
    closeMissionsBtn: getEl('closeMissionsBtn'),
    missionsList: getEl('missionsList'),
    achievementToast: getEl('achievement-unlocked'),
    achievementName: getEl('achievement-unlocked').querySelector('.achievement-name'),
    levelUpToast: getEl('level-up-toast'),
    levelUpName: getEl('level-up-name'),
    countdownRoundInfo: getEl('countdown-round-info'),
    countdownCategoryInfo: getEl('countdown-category-info'),
    countdownQuestionTitle: getEl('countdown-question-title'),
    countdownTimerText: getEl('countdown-timer-text'),
    updateLogOverlay: getEl('updateLogOverlay'),
    closeUpdateLogBtn: getEl('closeUpdateLogBtn'),
    updateLogContent: getEl('update-log-content'),
    jumpscareOverlay: getEl('jumpscareOverlay'),
    captchaOverlay: getEl('captchaOverlay'),
};

const chaosVideoPaths = [
    'assets/videos/gameplay1.mp4',
    'assets/videos/gameplay2.mp4',
    'assets/videos/gameplay3.mp4',
    'assets/videos/gameplay4.mp4',
];

const chattiContainer = document.getElementById('chatti-container');
const chattiMsgs = document.getElementById('chatti-messages');
const chattiInput = document.getElementById('chattiInput');

let chaosPopupInterval = null;
let chaosActive = false;
let chaosMouseListener = null;
let chaosKeyListener = null;

const fxManager = {
    activeEffects: new Map(),
    init() {
        setInterval(() => this.cleanup(), 5000); 
    },
    cleanup() {
        for (const [element, intervals] of this.activeEffects.entries()) {
            if (!document.body.contains(element)) {
                intervals.forEach(clearInterval);
                this.activeEffects.delete(element);
            }
        }
    },
    _registerInterval(element, intervalId) {
        if (!this.activeEffects.has(element)) this.activeEffects.set(element, []);
        this.activeEffects.get(element).push(intervalId);
    },
    applyFireEffect(container) { 
        const createParticle = () => {
            if (!document.body.contains(container)) return;
            const isSparkle = Math.random() < 0.15;
            const p = document.createElement('div');
            p.className = 'fire-particle';
            p.style.left = `${Math.random() * container.offsetWidth}px`;
            p.style.top = `${container.offsetHeight * (0.7 + Math.random() * 0.3)}px`;
            
            const size = isSparkle ? (Math.random() * 4 + 2) : (Math.random() * 7 + 6);
            const lifetime = isSparkle ? (800 + Math.random() * 400) : (1200 + Math.random() * 500);
            const colorStart = isSparkle ? '#FFFFCC' : 'rgba(255,180,0,0.9)';
            const endY = isSparkle ? -(Math.random() * 80 + 40) : -(Math.random() * 40 + 20);

            p.style.width = `${size}px`; p.style.height = `${size}px`;
            p.style.setProperty('--color-start', colorStart); p.style.setProperty('--color-end', 'transparent');
            p.style.setProperty('--animation-duration', `${lifetime / 1000}s`);
            p.style.setProperty('--start-opacity', '1'); p.style.setProperty('--start-scale', '0.2');
            p.style.setProperty('--initial-x', '0px'); p.style.setProperty('--initial-y', '0px');
            p.style.setProperty('--end-x', `${(Math.random() - 0.5) * 50}px`);
            p.style.setProperty('--end-y', `${endY}px`);
            p.style.setProperty('--end-scale', `${isSparkle ? 0.2 : 1.0}`);
            
            container.appendChild(p);
            setTimeout(() => p.remove(), lifetime);
        };
        this._registerInterval(container, setInterval(createParticle, 50));
    },
    applyWinterEffect(container) { 
        const snowflakes = ["❄", "✻", "❅", "✼"]; 
        const createParticle = () => {
            if (!document.body.contains(container)) return;
            const p = document.createElement('div');
            p.className = 'snow-particle';
            p.innerText = snowflakes[Math.floor(Math.random() * snowflakes.length)];
            p.style.fontSize = `${Math.random() * 7 + 7}px`;
            p.style.left = `${Math.random() * container.offsetWidth}px`;
            p.style.top = `-10px`;
            p.style.setProperty("--drift", `${(Math.random() - 0.5) * 25}px`);
            const duration = Math.random() * 2.5 + 2.0;
            p.style.animationDuration = `${duration}s`;
            container.appendChild(p);
            setTimeout(() => p.remove(), duration * 1000);
        };
        this._registerInterval(container, setInterval(createParticle, 200));
    },
    applySmokeEffect(container) { 
        const createParticle = () => {
            if (!document.body.contains(container)) return;
            const p = document.createElement('div');
            p.className = 'smoke-particle';
            const size = Math.random() * 40 + 20;
            p.style.width = `${size}px`; p.style.height = `${size}px`;
            p.style.left = `${Math.random() * container.offsetWidth}px`;
            p.style.top = `${container.offsetHeight - (Math.random() * 10)}px`;
            const lifetime = 4000 + Math.random() * 2000;
            p.style.setProperty('--duration', `${lifetime / 1000}s`);
            p.style.setProperty('--end-y', `${-(Math.random() * 50 + 30)}px`);
            p.style.setProperty('--end-scale', `${1.5 + Math.random()}`);
            p.style.setProperty('--start-opacity', `${0.2 + Math.random() * 0.3}`);
            p.style.setProperty('--start-x-offset', `${(Math.random() - 0.5) * 40}px`);
            container.appendChild(p);
            setTimeout(() => p.remove(), lifetime);
        };
        this._registerInterval(container, setInterval(createParticle, 100));
    },
     applyLightningEffect(container) {
        const createBolt = () => {
            if (!document.body.contains(container)) return;

            const p = document.createElement('div');
            p.className = 'lightning-particle';

            const startSide = Math.floor(Math.random() * 4);
            const endSide = (startSide + Math.floor(Math.random() * 2) + 1) % 4;

            const getPosOnSide = (side) => {
                switch(side) {
                    case 0: return { x: Math.random() * container.offsetWidth, y: 0 }; 
                    case 1: return { x: container.offsetWidth, y: Math.random() * container.offsetHeight }; 
                    case 2: return { x: Math.random() * container.offsetWidth, y: container.offsetHeight }; 
                    default: return { x: 0, y: Math.random() * container.offsetHeight }; 
                }
            };

            const startPos = getPosOnSide(startSide);
            const endPos = getPosOnSide(endSide);
            
            const segmentCount = 5;
            let points = `${startPos.x},${startPos.y}`;
            for (let i = 1; i < segmentCount; i++) {
                const progress = i / segmentCount;
                const base_x = startPos.x + (endPos.x - startPos.x) * progress;
                const base_y = startPos.y + (endPos.y - startPos.y) * progress;
                const offsetX = (Math.random() - 0.5) * 15;
                const offsetY = (Math.random() - 0.5) * 15;
                points += ` ${base_x + offsetX},${base_y + offsetY}`;
            }
            points += ` ${endPos.x},${endPos.y}`;

            p.innerHTML = `<svg viewbox="0 0 ${container.offsetWidth} ${container.offsetHeight}" style="position: absolute; top:0; left:0; width:100%; height:100%; overflow: visible;">
                <polyline points="${points}" class="lightning-path"/>
            </svg>`;
            
            container.appendChild(p);
            setTimeout(() => p.remove(), 200);
        };
        this._registerInterval(container, setInterval(createBolt, 100 + Math.random() * 300));
    },
    applyGalaxyEffect(container) { 
        if (container.querySelector('.galaxy-particle')) return; 
        const planetClasses = ['p-mercury', 'p-venus', 'p-earth', 'p-mars', 'p-jupiter', 'p-saturn', 'p-uranus', 'p-neptune', 'p-pluto'];
        planetClasses.forEach(c => {
            const p = document.createElement('div');
            p.className = `galaxy-particle ${c}`;
            container.appendChild(p);
        });
    }
};

const travelManager = {
    overlay: null,
    welcomeView: null,
    destinationsView: null,
    albumView: null,
    qcoinsDisplay: null,
    levelDisplay: null,
    rewardModal: null,
    activeTravelNotice: null,
    timerView: null,
    claimView: null,
    timerInterval: null,
    
    init() {
        this.overlay = getEl('travelAgencyOverlay');
        this.welcomeView = getEl('travel-welcome-view');
        this.destinationsView = getEl('travel-destinations-view');
        this.albumView = getEl('travel-album-view');
        
        this.qcoinsDisplay = getEl('travel-qcoins-display');
        this.levelDisplay = getEl('travel-level-display');
        this.rewardModal = getEl('travel-reward-modal');
        this.activeTravelNotice = getEl('active-travel-notice');
        this.timerView = getEl('travel-timer-view');
        this.claimView = getEl('travel-claim-view');

        getEl('openTravelBtn').addEventListener('click', () => this.open());
        getEl('closeTravelAgencyBtn').addEventListener('click', () => this.close());
        
        getEl('show-destinations-btn').addEventListener('click', () => this.showView('destinations'));
        getEl('show-album-btn').addEventListener('click', () => this.showView('album'));
        
        if(this.overlay) {
            this.overlay.querySelectorAll('.bank-back-btn').forEach(btn => {
                btn.addEventListener('click', (e) => this.showView('welcome'));
            });
        }

        getEl('travel-reward-ok-btn').addEventListener('click', () => this.rewardModal.classList.add('hidden'));
        
        if(this.activeTravelNotice) {
            this.activeTravelNotice.addEventListener('click', (e) => {
                if (e.target.id === 'claim-travel-reward-btn-v2') {
                    socket.emit('travel:claim', { token: myPlayerToken });
                }
            });
        }
        
        const destGrid = getEl('destinations-grid-v2');
        if(destGrid) {
            destGrid.addEventListener('click', e => {
                const btn = e.target.closest('.start-travel-btn');
                if (btn && !btn.disabled) {
                    socket.emit('travel:start', { token: myPlayerToken, destinationId: btn.dataset.id });
                }
            });
        }

        const albumContent = getEl('album-content-v2');
        if (albumContent) {
            albumContent.addEventListener('click', (e) => {
                if (e.target.classList.contains('souvenir-icon') && e.target.dataset.fullSrc) {
                    const fullSrc = e.target.dataset.fullSrc;
                    const viewerOverlay = getEl('imageViewerOverlay');
                    const viewerImage = getEl('viewerImage');
                    
                    if (viewerOverlay && viewerImage) {
                        viewerImage.src = fullSrc;
                        viewerOverlay.classList.remove('hidden');
                    }
                }
            });
        }

        getEl('closeImageViewerBtn').addEventListener('click', () => {
            getEl('imageViewerOverlay').classList.add('hidden');
        });
    },

    open() {
        if (!myPlayerToken) return;
        socket.emit('travel:getData', { token: myPlayerToken });
    },

    close() {
        if (this.overlay) {
            this.overlay.classList.remove('force-visible');
            this.overlay.classList.add('hidden');
        }
        if (this.timerInterval) clearInterval(this.timerInterval);
    },

    showView(viewName) {
        if(this.welcomeView) this.welcomeView.classList.add('hidden');
        if(this.destinationsView) this.destinationsView.classList.add('hidden');
        if(this.albumView) this.albumView.classList.add('hidden');

        if (viewName === 'welcome' && this.welcomeView) this.welcomeView.classList.remove('hidden');
        if (viewName === 'destinations' && this.destinationsView) this.destinationsView.classList.remove('hidden');
        if (viewName === 'album' && this.albumView) this.albumView.classList.remove('hidden');
    },

    render(data) {
        this.overlay = getEl('travelAgencyOverlay');
        if (!this.overlay) return;
        this.overlay.classList.remove('hidden');
        this.overlay.classList.add('force-visible');
        this.welcomeView = getEl('travel-welcome-view');
        this.destinationsView = getEl('travel-destinations-view');
        this.albumView = getEl('travel-album-view');

        try {
            const { destinations, souvenirs, sets, playerTravel, qcoins, level } = data;
            
            const displayQCoins = (qcoins !== undefined) ? qcoins : (currentPlayerProfile?.qcoins || 0);
            const displayLevel = (level !== undefined) ? level : (currentPlayerProfile?.level || 1);

            if (this.qcoinsDisplay) this.qcoinsDisplay.innerHTML = `${displayQCoins} ${coinImg}`;
            if (this.levelDisplay) this.levelDisplay.textContent = `Lv. ${displayLevel}`;
            if(this.welcomeView) this.welcomeView.classList.add('hidden');
            if(this.destinationsView) this.destinationsView.classList.add('hidden');
            if(this.albumView) this.albumView.classList.add('hidden');
            if (playerTravel && playerTravel.activeTravel) {
                try { this.renderActiveTravel(playerTravel.activeTravel, destinations); } catch(e) {}
                if(this.welcomeView) this.welcomeView.classList.remove('hidden');
            } else {
                if(this.activeTravelNotice) this.activeTravelNotice.classList.add('hidden');
                const wText = getEl('globia-welcome-text');
                if(wText) wText.textContent = "Bereit, die Welt zu entdecken? Wohin soll die Reise gehen?";
                
                if(this.welcomeView) this.welcomeView.classList.remove('hidden');
            }

            this.renderDestinations(destinations, playerTravel?.activeTravel, displayQCoins, displayLevel);
            this.renderAlbum(souvenirs, sets, playerTravel?.collectedSouvenirs || []);

        } catch (error) {
            console.error("Fehler im Travel Render:", error);
        }
    },

    renderActiveTravel(journey, destinations) {
        if (this.timerInterval) clearInterval(this.timerInterval);
        if (!journey) return;

        const destination = destinations[journey.destinationId];
        const destName = destination ? DOMPurify.sanitize(destination.name) : 'einem fernen Land';
        
        if(this.activeTravelNotice) this.activeTravelNotice.classList.remove('hidden');
        const wText = getEl('globia-welcome-text');
        if(wText) wText.textContent = "Du bist gerade unterwegs. Komm wieder, wenn dein Abenteuer beendet ist!";

        const updateTimer = () => {
            const remaining = journey.endTime - Date.now();
            if (remaining <= 0) {
                clearInterval(this.timerInterval);
                if(this.timerView) this.timerView.classList.add('hidden');
                if(this.claimView) {
                    this.claimView.classList.remove('hidden');
                    getEl('travel-claim-destination').innerHTML = `Dein Abenteuer in <strong>${destName}</strong> ist vorbei.`;
                }
                return;
            }
            if(this.timerView) this.timerView.classList.remove('hidden');
            if(this.claimView) this.claimView.classList.add('hidden');
            
            getEl('travel-timer-destination').innerHTML = `Rückkehr aus <strong>${destName}</strong> in:`;
            
            const h = String(Math.floor(remaining / 3600000)).padStart(2, '0');
            const m = String(Math.floor((remaining % 3600000) / 60000)).padStart(2, '0');
            const s = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0');
            getEl('active-travel-timer').textContent = `${h}:${m}:${s}`;
        };
        updateTimer();
        this.timerInterval = setInterval(updateTimer, 1000);
    },

    renderDestinations(destinations, activeTravel, qcoins, level) {
        const grid = getEl('destinations-grid-v2');
        if(!grid) return;
        
        if (qcoins === undefined || level === undefined) {
             grid.innerHTML = "<p>Lade Daten...</p>";
             return;
        }

        grid.innerHTML = Object.values(destinations).map(dest => {
            const canAfford = qcoins >= dest.cost;
            const levelOk = level >= dest.level;
            const isLocked = !canAfford || !levelOk;
            
            let reason = '';
            if (activeTravel) reason = 'Du bist bereits auf Reisen';
            else if (!levelOk) reason = `Level ${dest.level} benötigt`;
            else if (!canAfford) reason = 'Zu teuer';

            let btnAttr = (isLocked || activeTravel) ? 'disabled' : '';
            let btnText = (isLocked || activeTravel) ? `<span>${reason}</span>` : `<span>Starten für ${dest.cost}</span> ${coinImg}`;

            return `<div class="destination-card-v2 ${isLocked ? 'locked' : ''}">
                        <div class="destination-card-v2-header">${dest.icon} ${safeSanitize(dest.name)}</div>
                        <div class="destination-card-v2-details">
                            <span><i class="material-icons">schedule</i> ${dest.duration / 3600000}h</span>
                            <span><i class="material-icons">military_tech</i> Lv. ${dest.level}</span>
                        </div>
                        <div class="destination-card-v2-footer">
                            <button class="start-travel-btn" data-id="${dest.id}" ${btnAttr}>${btnText}</button>
                        </div>
                    </div>`;
        }).join('');
    },

    renderAlbum(souvenirs, sets, collectedSouvenirs) {
        const albumEl = getEl('album-content-v2');
        if(!albumEl) return;

        albumEl.innerHTML = Object.keys(sets).map(setName => {
            const set = sets[setName];
            const regionKey = set.region.toLowerCase();
            const regionSouvenirs = souvenirs[regionKey] || [];
            const collectedInRegion = regionSouvenirs.filter(s => collectedSouvenirs.includes(s.id));
            const progress = regionSouvenirs.length > 0 ? (collectedInRegion.length / regionSouvenirs.length) * 100 : 0;
            
            return `<div class="album-set-v2">
                        <div class="album-set-v2-header">
                            <h4>${DOMPurify.sanitize(setName)}</h4>
                            <small>${collectedInRegion.length} / ${regionSouvenirs.length}</small>
                        </div>
                        <div class="set-progress-bar"><div class="set-progress-fill" style="width: ${progress}%"></div></div>
                        <div class="souvenir-grid-v2">
                            ${regionSouvenirs.map(s => {
                                const isCollected = collectedSouvenirs.includes(s.id);
                                return `<div class="souvenir-item-v2 ${isCollected ? 'collected' : ''}">
                                            <img class="souvenir-icon" 
                                                 src="assets/travel/${isCollected ? s.icon : 'unknown_souvenir.png'}" 
                                                 ${isCollected ? `data-full-src="assets/travel/${s.icon}"` : ''}
                                                 title="${isCollected ? 'Klicken zum Vergrößern' : 'Noch nicht gefunden'}">
                                        </div>`;
                            }).join('')}
                        </div>
                    </div>`;
        }).join('');
    },

    showReward(result) {
        let souvenirHtml = result.foundSouvenir ? `<li>Souvenir gefunden: <strong>${DOMPurify.sanitize(result.foundSouvenir.name)}</strong></li>` : '';
        const contentHtml = `<p>${DOMPurify.sanitize(result.story)}</p>
                             <ul><li>+${result.qcoinReward} ${coinImg}</li>${souvenirHtml}</ul>`;
        
        getEl('travel-reward-content').innerHTML = contentHtml;
        this.rewardModal.classList.remove('hidden');
        if (currentPlayerProfile) currentPlayerProfile.qcoins = result.qcoins;
        this.open();
    }
};

const tutorialManager = {
    currentStep: 0,
    overlay: getEl('tutorialOverlay'),
    contentContainer: document.querySelector('.tutorial-content'),
    dotsContainer: getEl('tutorial-dots'),
    nextBtn: getEl('tutorial-next'),
    prevBtn: getEl('tutorial-prev'),
    finishBtn: getEl('tutorial-finish'),
    
    steps: [
        {
            lottie: 'assets/lottie/Trophy.json',
            title: 'Willkommen, Herausforderer!',
            text: 'Tritt ein in die Arena, wo Wissen Macht ist und schnelle Antworten den Sieg bedeuten. Dein Weg zur Legende beginnt genau jetzt.'
        },
        {
            lottie: 'assets/lottie/Warning Animation.json',
            title: 'Eine kurze Warnung',
            text: 'Dieses Spiel enthält schnelle visuelle Effekte, blinkende Lichter und gelegentliche Schock-Effekte (Jumpscares), die für manche Spieler unangenehm sein könnten. Spiele mit Bedacht!'
        },
        {
            lottie: 'assets/lottie/Meditating Brain.json',
            title: 'Verstand statt Auswahl',
            text: 'Vergiss Multiple-Choice. Hier schreibst du deine Antworten selbst. Unsere KI erkennt sogar kleine Tippfehler und alternative Formulierungen.'
        },
        {
            lottie: 'assets/lottie/Fire Streak Orange.json',
            title: 'Jeder Punkt zählt',
            text: 'Sammle Punkte für richtige Antworten, sei schneller als die anderen für einen Speed-Bonus und halte deine Siegesserie (Streak) am Leben für massive Extra-Punkte!'
        },
        {
            lottie: 'assets/lottie/XO Spinner.json',
            title: 'Meistere das Chaos',
            text: 'Zufällige Chaos-Events können eine Runde komplett auf den Kopf stellen. Nutze strategische Joker aus dem Shop, um dir einen entscheidenden Vorteil zu verschaffen.'
        },
        {
            lottie: 'assets/lottie/3D Treasure Box.json',
            title: 'Werde zur Legende',
            text: 'Sammle<strong>Q-Coins</strong> für den Shop, steige im Level auf, um passive <strong>Perks</strong> freizuschalten, und zeige deine Erfolge mit stolzen <strong>Titeln</strong> vor deinem Namen. Spiele außerdem im <strong>Casino</strong> und teste dein Glück beim Gambeln.'
        },
        {
            lottie: 'assets/lottie/Slot Machine.json',
            title: 'Q-Coin Slot & Bank!',
            text: 'Für alle, die das Kribbeln brauchen: Unsere <strong>Slotmaschine</strong> dreht sich 24/7 für euch! 🎰 Falls euer Guthaben dabei mal schneller verschwindet als gedacht, keine Panik – die <strong>Bank</strong> hat ebenfalls 24/7 geöffnet und hilft euch direkt wieder auf die Beine. Viel Spaß beim Zocken (und immer schön verantwortungsvoll drehen 😉).'
        },
        {
            lottie: 'assets/lottie/Live chatbot.json',
            title: 'Dein Assistent: Chatti',
            text: 'Unten rechts findest du <strong>Chatti</strong>, unseren schlauen Bot. Klicke auf das Roboter-Icon, wenn du Fragen zu Regeln, Events oder Spielmechaniken hast. Er ist rund um die Uhr für dich da und lernt ständig dazu!'
        },
        {
            lottie: 'assets/lottie/Rocket Lunch.json',
            title: 'Die Arena wartet!',
            text: 'Du kennst die Regeln. Dein Wissen ist deine Waffe. Tritt jetzt einem Raum bei oder erstelle deinen eigenen. Zeig allen, wer der wahre Champion ist!'
        }
    ],

    init() {
        this.overlay.addEventListener('click', (e) => {
            if (e.target.id === 'tutorial-next') this.changeStep(1);
            if (e.target.id === 'tutorial-prev') this.changeStep(-1);
            if (e.target.id === 'tutorial-finish') this.finish();
        });
    },
    
    show() {
        this.dotsContainer.innerHTML = this.steps.map((_, i) => `<div class="dot" data-step="${i}"></div>`).join('');
        this.contentContainer.innerHTML = this.steps.map((step, i) => `
            <div class="tutorial-step ${i !== 0 ? 'hidden' : 'active'}" data-step="${i}">
                <div class="tutorial-icon"></div>
                <h2>${step.title}</h2>
                <p>${step.text}</p>
            </div>
        `).join('');

        this.steps.forEach((step, i) => {
            if (step.lottie) {
                const container = this.contentContainer.querySelector(`[data-step="${i}"] .tutorial-icon`);
                if(container) {
                    lottie.loadAnimation({
                        container: container,
                        renderer: 'svg',
                        loop: true,
                        autoplay: true,
                        path: step.lottie
                    });
                }
            }
        });

        this.currentStep = 0;
        this.updateNav();
        this.overlay.classList.remove('hidden');
    },

    renderStep() {
        this.contentContainer.querySelectorAll('.tutorial-step').forEach((el, i) => {
            el.classList.toggle('hidden', i !== this.currentStep);
            el.classList.toggle('active', i === this.currentStep);
        });
        this.updateNav();
    },

    updateNav() {
        this.dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentStep);
        });
        
        this.prevBtn.classList.toggle('hidden', this.currentStep === 0);
        this.nextBtn.classList.toggle('hidden', this.currentStep === this.steps.length - 1);
        this.finishBtn.classList.toggle('hidden', this.currentStep !== this.steps.length - 1);
    },

    changeStep(direction) {
        const newStep = this.currentStep + direction;
        if (newStep >= 0 && newStep < this.steps.length) {
            this.currentStep = newStep;
            this.renderStep();
        }
    },

    finish() {
        this.overlay.classList.add('hidden');
        localStorage.setItem('quizClashTutorialCompleted_v3', 'true');
    }
};

const casinoManager = {
    overlay: getEl('casinoV2Overlay'),
    welcomeView: getEl('casino-welcome-view'),
    slotView: getEl('casino-slot-machine-view'),
    spinBtn: getEl('casinoSpinBtnV2'),
    betInput: getEl('casinoBetInputV2'),
    reels: document.querySelectorAll('.reel-modern'), 
    reelInners: document.querySelectorAll('.reel-inner-v2'), 
    qcoinsDisplay: getEl('casino-qcoins-v2'),
    messageDisplay: getEl('casino-result-message-v2'),
    winLine: document.querySelector('.win-line-modern'),
    coinFallContainer: getEl('coin-fall-container-v2'), 
    paytableOverlay: getEl('paytable-overlay'),
    isSpinning: false,

    symbols: ['🍋', '🍒', '🔔', 'BAR', '💎', '❼'],
    symbolClasses: {
        '🍋': 'symbol-lemon', '🍒': 'symbol-cherry', '🔔': 'symbol-bell',
        'BAR': 'symbol-bar', '💎': 'symbol-diamond', '❼': 'symbol-7'
    },
    SYMBOL_HEIGHT: 140,

    init() {
        getEl('openCasinoBtn').addEventListener('click', () => this.open());
        getEl('closeCasinoBtnV2').addEventListener('click', () => this.close());
        getEl('show-slot-machine-btn').addEventListener('click', () => this.showView('slot-machine'));
        
        const backBtn = this.slotView.querySelector('.bank-back-btn');
        if(backBtn) backBtn.addEventListener('click', () => this.showView('welcome'));
        
        this.spinBtn.addEventListener('click', () => this.spin());

        const togglePaytableBtn = getEl('togglePaytableBtn');
        if(togglePaytableBtn) {
            togglePaytableBtn.addEventListener('click', () => {
                this.paytableOverlay.classList.toggle('hidden');
            });
        }
        
        if(this.paytableOverlay) {
            this.paytableOverlay.addEventListener('click', () => {
                this.paytableOverlay.classList.add('hidden');
            });
        }

        socket.on('casino:result', (data) => this.handleResult(data));
    },

    open() {
        if (!currentPlayerProfile) return;
        this.updateQCoins(currentPlayerProfile.qcoins);
        this.showView('welcome');
        this.overlay.classList.remove('hidden');
    },

    close() {
        this.overlay.classList.add('hidden');
        if(this.paytableOverlay) this.paytableOverlay.classList.add('hidden');
    },
    
    showView(viewName) {
        this.welcomeView.classList.toggle('hidden', viewName !== 'welcome');
        this.slotView.classList.toggle('hidden', viewName !== 'slot-machine');
        if (viewName === 'slot-machine') this.reset();
    },

    updateQCoins(amount) {
        this.qcoinsDisplay.innerHTML = `${amount} ${coinImg}`;
        if (currentPlayerProfile) currentPlayerProfile.qcoins = amount;
        const mainQCoins = getEl('profile-qcoins-display');
        if(mainQCoins) mainQCoins.innerHTML = `${amount} ${coinImg}`;
    },

    reset() {
        this.winLine.classList.add('hidden');
        this.reelInners.forEach(inner => {
            inner.querySelectorAll('div').forEach(div => div.classList.remove('glowing'));
        });
        this.coinFallContainer.innerHTML = '';
        this.messageDisplay.textContent = 'Drücke SPIN zum Starten';
        this.messageDisplay.style.color = 'var(--accent-primary)';
    },
    
    spin() {
        if (this.isSpinning) return;
        const betAmount = parseInt(this.betInput.value, 10);
        if (isNaN(betAmount) || betAmount <= 0) {
            this.messageDisplay.textContent = "Ungültiger Einsatz";
            return;
        }
        if (currentPlayerProfile.qcoins < betAmount) {
            this.messageDisplay.textContent = "Zu wenig Q-Coins!";
            this.messageDisplay.style.color = 'var(--accent-danger)';
            return;
        }
        
        this.reset();
        this.isSpinning = true;
        this.spinBtn.disabled = true;
        this.betInput.disabled = true;

        this.updateQCoins(currentPlayerProfile.qcoins - betAmount);
        this.messageDisplay.textContent = "Viel Glück...";

        this.reelInners.forEach((inner, index) => {
            inner.style.transition = 'none'; 
            inner.style.transform = `translateY(0px)`; 
            inner.offsetHeight; 
            inner.style.transition = `transform ${2 + index * 0.4}s cubic-bezier(0.4, 0.0, 0.2, 1)`;
            const randomOffset = Math.random() * this.SYMBOL_HEIGHT;
            inner.style.transform = `translateY(-${this.SYMBOL_HEIGHT * 20 + randomOffset}px)`;
        });

        socket.emit('casino:spin', { betAmount });
    },

    handleResult(data) {
        if (data.error) {
            this.messageDisplay.textContent = data.error;
            this.updateQCoins(data.newQCoins || currentPlayerProfile.qcoins);
            this.resetControls();
            return;
        }

        const stopReel = (index) => {
            const inner = this.reelInners[index];
            const finalSymbol = data.reels[index];
            const symbolStrip = [...this.symbols, ...this.symbols, ...this.symbols, ...this.symbols.slice(0, 5)];
            inner.innerHTML = symbolStrip.map(s => `<div class="${this.symbolClasses[s]}" style="height: ${this.SYMBOL_HEIGHT}px;">${s}</div>`).join('');
            const targetSymbolIndex = this.symbols.indexOf(finalSymbol) + this.symbols.length; 
            const finalPosition = -(targetSymbolIndex * this.SYMBOL_HEIGHT);
            const currentTransform = window.getComputedStyle(inner).transform;
            inner.style.transition = 'none';
            inner.style.transform = currentTransform; 
            inner.offsetHeight; 
            inner.style.transition = `transform ${0.6 + index * 0.2}s cubic-bezier(0.15, 0.9, 0.3, 1.1)`; 
            inner.style.transform = `translateY(${finalPosition}px)`;

            if (index === this.reels.length - 1) {
                setTimeout(() => this.showResult(data), 800 + index * 100);
            }
        };

        this.reels.forEach((_, i) => {
            setTimeout(() => stopReel(i), 100 + i * 300); 
        });
    },

    showResult(data) {
        if (data.payout > 0) {
            this.messageDisplay.textContent = `GEWINN! ${data.payout} Q-Coins!`;
            this.messageDisplay.style.color = '#4caf50';
            this.winLine.classList.remove('hidden');
            this.showWinAnimation(data);

            if (data.winType) {
                const indicesToGlow = data.winType.type === '3x' ? [0, 1, 2] : (data.reels[0] === data.reels[1] ? [0, 1] : [1, 2]);
                indicesToGlow.forEach(reelIndex => {
                    const inner = this.reelInners[reelIndex];
                    const targetSymbolIndex = this.symbols.indexOf(data.reels[reelIndex]) + this.symbols.length;
                    const symbolEl = inner.children[targetSymbolIndex];
                    if(symbolEl) symbolEl.classList.add('glowing');
                });
            }
        } else {
            this.messageDisplay.textContent = "Leider verloren.";
            this.messageDisplay.style.color = 'var(--text-secondary)';
        }

        this.updateQCoins(data.newQCoins);
        this.resetControls();
    },

    showWinAnimation(data) {
        for (let i = 0; i < Math.min(data.payout / 2, 30); i++) {
            setTimeout(() => {
                const coin = document.createElement('div');
                coin.className = 'coin-fall-v2';
                coin.style.left = `${Math.random() * 90 + 5}%`;
                coin.style.animationDuration = `${Math.random() * 1 + 1}s`;
                this.coinFallContainer.appendChild(coin);
                setTimeout(() => coin.remove(), 2000);
            }, i * 50);
        }
    },

    resetControls() {
        this.isSpinning = false;
        this.spinBtn.disabled = false;
        this.betInput.disabled = false;
    }
};

const bankManager = {
    overlay: getEl('bankOverlay'),
    qcoinsDisplay: getEl('bank-qcoins-display'),
    debtDisplay: getEl('bank-debt-display'),
    messageDisplay: getEl('bank-message'),
    loanInput: getEl('loanAmountInput'),
    repayInput: getEl('repayAmountInput'),
    tellerView: getEl('bank-teller-view'),
    loanView: getEl('bank-loan-view'),
    repayView: getEl('bank-repay-view'),

    init() {
        getEl('openBankBtn').addEventListener('click', () => this.open());
        getEl('closeBankBtn').addEventListener('click', () => this.close());
        getEl('show-loan-view-btn').addEventListener('click', () => this.showView('loan'));
        getEl('show-repay-view-btn').addEventListener('click', () => this.showView('repay'));
        getEl('takeLoanBtn').addEventListener('click', () => this.takeLoan());
        getEl('repayDebtBtn').addEventListener('click', () => this.repayDebt());
        this.loanView.querySelector('.bank-back-btn').addEventListener('click', () => this.resetView());
        this.repayView.querySelector('.bank-back-btn').addEventListener('click', () => this.resetView());


        socket.on('bank:update', (data) => this.handleUpdate(data));
        socket.on('bank:error', (message) => this.handleError(message));
    },

    open() {
        if (!currentPlayerProfile) return;
        this.updateDisplay(currentPlayerProfile.qcoins, currentPlayerProfile.debt || 0);
        this.resetView();
        this.overlay.classList.remove('hidden');
    },
    
    close() {
        this.overlay.classList.add('hidden');
    },

    resetView() {
        this.tellerView.classList.remove('hidden');
        this.loanView.classList.add('hidden');
        this.repayView.classList.add('hidden');
        this.messageDisplay.textContent = '';
        this.messageDisplay.className = 'message-box';
        this.loanInput.value = '';
        this.repayInput.value = '';
    },
    
    showView(viewName) {
        this.tellerView.classList.add('hidden');
        if (viewName === 'loan') {
            this.loanView.classList.remove('hidden');
        } else if (viewName === 'repay') {
            this.repayView.classList.remove('hidden');
        }
    },

    updateDisplay(qcoins, debt) {
        this.qcoinsDisplay.innerHTML = `${qcoins} ${coinImg}`;
        this.debtDisplay.innerHTML = `${debt} ${coinImg}`;

        if (currentPlayerProfile) {
            currentPlayerProfile.qcoins = qcoins;
            currentPlayerProfile.debt = debt;
        }

        getEl('show-loan-view-btn').disabled = debt > 0;
        getEl('show-repay-view-btn').disabled = debt === 0;
    },

    takeLoan() {
        const amount = this.loanInput.value;
        socket.emit('bank:takeLoan', { amount });
    },

    repayDebt() {
        const amount = this.repayInput.value;
        socket.emit('bank:repayDebt', { amount });
    },

    handleUpdate(data) {
        this.updateDisplay(data.newQCoins, data.newDebt);
        this.resetView();
        this.messageDisplay.textContent = data.message;
        this.messageDisplay.classList.add('success');
    },

    handleError(message) {
        this.messageDisplay.textContent = message;
        this.messageDisplay.classList.add('error');
    }
};

function populateAvatarSelector(avatars) {
    if (!DOMElements.avatarSelector) return;
    DOMElements.avatarSelector.innerHTML = ''; 

    const avatarList = Array.isArray(avatars) ? avatars : [];
    
    avatarList.forEach((avatarFile, index) => {
        const img = document.createElement('img');
        img.src = `assets/avatars/${avatarFile}`;
        img.dataset.avatar = avatarFile;
        img.alt = `Avatar ${index + 1}`;
        if (index === 0) {
            img.classList.add('selected');
        }
        DOMElements.avatarSelector.appendChild(img);
    });
}

let chattiFuse = null;

function initChatti() {
    if (typeof Fuse === 'undefined' || typeof chattiData === 'undefined') {
        console.warn("Chatti konnte nicht geladen werden (Fuse oder Data fehlt).");
        return;
    }

    const options = {
        includeScore: true,
        keys: ['triggers'],
        threshold: 0.4,
        ignoreLocation: true
    };
    chattiFuse = new Fuse(chattiData, options);

    const container = document.getElementById('chatti-container');
    const openBtn = document.getElementById('openChattiBtn');
    const closeBtn = document.getElementById('closeChattiBtn');
    const sendBtn = document.getElementById('chattiSendBtn');
    const input = document.getElementById('chattiInput');

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            container.classList.remove('chatti-closed');
            setTimeout(() => input.focus(), 100); 
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            container.classList.add('chatti-closed');
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', askChatti);
    }

    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') askChatti();
        });
    }
}

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

function askChatti() {
    const inputEl = document.getElementById('chattiInput');
    const msgsEl = document.getElementById('chatti-messages');
    const inputRaw = inputEl.value.trim();

    if (!inputRaw) return;

    msgsEl.innerHTML += `<div class="chatti-msg user">${safeSanitize(inputRaw)}</div>`;
    inputEl.value = '';
    msgsEl.scrollTop = msgsEl.scrollHeight;

    const typingId = `typing-${Date.now()}`;
    msgsEl.innerHTML += `
        <div id="${typingId}" class="chatti-typing">
            <span></span><span></span><span></span>
        </div>
    `;
    msgsEl.scrollTop = msgsEl.scrollHeight;

    setTimeout(() => {
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();

        if (typeof chattiData === 'undefined') return;

        const inputLower = inputRaw.toLowerCase();
        let replyObj = null;

        for (const item of chattiData) {
            const match = item.triggers.some(trigger => {
                return inputLower.includes(trigger.toLowerCase());
            });

            if (match) {
                replyObj = item;
                break; 
            }
        }

        if (!replyObj && typeof chattiFuse !== 'undefined') {
            const results = chattiFuse.search(inputRaw);
            if (results.length > 0) {
                if (results[0].score < 0.4) { 
                    replyObj = results[0].item;
                }
            }
        }

        if (!replyObj) {
            replyObj = chattiData.find(d => d.triggers.includes('fallback_default'));
        }

        if (replyObj) {
            const text = pickRandom(replyObj.answers);
            const moodClass = replyObj.mood || '';
            msgsEl.innerHTML += `<div class="chatti-msg bot ${moodClass}">${text}</div>`;
        }
        
        msgsEl.scrollTop = msgsEl.scrollHeight;

    }, 600 + Math.random() * 800);
}

function showLobbyMessage(message, isError = false, duration = 4000) {
    const msgBox = DOMElements.lobbyMessage;
    if (!msgBox) return; 
    msgBox.textContent = DOMPurify.sanitize(message);
    msgBox.classList.toggle('error', isError);
    if (duration > 0) {
        setTimeout(() => {
            if (msgBox.textContent === message) {
                msgBox.textContent = '';
                msgBox.classList.remove('error');
            }
        }, duration);
    }
}

function showScreen(screenName) {
    DOMElements.lobbyScreen.classList.add('hidden');
    DOMElements.gameScreen.classList.add('hidden');
    if (DOMElements.chatOpenBtn) DOMElements.chatOpenBtn.classList.remove('visible');
    if (screenName === 'lobby') {
        DOMElements.lobbyScreen.classList.remove('hidden');
        document.querySelectorAll('.overlay').forEach(o => o.classList.add('hidden'));
    } else if (screenName === 'game') {
        DOMElements.gameScreen.classList.remove('hidden');
        if (DOMElements.chatOpenBtn) DOMElements.chatOpenBtn.classList.add('visible');
    }
}

const openMenuBtn = getEl('openMenuBtn');
const closeMenuBtn = getEl('closeMenuBtn');
const sideMenu = getEl('sideMenu');
const menuOverlay = getEl('menuOverlay');

function openReportModal() {
    if (!myPlayerToken) {
        showLobbyMessage('Du musst eingeloggt sein, um eine Meldung zu senden.', true);
        return;
    }
    const reportOverlay = getEl('generalReportOverlay');
    const reportTypeSelect = getEl('reportTypeSelect');
    const reportPlayerNameInput = getEl('reportPlayerNameInput');
    
    if (reportOverlay) reportOverlay.classList.remove('hidden');
    if (reportTypeSelect) {
        reportTypeSelect.value = 'player';
        if (reportPlayerNameInput) reportPlayerNameInput.style.display = 'block';
    }
    if (getEl('reportDetailsInput')) getEl('reportDetailsInput').value = '';
    if (reportPlayerNameInput) reportPlayerNameInput.value = '';
}

const menuActions = {
    'openProfileBtn': openProfile,
    'openGuildBtn': () => { if (myPlayerToken) socket.emit('getGuildData', { token: myPlayerToken }) },
    'openMissionsBtn': () => { if (myPlayerToken) socket.emit('getMissions', { token: myPlayerToken }) },
    'openShopBtnLobby': openShop,
    'openCasinoBtn': () => casinoManager.open(),
    'openBankBtn': () => bankManager.open(),
    'openTravelBtn': () => travelManager.open(),
    'openUpdateLogBtn': () => {
        populateUpdateLog();
        DOMElements.updateLogOverlay.classList.remove('hidden');
    },
    'openAboutDevBtn': () => {
        const aboutOverlay = document.getElementById('aboutDevOverlay');
        if (aboutOverlay) aboutOverlay.classList.remove('hidden');
    },
    'openRulesBtn': () => DOMElements.rulesOverlay.classList.remove('hidden'),
    'openReportBtn': openReportModal
};

const toggleMenu = () => {
    if (sideMenu) sideMenu.classList.toggle('open');
    if (menuOverlay) menuOverlay.classList.toggle('visible');
};

if (openMenuBtn) openMenuBtn.addEventListener('click', toggleMenu);
if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);
if (menuOverlay) menuOverlay.addEventListener('click', toggleMenu);
const sideMenuNav = document.querySelector('.side-menu-nav');
if (sideMenuNav) {
    sideMenuNav.addEventListener('click', (e) => {
        const link = e.target.closest('.side-menu-link');
        if (link && menuActions[link.id]) {
            e.preventDefault();
            menuActions[link.id]();
            toggleMenu(); 
        }
    });
}

function setupEventListeners() {
    const lobbyTabNav = document.querySelector('.lobby-tab-nav');
    if (lobbyTabNav) {
        lobbyTabNav.addEventListener('click', (e) => {
            const tabButton = e.target.closest('.lobby-tab-btn');
            if (!tabButton) return;

            const tabId = tabButton.dataset.tab;
            
            document.querySelectorAll('.lobby-tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.lobby-tab-content').forEach(content => content.classList.remove('active'));

            tabButton.classList.add('active');
            const activeTab = document.getElementById(tabId);
            if (activeTab) {
                activeTab.classList.add('active');
            }
        });
    }
    if (DOMElements.rulesNav) {
        DOMElements.rulesNav.addEventListener('click', (e) => {
            const navButton = e.target.closest('.rules-nav-btn');
            if (!navButton) return;

            const sectionId = navButton.dataset.section;
            if (!sectionId) return;

            DOMElements.rulesNavBtns.forEach(btn => btn.classList.remove('active'));
            DOMElements.rulesSections.forEach(section => section.classList.remove('active'));

            navButton.classList.add('active');
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    }

    if (DOMElements.playerNameInput) {
        DOMElements.playerNameInput.addEventListener('blur', login);
        DOMElements.playerNameInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') login(); });
    }
    if (DOMElements.createRoomBtn) DOMElements.createRoomBtn.addEventListener('click', createRoom);
    if (DOMElements.joinRoomBtn) DOMElements.joinRoomBtn.addEventListener('click', () => handleJoin(false));
    if (DOMElements.spectateRoomBtn) DOMElements.spectateRoomBtn.addEventListener('click', () => handleJoin(true));
    if (DOMElements.startGameBtn) DOMElements.startGameBtn.addEventListener('click', () => socket.emit('startGame'));
    if (DOMElements.submitBtn) DOMElements.submitBtn.addEventListener('click', submitSolution);
    if (DOMElements.solutionInput) DOMElements.solutionInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') submitSolution(); });
    if (DOMElements.closeRulesBtn) DOMElements.closeRulesBtn.addEventListener('click', () => DOMElements.rulesOverlay.classList.add('hidden'));
    if (DOMElements.backToLobbyBtn) DOMElements.backToLobbyBtn.addEventListener('click', () => location.reload());
    if (DOMElements.backToLobbyBtnNew) DOMElements.backToLobbyBtnNew.addEventListener('click', () => location.reload());
    if (DOMElements.playAgainBtn) DOMElements.playAgainBtn.addEventListener('click', () => socket.emit('startGame'));
    if (DOMElements.chatOpenBtn) DOMElements.chatOpenBtn.addEventListener('click', toggleChat);
    if (DOMElements.chatToggleBtn) DOMElements.chatToggleBtn.addEventListener('click', toggleChat);
    if (DOMElements.openShopBtnGame) DOMElements.openShopBtnGame.addEventListener('click', openShop);
    if (DOMElements.chatForm) DOMElements.chatForm.addEventListener('submit', (e) => { e.preventDefault(); const msg = DOMElements.chatInput.value.trim(); if (msg) { socket.emit('chatMessage', msg); DOMElements.chatInput.value = ''; }});
    if (DOMElements.closeShopBtn) DOMElements.closeShopBtn.addEventListener('click', () => DOMElements.shopOverlay.classList.add('hidden'));
    if (DOMElements.closeProfileBtn) DOMElements.closeProfileBtn.addEventListener('click', () => DOMElements.profileOverlay.classList.add('hidden'));
    if (DOMElements.closeMissionsBtn) DOMElements.closeMissionsBtn.addEventListener('click', () => DOMElements.missionsOverlay.classList.add('hidden'));
    if (DOMElements.openGuildBtn) DOMElements.openGuildBtn.addEventListener('click', () => { if (myPlayerToken) socket.emit('getGuildData', { token: myPlayerToken }); });
    if (DOMElements.closeGuildBtn) {
    DOMElements.closeGuildBtn.addEventListener('click', () => {
        DOMElements.guildOverlay.classList.add('hidden');
        if (DOMElements.gameScreen.classList.contains('hidden')) {
            if (DOMElements.chatOpenBtn) DOMElements.chatOpenBtn.classList.remove('visible');
        }
    });
}
    if (DOMElements.createGuildBtn) DOMElements.createGuildBtn.addEventListener('click', () => {
        const name = DOMElements.createGuildNameInput.value;
        const tag = DOMElements.createGuildTagInput.value;
        socket.emit('createGuild', { token: myPlayerToken, name, tag });
    });
    if (DOMElements.joinGuildBtn) DOMElements.joinGuildBtn.addEventListener('click', () => {
        const guildId = DOMElements.joinGuildIdInput.value;
        socket.emit('joinGuild', { token: myPlayerToken, guildId });
    });

    const logoutBtn = getEl('logoutBtn');
    if(logoutBtn) logoutBtn.addEventListener('click', showLoginViewForNameChange);

    if (DOMElements.roomIdDisplay) {
        DOMElements.roomIdDisplay.addEventListener('click', () => {
            navigator.clipboard.writeText(DOMElements.roomIdDisplay.textContent).then(() => {
                showSystemToast('Raum-ID wurde kopiert!');
            });
        });
    }

    DOMElements.gameScreen.addEventListener('click', (e) => {
    const hostBtn = e.target.closest('.host-control-btn');
        if (hostBtn) {
            e.stopPropagation(); 
            const targetId = hostBtn.dataset.targetId;
            const targetName = hostBtn.dataset.targetName;
            
            if (window.openHostMenu) {
                window.openHostMenu(e, targetId, targetName);
            }
            return; 
        }
    const profileButton = e.target.closest('[data-action="view-profile"]');
    if (profileButton) {
        const token = profileButton.dataset.token;
        if (token) {
            socket.emit('getPlayerProfile', { token });
        }
    }
});

    const closeTravelBtn = getEl('closeTravelBtn');
    if (closeTravelBtn) closeTravelBtn.addEventListener('click', () => getEl('travelOverlay').classList.add('hidden'));

    const openAlbumBtn = getEl('openAlbumBtn');
    if (openAlbumBtn) openAlbumBtn.addEventListener('click', () => getEl('albumOverlay').classList.remove('hidden'));
    
    const closeAlbumBtn = getEl('closeAlbumBtn');
    if(closeAlbumBtn) closeAlbumBtn.addEventListener('click', () => getEl('albumOverlay').classList.add('hidden'));


    if (DOMElements.openAboutDevBtn) DOMElements.openAboutDevBtn.addEventListener('click', () => DOMElements.aboutDevOverlay.classList.remove('hidden'));
    if (getEl('closeAboutDevBtn')) getEl('closeAboutDevBtn').addEventListener('click', () => getEl('aboutDevOverlay').classList.add('hidden'));
    if (DOMElements.openUpdateLogBtn) DOMElements.openUpdateLogBtn.addEventListener('click', () => {
        populateUpdateLog();
        DOMElements.updateLogOverlay.classList.remove('hidden');
    });
    if (DOMElements.closeUpdateLogBtn) DOMElements.closeUpdateLogBtn.addEventListener('click', () => DOMElements.updateLogOverlay.classList.add('hidden'));

    const eliminatedPanel = getEl('eliminated-actions-panel');
    if (eliminatedPanel) {
        eliminatedPanel.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button || !myPlayerToken) return;
            const action = button.id.replace('sabotage-', '');
            socket.emit('sabotage', { token: myPlayerToken, action });
        });
    }

    if (DOMElements.gameModeSelect) {
        DOMElements.gameModeSelect.addEventListener('change', (e) => {
            const isSurvival = e.target.value === 'survival';
            DOMElements.roundsInput.disabled = isSurvival;
            if (isSurvival) DOMElements.roundsInput.value = '';
        });
    }
    const reportOverlay = getEl('generalReportOverlay');
    const reportCancelBtn = getEl('reportCancelBtn');
    const reportSubmitBtn = getEl('reportSubmitBtn');
    const reportTypeSelect = getEl('reportTypeSelect');
    const reportPlayerNameInput = getEl('reportPlayerNameInput');
    const reportDetailsInput = getEl('reportDetailsInput');

    if (reportTypeSelect) {
        reportTypeSelect.addEventListener('change', () => {
            reportPlayerNameInput.style.display = (reportTypeSelect.value === 'player') ? 'block' : 'none';
        });
    }
    if (reportCancelBtn) reportCancelBtn.addEventListener('click', () => reportOverlay.classList.add('hidden'));
    if (reportSubmitBtn) {
        reportSubmitBtn.addEventListener('click', () => {
            const type = reportTypeSelect.value;
            const targetName = reportPlayerNameInput.value.trim();
            const details = reportDetailsInput.value.trim();
            if (type === 'player' && !targetName) return showSystemToast('Bitte gib den Namen des Spielers an.');
            if (!details) return showSystemToast('Bitte gib eine Beschreibung an.');
            socket.emit('submitGeneralReport', { type, targetName, details, token: myPlayerToken });
            reportOverlay.classList.add('hidden');
            showSystemToast('Deine Meldung wurde erfolgreich übermittelt. Vielen Dank!');
        });
    }
    if(DOMElements.missionsList) {
        DOMElements.missionsList.addEventListener('click', e => {
            const claimBtn = e.target.closest('.claim-btn');
            if (claimBtn && !claimBtn.disabled) {
                socket.emit('claimMissionReward', { token: myPlayerToken, missionType: claimBtn.dataset.missionType });
            }
        });
    }
    if(DOMElements.shopItemsContainer) {
        DOMElements.shopItemsContainer.addEventListener('click', (e) => {
            if (!myPlayerToken) return;
            const buyBtn = e.target.closest('.buy-btn');
            const applyBtn = e.target.closest('.apply-btn');
            if (buyBtn) socket.emit('buyItem', { token: myPlayerToken, itemId: buyBtn.dataset.itemId });
            else if (applyBtn) socket.emit('equipItem', { token: myPlayerToken, itemId: applyBtn.dataset.itemId });
        });
    }
if(DOMElements.avatarSelector) {
    DOMElements.avatarSelector.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
            DOMElements.avatarSelector.querySelectorAll('img').forEach(img => img.classList.remove('selected'));
            e.target.classList.add('selected');
            if (DOMElements.playerNameInput.value.trim() || myPlayerToken) {
                login();
            }
        }
    });
}
    if(DOMElements.placeBetBtn) {
        DOMElements.placeBetBtn.addEventListener('click', () => {
            const amount = DOMElements.betAmountInput.value;
            if (amount && myPlayerToken) socket.emit('placeBet', { token: myPlayerToken, amount });
        });
    }

socket.on('showGuildData', ({ guild, guilds }) => {
    currentGuilds = guilds || {};
    DOMElements.guildOverlay.classList.remove('hidden');
    DOMElements.noGuildView.classList.toggle('hidden', !!guild);
    DOMElements.guildView.classList.toggle('hidden', !guild);

    if (DOMElements.chatOpenBtn) DOMElements.chatOpenBtn.classList.add('visible');

    if (guild) {
        renderGuildView(guild);
    }
});

socket.on('forceRelog', (data) => {
    showAlertModal(data.message, 'Admin-Aktion');
    localStorage.removeItem('quizClashPlayerToken');
    setTimeout(() => {
        location.reload();
    }, 4000); 
});

socket.on('maintenanceStatus', (status) => {
    const overlay = getEl('maintenanceOverlay');
    if (status.active) {
        getEl('maintenance-message').textContent = status.message;
        overlay.classList.remove('hidden');
        if (!maintenanceLottieAnimation) {
            maintenanceLottieAnimation = lottie.loadAnimation({
                container: getEl('maintenance-lottie'),
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: 'assets/lottie/Under Maintenance.json' 
            });
        }
    } else {
        overlay.classList.add('hidden');
    }
});

socket.on('forceBSOD', () => {
    const bsod = document.getElementById('bsodOverlay');
    bsod.classList.add('active');
    
    setTimeout(() => {
        bsod.classList.remove('active');
    }, 9000);
});

socket.on('playerBanned', ({ reason, banned_until }) => {
    const banScreen = getEl('banScreen');
    const reasonEl = getEl('banReasonText');
    const durationEl = getEl('banDurationText');
    const appealContainer = getEl('appeal-button-container');
    const openAppealBtn = getEl('openAppealBtn');

    reasonEl.textContent = `Grund: ${reason || 'Kein Grund angegeben.'}`;
    const isPermanent = !banned_until;
    durationEl.textContent = isPermanent
        ? 'Dauer: Permanent'
        : `Dauer: Dein Bann endet am ${new Date(banned_until).toLocaleString('de-DE')}`;
    
    appealContainer.classList.toggle('hidden', !isPermanent);
    
    banScreen.classList.remove('hidden');

    const newOpenAppealBtn = openAppealBtn.cloneNode(true);
    openAppealBtn.parentNode.replaceChild(newOpenAppealBtn, openAppealBtn);

    if (isPermanent) {
        newOpenAppealBtn.addEventListener('click', () => {
            showAppealModal();
        });
    }
});

socket.on('unbanRequestStatus', ({ success, message }) => {
    showAlertModal(message, success ? 'Antrag gesendet' : 'Fehler');
});


DOMElements.missionsList.addEventListener('click', e => {
    const claimBtn = e.target.closest('.claim-btn');
    if (claimBtn && !claimBtn.disabled) {
        socket.emit('claimMissionReward', { token: myPlayerToken, missionType: claimBtn.dataset.missionType });
    }
});
    
    DOMElements.shopItemsContainer.addEventListener('click', (e) => {
        if (!myPlayerToken) return;
        const buyBtn = e.target.closest('.buy-btn');
        const applyBtn = e.target.closest('.apply-btn');
        if (buyBtn) socket.emit('buyItem', { token: myPlayerToken, itemId: buyBtn.dataset.itemId });
        else if (applyBtn) socket.emit('equipItem', { token: myPlayerToken, itemId: applyBtn.dataset.itemId });
    });

    DOMElements.avatarSelector.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        DOMElements.avatarSelector.querySelectorAll('img').forEach(img => img.classList.remove('selected'));
        e.target.classList.add('selected');
        
        if (DOMElements.playerNameInput.value.trim()) {
            login();
        }
    }
});
    
    DOMElements.placeBetBtn.addEventListener('click', () => {
        const amount = DOMElements.betAmountInput.value;
        if (amount && myPlayerToken) socket.emit('placeBet', { token: myPlayerToken, amount });
    });
}

socket.on('playerLevelUp', ({ level, xp, qcoins }) => {
    if(currentPlayerProfile) {
        currentPlayerProfile.qcoins = qcoins;
        currentPlayerProfile.level = level;
        currentPlayerProfile.xp = xp;
    }

    DOMElements.levelUpName.textContent = `Du hast Level ${level} erreicht! +${level * 10} 🪙`;
    DOMElements.levelUpToast.classList.remove('hidden');
    setTimeout(() => {
        DOMElements.levelUpToast.classList.add('hidden');
    }, 5000);
});

socket.on('showPlayerProfile', (profileData) => {
    if (profileData) {
        populateProfileOverlay(profileData, false);
    } else {
        showSystemToast('Spielerprofil konnte nicht geladen werden.');
    }
});

socket.on('forceKick', (data) => {
    showAlertModal(`Du wurdest von einem Admin aus dem Spiel entfernt. Grund: ${data.reason}`, 'Gekickt');
    setTimeout(() => {
        location.reload();
    }, 4000);
});

socket.on('captcha:required', ({ answer }) => {
    DOMElements.solutionInput.disabled = false;
    DOMElements.submitBtn.disabled = false;
    showCaptcha(answer);
});

socket.on('travel:showData', (data) => {
    travelManager.render(data);
});

socket.on('travel:rewardClaimed', (result) => {
    travelManager.showReward(result);
});

socket.on('travel:error', (message) => {
    showSystemToast(message, true);
});

socket.on('systemBroadcast', ({ message }) => {
    const broadcastElement = document.createElement('div');
    broadcastElement.className = 'system-broadcast-banner';
    broadcastElement.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
        <span>${DOMPurify.sanitize(message)}</span>
    `;
    
    document.body.appendChild(broadcastElement);
});

function showAdminDirectMessageModal(message) {
    const overlay = getEl('customAlertOverlay');
    if (!overlay) return;

    getEl('alertTitle').textContent = 'Nachricht vom Admin-Team';
    getEl('alertMessage').textContent = message;

    const okBtn = getEl('alertBtnOk');
    const newOkBtn = okBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newOkBtn, okBtn);

    const handleOk = () => overlay.classList.add('hidden');
    newOkBtn.addEventListener('click', handleOk, { once: true });

    overlay.classList.remove('hidden');
}

socket.on('adminDirectMessage', (message) => {
    showAdminDirectMessageModal(message);
});

socket.on('accountDeleted', () => {
    localStorage.clear(); 
    showAlertModal('Dein Account wurde erfolgreich gelöscht. Du wirst zur Startseite weitergeleitet.', 'Account gelöscht');

    setTimeout(() => {
        location.reload();
    }, 3000);
});

socket.on('reconnect', () => {
    console.log('Verbindung wiederhergestellt! Versuche, dem Raum erneut beizutreten...');
    const roomId = DOMElements.roomIdDisplay.textContent;
    if (roomId && myPlayerToken) {
        const isSpectator = !myPlayerData.socketId; 
        
        socket.emit('joinRoom', { 
            token: myPlayerToken, 
            roomId: roomId, 
            isSpectator: isSpectator 
        });
    }
});

socket.on('connectionSuccess', (data) => {
    shopItems = data.shopItems || {};
    achievements = data.achievements || {};
    chaosEvents = data.chaosEvents || {};
    titles = data.titles || {};
    updateLogData = data.updateLogs || [];

    populateAvatarSelector(data.avatars);

    showScreen('lobby');

    const storedToken = localStorage.getItem('quizClashPlayerToken');
    if (storedToken) {
        socket.emit('login', { token: storedToken });
    }
});

socket.on('validateToken', ({ user }) => {
    if (user) {
        DOMElements.playerNameInput.value = user.name;
        showLobbyMessage(`Als ${user.name} fortfahren oder Namen ändern.`, false, 4000);
    }
});

socket.on('updateLogChanged', (logs) => {
    updateLogData = logs || [];
    if (!DOMElements.updateLogOverlay.classList.contains('hidden')) {
        populateUpdateLog();
    }
});

socket.on('showMissions', ({ missions }) => {
    if (missions) {
        renderMissions(missions);
        DOMElements.missionsOverlay.classList.remove('hidden');
    }
});

socket.on('kickedFromGuild', ({ guildName, wasBanned }) => {
    if (currentPlayerProfile) {
        currentPlayerProfile.guildId = null;
    }

    DOMElements.guildOverlay.classList.add('hidden');

    const message = wasBanned
        ? `Du wurdest aus der Gilde "${guildName}" gebannt! Die Seite wird neu geladen.`
        : `Du wurdest aus der Gilde "${guildName}" entfernt! Die Seite wird neu geladen.`;
    
    showAlertModal(message, 'Aus Gilde entfernt', () => {
        location.reload();
    });
});

socket.on('newGuildMessage', (message) => {
    if (!DOMElements.guildOverlay.classList.contains('hidden')) {
        const li = document.createElement('li');
        const isMe = message.senderToken === myPlayerToken;
        const reportBtnHTML = !isMe ? `<button class="report-btn" data-token="${message.senderToken}" data-message="${DOMPurify.sanitize(message.message)}" data-context-source="guild-chat-messages">!</button>` : '';
        
        li.innerHTML = `<strong>${DOMPurify.sanitize(message.senderName)}:</strong> <span class="message-content">${DOMPurify.sanitize(message.message)}</span>${reportBtnHTML}`;
        getEl('guild-chat-messages').appendChild(li);
        getEl('guild-chat-messages').scrollTop = getEl('guild-chat-messages').scrollHeight;
    }
});

socket.on('promptPlaceBounty', (activePlayers) => {
    const bountyList = DOMElements.finalBountyPlayerList; 
    const bountyOverlay = DOMElements.finalBountyOverlay; 

    bountyList.innerHTML = activePlayers.map(p => 
        `<li><button data-target-id="${p.socketId}">${DOMPurify.sanitize(p.name)}</button></li>`
    ).join('');

    bountyList.onclick = (e) => {
        const target = e.target.closest('button');
        if (target) {
            const targetSocketId = target.dataset.targetId;
            socket.emit('placeFinalBounty', { targetSocketId });
            bountyOverlay.classList.add('hidden');
            bountyList.onclick = null; 
        }
    };

    bountyOverlay.classList.remove('hidden');
});

socket.on('missionsUpdate', ({ missions }) => {
    if (!DOMElements.missionsOverlay.classList.contains('hidden')) {
        renderMissions(missions);
    }
    currentPlayerProfile.dailyMissions = missions;
});

socket.on('showHint', (hint) => {
    DOMElements.problemHint.textContent = `Hinweis: ${DOMPurify.sanitize(hint)}`;
    DOMElements.problemHint.classList.remove('hidden');
});

socket.on('achievementUnlocked', (achievement) => {
    DOMElements.achievementName.textContent = achievement.name;
    DOMElements.achievementToast.classList.remove('hidden');
    setTimeout(() => {
        DOMElements.achievementToast.classList.add('hidden');
    }, 4000); 
});

socket.on('updateState', (state) => {
    if (state.error) {
        showLobbyMessage(state.error, true, 5000);
        if (state.forceLobby) {
            showScreen('lobby');
        }
        return;
    }

    currentGameState = state;
    previousGameState = currentGameState.gameState; 

    showScreen('game');

    myPlayerData = state.players[socket.id] || {};
    const isSpectator = !state.players[socket.id];
    const isHost = state.hostId === socket.id;
    updateUI(state, isHost, isSpectator);
});

socket.on('spectatorBetPlaced', ({ onPlayerName, amount }) => {
    document.querySelectorAll('#spectator-betting-panel input, #spectator-betting-panel button').forEach(el => {
        el.disabled = true;
    });
    const panel = DOMElements.spectatorBettingPanel;
    const confirmation = document.createElement('p');
    confirmation.style.marginTop = '10px';
    confirmation.style.color = 'var(--accent-success)';
    confirmation.textContent = `Du hast erfolgreich ${amount} 🪙 auf ${onPlayerName} gesetzt!`;
    panel.appendChild(confirmation);
});


socket.on('shopUpdate', ({ qcoins, inventory }) => {
    if (currentPlayerProfile) { 
        currentPlayerProfile.qcoins = qcoins; 
        currentPlayerProfile.inventory = inventory; 
    }
    mainUserQCoins = qcoins;
    if (!DOMElements.shopOverlay.classList.contains('hidden')) openShop();
});


socket.on('itemEquipped', ({ updatedProfile }) => {
    currentPlayerProfile = updatedProfile;
    if (!DOMElements.shopOverlay.classList.contains('hidden')) {
        openShop();
    }
    if (!DOMElements.profileOverlay.classList.contains('hidden')) {
        openProfile(); 
    }
    applyEquippedFont(updatedProfile.equippedFont); 
    showSystemToast('Gegenstand/Titel wurde ausgerüstet!');
});

socket.on('betPlaced', ({ amount, newBalance }) => {
    DOMElements.betConfirmationMsg.textContent = `Du hast ${amount} QCoins gesetzt!`;
    DOMElements.betAmountInput.disabled = true;
    DOMElements.placeBetBtn.disabled = true;
    if (myPlayerData) myPlayerData.qcoins = newBalance;
    if (DOMElements.myQCoinsDisplay) DOMElements.myQCoinsDisplay.textContent = newBalance;
});

socket.on('chatMessage', (data) => {
    console.log('Chat-Nachricht empfangen. Vergleiche Tokens:', {
        'Nachricht von (data.token)': data.token,
        'Ich bin (myPlayerToken)': myPlayerToken,
        'Ist meine Nachricht?': data.token === myPlayerToken
    });

    const li = document.createElement('li');

    if (data.type === 'standard') {
    if (data.role === 'owner') {
            const badge = document.createElement('i');
            badge.className = 'material-icons chat-role-badge owner';
            badge.textContent = 'workspace_premium';
            badge.style.color = '#d500f9'; 
            li.appendChild(badge);
        }
    if (data.role === 'admin') {
        const badge = document.createElement('i');
        badge.className = 'material-icons chat-role-badge admin';
        badge.textContent = 'verified_user';
        li.appendChild(badge);
    } else if (data.role === 'mod') {
        const badge = document.createElement('i');
        badge.className = 'material-icons chat-role-badge mod';
        badge.textContent = 'shield';
        li.appendChild(badge);
    }

    const nameSpan = document.createElement('strong');
        nameSpan.textContent = DOMPurify.sanitize(data.name);

        if (data.color) {
            if (data.color.startsWith('fx-')) {
                nameSpan.className = `anim-target ${data.color}`;
                nameSpan.dataset.text = data.name;
            } else {
                nameSpan.style.color = data.color;
            }
        }

        li.appendChild(nameSpan);
        
        const messageSpan = document.createElement('span');
        messageSpan.className = 'message-content';
        messageSpan.textContent = `: ${DOMPurify.sanitize(data.message)}`;
        li.appendChild(messageSpan);

        const isMyMessage = data.token === myPlayerToken;
        if (!isMyMessage && data.token) {
            const reportBtn = document.createElement('button');
            reportBtn.className = 'report-btn';
            reportBtn.textContent = '!';
            reportBtn.title = 'Nachricht melden';
            reportBtn.dataset.token = data.token;
            reportBtn.dataset.message = data.message;
            li.appendChild(reportBtn);
        }

    } else if (data.type === 'special') {
        li.className = 'system-message special';
        li.textContent = data.message;
    } else if (data.type === 'elimination') {
        li.className = 'system-message elimination';
        li.textContent = data.message;
    } else {
        li.className = 'system-message';
        li.textContent = data.message;
    }

    DOMElements.chatMessages.appendChild(li);
    DOMElements.chatMessages.scrollTop = DOMElements.chatMessages.scrollHeight;

    if (data.color && data.color.startsWith('fx-')) {
        const effectElement = li.querySelector('.anim-target');
        if (effectElement) {
            setTimeout(() => {
                const effectMethod = `apply${data.color.charAt(3).toUpperCase() + data.color.slice(4)}Effect`;
                if (fxManager[effectMethod]) {
                    fxManager[effectMethod](effectElement);
                }
            }, 50);
        }
    }
});

function handleReportClick(e) {
    if (e.target.classList.contains('report-btn')) {
        const button = e.target;
        const reportedToken = button.dataset.token;
        const message = button.dataset.message;
        const contextSourceId = button.dataset.contextSource || (button.closest('ul') ? button.closest('ul').id : 'chat-messages');
        const overlay = getEl('reportModalOverlay');
        const messageText = getEl('report-message-text');
        const commentInput = getEl('report-comment-input');
        const confirmBtn = getEl('reportBtnConfirm');
        const cancelBtn = getEl('reportBtnCancel');

        messageText.textContent = `"${message}"`;
        commentInput.value = '';
        overlay.classList.remove('hidden');

        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

        const newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

        newConfirmBtn.addEventListener('click', () => {
            const comment = commentInput.value.trim();
            const context = getChatContext(contextSourceId);
            
            socket.emit('reportChatMessage', { reportedToken, message, comment, context });

            showSystemToast('Nachricht & Verlauf wurden gemeldet.');
            button.disabled = true;
            button.textContent = '✓';
            overlay.classList.add('hidden');
        });

        newCancelBtn.addEventListener('click', () => overlay.classList.add('hidden'));
    }
}

if(DOMElements.chatMessages) DOMElements.chatMessages.addEventListener('click', handleReportClick);
if(getEl('guild-chat-messages')) getEl('guild-chat-messages').addEventListener('click', handleReportClick);

function updateUI(state, isHost, isSpectator) {
    if (state.gameState !== 'playing' && isCaptchaActive) {
        isCaptchaActive = false;
        DOMElements.captchaOverlay.classList.add('hidden');
    }
    currentGameState = state;
    if (state.gameState === 'playing' && state.activeEvent === 'popupWahnsinn') {
        if (!chaosPopupInterval) { 
            startPopupChaos();
        }
    } else {
        if (chaosPopupInterval) {
            stopPopupChaos();
        }
    }

    if (state.gameState === 'waiting') {
    const settingsEl = document.getElementById('waiting-room-settings');
    if (settingsEl) {
        settingsEl.innerHTML = `
            <span><strong>Modus:</strong></span><span>${state.settings.gameMode}</span>
            <span><strong>Schwierigkeit:</strong></span><span>${state.settings.difficulty}</span>
            <span><strong>Runden:</strong></span><span>${state.settings.rounds}</span>
            <span><strong>Zeit/Runde:</strong></span><span>${state.settings.duration}s</span>
        `;
    }
}

    if (state.activeEvent === 'pikaSqueak' && !pikaSqueakActive) {
        startPikaSqueak();
    } else if (state.activeEvent !== 'pikaSqueak' && pikaSqueakActive) {
        stopPikaSqueak();
    }

 if (state.activeEvent === 'lagMonster' && !isLagMonsterActive) {
        startLagMonster();
    } else if (state.activeEvent !== 'lagMonster' && isLagMonsterActive) {
        stopLagMonster();
    }

if (state.activeEvent === 'autocorrectCurse' && !autocorrectActive) {
    startAutocorrectCurse();
} else if (state.activeEvent !== 'autocorrectCurse' && autocorrectActive) {
    stopAutocorrectCurse();
}
if (state.decoyAnswerText && !decoyActive) { 
    startDecoyAnswer(state.decoyAnswerText);
} else if (!state.decoyAnswerText && decoyActive) {
    stopDecoyAnswer();
}
    if (state.activeEvent === 'tastenChaos' && !chaosActive) {
        startTastenChaos();

} else if (state.activeEvent !== 'tastenChaos' && chaosActive) {
    stopTastenChaos();
}

if (state.activeEvent === 'discoTime' && !discoActive) {
    startDiscoTime();
} else if (state.activeEvent !== 'discoTime' && discoActive) {
    stopDiscoTime();
}

if (state.activeEvent === 'mirroredScreen') {
    document.body.classList.add('mirrored-screen');
} else {
    document.body.classList.remove('mirrored-screen');
}
    document.body.classList.toggle('three-d-effect-active', state.activeEvent === 'threeDGlasses');

const ufoContainer = document.getElementById('ufo-abduction-container');
    if (state.activeEvent === 'ufoAbduction' && state.gameState === 'playing') {
        ufoContainer.classList.remove('hidden');
        ufoContainer.classList.remove('departing');

        if (!abductedElement) {
            const potentialTargets = [
                DOMElements.playerList,
                DOMElements.problemDescription,
                DOMElements.solutionWrapper,
                DOMElements.timerContainer 
            ].filter(el => el && !el.classList.contains('hidden')); 

            if (potentialTargets.length > 0) {
                const numToAbduct = (Math.random() < 0.4 && potentialTargets.length > 1) ? 2 : 1;
                const shuffledTargets = potentialTargets.sort(() => 0.5 - Math.random());
                abductedElement = shuffledTargets.slice(0, numToAbduct);

                abductedElement.forEach((el, index) => {
                     el.style.position = 'relative'; 
                     el.style.zIndex = '998'; 
                     el.classList.add('is-abducted');
                     el.style.animationDelay = `${index * 0.3}s`;
                });

                setTimeout(() => {
                     if (document.getElementById('ufo-abduction-container')) {
                         document.getElementById('ufo-abduction-container').classList.add('departing');
                     }
                 }, 3500 + numToAbduct * 300);
            }
        }
    } else {
        ufoContainer.classList.add('hidden');
        ufoContainer.classList.remove('departing');
        if (abductedElement) {
            abductedElement.forEach(el => {
                el.classList.remove('is-abducted');
                el.style.animationDelay = '';
                el.style.position = ''; 
                el.style.zIndex = '';   
            });
            abductedElement = null; 
        }
    }
   
    document.body.classList.toggle('pixel-panic-active', state.activeEvent === 'pixelPanic');

if (state.activeEvent === 'jumpscare') {
        if (!hasJumpscarePlayedThisRound) {
            hasJumpscarePlayedThisRound = true;
            const jumpscareOverlay = DOMElements.jumpscareOverlay;
            jumpscareOverlay.style.display = 'flex'; 
            jumpscareOverlay.classList.remove('hidden');
            jumpscareOverlay.classList.add('active');

            jumpscareAudio.play().catch(e => console.error("Jumpscare Audio konnte nicht abgespielt werden:", e));

            setTimeout(() => {
                jumpscareOverlay.classList.remove('active');
                setTimeout(() => {
                    jumpscareOverlay.style.display = 'none'; 
                    jumpscareOverlay.classList.add('hidden');
                }, 500); 
            }, 1000); 
        }
    } else {
        hasJumpscarePlayedThisRound = false; 
        const jumpscareOverlay = DOMElements.jumpscareOverlay;
        if (!jumpscareOverlay.classList.contains('hidden')) {
             jumpscareOverlay.classList.remove('active');
             jumpscareOverlay.style.display = 'none';
             jumpscareOverlay.classList.add('hidden');
        }
    }

if (state.activeEvent === 'ohrenzerstoerer' && !earDestroyerActive) {
    earDestroyerActive = true;
    earDestroyerSounds.forEach(sound => {
        sound.play().catch(e => console.error("Ohrenzerstörer-Sound konnte nicht abgespielt werden:", e));
    });
} else if (state.activeEvent !== 'ohrenzerstoerer' && earDestroyerActive) {
    earDestroyerActive = false;
    earDestroyerSounds.forEach(sound => {
        sound.pause();
        sound.currentTime = 0; 
    });
}

    DOMElements.roomIdDisplay.textContent = state.roomId;
    DOMElements.spectatorCount.textContent = Object.keys(state.spectators).length;
    updatePlayerList(state);
    updateGameStatus(state);
    updateProblemDisplay(state, isSpectator);
    updateHostControls(state, isHost, isSpectator);
    renderSpectatorUI(state);

    const isEliminated = myPlayerData.isEliminated;
    DOMElements.eliminatedActionsPanel.classList.toggle('hidden', !isEliminated);
    if (isEliminated) {
        DOMElements.eliminatedActionsPanel.querySelectorAll('button').forEach(btn => {
            const cost = parseInt(btn.dataset.cost, 10);
            btn.disabled = myPlayerData.qcoins < cost;
        });
    }
    updateTimer(state);
    handleOverlays(state, isHost, isSpectator);
    renderSpectatorUI(state);
}

function renderMissions(missionsData) {
    const missionEntries = Object.values(missionsData);
    if (missionEntries.length === 0) {
        DOMElements.missionsList.innerHTML = `<p>Keine aktiven Missionen. Schau morgen wieder vorbei!</p>`;
        return;
    }

    DOMElements.missionsList.innerHTML = missionEntries.map(m => {
        const progressPercent = (m.progress / m.goal) * 100;
        let buttonHtml;
        if (m.rewardClaimed) {
            buttonHtml = `<button class="claim-btn" disabled>Erledigt</button>`;
        } else if (m.completed) {
            buttonHtml = `<button class="claim-btn" data-mission-type="${m.type}">Belohnung: ${m.reward} ${coinImg}</button>`;
        } else {
            buttonHtml = `<div class="mission-reward-value">${m.reward} ${coinImg}</div>`;
        }

        return `
            <div class="mission-card ${m.completed ? 'completed' : ''}">
                <div class="mission-details">
                    <h4>${DOMPurify.sanitize(m.name)}</h4>
                    <p>${DOMPurify.sanitize(m.description)}</p>
                    <div class="mission-progress-bar">
                        <div class="mission-progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <small>${m.progress} / ${m.goal}</small>
                </div>
                <div class="mission-reward">${buttonHtml}</div>
            </div>
        `;
    }).join('');
    DOMElements.missionsOverlay.classList.remove('hidden');
}

function renderPlayerEventChoice(state) {
    const amIChooser = socket.id === state.eventChoice.chooserId;
    const chooserName = state.players[state.eventChoice.chooserId]?.name || 'Der Host';
    DOMElements.playerChoiceOverlay.querySelector('h2').textContent = `${chooserName}, wähle das nächste Event!`;

    DOMElements.playerEventChoicesContainer.innerHTML = state.eventChoice.choices.map(event => `
        <button class="event-choice-btn" data-event-id="${event.id}" ${!amIChooser ? 'disabled' : ''}>
            <div class="event-text">
                <h4>${DOMPurify.sanitize(event.name)}</h4>
                <p>${DOMPurify.sanitize(event.description)}</p>
            </div>
        </button>
    `).join('');

    if (amIChooser) {
        DOMElements.playerEventChoicesContainer.querySelectorAll('.event-choice-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const eventId = e.currentTarget.dataset.eventId;
                socket.emit('choosePlayerEvent', { eventId });
            });
        });
    }
}

function showAppealModal() {
    const confirmationOverlay = getEl('customConfirmOverlay');
    if (!confirmationOverlay) return;

    confirmationOverlay.style.zIndex = '1001';

    showConfirmationModal(
        `Beschreibe bitte sachlich und detailliert, warum dein permanenter Bann aufgehoben werden sollte. Beleidigungen oder Spam führen zur sofortigen Ablehnung.\n\n<textarea id="appeal-input" placeholder="Dein Einspruch..." style="width: 100%; min-height: 120px; margin-top: 15px;"></textarea>`,
        (confirmed) => {
            if (confirmed) {
                const message = getEl('appeal-input').value;
                const storedToken = localStorage.getItem('quizClashPlayerToken');
                socket.emit('submitUnbanRequest', { token: storedToken, message });
            }
            confirmationOverlay.style.zIndex = '';
        },
        'Einspruch einlegen'
    );
}

function startLagMonster() {
    if (isLagMonsterActive) return;
    isLagMonsterActive = true;
    const input = DOMElements.solutionInput;
    
    lagKeyListener = (e) => {
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            lagQueue.push(e.key);
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            lagQueue.push('BACKSPACE');
        }
    };
    
    input.addEventListener('keydown', lagKeyListener);
    
    lagInterval = setInterval(() => {
        if (lagQueue.length > 0) {
            const action = lagQueue.shift();
            if (action === 'BACKSPACE') {
                input.value = input.value.slice(0, -1);
            } else {
                input.value += action;
            }
        }
    }, 250 + Math.random() * 350);
}

function stopLagMonster() {
    if (!isLagMonsterActive) return;
    isLagMonsterActive = false;
    const input = DOMElements.solutionInput;

    if (lagKeyListener) {
        input.removeEventListener('keydown', lagKeyListener);
        lagKeyListener = null;
    }
    if (lagInterval) {
        clearInterval(lagInterval);
        lagInterval = null;
    }
    lagQueue.forEach(action => {
        if (action === 'BACKSPACE') {
            input.value = input.value.slice(0, -1);
        } else {
            input.value += action;
        }
    });
    lagQueue = [];
}

function renderSpectatorUI(state) {
    const isSpectator = !state.players[socket.id];
    const panel = DOMElements.spectatorBettingPanel;
    if (!panel) return;

    const showPanel = isSpectator && state.gameState === 'betting';
    panel.classList.toggle('hidden', !showPanel);

    if (showPanel) {
        const playerList = panel.querySelector('#spectator-player-list');
        const activePlayers = Object.values(state.players).filter(p => !p.isEliminated);

        playerList.innerHTML = activePlayers.map(p => `
            <li>
                <span>${DOMPurify.sanitize(p.name)}</span>
                <div class="spectator-bet-action">
                    <input type="number" placeholder="Einsatz" class="spectator-bet-input" data-player-id="${p.socketId}">
                    <button class="spectator-bet-btn" data-player-id="${p.socketId}">Wetten</button>
                </div>
            </li>
        `).join('');

        playerList.querySelectorAll('.spectator-bet-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const playerId = btn.dataset.playerId;
                const input = playerList.querySelector(`.spectator-bet-input[data-player-id="${playerId}"]`);
                const amount = input.value;
                if (amount && myPlayerToken) {
                    socket.emit('spectatorPlaceBet', { token: myPlayerToken, onPlayerId: playerId, amount });
                }
            });
        });
    }
}

function applyEquippedFont(fontClass) {
    const body = document.body;
    const allFontClasses = [
        'font-inter', 'font-poppins', 'font-roboto-mono', 'font-merriweather', 'font-lato',
        'font-oswald', 'font-caveat', 'font-nunito', 'font-montserrat', 'font-playfair',
        'font-source-code', 'font-bebas-neue', 'font-pacifico', 'font-cinzel'
    ];
    
    body.classList.remove(...allFontClasses);
    
    if (fontClass && allFontClasses.includes(fontClass)) {
        body.classList.add(fontClass);
    } else {
        body.classList.add('font-inter');
    }
}

function updatePlayerList(state) {
    const playerListEl = DOMElements.playerList;
    if (!playerListEl) return;

    const amIHost = (state.hostId === socket.id);
    const players = state.players || {};
    const sortedPlayers = Object.values(players).sort((a, b) => (b.score || 0) - (a.score || 0));

    const newHTML = sortedPlayers.map(p => {
        const isCurrentTurn = state.currentPlayerTurn === p.socketId;
        const sanitizedName = DOMPurify.sanitize(p.name || 'Unbekannt');
        const titleData = p.equippedTitle && titles ? titles[p.equippedTitle] : null;

        const hostIndicator = p.isHost ? '<span class="player-indicator host" title="Raum-Host">👑</span>' : '';
        const streakIndicator = (p.correctStreak || 0) > 2 ? `<span class="player-indicator streak" title="${p.correctStreak}er-Streak">🔥</span>` : '';
        const bountyIndicator = state.bountyOn === p.socketId ? `<span class="player-indicator bounty" title="Kopfgeld!">🎯</span>` : '';
        const answeredCheck = p.hasAnswered ? '<span class="player-indicator answered" title="Hat geantwortet">✓</span>' : '';
        const titleHtml = titleData ? `<span class="player-title">${DOMPurify.sanitize(titleData.name || '')}</span>` : '';

        const colorValue = p.chatColor || '#FFFFFF';
        let nameHtml;
        if (colorValue.startsWith('fx-')) {
            nameHtml = `<span class="name anim-target ${colorValue}" data-text="${sanitizedName}">${sanitizedName}</span>`;
        } else {
            nameHtml = `<span class="name" style="color: ${colorValue};">${sanitizedName}</span>`;
        }

        let roleBadge = '';
        if (p.role === 'owner') roleBadge = '<i class="material-icons role-badge owner" title="Inhaber" style="color: #d500f9;">workspace_premium</i>';
        else if (p.role === 'admin') roleBadge = '<i class="material-icons role-badge admin" title="Administrator">security</i>';
        else if (p.role === 'mod') roleBadge = '<i class="material-icons role-badge mod" title="Moderator">verified_user</i>';

        let hostControlsHtml = '';
        if (amIHost && p.socketId !== socket.id) {
            hostControlsHtml = `
                <button class="host-control-btn" title="Spieler verwalten" 
                        data-target-id="${p.socketId}" 
                        data-target-name="${sanitizedName}">
                    <i class="material-icons">more_vert</i>
                </button>
            `;
        }

        return `
            <li class="player-list-item ${p.isEliminated ? 'eliminated' : ''} ${isCurrentTurn ? 'current-turn' : ''}" 
                data-id="${p.socketId}" 
                data-action="view-profile" 
                data-token="${p.token}" 
                title="Profil ansehen">
                <img src="assets/avatars/${DOMPurify.sanitize(p.avatar || 'avatar1.png')}" class="player-avatar" alt="Avatar">
                <div class="player-details">
                    ${titleHtml}
                    <div class="player-name-line">
                        ${hostIndicator} ${roleBadge} ${nameHtml} ${streakIndicator} ${bountyIndicator}
                    </div>
                </div>
                <div class="player-status-icons">${answeredCheck}</div>
                <div class="player-actions">${hostControlsHtml}</div> 
                <div class="player-score">${p.score || 0} P</div>
            </li>`;
    }).join('');

    if (playerListEl.innerHTML !== newHTML) {
        playerListEl.innerHTML = newHTML;

        setTimeout(() => {
            playerListEl.querySelectorAll('.anim-target').forEach(el => {
                const effectClass = Array.from(el.classList).find(c => c.startsWith('fx-'));
                if (effectClass) {
                    const functionName = `apply${effectClass.charAt(3).toUpperCase()}${effectClass.slice(4)}Effect`;
                    if (fxManager[functionName]) {
                        fxManager[functionName](el);
                    }
                }
            });
        }, 100);
    }
}

function showAlertModal(message, title = 'Hinweis', onOkCallback = null) {
    const overlay = getEl('customAlertOverlay');
    getEl('alertTitle').textContent = title;
    getEl('alertMessage').textContent = message;

    const okBtn = getEl('alertBtnOk');
    const newOkBtn = okBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newOkBtn, okBtn);

    const handleOk = () => {
        overlay.classList.add('hidden');
        if (onOkCallback) {
            onOkCallback();
        }
    };

    newOkBtn.addEventListener('click', handleOk, { once: true });
    overlay.classList.remove('hidden');
}

function showConfirmationModal(message, callback, title = 'Bist du sicher?') {
    const overlay = getEl('customConfirmOverlay');
    getEl('confirmTitle').textContent = title;
    getEl('confirmMessage').innerHTML = message;

    const yesBtn = getEl('confirmBtnYes');
    const noBtn = getEl('confirmBtnNo');
    const newYesBtn = yesBtn.cloneNode(true);
    yesBtn.parentNode.replaceChild(newYesBtn, yesBtn);

    const newNoBtn = noBtn.cloneNode(true);
    noBtn.parentNode.replaceChild(newNoBtn, noBtn);
    const cleanup = () => {
        overlay.classList.add('hidden');
    };

    const handleYes = () => {
        callback(true);
        cleanup();
    };

    const handleNo = () => {
        callback(false);
        cleanup();
    };

    newYesBtn.addEventListener('click', handleYes, { once: true });
    newNoBtn.addEventListener('click', handleNo, { once: true });

    overlay.classList.remove('hidden');
}

function renderItemRules() {
    const itemsContainer = DOMElements.itemsListContainer;
    if (!itemsContainer) return;

    const powerups = Object.values(shopItems).filter(item => item.type === 'powerup');

    if (powerups.length === 0) {
        itemsContainer.innerHTML = '<p>Derzeit sind keine Power-Ups verfügbar.</p>';
        return;
    }

    const itemsHtml = powerups.map(item => `
        <h4>${DOMPurify.sanitize(item.name)}</h4>
        <ul>
            <li><strong>Effekt:</strong> ${DOMPurify.sanitize(item.description)}</li>
            <li><strong>Kosten:</strong> ${item.cost} 🪙</li>
        </ul>
    `).join('');

    itemsContainer.innerHTML = itemsHtml;
}

function showSystemToast(message) {
    const toast = DOMElements.achievementToast;
    toast.querySelector('.achievement-name').textContent = message;
    toast.querySelector('.achievement-title').textContent = 'System-Nachricht';
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 4000);
}

function getChatContext(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    const messages = Array.from(container.querySelectorAll('li')).slice(-15);
    return messages.map(li => li.textContent.trim());
}

function updateGameStatus(state) {
    let statusMsg = '...';

    if (state.settings.gameMode === 'survival') {
        if (state.gameState === 'playing' && state.currentPlayerTurn) {
            const currentPlayer = state.players[state.currentPlayerTurn];
            if (currentPlayer) {
                statusMsg = `Am Zug: ${DOMPurify.sanitize(currentPlayer.name)}`;
            }
        } else if (state.gameState !== 'finished') {
            statusMsg = 'Nächster Spieler wird ermittelt...';
        } else {
            statusMsg = 'Spiel beendet!';
        }
    } else {
        switch (state.gameState) {
            case 'waiting': statusMsg = 'Warte auf Spieler...'; break;
            case 'event-voting': statusMsg = 'Zuschauer wählen ein Event!'; break;
            case 'betting': statusMsg = 'Wettphase! Platziere deinen Einsatz.'; break;
           case 'category-choice': 
    statusMsg = `${state.players[state.chooserId]?.name || 'Ein Spieler'} wählt...`; 
    break;
            case 'playing': statusMsg = 'Runde läuft!'; break;
            case 'round-over': statusMsg = 'Runde vorbei! Auswertung...'; break;
            case 'finished': statusMsg = 'Spiel beendet!'; break;
        }
    }
    
    DOMElements.roundCounter.classList.toggle('hidden', state.settings.gameMode === 'survival');

    DOMElements.gameStatusDisplay.textContent = statusMsg;
    DOMElements.activeEventIndicator.classList.toggle('hidden', !state.activeEvent);
    if(state.activeEvent && chaosEvents[state.activeEvent]) DOMElements.activeEventIndicator.innerHTML = `⚡ ${chaosEvents[state.activeEvent].name}`;
         
    const isSurvival = state.settings.gameMode === 'survival';
    DOMElements.roundCounter.classList.toggle('hidden', isSurvival);
    if (!isSurvival && state.currentRound > 0) {
        DOMElements.roundCounter.textContent = `Runde ${state.currentRound} / ${state.totalRounds}`;
    } else {
        DOMElements.roundCounter.textContent = '';
    }
}

function updateProblemDisplay(state, isSpectator) {
    const isPlayer = !!myPlayerData.socketId;
    const isDuelist = state.duel && (myPlayerData.socketId === state.duel.p1 || myPlayerData.socketId === state.duel.p2);
    const isGameActive = ['playing', 'dueling', 'sudden-death'].includes(state.gameState) && state.currentProblem;

    let canAnswer = false;
    if (state.settings.gameMode === 'survival') {
        canAnswer = state.currentPlayerTurn === socket.id && !myPlayerData.hasAnswered;
    } else {
        canAnswer = (state.gameState === 'playing' && isPlayer && !myPlayerData.isEliminated && !myPlayerData.hasAnswered) ||
                      (state.gameState === 'dueling' && isDuelist && !myPlayerData.hasAnswered) ||
                      (state.gameState === 'sudden-death' && state.suddenDeath?.participants.includes(socket.id) && !myPlayerData.hasAnswered);
    }

    const isWaiting = state.gameState === 'waiting';
    DOMElements.waitingRoomView.classList.toggle('hidden', !isWaiting);
    DOMElements.problemCard.classList.toggle('hidden', !isGameActive);
    DOMElements.solutionWrapper.classList.toggle('hidden', !canAnswer);

    if (isGameActive) {
        DOMElements.problemTitle.dataset.text = state.currentProblem.title;
        DOMElements.problemDescription.dataset.text = state.currentProblem.description;

        document.body.classList.toggle('glitch-active', state.activeEvent === 'digitalStorm');
        DOMElements.problemCard.classList.toggle('language-jumble-active', state.activeEvent === 'randomLanguage');

        DOMElements.problemTitle.textContent = DOMPurify.sanitize(state.currentProblem.title);
        DOMElements.problemHint.classList.add('hidden');

        const justStartedPlaying = (state.gameState === 'playing' && previousGameState !== 'playing');
        const justStartedDueling = (state.gameState === 'dueling' && previousGameState !== 'dueling');
        const justStartedSuddenDeath = (state.gameState === 'sudden-death' && previousGameState !== 'sudden-death');
        const justStartedSurvivalTurn = (state.settings.gameMode === 'survival' && state.currentPlayerTurn !== previousGameState?.currentPlayerTurn);
        if (justStartedPlaying || justStartedDueling || justStartedSuddenDeath || justStartedSurvivalTurn) {
        }

        DOMElements.solutionInput.disabled = !canAnswer;
        DOMElements.submitBtn.disabled = !canAnswer;

        const solutionInput = DOMElements.solutionInput;
        if (state.activeEvent === 'mirroredInput') {
            solutionInput.style.transform = 'scaleX(-1)';
            solutionInput.style.textAlign = 'right';
            solutionInput.style.direction = 'ltr';
        } else if (state.activeEvent === 'backwardsRound') {
            solutionInput.style.direction = 'rtl'; 
            solutionInput.style.textAlign = 'left';
            solutionInput.style.transform = 'none';
        } else {
            solutionInput.style.transform = 'none';
            solutionInput.style.textAlign = 'left';
            solutionInput.style.direction = 'ltr';
        }
        
        const imageContainer = DOMElements.problemCard.querySelector('.problem-image-container');
        if (imageContainer) imageContainer.remove();
        if (state.currentProblem.type === 'image' && state.currentProblem.imageUrl) {
            const container = document.createElement('div');
            container.className = 'problem-image-container';
            container.innerHTML = `<img src="${DOMPurify.sanitize(state.currentProblem.imageUrl)}" alt="Rätselbild">`;
            DOMElements.problemTitle.after(container);
        }

        DOMElements.problemDescription.textContent = DOMPurify.sanitize(state.currentProblem.description);

        const eventWarningContainer = getEl('event-warning-container');
        if (eventWarningContainer) eventWarningContainer.remove();

        if (state.activeEvent === 'reverseScoring') {
            const warningDiv = document.createElement('div');
            warningDiv.id = 'event-warning-container';
            warningDiv.className = 'event-warning';
            warningDiv.innerHTML = `ACHTUNG: EVENT "UMGEKEHRTE WERTUNG" AKTIV! <br> Richtige Antworten geben Minuspunkte!`;
            DOMElements.problemDescription.after(warningDiv);
        }

        if (canAnswer) {
            DOMElements.solutionInput.focus();
        }
    }
}

function renderGuildView(guild) {
    const isOwner = guild.owner === myPlayerToken;
    const sortedGuilds = Object.values(currentGuilds).sort((a, b) => (b.weeklyScore || 0) - (a.weeklyScore || 0));
    const myRank = sortedGuilds.findIndex(g => g.id === guild.id) + 1;

    getEl('guild-name-display').textContent = `[${DOMPurify.sanitize(guild.tag)}] ${DOMPurify.sanitize(guild.name)}`;
    getEl('guild-rank-display').textContent = myRank > 0 ? `Rang #${myRank}` : 'Unranked';
    getEl('guild-member-count').textContent = guild.detailedMembers.length;
    getEl('guild-treasury-display').innerHTML = `${guild.treasury || 0}${coinImg}`;
    getEl('guild-invite-code').value = guild.id;

    const tabContainer = document.querySelector('.guild-tabs');
    const contentContainer = document.getElementById('guild-tab-content-container');
    const newTabContainer = tabContainer.cloneNode(true);
    tabContainer.parentNode.replaceChild(newTabContainer, tabContainer);
    newTabContainer.addEventListener('click', (e) => {
        const tabButton = e.target.closest('.guild-tab-btn');
        if (!tabButton) return;

        newTabContainer.querySelectorAll('.guild-tab-btn').forEach(btn => btn.classList.remove('active'));
        contentContainer.querySelectorAll('.guild-tab-pane').forEach(pane => pane.classList.remove('active'));

        tabButton.classList.add('active');
        const targetPane = contentContainer.querySelector(`#tab-${tabButton.dataset.tab}`);
        if (targetPane) {
            targetPane.classList.add('active');
        }
    });

    const settingsTabBtn = document.getElementById('guild-settings-tab-btn');
    if (settingsTabBtn) {
        settingsTabBtn.classList.toggle('hidden', !isOwner);
    }

    const memberListEl = getEl('guild-member-list');
    memberListEl.innerHTML = guild.detailedMembers.map(member => {
        const isSelf = myPlayerToken === member.token;
        let buttons = '';
        if (isOwner && !isSelf) {
            buttons = `
                <div class="member-actions">
                    <button class="member-kick-btn" data-action="kick" data-token="${member.token}" title="Mitglied kicken">Kicken</button>
                    <button class="member-kick-btn danger-btn" data-action="ban" data-token="${member.token}" title="Mitglied bannen & entfernen">Bannen</button>
                </div>
            `;
        }
        return `
            <li>
                <span>${guild.owner === member.token ? '👑' : '🛡️'} ${DOMPurify.sanitize(member.name)}</span>
                ${buttons}
            </li>
        `;
    }).join('');

const chatMessagesEl = getEl('guild-chat-messages');
    chatMessagesEl.innerHTML = (guild.chatHistory || []).map(msg => {
        const isMe = msg.senderToken === myPlayerToken;
        const reportBtn = !isMe ? `<button class="report-btn" data-token="${msg.senderToken}" data-message="${DOMPurify.sanitize(msg.message)}" data-context-source="guild-chat-messages">!</button>` : '';
        
        return `<li>
            <strong>${DOMPurify.sanitize(msg.senderName)}:</strong> 
            <span class="message-content">${DOMPurify.sanitize(msg.message)}</span>
            ${reportBtn}
        </li>`;
    }).join('');
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    
    if (isOwner) {
        const payoutSelectEl = getEl('payout-member-select');
        payoutSelectEl.innerHTML = guild.detailedMembers
            .filter(m => m.token !== myPlayerToken)
            .map(m => `<option value="${m.token}">${DOMPurify.sanitize(m.name)}</option>`)
            .join('');
    }
    
    setupGuildEventListeners(guild);
}

function setupGuildEventListeners(guild) {
    const rebind = (elementId, event, callback) => {
        const element = getEl(elementId);
        if (element) {
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
            newElement.addEventListener(event, callback);
        }
    };
    
    rebind('guildDonateBtn', 'click', () => {
        const amount = getEl('guildDonateAmount').value;
        if (amount > 0) {
            socket.emit('donateToGuild', { token: myPlayerToken, amount });
            getEl('guildDonateAmount').value = '';
        }
    });

    rebind('leaveGuildBtn', 'click', () => {
        const isOwner = guild.owner === myPlayerToken;
        const message = isOwner && guild.members.length > 1
            ? 'Wenn du als Anführer die Gilde verlässt, wird das älteste Mitglied zum neuen Anführer. Bist du sicher?'
            : 'Möchtest du die Gilde wirklich verlassen?';
        
        showConfirmationModal(message, (confirmed) => {
            if (confirmed) {
                socket.emit('leaveGuild', { token: myPlayerToken });
            }
        }, 'Gilde verlassen');
    });

    rebind('copy-guild-id-btn', 'click', () => {
        const inviteCodeInput = getEl('guild-invite-code');
        navigator.clipboard.writeText(inviteCodeInput.value).then(() => {
            showSystemToast('Gilden-ID wurde in die Zwischenablage kopiert!');
        });
    });

    getEl('guild-member-list').querySelectorAll('.member-kick-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetToken = e.currentTarget.dataset.token;
            const action = e.currentTarget.dataset.action;
            const memberName = e.currentTarget.closest('li').querySelector('span').textContent.replace(/^[👑🛡️]\s*/, '').trim();

            const isBan = action === 'ban';
            const message = isBan 
                ? `Möchtest du ${memberName} wirklich aus der Gilde entfernen UND permanent für diese Gilde bannen?`
                : `Möchtest du ${memberName} wirklich aus der Gilde entfernen?`;
            const title = isBan ? 'Mitglied Bannen' : 'Mitglied Kicken';

            showConfirmationModal(message, (confirmed) => {
                if (confirmed) {
                    socket.emit('kickGuildMember', { token: myPlayerToken, targetToken, ban: isBan });
                }
            }, title);
        });
    });

    if (guild.owner === myPlayerToken) {
        rebind('payout-btn', 'click', () => {
             const targetToken = getEl('payout-member-select').value;
             const amount = getEl('payout-amount-input').value;
             if (targetToken && amount > 0) {
                 socket.emit('payoutFromTreasury', { token: myPlayerToken, targetToken, amount });
             }
        });
    }
    
    rebind('guild-chat-form', 'submit', (e) => {
        e.preventDefault();
        const input = getEl('guild-chat-input');
        const message = input.value.trim();
        if (message) {
            socket.emit('guildChatMessage', { token: myPlayerToken, message });
            input.value = '';
        }
    });
}

function handleOverlays(state, isHost, isSpectator) {
    const persistentOverlays = [
        'shopOverlay', 'profileOverlay', 'guildOverlay', 'missionsOverlay', 
        'bankOverlay', 'casinoV2Overlay', 'travelAgencyOverlay', 
        'updateLogOverlay', 'aboutDevOverlay', 'rulesOverlay', 
        'generalReportOverlay', 'imageViewerOverlay', 'tutorialOverlay'
    ];

    const overlays = document.querySelectorAll('.overlay');
    overlays.forEach(o => {
        if (o.classList.contains('force-visible')) {
            return; 
        }

        if (o.id === 'captchaOverlay' && isCaptchaActive) return;
        
        if (persistentOverlays.includes(o.id)) return; 

        o.classList.add('hidden');
    });

    switch(state.gameState) {
        case 'countdown':
            const countdownOverlay = DOMElements.countdownOverlay;
            countdownOverlay.classList.remove('hidden');

            DOMElements.countdownRoundInfo.textContent = `Runde ${state.currentRound} / ${state.totalRounds}`;
            DOMElements.countdownCategoryInfo.textContent = `Kategorie: ${DOMPurify.sanitize(state.chosenCategory)}`;
            
            DOMElements.countdownQuestionTitle.textContent = 'Frage wird vorbereitet...';
            
            DOMElements.countdownTimerText.textContent = state.timeLeft > 0 ? state.timeLeft : 'GO!';
            
            DOMElements.solutionInput.value = '';
            break;
            
        case 'betting':
            if (previousGameState !== 'betting') {
                DOMElements.betConfirmationMsg.textContent = '';
            }
            DOMElements.bettingOverlay.classList.remove('hidden');
            DOMElements.bettingTimer.textContent = state.timeLeft;

            const canBet = !isSpectator && myPlayerData && !myPlayerData.isEliminated;
            const qcoinsDisplay = document.getElementById('my-qcoins-betting');
            if (qcoinsDisplay && myPlayerData) {
                qcoinsDisplay.innerHTML = `${myPlayerData.qcoins || 0}${coinImg}`;
            }

            const betAlreadyPlaced = !!(state.bets && state.bets[socket.id]);
            DOMElements.betAmountInput.disabled = !canBet || betAlreadyPlaced;
            DOMElements.placeBetBtn.disabled = !canBet || betAlreadyPlaced;

            if (betAlreadyPlaced) {
                DOMElements.betConfirmationMsg.textContent = `Du hast ${state.bets[socket.id]} 🪙 gesetzt!`;
            }
            break;
        case 'event-voting':
            DOMElements.eventVotingOverlay.classList.remove('hidden');
            renderEventVoting(state, isSpectator);
            break;
        case 'category-choice':
            DOMElements.categoryChoiceOverlay.classList.remove('hidden');
            renderCategoryChoice(state);
            break;
        case 'finished':
            DOMElements.gameOverOverlay.classList.remove('hidden');
            renderGameOver(state, isHost);
            break;
        case 'dueling':
            const duelOverlay = document.getElementById('duelOverlay');
            duelOverlay.classList.remove('hidden');
            const duelist1 = state.players[state.duel.p1];
            const duelist2 = state.players[state.duel.p2];
            if (duelist1 && duelist2) {
                document.getElementById('duelist1').innerHTML = `<img src="assets/avatars/${duelist1.avatar}" alt="${duelist1.name}"><div class="duelist-name">${DOMPurify.sanitize(duelist1.name)}</div>`;
                document.getElementById('duelist2').innerHTML = `<img src="assets/avatars/${duelist2.avatar}" alt="${duelist2.name}"><div class="duelist-name">${DOMPurify.sanitize(duelist2.name)}</div>`;
            }
            break;
        case 'sudden-death':
            DOMElements.suddenDeathOverlay.classList.remove('hidden');
            const participants = state.suddenDeath.participants.map(id => state.players[id]?.name || 'Unbekannt');
            DOMElements.suddenDeathParticipants.textContent = participants.join(' vs ');
            break;
        case 'player-event-choice':
            DOMElements.playerChoiceOverlay.classList.remove('hidden');
            renderPlayerEventChoice(state);
            break;
    }

    if (state.lastEliminated && (previousGameState === 'round-over' || previousGameState === 'dueling')) {
        DOMElements.eliminatedPlayerName.textContent = DOMPurify.sanitize(state.lastEliminated);
        DOMElements.eliminationOverlay.classList.remove('hidden');
        setTimeout(() => DOMElements.eliminationOverlay.classList.add('hidden'), 4000);
    }
}

function renderCategoryChoice(state) {
    const chooser = state.players[state.chooserId];
    DOMElements.categoryChooserName.textContent = chooser ? DOMPurify.sanitize(chooser.name) : 'Jemand';
    const amIChooser = socket.id === state.chooserId;
    DOMElements.categoryButtonsContainer.innerHTML = state.availableCategories.map(cat => `<button ${!amIChooser ? 'disabled' : ''} data-category="${cat}">${DOMPurify.sanitize(cat)}</button>`).join('');
    if(amIChooser) {
        DOMElements.categoryButtonsContainer.onclick = e => { if(e.target.dataset.category) socket.emit('chooseCategory', { category: e.target.dataset.category }); };
    }
}

function renderGameOver(state, isHost) {
    if (state.isTeamMode) {
        const winnerTeam = state.teamScores.A > state.teamScores.B ? 'A' : (state.teamScores.B > state.teamScores.A ? 'B' : null);
        if (winnerTeam) {
            const teamName = winnerTeam === 'A' ? 'Cyan' : 'Magenta';
            DOMElements.winnerAnnouncement.textContent = `Team ${teamName} hat gewonnen!`;
        } else {
            DOMElements.winnerAnnouncement.textContent = 'Unentschieden!';
        }
    } else {
        const players = Object.values(state.players).sort((a, b) => b.score - a.score);
        const winner = players.find(p => !p.isEliminated) || players[0];
        DOMElements.winnerAnnouncement.textContent = winner ? `Sieger: ${DOMPurify.sanitize(winner.name)}!` : 'Spiel beendet!';
    }

    const players = Object.values(state.players).sort((a, b) => b.score - a.score);
    DOMElements.finalRanking.innerHTML = players.map((p, i) => {
        const teamIndicator = p.team ? `<span class="final-team-indicator team-${p.team.toLowerCase()}"></span>` : '';
        return `<li>${teamIndicator}${i + 1}. ${DOMPurify.sanitize(p.name)}: ${p.score} Pkt</li>`;
    }).join('');
    
    DOMElements.playAgainBtn.classList.toggle('hidden', !isHost);
}

function updateHostControls(state, isHost) {
    const canStart = isHost && state.gameState === 'waiting';
    DOMElements.startGameBtn.classList.toggle('hidden', !canStart);
    if(canStart) DOMElements.startGameBtn.disabled = Object.keys(state.players).length < 1;
}

function toggleChat() {
    const isHidden = DOMElements.chatContainer.classList.toggle('chat-hidden');
    DOMElements.chatOpenBtn.classList.toggle('visible', isHidden);
}

function updateTimer(state) {
    const timerBar = DOMElements.timerBar;
    const timerContainer = DOMElements.timerContainer;

    const isRoundActive = ['playing', 'dueling', 'sudden-death'].includes(state.gameState);
    timerContainer.style.visibility = isRoundActive ? 'visible' : 'hidden';

    if (isRoundActive) {
        let totalDuration = state.settings.duration;
        if (state.activeEvent === 'speedyRound') totalDuration = Math.ceil(totalDuration / 2);
        if (state.gameState === 'dueling' || state.gameState === 'sudden-death') totalDuration = 15;
        if (state.sabotageTime) totalDuration = Math.max(5, totalDuration - 5);

        const percentage = (state.timeLeft / totalDuration) * 100;
        
        timerBar.style.width = `${Math.max(0, percentage)}%`;
    } else {
        timerBar.style.width = '100%';
    }
}

function mirrorInputValue(e) {
    const input = e.target;
}

function login() {
    const name = (currentPlayerProfile && currentPlayerProfile.name)
        ? currentPlayerProfile.name
        : DOMElements.playerNameInput.value.trim();

    if (!name) return showLobbyMessage('Bitte gib einen Spielernamen ein.', true);

    const selectedAvatarEl = DOMElements.avatarSelector.querySelector('img.selected');
    const avatar = selectedAvatarEl ? selectedAvatarEl.dataset.avatar : 'avatar1.png';
    const storedToken = localStorage.getItem('quizClashPlayerToken');

    socket.emit('login', { name, token: storedToken, avatar });
}

function startAutocorrectCurse() {
    if (autocorrectActive) return;
    autocorrectActive = true;

   const wordPool = [
  'Apfel', 'Haus', 'Tisch', 'Lampe', 'Ball', 'Buch', 'Sonne', 'Mond', 'Auto', 'Baum', 'Wasser', 'Fahrrad', 'Blume',
  'Hund', 'Katze', 'Vogel', 'Schule', 'Fenster', 'Tür', 'Stuhl', 'Computer', 'Telefon', 'Berg', 'Fluss', 'Meer', 
  'Wolke', 'Straße', 'Garten', 'Brücke', 'Park', 'Zug', 'Bus', 'Stadt', 'Dorf', 'Markt', 'Küche', 'Bett', 'Schrank', 
  'Uhr', 'Himmel', 'Kerze', 'Kuchen', 'Pizza', 'Brot', 'Glas', 'Tasse', 'Löffel', 'Gabel', 'Messer', 'Teller', 
  'Koffer', 'Rucksack', 'Schuhe', 'Jacke', 'Hut', 'Ballon', 'Foto', 'Brief', 'Zeitung', 'Film', 'Musik', 'Bühne',
  'rennt', 'singt', 'denkt', 'isst', 'schläft', 'spielt', 'lacht', 'läuft', 'schreibt', 'liest', 'fährt', 'springt', 
  'tanzt', 'malt', 'hört', 'schaut', 'kocht', 'trinkt', 'schwimmt', 'klettert', 'fliegt', 'sitzt', 'steht', 'öffnet', 
  'schließt', 'sucht', 'findet', 'träumt', 'arbeitet', 'lernt', 'baut', 'schiebt', 'zieht', 'wirft', 'fängt', 'ruft', 
  'antwortet', 'fragt', 'zeichnet', 'gießt', 'pflanzt', 'putzt', 'räumt', 'packt', 'versteckt', 'holt', 'bringt',
  'schnell', 'grün', 'lustig', 'glücklich', 'schön', 'klein', 'groß', 'hell', 'dunkel', 'kalt', 'warm', 'heiß', 
  'langsam', 'leise', 'laut', 'weich', 'hart', 'neu', 'alt', 'sauber', 'schmutzig', 'bunt', 'nass', 'trocken', 
  'freundlich', 'traurig', 'ruhig', 'wild', 'mutig', 'schlau', 'dumm', 'schwer', 'leicht', 'leer', 'voll', 
  'scharf', 'stumpf', 'glatt', 'rau', 'rund', 'eckig', 'hoch', 'tief', 'nah', 'fern',
  'immer', 'nie', 'manchmal', 'heute', 'morgen', 'gestern', 'jetzt', 'bald', 'später', 'drinnen', 'draußen', 
  'oben', 'unten', 'vorne', 'hinten', 'links', 'rechts', 'überall', 'nirgendwo', 'zusammen', 'allein'
];
    const input = DOMElements.solutionInput;
    input.classList.add('autocorrect-active');

    autocorrectListener = (e) => {
        if (e.key === ' ') {
            e.preventDefault(); 

            const words = input.value.split(' ');
            const lastWord = words[words.length - 1];

            if (lastWord.length > 0) {
                const randomWord = wordPool[Math.floor(Math.random() * wordPool.length)];
                words[words.length - 1] = randomWord;
                input.value = words.join(' ') + ' ';
            }
        }
    };

    input.addEventListener('keydown', autocorrectListener);
}

function stopAutocorrectCurse() {
    if (!autocorrectActive) return;
    autocorrectActive = false;

    const input = DOMElements.solutionInput;
    input.classList.remove('autocorrect-active');
    if (autocorrectListener) {
        input.removeEventListener('keydown', autocorrectListener);
        autocorrectListener = null;
    }
}

function createRoom() {
    if (!myPlayerToken) {
        showAlertModal('Du musst dich erst im "Schnelleinstieg"-Tab anmelden, um ein Spiel zu erstellen.', 'Anmeldung erforderlich');
        return;
    }

    const isPublicCheckbox = document.getElementById('isPublicCheckbox');

    const settings = {
        rounds: parseInt(DOMElements.roundsInput.value, 10),
        duration: parseInt(DOMElements.durationInput.value, 10),
        gameMode: DOMElements.gameModeSelect.value,
        difficulty: DOMElements.difficultySelect.value,
        isTeamMode: false,
        isPublic: isPublicCheckbox ? isPublicCheckbox.checked : false
    };
    
    socket.emit('createRoom', { token: myPlayerToken, settings });
}

function renderPublicRooms(roomsList) {
    const listEl = document.getElementById('public-rooms-list-modal');
    if (!listEl) return;

    if (!roomsList || roomsList.length === 0) {
        listEl.innerHTML = '<li class="no-rooms-message">Keine öffentlichen Spiele gefunden.</li>';
        return;
    }

    listEl.innerHTML = roomsList.map(room => `
        <li class="public-room-item">
            <div class="room-item-host-name">
                ${DOMPurify.sanitize(room.hostName)}'s Spiel
            </div>
            <div class="room-item-details">
                <i class="material-icons">videogame_asset</i>
                <span>${DOMPurify.sanitize(room.gameMode)} (${DOMPurify.sanitize(room.difficulty)})</span>
            </div>
            <div class="room-item-details">
                <i class="material-icons">people</i>
                <span>${room.playerCount} / ${room.maxPlayers}</span>
            </div>
            <button class="room-item-join-btn" data-room-id="${DOMPurify.sanitize(room.roomId)}">Beitreten</button>
        </li>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refreshRoomsBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => socket.emit('getPublicRoomsList'));
    }

    const publicRoomsListEl = document.getElementById('public-rooms-list');
    if (publicRoomsListEl) {
        publicRoomsListEl.addEventListener('click', (e) => {
            const joinBtn = e.target.closest('.room-item-join-btn');
            if (joinBtn) {
                const roomId = joinBtn.dataset.roomId;
                DOMElements.roomIdInput.value = roomId;
                handleJoin(false);
            }
        });
    }
});

const browseBtn = document.getElementById('browsePublicRoomsBtn');
const publicRoomsOverlay = document.getElementById('publicRoomsOverlay');
const closePublicRoomsBtn = document.getElementById('closePublicRoomsBtn');
const refreshBtnModal = document.getElementById('refreshRoomsBtnModal');
const publicRoomsListModal = document.getElementById('public-rooms-list-modal');

if (browseBtn) {
    browseBtn.addEventListener('click', () => {
        publicRoomsOverlay.classList.remove('hidden');
        socket.emit('getPublicRoomsList');
    });
}

if (closePublicRoomsBtn) {
    closePublicRoomsBtn.addEventListener('click', () => {
        publicRoomsOverlay.classList.add('hidden');
    });
}

if (refreshBtnModal) {
    refreshBtnModal.addEventListener('click', () => socket.emit('getPublicRoomsList'));
}

if (publicRoomsListModal) {
    publicRoomsListModal.addEventListener('click', (e) => {
        const joinBtn = e.target.closest('.room-item-join-btn');
        if (joinBtn) {
            const roomId = joinBtn.dataset.roomId;
            DOMElements.roomIdInput.value = roomId;
            publicRoomsOverlay.classList.add('hidden');
            handleJoin(false);
        }
    });
}

socket.on('publicRoomsUpdate', (roomsList) => {
    renderPublicRooms(roomsList);
});


socket.on('loginSuccess', ({ user, token, isNewUser }) => {
    myPlayerToken = token;
    localStorage.setItem('quizClashPlayerToken', token);
    currentPlayerProfile = user;
    if (isNewUser) {
        tutorialManager.show();
    }

    getEl('loginView').classList.add('hidden');
    const loggedInView = getEl('loggedInView');
    getEl('welcomeMessage').textContent = `Angemeldet als: ${user.name}`;
    loggedInView.classList.remove('hidden');

    applyEquippedFont(user.equippedFont);
    if (!isNewUser) {
        showLobbyMessage(`Willkommen zurück, ${user.name}!`, false, 3000);
    }

    const allAvatars = getEl('avatarSelector').querySelectorAll('img');
    allAvatars.forEach(img => {
        img.classList.toggle('selected', img.dataset.avatar === user.equippedAvatar);
    });

    socket.emit('getPublicRoomsList');
});

socket.on('loginFail', ({ message }) => {
    showLobbyMessage(message, true);
    DOMElements.playerNameInput.disabled = false;
    DOMElements.playerNameInput.focus();
    localStorage.removeItem('quizClashPlayerToken');
});

socket.on('showSystemToast', (message) => {
    showSystemToast(message);
});

socket.on('connectionSuccess', (data) => {
    const storedToken = localStorage.getItem('quizClashPlayerToken');
    if(storedToken) {
        socket.emit('login', { token: storedToken });
        socket.emit('getPublicRoomsList');
    }
});

socket.on('showSystemToast', (message) => {
    showSystemToast(message);
});

function renderEventVoting(state) {
    DOMElements.eventVoteTimer.textContent = state.timeLeft;
    const amISpectator = !state.players[socket.id];
    const myVote = state.eventVoting.votes[socket.id];
    
    DOMElements.eventChoicesContainer.innerHTML = state.eventVoting.choices.map(event => {
        const voteCount = state.eventVoting.voteCounts?.[event.id] || 0;
        const iVotedForThis = myVote === event.id;
        
        const canVote = amISpectator && !myVote;

        return `
            <button 
                class="event-choice-btn ${iVotedForThis ? 'voted' : ''}" 
                data-event-id="${event.id}" 
                ${!canVote ? 'disabled' : ''}
            >
                <div class="event-text">
                    <h4>${DOMPurify.sanitize(event.name)}</h4>
                    <p>${DOMPurify.sanitize(event.description)}</p>
                </div>
                <div class="event-vote-count">${voteCount}</div>
            </button>
        `;
    }).join('');

    DOMElements.eventChoicesContainer.onclick = (e) => {
    const button = e.target.closest('.event-choice-btn:not(:disabled)');
    if (button && amISpectator && !myVote) {
        const eventId = button.dataset.eventId;
        socket.emit('spectatorVoteEvent', { eventId });
        DOMElements.eventChoicesContainer.querySelectorAll('.event-choice-btn').forEach(btn => btn.disabled = true);
    }
};
}


function logout() {
    localStorage.removeItem('quizClashPlayerToken');
    location.reload();
}

function handleJoin(isSpectator) {
    if (!myPlayerToken) return showLobbyMessage('Bitte zuerst einen Namen eingeben.', true);
    const roomId = DOMElements.roomIdInput.value.trim().toUpperCase();
    if (!roomId) return showLobbyMessage('Bitte eine Raum-ID eingeben.', true);
    socket.emit('joinRoom', { token: myPlayerToken, roomId, isSpectator });
}

function submitSolution() {
    const solution = DOMElements.solutionInput.value;
    if (!solution.trim()) return;

    socket.emit('submitSolution', { answer: solution });
}

function showCaptcha(userAnswer) {
    isCaptchaActive = true;
    const captchaOverlay = DOMElements.captchaOverlay;
    const captchaGrid = getEl('captcha-grid');
    const captchaInstruction = getEl('captcha-instruction');
    const captchaMessage = getEl('captcha-message');
    const confirmBtn = getEl('captcha-confirm-btn');
    
    captchaOverlay.classList.remove('hidden');

    const challenges = [
        { 
            instruction: 'Klicke auf alle Bilder, die ein Sandwich enthalten, das ein Fahrrad fährt.', 
            correctType: 'sandwich', 
            correctCount: 3,
            images: ['sandwich1.png', 'sandwich2.png', 'bike1.png', 'cat1.png', 'sandwich3.png', 'bike2.png', 'cat2.png', 'cat3.png', 'bike3.png'] 
        },
        { 
            instruction: 'Wähle alle Katzen aus, die erfolgreich eine Partie Schach gewonnen haben.', 
            correctType: 'cat', 
            correctCount: 3,
            images: ['cat1.png', 'cat2.png', 'sandwich1.png', 'bike1.png', 'cat3.png', 'bike2.png', 'sandwich2.png', 'sandwich3.png', 'bike3.png'] 
        }
    ];
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];

    captchaInstruction.textContent = challenge.instruction;
    captchaGrid.innerHTML = '';
    captchaMessage.textContent = '';
    captchaMessage.className = 'message-box';

    const shuffledImages = challenge.images.sort(() => 0.5 - Math.random());

    shuffledImages.forEach(imgName => {
        const img = document.createElement('img');
        img.src = `assets/captcha/${imgName}`;
        img.className = 'captcha-image';
        img.dataset.type = imgName.replace(/[0-9]/g, '').replace('.png', '');
        img.addEventListener('click', () => {
            img.classList.toggle('selected');
        });
        captchaGrid.appendChild(img);
    });

    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    newConfirmBtn.addEventListener('click', () => {
        const selectedImages = captchaGrid.querySelectorAll('.captcha-image.selected');
        let correctSelections = 0;
        let incorrectSelections = 0;

        selectedImages.forEach(img => {
            if (img.dataset.type === challenge.correctType) {
                correctSelections++;
            } else {
                incorrectSelections++;
            }
        });

        if (incorrectSelections === 0 && correctSelections === challenge.correctCount) {
            socket.emit('submitSolution', { answer: userAnswer, captchaPassed: true });
            isCaptchaActive = false;
            captchaOverlay.classList.add('hidden');
            captchaGrid.innerHTML = '';
        } else {
            captchaMessage.textContent = 'Falsch! Bist du sicher, dass du ein Mensch bist?';
            captchaMessage.classList.add('error');
            captchaGrid.querySelectorAll('.captcha-image.selected').forEach(img => img.classList.remove('selected'));
        }
   });
}

function startPikaSqueak() {
    if (pikaSqueakActive) return;
    pikaSqueakActive = true;

    pikaAudio = new Audio('assets/audio/pika.mp3');
    pikaAudio.load();

    const input = DOMElements.solutionInput;

    pikaKeyListener = (e) => {
        if (pikaAudio && e.key.length === 1) {
            pikaAudio.currentTime = 0;
            pikaAudio.play().catch(err => console.error("Sound konnte nicht abgespielt werden:", err));
        }
    };

    input.addEventListener('keydown', pikaKeyListener);
}

function stopPikaSqueak() {
    if (!pikaSqueakActive) return;
    pikaSqueakActive = false;

    const input = DOMElements.solutionInput;
    if (pikaKeyListener) {
        input.removeEventListener('keydown', pikaKeyListener);
    }

    pikaKeyListener = null;
    pikaAudio = null;
}

function renderTravelUI(data) {
    const { destinations, souvenirs, sets, playerTravel } = data;
    const destinationsGrid = getEl('destinations-grid');
    const activeTravelInfo = getEl('active-travel-info');
    const albumContent = getEl('album-content');
    destinationsGrid.innerHTML = Object.values(destinations).map(dest => {
        const canAfford = currentPlayerProfile.qcoins >= dest.cost;
        const levelOk = currentPlayerProfile.level >= dest.level;
        const isLocked = !canAfford || !levelOk;
        let lockReason = '';
        if (!canAfford) lockReason = 'Zu teuer';
        else if (!levelOk) lockReason = `Level ${dest.level} benötigt`;

        return `
            <div class="destination-card ${isLocked ? 'locked' : ''}" title="${lockReason}">
                <h4>${dest.icon} ${safeSanitize(dest.name)}</h4>
                <div class="destination-card-details">
                    <span><i class="material-icons">schedule</i> ${dest.duration / 3600000} Stunden</span>
                    <span><i class="material-icons">military_tech</i> Level ${dest.level}</span>
                    <span><img src="assets/Coin.png" class="coin-icon" alt="Coins"> ${dest.cost}</span>
                </div>
                <button class="start-travel-btn" data-id="${dest.id}" ${isLocked || playerTravel.activeTravel ? 'disabled' : ''}>
                    ${isLocked ? lockReason : 'Reise starten'}
                </button>
            </div>
        `;
    }).join('');

    destinationsGrid.querySelectorAll('.start-travel-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const destinationId = e.currentTarget.dataset.id;
            socket.emit('travel:start', { token: myPlayerToken, destinationId });
        });
    });

    if (playerTravel.activeTravel) {
        const journey = playerTravel.activeTravel;
        const destination = destinations[journey.destinationId];
        const isFinished = Date.now() >= journey.endTime;

        activeTravelInfo.innerHTML = `
            <div class="travel-active-card">
                <div class="travel-details">
                    <p>Unterwegs nach: ${destination.icon} ${DOMPurify.sanitize(destination.name)}</p>
                    <small id="travel-timer">Wird berechnet...</small>
                </div>
                <button id="claim-travel-reward-btn" ${!isFinished ? 'disabled' : ''}>
                    ${isFinished ? 'Belohnung abholen' : 'Unterwegs...'}
                </button>
            </div>
        `;
        
        const claimBtn = getEl('claim-travel-reward-btn');
        if (claimBtn) {
            claimBtn.addEventListener('click', () => {
                socket.emit('travel:claim', { token: myPlayerToken });
            });
        }
        
        updateTravelTimer(journey.endTime);

    } else {
        activeTravelInfo.innerHTML = `<p>Du bist derzeit nicht auf Reisen. Wähle ein Ziel!</p>`;
        if (travelTimerInterval) clearInterval(travelTimerInterval);
    }

albumContent.innerHTML = Object.keys(sets).map(setName => {
    const set = sets[setName];
    const regionKey = set.region ? set.region.toLowerCase() : '';
    const regionSouvenirs = souvenirs[regionKey] || [];
    
    const collectedInRegion = regionSouvenirs.filter(s => playerTravel.collectedSouvenirs.includes(s.id));
    const progress = regionSouvenirs.length > 0 ? (collectedInRegion.length / regionSouvenirs.length) * 100 : 0;
    
    return `
        <div class="album-set">
            <h3>${DOMPurify.sanitize(setName)} (${collectedInRegion.length}/${regionSouvenirs.length})</h3>
            <div class="set-progress-bar"><div class="set-progress-fill" style="width: ${progress}%"></div></div>
            <div class="souvenir-grid">
                ${regionSouvenirs.map(s => {
                    const isCollected = playerTravel.collectedSouvenirs.includes(s.id);
                    return `
                        <div class="souvenir-item ${isCollected ? 'collected' : ''}" title="${s.name}">
                            <img class="souvenir-icon" src="assets/${isCollected ? s.icon : 'unknown_souvenir.png'}" alt="${s.name}">
                            <span>${DOMPurify.sanitize(s.name)}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}).join('');
    
    getEl('travelOverlay').classList.remove('hidden');
}

function openShop() {
    if (!currentPlayerProfile) return;

    const createItemHTML = (item) => {
        const isOwned = currentPlayerProfile.inventory?.includes(item.id);
        const isEquipped = 
            (item.type === 'font' && currentPlayerProfile.equippedFont === item.value) ||
            (item.type === 'avatar' && currentPlayerProfile.equippedAvatar === item.value) || 
            ((item.type === 'chat_color' || item.type === 'chat_fx') && currentPlayerProfile.equippedChatColor === item.value);

        let buttonHtml;
        if (isEquipped) {
            buttonHtml = `<button class="shop-btn equipped" disabled>Angelegt</button>`;
        } else if (isOwned) {
            buttonHtml = `<button class="shop-btn apply-btn" data-item-id="${item.id}">Anwenden</button>`;
        } else if (currentPlayerProfile.qcoins >= item.cost) {
            buttonHtml = `<button class="shop-btn buy-btn" data-item-id="${item.id}">Kaufen</button>`;
        } else {
            buttonHtml = `<button class="shop-btn unaffordable" disabled>Zu teuer</button>`;
        }
        
        let previewHtml;
        let nameHtml = `<h4 class="item-name">${DOMPurify.sanitize(item.name)}</h4>`;
        switch(item.type) {
            case 'powerup': previewHtml = `<div class="item-preview-powerup">⚡</div>`; break;
            
            case 'font':
                const fontNameMatch = item.name.match(/\(([^)]+)\)/);
                const fontFamily = fontNameMatch ? fontNameMatch[1] : 'sans-serif'; 
                previewHtml = `<div class="item-preview-font" style="font-family: '${fontFamily}', sans-serif;">Ag</div>`;
                break;

            case 'chat_color': previewHtml = `<div class="item-preview-color" style="background-color: ${item.value};"></div>`; nameHtml = `<h4 class="item-name" style="color: ${item.value};">${DOMPurify.sanitize(item.name)}</h4>`; break;
            case 'chat_fx': previewHtml = `<div class="item-preview-fx"><span class="anim-target ${item.value}" data-text="Effekt">${item.name.split(' ')[0]}</span></div>`; nameHtml = `<h4>${DOMPurify.sanitize(item.name)}</h4>`; break;
            case 'avatar': previewHtml = `<img src="assets/avatars/${item.value}" class="item-preview-avatar">`; break; 
        }

        return `
            <div class="shop-item-card">
                <div class="item-preview">${previewHtml || ''}</div>
                <div class="item-details">${nameHtml}<p class="item-description">${item.description || ''}</p></div>
                <div class="item-purchase"><div class="item-cost"><span>${item.cost}</span>${coinImg}</div>${buttonHtml}</div>
            </div>`;
    };
    
    const jokers = Object.values(shopItems).filter(item => item.type === 'powerup');
    const fonts = Object.values(shopItems).filter(item => item.type === 'font');
    const colors = Object.values(shopItems).filter(item => item.type === 'chat_color');
    const animations = Object.values(shopItems).filter(item => item.type === 'chat_fx');
    const avatars = Object.values(shopItems).filter(item => item.type === 'avatar'); 

    getEl('shop-tab-schrift').innerHTML = fonts.map(createItemHTML).join('');
    getEl('shop-tab-farben').innerHTML = colors.map(createItemHTML).join('');
    getEl('shop-tab-animationen').innerHTML = animations.map(createItemHTML).join('');
    getEl('shop-tab-avatare').innerHTML = avatars.map(createItemHTML).join('');

    DOMElements.shopQCoinsDisplay.innerHTML = `${currentPlayerProfile.qcoins}${coinImg}`;
    DOMElements.shopOverlay.classList.remove('hidden');

    setTimeout(() => {
        document.querySelectorAll('#shop-tab-animationen .anim-target').forEach(el => {
            const effectClass = Array.from(el.classList).find(c => c.startsWith('fx-'));
             if (effectClass) { 
                 const functionName = `apply${effectClass.charAt(3).toUpperCase()}${effectClass.slice(4)}Effect`;
                 if (fxManager[functionName]) {
                    fxManager[functionName](el);
                }
            }
        });
    }, 100);
}

function startPopupChaos() {
    if (chaosPopupInterval) return; 

    const createChaosPopup = () => {
        const video = document.createElement('video');
        video.className = 'chaos-popup';
        video.src = chaosVideoPaths[Math.floor(Math.random() * chaosVideoPaths.length)];

        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;

        const size = Math.random() * 20 + 20;
        video.style.width = `${size}vw`;
        video.style.height = 'auto';
        video.style.top = `${Math.random() * 70}vh`; 
        video.style.left = `${Math.random() * (100 - size)}vw`;

        document.body.appendChild(video);

        setTimeout(() => {
            video.remove();
        }, 12000); 
    };

      chaosPopupInterval = setInterval(createChaosPopup, 800); 
}

function stopPopupChaos() {
    if (chaosPopupInterval) {
        clearInterval(chaosPopupInterval);
        chaosPopupInterval = null;
    }
    document.querySelectorAll('.chaos-popup').forEach(p => p.remove());
}

function startTastenChaos() {
    if (chaosActive) return;
    chaosActive = true;

    document.body.classList.add('chaos-active');

    const chaosCursor = document.createElement('div');
    chaosCursor.id = 'chaos-cursor';
    document.body.appendChild(chaosCursor);

    chaosMouseListener = (e) => {
        chaosCursor.style.top = `${e.clientX}px`;
        chaosCursor.style.left = `${e.clientY}px`;
    };
    document.addEventListener('mousemove', chaosMouseListener);

    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789!?.,-';
    chaosKeyListener = (e) => {
        e.preventDefault();
        const randomChar = chars[Math.floor(Math.random() * chars.length)];
        const input = DOMElements.solutionInput;

        const start = input.selectionStart;
        const end = input.selectionEnd;
        input.value = input.value.substring(0, start) + randomChar + input.value.substring(end);
        input.selectionStart = input.selectionEnd = start + 1;
    };
    DOMElements.solutionInput.addEventListener('keydown', chaosKeyListener);
}

function stopTastenChaos() {
    if (!chaosActive) return;
    chaosActive = false;

    document.body.classList.remove('chaos-active');

    const chaosCursor = document.getElementById('chaos-cursor');
    if (chaosCursor) chaosCursor.remove();

    if (chaosMouseListener) document.removeEventListener('mousemove', chaosMouseListener);
    if (chaosKeyListener) DOMElements.solutionInput.removeEventListener('keydown', chaosKeyListener);

    chaosMouseListener = null;
    chaosKeyListener = null;
}

function startDecoyAnswer(decoyText) {
    if (decoyActive || !decoyText) return;
    decoyActive = true;

    const popup = document.createElement('div');
    popup.id = 'decoy-popup';
    popup.innerHTML = `
        <h3>⚠️ LÖSUNG GELEAKT! ⚠️</h3>
        <p>"${DOMPurify.sanitize(decoyText)}"</p>
        <small>(Vertrau mir...)</small>
    `;
    document.body.appendChild(popup);

    decoyMouseMoveListener = (e) => {
        popup.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    document.addEventListener('mousemove', decoyMouseMoveListener);
}

function stopDecoyAnswer() {
    if (!decoyActive) return;
    decoyActive = false;

    const popup = document.getElementById('decoy-popup');
    if (popup) popup.remove();

    if (decoyMouseMoveListener) {
        document.removeEventListener('mousemove', decoyMouseMoveListener);
        decoyMouseMoveListener = null;
    }
}

function startDiscoTime() {
    if (discoActive) return;
    discoActive = true;

    try {
        discoAudio = new Audio('assets/audio/disco-music.mp3');
        discoAudio.loop = true;
        discoAudio.volume = 0.5;
        discoAudio.play();
    } catch (e) {
        console.error("Musik konnte nicht geladen werden.", e);
    }

    document.body.classList.add('disco-mode');

    const discoContainer = document.createElement('div');
    discoContainer.id = 'disco-container';

    const discoBall = document.createElement('div');
    discoBall.id = 'disco-ball';
    discoContainer.appendChild(discoBall);

    const colors = ['#ff00ff', '#00ffff', '#ffff00', '#00ff00', '#ff8800', '#0088ff'];
    for (let i = 0; i < 900; i++) { 
        const lightBeam = document.createElement('div');
        lightBeam.className = 'light-beam';
        lightBeam.style.background = `linear-gradient(to bottom, ${colors[i % colors.length]}33, transparent)`;
        lightBeam.style.transform = `rotate(${i * 18}deg)`;
        lightBeam.style.animationDelay = `${i * 0.05}s`;
        discoContainer.appendChild(lightBeam);
    }

    const dancePopup = document.createElement('div');
    dancePopup.id = 'dance-popup';
    dancePopup.innerHTML = '<span>D</span><span>A</span><span>N</span><span>C</span><span>E</span><span>!</span>';

    discoContainer.appendChild(dancePopup);
    document.body.appendChild(discoContainer);

    startConfettiCannons();
}

function stopDiscoTime() {
    if (!discoActive) return;
    discoActive = false;

    if (discoAudio) {
        discoAudio.pause();
        discoAudio = null;
    }

    document.body.classList.remove('disco-mode');

    const discoContainer = document.getElementById('disco-container');
    if (discoContainer) {
        discoContainer.remove();
    }

    stopConfettiCannons();
}

function startConfettiCannons() {
    const leftCannon = document.createElement('div');
    leftCannon.className = 'confetti-cannon left';
    document.body.appendChild(leftCannon);

    const rightCannon = document.createElement('div');
    rightCannon.className = 'confetti-cannon right';
    document.body.appendChild(rightCannon);

    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800'];

    const launchConfetti = (cannon) => {
        for (let i = 0; i < 10; i++) { 
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            const angle = (Math.random() * 45 + 20) * (cannon.classList.contains('left') ? 1 : -1) - 90;
            const velocity = Math.random() * 80 + 120;
            const rotation = Math.random() * 360;

            piece.style.setProperty('--angle', `${angle}deg`);
            piece.style.setProperty('--velocity', `${velocity}vmin`);
            piece.style.setProperty('--rotation', `${rotation}deg`);

            cannon.appendChild(piece);
            setTimeout(() => piece.remove(), 4000);
        }
    };

    confettiInterval = setInterval(() => {
        launchConfetti(leftCannon);
        launchConfetti(rightCannon);
    }, 800);
}

function stopConfettiCannons() {
    if (confettiInterval) {
        clearInterval(confettiInterval);
        confettiInterval = null;
    }
    document.querySelectorAll('.confetti-cannon').forEach(c => c.remove());
}

function showLoginViewForNameChange() {
    getEl('loggedInView').classList.add('hidden');
    getEl('loginView').classList.remove('hidden');
}

function populateUpdateLog() {
    if (!updateLogData || updateLogData.length === 0) {
        DOMElements.updateLogContent.innerHTML = '<p>Konnte das Update Log nicht laden oder es ist leer.</p>';
        return;
    }

    const groupedLogs = updateLogData.reduce((acc, log) => {
        if (!acc[log.version]) {
            acc[log.version] = [];
        }
        acc[log.version].push(log);
        return acc;
    }, {});

    let logHTML = '';
    for (const version in groupedLogs) {
        logHTML += `<h4>Version ${DOMPurify.sanitize(version)}</h4><ul>`;
        
        groupedLogs[version].forEach(log => {
            const lines = log.description.split('\n').filter(line => line.trim() !== '');
            lines.forEach(line => {
                const lowerLine = line.toLowerCase().trim();
                let typeClass = '';
                let cleanLine = line.trim();

                if (lowerLine.startsWith('[new]') || lowerLine.startsWith('[feature]') || lowerLine.startsWith('[add]')) {
                    typeClass = 'feature';
                    cleanLine = line.replace(/\[(new|feature|add)\]/i, '').trim();
                } else if (lowerLine.startsWith('[fix]') || lowerLine.startsWith('[bug]') || lowerLine.startsWith('[bugfix]')) {
                    typeClass = 'fix';
                    cleanLine = line.replace(/\[(fix|bug|bugfix)\]/i, '').trim();
                } else if (lowerLine.startsWith('[info]') || lowerLine.startsWith('[change]')) {
                    typeClass = 'info';
                    cleanLine = line.replace(/\[(info|change)\]/i, '').trim();
                }

                logHTML += `<li class="${typeClass}">${DOMPurify.sanitize(cleanLine)}</li>`;
            });
        });
        
        logHTML += `</ul>`;
    }

    DOMElements.updateLogContent.innerHTML = logHTML;
}

function populateProfileOverlay(user, isMyProfile) {
    if (!user) return;
    const level = user.level || 1;
    const xp = user.xp || 0;
    const xpForNextLevel = Math.floor(100 * Math.pow(level, 1.5));
    const xpPercent = Math.min((xp / xpForNextLevel) * 100, 100);

    DOMElements.profileAvatarImg.src = `assets/avatars/${user.equippedAvatar}`;
    DOMElements.profileAvatarLevel.textContent = level;
    DOMElements.profileAvatarXpText.textContent = `${Math.floor(xp)} / ${xpForNextLevel} XP`;
    DOMElements.profileAvatarXpFill.style.width = `${xpPercent}%`;
    DOMElements.profileName.textContent = user.name;
    DOMElements.profileQCoins.innerHTML = `${user.qcoins}${coinImg}`;
    const stats = user.stats || { wins: 0, gamesPlayed: 0 };
    DOMElements.profileWins.textContent = stats.wins || 0;
    DOMElements.profileGames.textContent = stats.gamesPlayed || 0;
    const winRate = (stats.gamesPlayed > 0) ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;
    DOMElements.profileWinrate.textContent = `${winRate}%`;
    const perksListEl = getEl('profile-perks-list');
    perksListEl.innerHTML = user.unlockedPerks?.length > 0
        ? user.unlockedPerks.map(perkId => {
            const perkData = Object.values(avatarPerks || {}).find(p => p.id === perkId);
            if (!perkData) return '';
            return `<li><div class="ach-icon">${perkData.icon}</div><div class="ach-text"><h4>${DOMPurify.sanitize(perkData.name)}</h4><p>${DOMPurify.sanitize(perkData.description)}</p></div></li>`;
        }).join('')
        : '<li>Dieser Spieler hat noch keine Perks freigeschaltet.</li>';
    DOMElements.profileAchievementsList.innerHTML = user.achievements?.length > 0
        ? user.achievements.map(achId => `<li><div class="ach-icon">🏆</div><div class="ach-text"><h4>${achievements[achId]?.name || achId}</h4><p>${achievements[achId]?.description || ''}</p></div></li>`).join('')
        : '<li>Dieser Spieler hat noch keine Erfolge freigeschaltet.</li>';
    const historyListEl = getEl('profile-game-history');
    historyListEl.innerHTML = user.gameHistory?.length > 0
        ? user.gameHistory.map(game => {
            const date = new Date(game.date).toLocaleDateString('de-DE');
            return `
                <li>
                    <div class="ach-icon">📜</div>
                    <div class="ach-text">
                        <h4>Platz ${game.myRank} / ${game.playerCount} (${game.myScore} Pkt)</h4>
                        <p>Modus: ${game.mode} | Gewinner: ${game.winner} | ${date}</p>
                    </div>
                </li>
            `;
        }).join('')
        : '<li>Keine Spielhistorie verfügbar.</li>';
const titlesListEl = DOMElements.profileTitlesList;
    const unlockedTitlesArray = user.unlockedTitles || []; 

    if (unlockedTitlesArray.length > 0) {
        titlesListEl.innerHTML = unlockedTitlesArray.map(titleId => {
            const titleData = titles[titleId]; 
            
            if (!titleData) {
                console.warn(`Title data missing for unlocked ID: ${titleId}`);
                return ''; 
            }

            const isEquipped = user.equippedTitle === titleId;
            const canEquip = isMyProfile && !isEquipped; 

            return `
                <button class="title-btn ${isEquipped ? 'equipped' : ''}"
                        data-title-id="${titleId}"
                        ${!canEquip ? 'disabled' : ''} 
                        title="${DOMPurify.sanitize(titleData.description || 'Keine Beschreibung.')}">
                    ${DOMPurify.sanitize(titleData.name || 'Unbekannter Titel')}
                </button>
            `;
        }).join('');
    } else {
        titlesListEl.innerHTML = '<p>Du hast noch keine Titel freigeschaltet. Spiele mehr, um sie zu verdienen!</p>';
    }

    if (isMyProfile) {
         titlesListEl.querySelectorAll('.title-btn:not(:disabled)').forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn); 
            
            newBtn.addEventListener('click', (e) => {
                const titleId = e.currentTarget.dataset.titleId;
                if (myPlayerToken && titleId) { 
                    socket.emit('equipItem', { token: myPlayerToken, itemId: titleId });
                    titlesListEl.querySelectorAll('.title-btn').forEach(b => b.disabled = true);
                } else {
                    console.error("Missing token or titleId on equip click");
                }
            });
        });
    }
    
    const dangerZone = DOMElements.profileOverlay.querySelector('.danger-zone');
    if (dangerZone) {
        dangerZone.classList.toggle('hidden', !isMyProfile);
    }
    DOMElements.profileOverlay.classList.remove('hidden');
}


function openProfile() {
    if (!currentPlayerProfile) return;

    const level = currentPlayerProfile.level || 1;
    const xp = currentPlayerProfile.xp || 0;
    const xpForNextLevel = Math.floor(100 * Math.pow(level, 1.5));
    const xpPercent = Math.min((xp / xpForNextLevel) * 100, 100);

    DOMElements.profileAvatarImg.src = `assets/avatars/${currentPlayerProfile.equippedAvatar}`;
    DOMElements.profileAvatarLevel.textContent = level;
    DOMElements.profileAvatarXpText.textContent = `${Math.floor(xp)} / ${xpForNextLevel} XP`;
    DOMElements.profileAvatarXpFill.style.width = `${xpPercent}%`;
    DOMElements.profileName.textContent = currentPlayerProfile.name;

    DOMElements.profileQCoins.innerHTML = `${currentPlayerProfile.qcoins}${coinImg}`;
    const stats = currentPlayerProfile.stats;
    DOMElements.profileWins.textContent = stats.wins || 0;
    DOMElements.profileGames.textContent = stats.gamesPlayed || 0;
    const winRate = (stats.gamesPlayed > 0) ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;
    DOMElements.profileWinrate.textContent = `${winRate}%`;

        const perksListEl = document.getElementById('profile-perks-list');
    perksListEl.innerHTML = currentPlayerProfile.unlockedPerks?.length > 0
        ? currentPlayerProfile.unlockedPerks.map(perkId => {
            const perkData = Object.values(avatarPerks || {}).find(p => p.id === perkId); 
            if (!perkData) return '';
            return `<li><div class="ach-icon">${perkData.icon}</div><div class="ach-text"><h4>${DOMPurify.sanitize(perkData.name)}</h4><p>${DOMPurify.sanitize(perkData.description)}</p></div></li>`;
        }).join('')
        : '<li>Noch keine Perks freigeschaltet. Steigere dein Avatar-Level!</li>';

    DOMElements.profileAchievementsList.innerHTML = currentPlayerProfile.achievements.length > 0 
        ? currentPlayerProfile.achievements.map(achId => `<li><div class="ach-icon">🏆</div><div class="ach-text"><h4>${achievements[achId]?.name || achId}</h4><p>${achievements[achId]?.description || ''}</p></div></li>`).join('') 
        : '<li>Noch keine Erfolge freigeschaltet.</li>';


     const historyListEl = document.getElementById('profile-game-history');
    historyListEl.innerHTML = currentPlayerProfile.gameHistory?.length > 0
        ? currentPlayerProfile.gameHistory.map(game => {
            const date = new Date(game.date).toLocaleDateString('de-DE');
            return `
                <li>
                    <div class="ach-icon">📜</div>
                    <div class="ach-text">
                        <h4>Platz ${game.myRank} / ${game.playerCount} (${game.myScore} Pkt)</h4>
                        <p>Modus: ${game.mode} | Gewinner: ${game.winner} | ${date}</p>
                    </div>
                </li>
            `;
        }).join('')
        : '<li>Noch keine Spiele beendet.</li>';

    const titlesListEl = DOMElements.profileTitlesList;
    titlesListEl.innerHTML = (currentPlayerProfile.unlockedTitles || []).map(titleId => {
        const titleData = titles[titleId];
        if (!titleData) return '';
        const isEquipped = currentPlayerProfile.equippedTitle === titleId;
        return `
            <button class="title-btn ${isEquipped ? 'equipped' : ''}" data-title-id="${titleId}" ${isEquipped ? 'disabled' : ''} title="${DOMPurify.sanitize(titleData.description)}">
                ${DOMPurify.sanitize(titleData.name)}
            </button>
        `;
    }).join('') || '<p>Schalte Titel durch Gameplay frei!</p>';

    titlesListEl.querySelectorAll('.title-btn:not(:disabled)').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const titleId = e.currentTarget.dataset.titleId;
            socket.emit('equipItem', { token: myPlayerToken, itemId: titleId });
            titlesListEl.querySelectorAll('.title-btn').forEach(b => b.disabled = true);
        });
    });

    const deleteBtn = getEl('deleteAccountBtn');
if (deleteBtn) {
    const newDeleteBtn = deleteBtn.cloneNode(true);
    deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);

    newDeleteBtn.addEventListener('click', () => {
        const overlay = getEl('deleteAccountConfirmOverlay');
        const confirmInput = getEl('deleteConfirmInput');
        const confirmYesBtn = getEl('deleteConfirmBtnYes');
        const confirmNoBtn = getEl('deleteConfirmBtnNo');
        const playerNameDisplay = getEl('deleteConfirmPlayerName');

        confirmInput.value = '';
        confirmYesBtn.disabled = true;
        playerNameDisplay.textContent = currentPlayerProfile.name;
        overlay.classList.remove('hidden');

        const handleInput = () => {
            confirmYesBtn.disabled = confirmInput.value !== currentPlayerProfile.name;
        };
        
        const handleConfirm = () => {
            if (confirmInput.value === currentPlayerProfile.name) {
                 socket.emit('deleteAccount', { token: myPlayerToken });
            }
            cleanup();
        };

        const handleCancel = () => {
            cleanup();
        };

        const cleanup = () => {
            overlay.classList.add('hidden');
            confirmInput.removeEventListener('input', handleInput);
            confirmYesBtn.removeEventListener('click', handleConfirm);
            confirmNoBtn.removeEventListener('click', handleCancel);
        };

        confirmInput.addEventListener('input', handleInput);
        confirmYesBtn.addEventListener('click', handleConfirm);
        confirmNoBtn.addEventListener('click', handleCancel);
    });
}

    DOMElements.profileOverlay.classList.remove('hidden');
}

 DOMElements.shopOverlay.addEventListener('click', (e) => {
        const navBtn = e.target.closest('.shop-nav-btn');
        if (!navBtn) return;

        const tab = navBtn.dataset.tab;
        
        DOMElements.shopOverlay.querySelectorAll('.shop-nav-btn').forEach(btn => btn.classList.remove('active'));
        DOMElements.shopOverlay.querySelectorAll('.shop-tab-content').forEach(content => content.classList.remove('active'));
        
        navBtn.classList.add('active');
        getEl(`shop-tab-${tab}`).classList.add('active');
    });

document.addEventListener('DOMContentLoaded', () => {
    const storedToken = localStorage.getItem('quizClashPlayerToken');
    if (storedToken) {
        socket.emit('login', { token: storedToken });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    const spectateParam = urlParams.get('spectate');

    if (roomParam && storedToken) {
        setTimeout(() => {
            if (DOMElements.roomIdInput) {
                DOMElements.roomIdInput.value = roomParam;
                handleJoin(spectateParam === 'true');
            }
        }, 800); 
    }

    window.openHostMenu = function(event, targetId, targetName) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
    
        const overlay = document.getElementById('customConfirmOverlay');
        const btnContainer = overlay.querySelector('.confirm-buttons');
        
        if (!btnContainer.dataset.originalHtml) {
            btnContainer.dataset.originalHtml = btnContainer.innerHTML;
        }

        const restoreAndClose = () => {
            overlay.classList.add('hidden');
            setTimeout(() => {
                if (btnContainer.dataset.originalHtml) {
                    btnContainer.innerHTML = btnContainer.dataset.originalHtml;
                }
            }, 200);
        };

        showConfirmationModal(
            `<p>Was möchtest du mit <strong>${targetName}</strong> tun?</p>
             <p style="font-size:0.9em; color:#aaa;">Kick = Rauswerfen (kann rejoinen)<br>Ban = Rauswerfen & Sperren für diesen Raum</p>`,
            (result) => {
            }, 
            'Spieler verwalten'
        );

        btnContainer.innerHTML = `
            <button id="hostKickBtn" class="action-button" style="border-color:orange; color:orange;">Kicken</button>
            <button id="hostBanBtn" class="danger-btn">Bannen</button>
            <button id="hostCancelBtn" class="secondary-action">Abbrechen</button>
        `;

        document.getElementById('hostKickBtn').onclick = () => {
            socket.emit('host:kickPlayer', { roomId: currentGameState.roomId, targetId: targetId, isBan: false });
            restoreAndClose();
        };

        document.getElementById('hostBanBtn').onclick = () => {
            socket.emit('host:kickPlayer', { roomId: currentGameState.roomId, targetId: targetId, isBan: true });
            restoreAndClose();
        };

        document.getElementById('hostCancelBtn').onclick = () => {
            restoreAndClose();
        };
    };

    document.addEventListener('copy', (e) => {
        if (!DOMElements.gameScreen.classList.contains('hidden') && document.activeElement !== DOMElements.chatInput) {
            e.preventDefault();
            const gibberish = [
                "Hier wird nicht geschummelt!",
                "Kopieren ist deaktiviert.",
                "Quizlino Security Protocol Active"
            ];
            const randomText = gibberish[Math.floor(Math.random() * gibberish.length)];
            
            if (e.clipboardData) {
                e.clipboardData.setData('text/plain', randomText);
            } else if (window.clipboardData) {
                window.clipboardData.setData('text', randomText);
            }
            showSystemToast('🚫 Kopieren ist während des Spiels deaktiviert!');
        }
    });

    setupEventListeners();
    fxManager.init();

    if (!localStorage.getItem('quizClashTutorialCompleted_v3')) {
        tutorialManager.show();
    }
    
    tutorialManager.init();
    casinoManager.init();
    bankManager.init();
    initChatti();
    travelManager.init();
    populateUpdateLog();
    if (DOMElements.chatOpenBtn) {
    DOMElements.chatOpenBtn.classList.add('visible');
}
    for (let i = 1; i <= 5; i++) {
        const audio = new Audio(`assets/audio/ear_destroyer_${i}.mp3`);
        audio.loop = true;
        earDestroyerSounds.push(audio);
    }
    const startHandyGameBtn = document.getElementById('start-handy-game-btn');
    if (startHandyGameBtn) {
        startHandyGameBtn.addEventListener('click', () => {
            loadPhoneGame();
        });
    }
});
