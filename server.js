const express = require('express');
require('dotenv').config();
const http = require('http');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ADMIN_PANEL_PATH = process.env.ADMIN_PANEL_PATH || `/admin-dashboard-${randomUUID()}`;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET;
const socketIo = require('socket.io');
const fs = require('fs').promises;
const path = require('path');
const socketRateLimits = {};
const isRateLimited = (socketId, actionType, timeWindowMs = 500) => {
    if (!socketRateLimits[socketId]) socketRateLimits[socketId] = {};
    
    const lastAction = socketRateLimits[socketId][actionType] || 0;
    const now = Date.now();
    
    if (now - lastAction < timeWindowMs) {
        return true;
    }
    
    socketRateLimits[socketId][actionType] = now;
    return false; 
};
const connectionAttempts = {};
const CONNECTION_WINDOW = 60000;
const MAX_CONNECTIONS_PER_WINDOW = 10;

const validatePayload = (data, expectedStructure) => {
    if (typeof data !== 'object' || data === null) return false;
    for (const [key, type] of Object.entries(expectedStructure)) {
        if (data[key] === undefined) return false;
        if (typeof data[key] !== type) return false;
        if (type === 'string' && data[key].length > 1000) return false;
    }
    return true;
};
const { randomUUID } = require('crypto'); 
const rateLimit = require('express-rate-limit');
const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');
const toxicity = require('@tensorflow-models/toxicity');
const Database = require('better-sqlite3');
const serverStartTime = Date.now();
const shopItems = require('./game-data/shopItems.js');
const travelData = require('./game-data/travelData.js');
const storyTemplates = require('./game-data/storyTemplates.js');
const chaosEvents = require('./game-data/chaosEvents.js');
const getServerStatus = () => {
const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);
const days = Math.floor(uptimeSeconds / 86400);
const hours = Math.floor((uptimeSeconds % 86400) / 3600);
const minutes = Math.floor((uptimeSeconds % 3600) / 60);

    return {
        activeRooms: Object.keys(rooms).length,
        playersOnline: io.engine.clientsCount,
        uptime: `${days}d ${hours}h ${minutes}m`,
        memoryUsage: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`
    };
};
const db = new Database('quizlino.db', { verbose: console.log });
try {
    console.log('Überprüfe Datenbank-Schema...');
    const columns = db.prepare(`PRAGMA table_info(users)`).all();

    const hasDebtColumn = columns.some(col => col.name === 'debt');
    if (!hasDebtColumn) {
        console.log('Füge fehlende Spalte "debt" zur "users"-Tabelle hinzu...');
        db.prepare(`ALTER TABLE users ADD COLUMN debt INTEGER DEFAULT 0`).run();
        console.log('Spalte "debt" erfolgreich hinzugefügt!');
    }

    const hasIpColumn = columns.some(col => col.name === 'last_known_ip');
    if (!hasIpColumn) {
        console.log('Füge fehlende Spalte "last_known_ip" zur "users"-Tabelle hinzu...');
        db.prepare(`ALTER TABLE users ADD COLUMN last_known_ip TEXT`).run();
        console.log('Datenbank-Schema erfolgreich aktualisiert!');
    } else {
        console.log('Datenbank-Schema ist aktuell.');
    }

    try {
    const columns = db.prepare(`PRAGMA table_info(users)`).all();
    const hasTravelColumn = columns.some(col => col.name === 'travelData');
    if (!hasTravelColumn) {
        console.log('Füge fehlende Spalte "travelData" zur "users"-Tabelle hinzu...');
        db.prepare(`ALTER TABLE users ADD COLUMN travelData TEXT`).run();
        console.log('Spalte "travelData" erfolgreich hinzugefügt!');
    }
} catch (error) {
    console.error('Fehler bei der Migration der Reisedaten:', error);
}

    const hasMuteColumn = columns.some(col => col.name === 'mute_until');
    if (!hasMuteColumn) {
        console.log('Füge fehlende Spalte "mute_until" zur "users"-Tabelle hinzu...');
        db.prepare(`ALTER TABLE users ADD COLUMN mute_until DATETIME`).run();
        console.log('Spalte "mute_until" erfolgreich hinzugefügt!');
    }

    const hasAdminCommentColumn = columns.some(col => col.name === 'admin_comment');
    if (!hasAdminCommentColumn) {
        console.log('Füge fehlende Spalte "admin_comment" zur "users"-Tabelle hinzu...');
        db.prepare(`ALTER TABLE users ADD COLUMN admin_comment TEXT`).run();
        console.log('Spalte "admin_comment" erfolgreich hinzugefügt!');
    }

} catch (error) {
    console.error('Fehler bei der Datenbank-Migration:', error);
}
try {
    const columns = db.prepare(`PRAGMA table_info(users)`).all();
    const hasRoleColumn = columns.some(col => col.name === 'role');
    if (!hasRoleColumn) {
        console.log('Füge fehlende Spalte "role" zur "users"-Tabelle hinzu...');
        db.prepare(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'`).run(); 
        console.log('Spalte "role" erfolgreich hinzugefügt!');
    }
} catch (error) { console.error('Fehler DB Migration (Role):', error); }

try {
    const guildColumns = db.prepare(`PRAGMA table_info(guilds)`).all();
    const hasBannedColumn = guildColumns.some(col => col.name === 'banned_members');
    if (!hasBannedColumn) {
        console.log('Füge fehlende Spalte "banned_members" zur "guilds"-Tabelle hinzu...');
        db.prepare(`ALTER TABLE guilds ADD COLUMN banned_members TEXT DEFAULT '[]'`).run();
        console.log('Spalte "banned_members" erfolgreich hinzugefügt!');
    }
} catch (error) {
    console.log('Info: "guilds"-Tabelle wird später erstellt.');
}
try {
    const reportColumns = db.prepare(`PRAGMA table_info(reports)`).all();
    const hasCommentColumn = reportColumns.some(col => col.name === 'comment');

    if (!hasCommentColumn) {
        console.log('Füge fehlende Spalte "comment" zur "reports"-Tabelle hinzu...');
        db.prepare(`ALTER TABLE reports ADD COLUMN comment TEXT`).run();
        console.log('Spalte "comment" erfolgreich hinzugefügt!');
    }
const hasContextColumn = reportColumns.some(col => col.name === 'context');
    if (!hasContextColumn) {
        console.log('Füge fehlende Spalte "context" zur "reports"-Tabelle hinzu...');
        db.prepare(`ALTER TABLE reports ADD COLUMN context TEXT`).run();
        console.log('Spalte "context" erfolgreich hinzugefügt!');
    }
    const hasAiColumn = reportColumns.some(col => col.name === 'ai_analysis');
    if (!hasAiColumn) {
        console.log('Füge Spalte "ai_analysis" zur "reports"-Tabelle hinzu...');
        db.prepare(`ALTER TABLE reports ADD COLUMN ai_analysis TEXT`).run();
        console.log('Spalte "ai_analysis" erfolgreich hinzugefügt!');
    }
} catch (error) {
    console.log('Info: "reports"-Tabelle wird später erstellt.');
}
const helmet = require('helmet');
const deleteUser = (token) => dbRun('DELETE FROM users WHERE token = ?', [token]);
if (!ADMIN_PASSWORD_HASH || !JWT_SECRET) {
    console.error('FATALER FEHLER: ADMIN_PASSWORD_HASH oder JWT_SECRET ist in der .env-Datei nicht gesetzt!');
    console.error('Stelle sicher, dass du das hash-password.js Skript ausgeführt und die .env Datei korrekt konfiguriert hast.');
    process.exit(1);
}
const PORT = process.env.PORT || 3000;
const COUNTDOWN_SECONDS = 5;
const BETTING_SECONDS = 10;
const POST_ROUND_DELAY_MS = 7000;
const EVENT_VOTE_SECONDS = 10;
const STREAK_BONUS_PER_ROUND = 15;
const SIMILARITY_THRESHOLD = 0.72; 
const INACTIVE_ROOM_CLEANUP_MS = 30 * 60 * 1000; 
const SPAM_MESSAGE_LIMIT = 5;      
const SPAM_TIME_FRAME_MS = 5000;   
const CHAT_TIMEOUT_MS = 30000;
const PARTICIPATION_XP = 20;
const shooterGames = {};

const AVATAR_XP_AWARDS = {
    CORRECT_ANSWER: 10,
    WIN_ROUND: 25, 
    WIN_GAME: 100,
    WIN_DUEL: 40,
    COMPLETE_MISSION: 50
};

const createTablesStmt = `
CREATE TABLE IF NOT EXISTS users (
    token TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    qcoins INTEGER DEFAULT 0,
    inventory TEXT DEFAULT '[]',
    achievements TEXT DEFAULT '[]',
    unlockedTitles TEXT DEFAULT '[]',
    equippedTitle TEXT,
    equippedAvatar TEXT,
    equippedChatColor TEXT,
    equippedFont TEXT,
    stats TEXT,
    dailyMissions TEXT,
    lastLoginDate TEXT,
    loginStreak INTEGER DEFAULT 0,
    unlockedPerks TEXT DEFAULT '[]',
    gameHistory TEXT DEFAULT '[]',
    guildId TEXT,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    unlockedAvatars TEXT DEFAULT '[]',
    last_known_ip TEXT,
    mute_until DATETIME,
    travelData TEXT,
    debt INTEGER DEFAULT 0,
    admin_comment TEXT
);

CREATE TABLE IF NOT EXISTS blocked_words (
    word TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS update_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    version TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS guilds (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tag TEXT NOT NULL,
    owner TEXT NOT NULL,
    members TEXT DEFAULT '[]',
    treasury INTEGER DEFAULT 0,
    weeklyScore INTEGER DEFAULT 0,
    createdAt TEXT,
    chatHistory TEXT DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS banned_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_token TEXT,
    ip_address TEXT,
    banned_until DATETIME,
    reason TEXT,
    banned_by TEXT
);

CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reporter_token TEXT,
    reported_token TEXT,
    message TEXT,
    comment TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending' -- pending, resolved
);

CREATE TABLE IF NOT EXISTS admin_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    admin_identifier TEXT,
    action TEXT,
    target_id TEXT,
    details TEXT
);

CREATE TABLE IF NOT EXISTS unban_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_token TEXT,
    ip_address TEXT,
    appeal_message TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending' -- pending, reviewed
);
`;
db.exec(createTablesStmt);

const dbRun = (stmt, params = []) => {
    try {
        return db.prepare(stmt).run(params);
    } catch (error) {
        console.error("DB Run Error:", error.message);
        throw error;
    }
};

const getUpdateLogs = () => dbGetAll('SELECT * FROM update_log ORDER BY id DESC');

const broadcastUpdateLog = () => {
    const logs = getUpdateLogs();
    io.emit('updateLogChanged', logs);
};

const dbGet = (stmt, params = []) => {
    try {
        const row = db.prepare(stmt).get(params);
        if (!row) return null;
        Object.keys(row).forEach(key => {
            if (['inventory', 'achievements', 'unlockedTitles', 'unlockedPerks', 'gameHistory', 'stats', 'dailyMissions', 'members', 'chatHistory'].includes(key) && typeof row[key] === 'string') {
                try {
                    row[key] = JSON.parse(row[key]);
                } catch {
                    row[key] = ['members', 'chatHistory'].includes(key) ? [] : {};
                }
            }
        });
        return row;
    } catch (error) {
        console.error("DB Get Error:", error.message);
        throw error;
    }
};  

const dbGetAll = (stmt, params = []) => {
    try {
        const rows = db.prepare(stmt).all(params);
        rows.forEach(row => {
            Object.keys(row).forEach(key => {
                 if (['members', 'chatHistory'].includes(key) && typeof row[key] === 'string') {
                    try {
                        row[key] = JSON.parse(row[key]);
                    } catch { row[key] = []; }
                }
            });
        });
        return rows;
    } catch (error) {
        console.error("DB GetAll Error:", error.message);
        throw error;
    }
};

const isPlayerBanned = (ip, token) => {
    const ban = dbGet(
        "SELECT * FROM banned_users WHERE (ip_address = ? OR user_token = ?) AND (datetime(banned_until) > datetime('now') OR banned_until IS NULL)",
        [ip, token]
    );
    return ban;
};

const logAdminAction = (adminIdentifier, action, target_id, details) => {
    dbRun(
        'INSERT INTO admin_logs (admin_identifier, action, target_id, details) VALUES (?, ?, ?, ?)',
        [adminIdentifier, action, target_id, JSON.stringify(details)]
    );
};

const getAdminData = () => {
const players = dbGetAll(`
    SELECT u.token, u.name, u.last_known_ip, u.guildId, u.level, u.qcoins, u.mute_until, u.admin_comment, u.role
    FROM users u
    LEFT JOIN banned_users b ON u.token = b.user_token AND (datetime(b.banned_until) > datetime('now') OR b.banned_until IS NULL)
    WHERE b.id IS NULL
    ORDER BY u.level DESC
`);

    const guilds = dbGetAll('SELECT id, name, tag, weeklyScore, members FROM guilds');
    const reports = dbGetAll(`
    SELECT r.id, r.message, r.reported_token, r.comment, r.context, r.ai_analysis, 
           reporter.name as reporterName, reported.name as reportedName 
    FROM reports r
    LEFT JOIN users reporter ON r.reporter_token = reporter.token
    LEFT JOIN users reported ON r.reported_token = reported.token
    WHERE r.status = 'pending'
`);
    
    const bans = dbGetAll(`
        SELECT b.*, u.name 
        FROM banned_users b 
        LEFT JOIN users u ON b.user_token = u.token 
        WHERE b.banned_until > CURRENT_TIMESTAMP OR b.banned_until IS NULL`);

    const unbanRequests = dbGetAll(`
    SELECT ur.*, u.name
    FROM unban_requests ur
    LEFT JOIN users u ON ur.user_token = u.token
    WHERE ur.status = 'pending'
    ORDER BY ur.timestamp DESC
`);
        
    const logs = dbGetAll('SELECT * FROM admin_logs ORDER BY timestamp DESC LIMIT 20');
    const updateLogs = getUpdateLogs();
    
    const stats = {
        totalPlayers: dbGet('SELECT COUNT(*) as count FROM users').count,
        totalGuilds: dbGet('SELECT COUNT(*) as count FROM guilds').count,
        pendingReports: reports.length
    };

    const activeRooms = Object.values(rooms).map(room => ({
        id: room.roomId,
        host: room.players[room.hostId]?.name || 'N/A',
        playerCount: Object.keys(room.players).length,
        spectatorCount: Object.keys(room.spectators).length,
        mode: room.settings.gameMode,
        status: room.gameState
    }));

    return { 
        players, guilds, reports, bans, logs, stats, activeRooms,
        serverStatus: getServerStatus(),
        updateLogs,
        unbanRequests,
        chatHistory: globalSpyHistory
    };
};

const broadcastAdminDataUpdate = () => {
    io.to('admins').emit('admin:data_update', getAdminData());
};

const getUser = (token) => dbGet('SELECT * FROM users WHERE token = ?', [token]);
const upsertUser = (user) => {
    const validColumns = [
    'name', 'qcoins', 'inventory', 'achievements', 'unlockedTitles', 
    'equippedTitle', 'equippedAvatar', 'equippedChatColor', 'equippedFont', 
    'stats', 'dailyMissions', 'lastLoginDate', 'loginStreak', 'unlockedPerks', 
    'gameHistory', 'guildId', 'level', 'xp', 'unlockedAvatars',
    'last_known_ip', 'mute_until' , 'debt' , 'travelData'
];
    
    const columnsToUpdate = Object.keys(user).filter(k => k !== 'token' && validColumns.includes(k));
    
    if (columnsToUpdate.length === 0) return; 

    const stmt = `
        INSERT INTO users (token, ${columnsToUpdate.join(', ')}) 
        VALUES (?, ${columnsToUpdate.map(() => '?').join(', ')})
        ON CONFLICT(token) DO UPDATE SET
        ${columnsToUpdate.map(c => `${c} = excluded.${c}`).join(', ')}
    `;
    const params = [user.token];
    columnsToUpdate.forEach(col => {
        const value = user[col];
        params.push(value === null ? null : (typeof value === 'object' ? JSON.stringify(value) : value));
    });
    dbRun(stmt, params);
};

const getGuild = (id) => dbGet('SELECT * FROM guilds WHERE id = ?', [id]);
const getAllGuilds = () => dbGetAll('SELECT id, name, tag, weeklyScore, members FROM guilds');
const upsertGuild = (guild) => {
    const validColumns = [
        'name', 'tag', 'owner', 'members', 'treasury', 'weeklyScore', 'createdAt', 'chatHistory',
        'banned_members'
    ];

    const columnsToUpdate = Object.keys(guild).filter(k => k !== 'id' && validColumns.includes(k));

    if (columnsToUpdate.length === 0) return;

    const stmt = `
        INSERT INTO guilds (id, ${columnsToUpdate.join(', ')})
        VALUES (?, ${columnsToUpdate.map(() => '?').join(', ')})
        ON CONFLICT(id) DO UPDATE SET
        ${columnsToUpdate.map(c => `${c} = excluded.${c}`).join(', ')}
    `;
    const params = [guild.id];
    columnsToUpdate.forEach(col => {
        const value = guild[col];
        params.push(value === null ? null : (typeof value === 'object' ? JSON.stringify(value) : value));
    });
    dbRun(stmt, params);
};

const deleteGuild = (id) => dbRun('DELETE FROM guilds WHERE id = ?', [id]);


const getXpForNextLevel = (level) => Math.floor(100 * Math.pow(level, 1.5))

const app = express();
app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": [
                "'self'", 
                "https://cdn.socket.io", 
                "https://cdn.jsdelivr.net", 
                "https://cdn.jsdelivr.net",
                "https://cdnjs.cloudflare.com",
                "'unsafe-inline'" 
            ],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            "connect-src": ["'self'", "https://lottie.host"], 
            "img-src": ["'self'", "data:", "https://*.lottie.host", "lottie.host"],
            "frame-ancestors": ["'none'"],
        },
    })
);
const server = http.createServer(app);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 2500, 
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

const io = new socketIo.Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
});

let problems = [];
let sentenceEncoderModel = null;
let toxicityModel = null;
const TOXICITY_THRESHOLD = 0.80;
const rooms = {};
let globalSpyHistory = [];
const tokenToSocketId = {};
const adminLoginAttempts = {};
const bannedIPs = {};
const chatSpamTrack = {}; 
const chatTimeouts = {};
let maintenanceMode = {
    active: false,
    message: 'Wir führen gerade Wartungsarbeiten durch und sind bald wieder für dich da!'
};

const achievements = {
    firstWin: { name: "Erster Sieg", description: "Gewinne dein erstes Spiel!", reward: 50 },
    hotStreak: { name: "Heißer Draht", description: "Beantworte 3 Fragen in Folge richtig.", reward: 25 },
    highRoller: { name: "High-Roller", description: "Gewinne eine Wette mit über 50 QCoins Einsatz.", reward: 20 },
    perfectionist: { name: "Perfektionist", description: "Beantworte eine schwere Frage richtig.", reward: 40 },
    gambler: { name: "Glücksritter", description: "Gewinne eine Runde, während 'Punkte-Lotterie' aktiv ist.", reward: 30 },
    teamPlayer: { name: "Teamplayer", description: "Gewinne ein Spiel im Team-Modus.", reward: 50 },
    sabotageMaster: { name: "Meister-Saboteur", description: "Setze 5-mal Sabotage ein.", reward: 75 },
    wordSmith: { name: "Wortschmied", description: "Gewinne eine 'Ein-Wort-Limit' Runde.", reward: 35 },
    strategist: { name: "Stratege", description: "Gewinne ein Spiel, in dem du erfolgreich ein Kopfgeld kassiert hast.", reward: 60 },
    avenger: { name: "Rächer", description: "Setze die 'Letzte Rache' ein, nachdem du eliminiert wurdest.", reward: 30 },
    clutch: { name: "Aufholjagd", description: "Gewinne ein Duell, während du weniger als 25% der Punkte deines Gegners hattest.", reward: 80 },
    back_from_the_brink: { name: "Comeback-Kid", description: "Gewinne ein Spiel, nachdem du zur Halbzeit auf dem letzten Platz warst.", reward: 100 },
    chaos_master: { name: "Meister des Chaos", description: "Gewinne ein Spiel, in dem mindestens 3 verschiedene Chaos-Events stattfanden.", reward: 75 },
    untouchable: { name: "Unberührbar", description: "Gewinne ein Spiel, ohne am Ende einer Runde jemals die wenigsten Punkte gehabt zu haben.", reward: 150 },
    generous: { name: "Mäzen", description: "Spende insgesamt 1000 QCoins an Gilden.", reward: 50 },
    globetrotter: { name: "Weltenbummler", description: "Beantworte in einem Spiel Fragen aus 3 verschiedenen Kategorien richtig.", reward: 40 },
    survivor: { name: "Überlebenskünstler", description: "Gewinne eine Elimination-Runde mit mindestens 4 Spielern als letzter Überlebender.", reward: 65 },
    perfectionist_plus: { name: "Perfektionist+", description: "Beantworte 5 schwere Fragen in Folge richtig.", reward: 120 },
};

const DECOY_WORD_POOL = [
    'Berlin', 'Paris', 'Mond', 'Sonne', 'Auto', 'Fahrrad', 'Apfel', 'Banane', 'Rot', 'Blau', 'Grün', 'Ja', 'Nein', 'Links', 'Rechts', 'Oben', 'Unten',
    'schnell', 'langsam', 'groß', 'klein', 'heiß', 'kalt', 'immer', 'manchmal', 'vielleicht', 'definitiv', 'eindeutig', 'sicher', 'logisch', 'denke', 'ich'
];

const defaultAvatars = ['avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png', 'avatar5.png', 'avatar6.png'];

const titles = {
    beginner: { name: 'Neuling', description: 'Spiele dein erstes Spiel ab.' },
    veteran: { name: 'Veteran', description: 'Spiele 10 Spiele ab.', check: user => user.stats.gamesPlayed >= 10 },
    champion: { name: 'Champion', description: 'Gewinne 25 Spiele.', check: user => user.stats.wins >= 25 },
    quiz_brain: { name: 'Quizhirn', description: 'Beantworte 100 Fragen richtig.', check: user => user.stats.correctAnswers >= 100 },
    invincible: { name: 'Unbesiegbar', description: 'Gewinne ein Spiel, ohne einmal falsch zu antworten.', check: user => user.stats.flawlessVictory >= 1 },
    duel_master: { name: 'Duellmeister', description: 'Gewinne 10 Duelle.', check: user => user.stats.duelsWon >= 10 },
    high_roller: { name: 'High-Roller', description: 'Gewinne eine Wette über 100 QCoins.', check: user => user.stats.highestBetWin >= 100 },
    saboteur: { name: 'Saboteur', description: 'Setze 10x Sabotage ein.', check: user => user.stats.sabotagesUsed >= 10 },
    legend: { name: 'Legende', description: 'Erreiche 50 Siege.', check: user => user.stats.wins >= 50 },
};

const avatarPerks = {
    5: { id: 'qcoin_boost', name: 'Q-Coin-Segen', description: 'Erhöht alle Q-Coin-Gewinne aus Wetten und Belohnungen um 10%.', icon: '💰' },
    10: { id: 'streak_saver', name: 'Streak-Retter', description: 'Deine erste falsche Antwort pro Spiel bricht deine Siegesserie nicht.', icon: '🛡️' },
};

const missions = {

    LOGIN_STREAK: { type: 'LOGIN_STREAK', name: "Tägliche Treue", description: "Logge dich an 3 Tagen in Folge ein.", goal: 3, reward: 100 },
    PLAY_GAMES: { type: 'PLAY_GAMES', name: "Spielesüchtiger", description: "Spiele 3 Partien.", goal: 3, reward: 50 },
    ANSWER_CORRECTLY: { type: 'ANSWER_CORRECTLY', name: "Besserwisser", description: "Beantworte 10 Fragen richtig.", goal: 10, reward: 40 },
    WIN_GAME_ELIMINATION: { type: 'WIN_GAME_ELIMINATION', name: "Überlebenskünstler", description: "Gewinne eine Partie im Elimination-Modus.", goal: 1, reward: 75 },
    WIN_DUEL: { type: 'WIN_DUEL', name: "Duellant", description: "Gewinne ein Duell.", goal: 1, reward: 40 },
    ANSWER_CATEGORY_GEO: { type: 'ANSWER_CATEGORY_GEO', name: "Weltenbummler", description: "Beantworte 5 Geografie-Fragen richtig.", goal: 5, reward: 60, params: { category: 'geografie' } },
    ANSWER_CATEGORY_SCI: { type: 'ANSWER_CATEGORY_SCI', name: "Wissenschaftler", description: "Beantworte 5 Wissenschafts-Fragen richtig.", goal: 5, reward: 60, params: { category: 'wissenschaft' } },
    CLAIM_BOUNTY: { type: 'CLAIM_BOUNTY', name: "Kopfgeldjäger", description: "Kassiere ein Kopfgeld.", goal: 1, reward: 80 },
    SABOTAGE_MASTER: { type: 'SABOTAGE_MASTER', name: "Saboteur", description: "Setze 3x Sabotage ein.", goal: 3, reward: 100 },
    USE_POWERUP: { type: 'USE_POWERUP', name: "Trickkiste", description: "Setze 3 Power-Ups ein.", goal: 3, reward: 70 },
    WIN_STREAK: { type: 'WIN_STREAK', name: "Unaufhaltsam", description: "Gewinne 2 Spiele hintereinander.", goal: 2, reward: 120 },
    ANSWER_DIFFICULTY_HARD: { type: 'ANSWER_DIFFICULTY_HARD', name: "Genie", description: "Beantworte 5 schwere Fragen richtig.", goal: 5, reward: 90 },
    SPECTATOR_WIN_BET: { type: 'SPECTATOR_WIN_BET', name: "Scharfes Auge", description: "Gewinne als Zuschauer eine Wette.", goal: 1, reward: 50 },
    SURVIVE_BOUNTY: { type: 'SURVIVE_BOUNTY', name: "Gejagter", description: "Überlebe eine Runde, während ein Kopfgeld auf dich ausgesetzt ist.", goal: 1, reward: 60 },
    FIRST_SHOP_PURCHASE: { type: 'FIRST_SHOP_PURCHASE', name: "Shopping-Tour", description: "Kaufe deinen ersten Gegenstand im Shop.", goal: 1, reward: 50 },
    PERFECT_ROUND: { type: 'PERFECT_ROUND', name: "Klassenbester", description: "Sei der Einzige, der in einer Runde richtig antwortet (min. 3 Spieler).", goal: 1, reward: 100 },
    HIGH_SCORE: { type: 'HIGH_SCORE', name: "Highscorer", description: "Erreiche über 500 Punkte in einem Spiel.", goal: 500, reward: 80, progress_type: 'max' },
    GUILD_DONATOR: { type: 'GUILD_DONATOR', name: "Gönner der Gilde", description: "Spende 250 Q-Coins an deine Gilde.", goal: 250, reward: 60 },
    CHAOS_CHOOSER: { type: 'CHAOS_CHOOSER', name: "Puppenspieler", description: "Wähle als Rundenbester 2x ein Chaos-Event.", goal: 2, reward: 75 },
    CORRECT_STREAK: { type: 'CORRECT_STREAK', name: "Lauf des Lebens", description: "Erreiche eine Serie von 5 richtigen Antworten in einem Spiel.", goal: 5, reward: 80 },
    EARN_QCOINS: { type: 'EARN_QCOINS', name: "Wirtschaftsmagnat", description: "Verdiene heute insgesamt 200 Q-Coins (ohne Belohnungen).", goal: 200, reward: 70 },
    WIN_GAME_CLASSIC: { type: 'WIN_GAME_CLASSIC', name: "Klassiker", description: "Gewinne eine Partie im klassischen Modus.", goal: 1, reward: 65 },
    PLACE_BETS: { type: 'PLACE_BETS', name: "Zocker", description: "Setze in Wetten heute insgesamt 150 Q-Coins.", goal: 150, reward: 50 },
    SURVIVE_CHAOS: { type: 'SURVIVE_CHAOS', name: "Chaos-Überlebender", description: "Beantworte 3 Fragen richtig, während ein Chaos-Event aktiv ist.", goal: 3, reward: 75 },
    TEAM_PLAYER_WIN: { type: 'TEAM_PLAYER_WIN', name: "Teamgeist", description: "Gewinne ein Spiel im Team-Modus.", goal: 1, reward: 100 },
    ANSWER_DIFFICULTY_EASY: { type: 'ANSWER_DIFFICULTY_EASY', name: "Aufwärmübung", description: "Beantworte 15 leichte Fragen richtig.", goal: 15, reward: 50 },
    FLAWLESS_VICTORY: { type: 'FLAWLESS_VICTORY', name: "Makelloser Sieg", description: "Gewinne ein Spiel, ohne eine einzige falsche Antwort zu geben.", goal: 1, reward: 150 }
    };


app.use(express.static(path.join(__dirname)));

app.get(ADMIN_PANEL_PATH, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});
console.log(`ℹ️ Admin-Zentrale erreichbar unter: ${ADMIN_PANEL_PATH}`);

async function initializeApp() {
    try {
        const rawData = await fs.readFile(path.join(__dirname, 'problems.json'), 'utf8');
        problems = JSON.parse(rawData);
        console.log(`✅ ${problems.length} Quiz-Fragen erfolgreich geladen.`);
    } catch (error) {
        console.error('❌ FATALER FEHLER: Konnte problems.json nicht laden.', error.message);
        process.exit(1);
    }

    try {
        console.log('Lade Toxicity-KI-Modell für Admin-Moderation...');
        toxicityModel = await toxicity.load(TOXICITY_THRESHOLD);
        console.log('✅ Toxicity-KI-Modell erfolgreich geladen.');
    } catch (err) {
        console.error('⚠️ WARNUNG: Toxicity-Modell konnte nicht geladen werden.', err);
    }
    
    try {
        console.log('Lade KI-Modell...');
        sentenceEncoderModel = await use.load();
        console.log('✅ Universal Sentence Encoder KI-Modell erfolgreich geladen.');
    } catch (err) {
        console.error('⚠️ WARNUNG: KI-Modell konnte nicht geladen werden. Fallback auf exakte Übereinstimmung.', err);
    }

    const usersCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    if (usersCount === 0) {
        console.log('ℹ️ User-Datenbank ist leer. Versuche Migration von users.json...');
        try {
            const usersData = await fs.readFile(path.join(__dirname, 'users.json'), 'utf8');
            const oldUsers = JSON.parse(usersData);
            const userTokens = Object.keys(oldUsers);
            if(userTokens.length > 0) {
                const transaction = db.transaction(() => {
                    for (const token of userTokens) {
                        const user = oldUsers[token];
                        user.token = token;
                        upsertUser(user);
                    }
                });
                transaction();
                console.log(`✅ ${userTokens.length} Benutzer erfolgreich von users.json migriert!`);
            }
        } catch (error) {
            console.log('ℹ️ Konnte users.json nicht finden oder lesen. Überspringe Migration.');
        }
    }

    const guildsCount = db.prepare('SELECT COUNT(*) as count FROM guilds').get().count;
    if (guildsCount === 0) {
        console.log('ℹ️ Gilden-Datenbank ist leer. Versuche Migration von guilds.json...');
        try {
            const guildsData = await fs.readFile(path.join(__dirname, 'guilds.json'), 'utf8');
            const oldGuilds = JSON.parse(guildsData);
             const guildIds = Object.keys(oldGuilds);
            if(guildIds.length > 0) {
                const transaction = db.transaction(() => {
                    for (const id of guildIds) {
                        const guild = oldGuilds[id];
                        guild.id = id;
                        upsertGuild(guild);
                    }
                });
                transaction();
                console.log(`✅ ${guildIds.length} Gilden erfolgreich von guilds.json migriert!`);
            }
        } catch (error) {
            console.log('ℹ️ Konnte guilds.json nicht finden oder lesen. Überspringe Migration.');
        }
    }
}

let isSaving = false;
let isGuildSaving = false;

const sanitizeInput = (str) => typeof str === 'string' ? str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim() : '';
const safeName = (p) => p?.name || 'Ein Spieler';
const sendError = (socket, message, forceLobby = false) => socket.emit('updateState', { error: message, forceLobby });
const shuffleArray = (array) => { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[array[i], array[j]] = [array[j], array[i]]; } return array; };
const generateRoomId = (length = 4) => { let result; const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'; do { result = ''; for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length)); } while (rooms[result]); return result; };
const generateGuildId = (length = 6) => {
    let result;
    const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    do {
        result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    } while (dbGet('SELECT id FROM guilds WHERE id = ?', [result]));
    return result;
};
const findRoomIdBySocketId = (socketId) => {
    for (const roomId in rooms) {
        if (rooms[roomId].players[socketId] || rooms[roomId].spectators[socketId]) {
            return roomId;
        }
    }
    return null;
};

function loginOrRegisterUser(name, token, avatar, ip) {
    const cleanName = sanitizeInput(name);
    if (!cleanName) {
        return { error: 'Ungültiger Name.' };
    }
    if (token) {
        let user = getUser(token);
        if (user) {
            if (user.name !== cleanName) {
                const nameTaken = dbGet('SELECT token FROM users WHERE name = ? AND token != ?', [cleanName, token]);
                if (nameTaken) {
                    return { error: 'Dieser Name ist bereits vergeben.' };
                }
                user.name = cleanName;
            }
            if (avatar) user.equippedAvatar = avatar;
            user.last_known_ip = ip;
            upsertUser(user); 
            return { user, token, isNewUser: false };
        }
    }
    const existingUser = dbGet('SELECT token FROM users WHERE name = ?', [cleanName]);
    if (existingUser) {
        return { error: 'Dieser Name ist bereits vergeben. Wähle einen anderen.' };
    }
    const newToken = randomUUID();
    const newUser = {
        token: newToken,
        name: cleanName,
        qcoins: 100,
        inventory: [],
        achievements: [],
        unlockedTitles: ['beginner'],
        equippedTitle: 'beginner',
        equippedAvatar: avatar || 'avatar1.png',
        equippedChatColor: '#FFFFFF',
        equippedFont: 'font-inter',
        stats: { wins: 0, gamesPlayed: 0, correctAnswers: 0, incorrectAnswers: 0, duelsWon: 0, highestBetWin: 0, sabotagesUsed: 0, flawlessVictory: 0 },
        dailyMissions: {},
        lastLoginDate: new Date().toISOString().split('T')[0],
        loginStreak: 1,
        unlockedPerks: [],
        gameHistory: [],
        guildId: null,
        level: 1,
        xp: 0,
        unlockedAvatars: defaultAvatars.slice(),
        last_known_ip: ip,
        mute_until: null,
        debt: 0,
        travelData: JSON.stringify({ activeTravel: null, collectedSouvenirs: [] })
    };
    upsertUser(newUser);
    assignNewMissions(newUser);
    upsertUser(newUser);
    
    return { user: newUser, token: newToken, isNewUser: true };
}

const profanityBlocklist = [
  'hure', 'hurensohn', 'hurenkind', 'hurenheini', 'hurenbock', 'hurenscheiß', 'nutte', 'schlampe',
  'fotze', 'fotzn', 'schlitzfotze', 'drecksfotze', 'wichser', 'wichs', 'wixxer', 'wichsgesicht',
  'wichskopf', 'wichslappen', 'wichsmaschine', 'wichsgriffel', 'wichspaddel', 'arschloch', 'arschratte',
  'arschgesicht', 'arschkriecher', 'arschficker', 'arschmade', 'arschgeige', 'arschbanane',
  'sackgesicht', 'mistgeburt', 'missgeburt', 'scheißkerl', 'scheißer', 'scheißkopf', 'scheißwichser',
  'drecksack', 'kotzbrocken', 'kotzfresse', 'kotzkopf', 'spast', 'spasti', 'spacko', 'krüppel', 'mongo',
  'opfer', 'depp', 'idiot', 'trottel', 'hohlkopf', 'hirnfurz', 'gehirnamputiert', 'resthirn',
  'geistig behindert', 'volldepp', 'affenarsch', 'affenhirn', 'lackaffe', 'doofi',
  'titten', 'tittenmonster', 'muschi', 'möse', 'pimmel', 'schwanz', 'lümmel', 'prängel', 'schlong',
  'bratwurst', 'schwanzlutscher', 'schwanzgesicht', 'schwanzfetisch', 'schwanzhalter', 'dödel',
  'lulli', 'schniedel', 'pimmelkopf', 'hodenlecker', 'eierlecker', 'spermaschlampe', 'spermakopf',
  'spermaarsch', 'spermatonne', 'blasenluder', 'blasenheini', 'tittenknecht', 'tittenfetisch',
  'tittenfick', 'bumsen', 'bums', 'bumsmaschine', 'bumsheini', 'bumsbirne', 'bumsaffe', 'bumsloch',
  'bumsratte', 'ficken', 'fick', 'ficksau', 'fickloch', 'fickmaschine', 'fickmatratze',
  'fickschlitz', 'fickstück', 'bumsfotze',
  'h*re', 'h0re', 'hu.re', 'h.ure', 'f*tze', 'f0tze', 'f0tzn', 'w1chser', 'w!chser', 'wiхser', 'w|chser',
  'w1xxer', 'w1xser', 'w!xxer', 'wi×xer', 'wiхxer', 'wiхs3r', 'b!tch', 'b1tch', 'b1tches', 'b@stard',
  'f!ck', 'f1ck', 'f!cken', 'f1cken', 'f1k', 'phuck', 'fuq', 'fux', 'sh1t', 'sh!t', 's*ast', 'sp4st',
  'krueppel', 'kruepl', 'krüppl', 'kruepel', 'a$$loch', 'a$$hole', 'c0ck', 'c0q', 'c0cksucker',
  'c*nt', 'c*m', 'wh0re', 'wh0r3', 'slvt', 'tw@t', 'w4nker', 'pr1ck', 'pr!ck',
  'fuck', 'fucker', 'fucking', 'motherfucker', 'mf', 'mfer', 'mofo', 'shit', 'bullshit',
  'bitch', 'bitches', 'slut', 'whore', 'hoe', 'cunt', 'twat', 'dick', 'cock', 'prick', 'tosser',
  'wanker', 'jerk', 'jerkoff', 'cum', 'cumslut', 'cumdump', 'cumdumpster', 'cumbucket',
  'cocksucker', 'deepthroat', 'rimjob', 'anal', 'blowjob', 'handjob', 'titjob',
  'fag', 'faggot', 'dyke', 'lezbo', 'tranny', 'shemale', 'ladyboy', 'queer',
  'nazi', 'hitler', 'heil', 'sieg heil', 'wpww', '14words', 'rahowa', 'white power', 'race traitor',
  'nigger', 'nigga', 'niggaz', 'nigguh', 'negro', 'negroid', 'nigglet', 'niggaboo', 'jungle bunny',
  'porch monkey', 'monkeyboy', 'köterrasse', 'judensau', 'antisemit', 'türkensau', 'dreckskanake',
  'kanackenpack', 'kanake', 'islamistenschwein', 'kopftuchmädchen', 'sandnigger', 'camel jockey',
  'puta', 'puto', 'putos', 'putas', 'cabron', 'mierda', 'pendejo', 'pendeja', 'chingar', 'chinga tu madre',
  'hijo de puta', 'puta madre', 'perra', 'maricón', 'marica', 'culero',
  'putain', 'salope', 'enculé', 'encule', 'connard', 'conne', 'merde', 'batard', 'niquer', 'fils de pute',
  'ta mère', 'ta race',
  'stronzo', 'vaffanculo', 'cazzo', 'culo', 'merda', 'puttana', 'pezzo di merda', 'porco dio', 'figlio di puttana',
  'kurac', 'pička', 'piçka', 'picka', 'jebem', 'jebiga', 'jebote', 'mater ti jebem', 'govno', 'govna', 'stoka',
  'sharmuta', 'sharmouta', 'ibn al kalb', 'ibn al sharmuta', 'yallah fuck', 'kalb', 'khara', 'kos omak',
  'blyat', 'cyka', 'suka', 'suka blyat', 'pidor', 'pidoras', 'govno', 'ebat', 'eblan', 'mudak'
];


const getBlockedWords = () => {
    return db.prepare('SELECT word FROM blocked_words').all().map(row => row.word);
};

const isMessageInappropriate = (message) => {
    if (typeof message !== 'string') return false;
    const lowerCaseMessage = message.toLowerCase();
    
    const linkRegex = /(https?:\/\/|www\.)[^\s/$.?#].[^\s]*|\b[a-z0-9-]+\.(com|de|net|org|info|gg)\b/i;
    if (linkRegex.test(lowerCaseMessage)) return true;

    const condensedMessage = lowerCaseMessage.replace(/[^a-z0-9]/g, '');
    const dbWords = getBlockedWords();
    const allBlockedWords = [...new Set([...dbWords, ...profanityBlocklist])];
    const hasProfanity = allBlockedWords.some(word => {
        if (!word || word.length < 2) return false;
        const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
        return condensedMessage.includes(cleanWord);
    });
    
    return hasProfanity;
};

function addXpToUser(user, amount, tokenForSocketEmit) {
    if (!user || !amount) return user;

    user.xp = (user.xp || 0) + amount;

    let xpForNext = getXpForNextLevel(user.level || 1);
    let leveledUp = false;
    let qcoinReward = 0; 

    while (user.xp >= xpForNext) {
        user.level++;
        leveledUp = true;
        user.xp -= xpForNext;
        xpForNext = getXpForNextLevel(user.level);

        const levelQCoins = user.level * 10;
        user.qcoins += levelQCoins;
        qcoinReward += levelQCoins; 

        if (avatarPerks[user.level] && !user.unlockedPerks.includes(avatarPerks[user.level].id)) {
            user.unlockedPerks.push(avatarPerks[user.level].id);
            const socket = Object.values(io.sockets.sockets).find(s => s.token === tokenForSocketEmit);
            if (socket) {
                socket.emit('showSystemToast', `Neuer Perk freigeschaltet: ${avatarPerks[user.level].name}!`);
            }
        }
    }

    if (leveledUp) {
        const socket = Object.values(io.sockets.sockets).find(s => s.token === tokenForSocketEmit);
        if (socket) {
            socket.emit('playerLevelUp', { 
                level: user.level, 
                xp: user.xp, 
                qcoinsGained: qcoinReward 
            });
        }
    }
    
    return user; 
}

function assignNewMissions(user) {
    if (!user) return;

    const missionPool = shuffleArray(Object.keys(missions).filter(m => m !== 'LOGIN_STREAK')); 
    const userMissions = {};

    const loginMission = missions.LOGIN_STREAK;
    userMissions[loginMission.type] = {
        ...loginMission,
        progress: user.loginStreak,
        completed: user.loginStreak >= loginMission.goal,
        rewardClaimed: false,
    };
    
    const selectedMissions = missionPool.slice(0, 2);
    selectedMissions.forEach(missionKey => {
        const mission = missions[missionKey];
        userMissions[mission.type] = { ...mission, progress: 0, completed: false, rewardClaimed: false };
    });

    user.dailyMissions = userMissions;
}

function updateMissionProgressForUser(user, missionType, value = 1, params = {}) {
    if (!user || !user.dailyMissions || !user.dailyMissions[missionType] || user.dailyMissions[missionType].completed) {
        return user;
    }
    
    const mission = user.dailyMissions[missionType];

    if (mission.params?.category && mission.params.category !== params.category) return user;

    if(mission.progress_type === 'max') {
        mission.progress = Math.max(mission.progress || 0, value);
    } else {
        mission.progress = (mission.progress || 0) + value;
    }

    if (mission.progress >= mission.goal) {
        mission.progress = mission.goal;
        mission.completed = true;
        const socket = Object.values(io.sockets.sockets).find(s => s.token === user.token);
        if (socket) {
            socket.emit('chatMessage', { name: 'System', message: `Mission erfüllt: "${mission.name}"! Belohnung im Profil abholen.`, type: 'special' });
        }
    }
    return user;
}

function getPublicRoomState(room) {
    if (!room) return null;

    const isAnonymousEventActive = room.activeEvent === 'anonymous';

const createGibberish = (text) => {
    if (!text) return '';
    return text.split(' ').map(word => {
        if (word.length <= 3) return word;
        const first = word[0];
        const last = word[word.length - 1];
        const middle = word.substring(1, word.length - 1).split('').sort(() => 0.5 - Math.random()).join('');
        return first + middle + last;
    }).join(' ');
};

    const publicState = {
        roomId: room.roomId,
        hostId: room.hostId,
        players: {},
        spectators: room.spectators,
        gameState: room.gameState,
        settings: room.settings,
        currentProblem: null,
        currentRound: room.currentRound,
        totalRounds: room.totalRounds,
        timeLeft: room.timeLeft,
        lastRoundResults: room.lastRoundResults,
        lastRoundCorrectAnswers: room.lastRoundCorrectAnswers,
        lastEliminated: room.lastEliminated,
        chooserId: room.chooserId,
        availableCategories: room.availableCategories,
        chosenCategory: room.chosenCategory,
        eventVoting: room.eventVoting,
        activeEvent: room.activeEvent,
        bountyOn: room.bountyOn,
        duel: room.duel ? { p1: room.duel.p1, p2: room.duel.p2 } : null,
        isTeamMode: room.isTeamMode,
        teamScores: room.teamScores,
        eventChoice: room.eventChoice,
        sabotageTime: room.sabotageTime,
        currentPlayerTurn: room.currentPlayerTurn,
    };

    let problemSource = null;
    if (room.settings.gameMode === 'survival') { problemSource = room.currentProblem; }
    else if ((room.gameState === 'playing' || room.gameState === 'countdown') && room.gameProblems[room.currentRound - 1]) { problemSource = room.gameProblems[room.currentRound - 1]; }
    else if (room.gameState === 'dueling' && room.duel) { problemSource = room.duel.problem; }
    else if (room.gameState === 'sudden-death' && room.suddenDeath) { problemSource = room.suddenDeath.problem; }

    if (problemSource) {
    const { id, title, description, hint, difficulty, type, imageUrl } = problemSource;
    publicState.currentProblem = { id, title, description, hint, difficulty, type, imageUrl };

if (room.activeEvent === 'randomLanguage') {
    const languages = ['Klingonisch', 'Elbisch', 'Dothraki', 'System-Kauderwelsch'];
    const randomLang = languages[Math.floor(Math.random() * languages.length)];

    publicState.currentProblem.title = `[Übersetzungsfehler: ${randomLang}]`;
    publicState.currentProblem.description = createGibberish(description); 
}

    if (room.activeEvent === 'minimalistRound') {
    publicState.currentProblem.description = '...ausgeblendet!';
}
if (room.activeEvent === 'decoyAnswer' && problemSource && problemSource.answers) {
    const numFakeWords = Math.floor(Math.random() * 3) + 3; 
    const selectedFakeWords = shuffleArray([...DECOY_WORD_POOL]).slice(0, numFakeWords);
    
    publicState.decoyAnswerText = selectedFakeWords.join(' ');
}

    }

for (const socketId in room.players) {
        if (room.players.hasOwnProperty(socketId) && room.players[socketId]) {
            const player = room.players[socketId];
            publicState.players[socketId] = {
                socketId: player.socketId,
                token: player.token,
                name: isAnonymousEventActive ? `Anonym ${parseInt(socketId.substring(0, 4), 16) % 100}` : player.name,
                avatar: player.avatar,
                chatColor: player.chatColor,
                score: player.score,
                role: player.role,
                isHost: player.isHost,
                hasAnswered: player.hasAnswered,
                isEliminated: player.isEliminated,
                correctStreak: player.correctStreak,
                powerups: player.powerups,
                equippedTitle: isAnonymousEventActive ? null : player.equippedTitle,
                qcoins: player.qcoins,
                team: player.team || null,
                hasFreeHint: player.hasFreeHint
            };
        }
    }

    return publicState;
}

function createPlayer(socketId, userData, isHost = false) {
    return {
        socketId, name: userData.name, token: userData.token, role: userData.role || 'user',
        avatar: userData.equippedAvatar || 'avatar1.png',
        chatColor: userData.equippedChatColor || '#FFFFFF',
        score: 0, isHost, hasAnswered: false, isEliminated: false, correctStreak: 0,
        qcoins: userData.qcoins, inventory: userData.inventory, achievements: userData.achievements,
        streakSaverUsed: false,
        hasFreeHint: userData ? userData.unlockedPerks.includes('free_hint') : false,
        gameStats: {
            claimedBounty: false,
            wasInLastPlace: false,
            wasNeverLowest: true,
            answeredCategories: new Set(),
        }
    };
}

function startDuel(roomId) {
    const room = rooms[roomId];
    if (!room) return;

    const activePlayers = Object.values(room.players).filter(p => !p.isEliminated);
    if (activePlayers.length < 2) {
        return startEventVotingPhase(roomId);
    }

    activePlayers.sort((a, b) => a.score - b.score);
    const duelist1 = activePlayers[0];
    const duelist2 = activePlayers[1];
    
    if (!duelist1 || !duelist2) {
        return startEventVotingPhase(roomId);
    }

    room.gameState = 'dueling';
    const duelProblems = problems.filter(p => p.difficulty === 'leicht');
    const duelProblem = shuffleArray(duelProblems)[0] || shuffleArray(problems)[0];

    room.duel = {
        p1: duelist1.socketId,
        p2: duelist2.socketId,
        p1_score: duelist1.score,
        p2_score: duelist2.score, 
        problem: duelProblem,
    };

    room.players[duelist1.socketId].hasAnswered = false;
    room.players[duelist2.socketId].hasAnswered = false;
    room.roundSubmissions = {};

    sendSystemMessage(roomId, `🔥 Es ist Zeit für ein Duell zwischen ${safeName(duelist1)} und ${safeName(duelist2)}!`, 'special');
    broadcastState(roomId);

    room.timeLeft = 15;
    room.timer = setInterval(() => {
        if (!rooms[roomId] || room.gameState !== 'dueling') return clearInterval(room.timer);
        room.timeLeft--;
        broadcastState(roomId);
        if (room.timeLeft <= 0) {
            handleDuelResult(roomId, null);
        }
    }, 1000);
}

async function handleDuelResult(roomId, winnerId) {
    const room = rooms[roomId];
    if (!room || !room.duel) return;
    clearInterval(room.timer);

    const { p1, p2, p1_score, p2_score } = room.duel;
    let loserId;

        if (winnerId) {
        loserId = (winnerId === p1) ? p2 : p1;
        const winnerToken = room.players[winnerId]?.token;
if (winnerToken) {
    let winnerUser = getUser(winnerToken); 
    if (winnerUser) {
        winnerUser = addXpToUser(winnerUser, AVATAR_XP_AWARDS.WIN_DUEL, winnerToken); 

        const winnerScore = winnerId === p1 ? p1_score : p2_score;
        const loserScore = winnerId === p1 ? p2_score : p1_score;
        if (loserScore > 0 && (winnerScore / loserScore) < 0.25) {
            checkAndAwardAchievements(winnerId, 'clutch');
        }

        winnerUser = updateMissionProgressForUser(winnerUser, 'WIN_DUEL');

        winnerUser.stats.duelsWon = (winnerUser.stats.duelsWon || 0) + 1;
        upsertUser(winnerUser); 
    }
        }

        const winnerPlayer = room.players[winnerId];
        const loserPlayer = room.players[loserId];

        if (loserPlayer) {
            loserPlayer.isEliminated = true;
            room.lastEliminated = safeName(loserPlayer);
        }
        if (winnerPlayer) {
            sendSystemMessage(roomId, `SIEGER! ${safeName(winnerPlayer)} hat das Duell gewonnen!`, 'special');
        }
    } else {
        const player1 = room.players[p1];
        const player2 = room.players[p2];
        if (player1) player1.isEliminated = true;
        if (player2) player2.isEliminated = true;
        room.lastEliminated = `${safeName(player1)} und ${safeName(player2)}`;
        sendSystemMessage(roomId, `Die Zeit ist um! Beide Duellanten wurden eliminiert!`, 'elimination');
    }

    room.duel = null;
    broadcastState(roomId);

    setTimeout(() => {
        if (!rooms[roomId]) return;
        const activePlayers = Object.values(room.players).filter(p => !p.isEliminated);
        if (room.currentRound >= room.totalRounds || activePlayers.length <= 1) {
            endGame(roomId);
        } else {
            startEventVotingPhase(roomId);
        }
    }, POST_ROUND_DELAY_MS);
}

function checkAndAwardAchievements(socketId, trigger, context = {}) {
    const room = Object.values(rooms).find(r => r.players[socketId]);
    if (!room) return;
    
    const player = room.players[socketId];
    const user = player ? getUser(player.token) : null;
    if (!player || !user) return;
    
    const socket = io.sockets.sockets.get(socketId);
    if (!socket) return;

    const award = (achId) => {
        if (!user.achievements.includes(achId)) {
            user.achievements.push(achId);
            user.qcoins += achievements[achId].reward;
            player.qcoins = user.qcoins; 
            socket.emit('achievementUnlocked', achievements[achId]);
            upsertUser(user); 
        }
    };

    switch (trigger) {
        case 'correctAnswer':
            if (player.correctStreak >= 3) award('hotStreak');
            if (context.difficulty === 'schwer') {
                award('perfectionist');
                user.stats.heavyCorrectStreak = (user.stats.heavyCorrectStreak || 0) + 1;
                if (user.stats.heavyCorrectStreak >= 5) award('perfectionist_plus');
            } else {
                 user.stats.heavyCorrectStreak = 0;
            }
            if (context.activeEvent === 'randomPoints' && context.isRoundWinner) award('gambler');
            if (context.activeEvent === 'oneWordOnly' && context.isRoundWinner) award('wordSmith');
            break;
        case 'endGame':
            if (context.isWinner) {
                if (user.stats.wins === 1) award('firstWin');
                if (context.isTeamMode) award('teamPlayer');
            }
            break;
        case 'useSabotage':
            user.stats.sabotagesUsed = (user.stats.sabotagesUsed || 0) + 1;
            if (user.stats.sabotagesUsed >= 5) award('sabotageMaster');
            break;
        case 'winBet':
            if (context.amount >= 50) award('highRoller');
            break;
        case 'donate':
            if (user.stats.totalDonated >= 1000) award('generous');
            break;
        case 'avenger':
            award('avenger');
            break;
        case 'clutch':
            award('clutch');
            break;
        case 'strategist': award('strategist'); break;
        case 'back_from_the_brink': award('back_from_the_brink'); break;
        case 'untouchable': award('untouchable'); break;
        case 'globetrotter': award('globetrotter'); break;
        case 'survivor': award('survivor'); break;
        case 'chaos_master': award('chaos_master'); break;
    }
    upsertUser(user);
}

async function serveSurvivalQuestion(roomId) {
    const room = rooms[roomId];
    if (!room || !room.currentPlayerTurn) return;

    const player = room.players[room.currentPlayerTurn];
    if (!player) {
        return startNextSurvivalTurn(roomId);
    }

    if (room.timer) clearInterval(room.timer);

    room.gameState = 'playing';

    const currentStreak = player.score;
    let difficulty = 'leicht';
    if (currentStreak >= 10) {
        difficulty = 'schwer';
    } else if (currentStreak >= 5) {
        difficulty = 'mittel';
    }
    const isBonusRound = currentStreak > 0 && currentStreak % 5 === 0;
    if (isBonusRound) {
        sendSystemMessage(roomId, `🔥 Streak-Bonus! ${player.name}, diese Frage gibt bei richtiger Antwort 25 extra Q-Coins!`, 'special');
    }
    const usedProblemIds = room.gameProblems.map(p => p.id);
    let problemPool = problems.filter(p => 
        !usedProblemIds.includes(p.id) && 
        p.difficulty === difficulty
    );
    if (problemPool.length === 0) { 
        problemPool = problems.filter(p => p.difficulty === difficulty);
    }
    if (problemPool.length === 0) {
        problemPool = problems;
    }

    const nextProblem = shuffleArray(problemPool)[0];
    if (!nextProblem) {
        sendSystemMessage(roomId, "Fehler: Keine Fragen gefunden!", 'elimination');
        return endSurvivalGame(roomId);
    }

    nextProblem.isBonus = isBonusRound;
    room.currentProblem = nextProblem;
    room.gameProblems.push(nextProblem);
    player.hasAnswered = false;
   
    room.timeLeft = room.settings.duration;
    broadcastState(roomId);

    room.timer = setInterval(async () => {
        if (!rooms[roomId] || !room.players[room.currentPlayerTurn] || room.currentPlayerTurn !== room.players[room.currentPlayerTurn].socketId) {
            return clearInterval(room.timer);
        }

        room.timeLeft--;
        broadcastState(roomId);

        if (room.timeLeft <= 0) {
            clearInterval(room.timer);
            const timedOutPlayer = room.players[room.currentPlayerTurn];
            if (timedOutPlayer) {
                sendSystemMessage(roomId, `Die Zeit für ${timedOutPlayer.name} ist um! Sein Zug ist mit ${timedOutPlayer.score} Punkten beendet.`, 'elimination');
                room.playedPlayerIds.push(room.currentPlayerTurn);
                room.currentPlayerTurn = null; 
                await startNextSurvivalTurn(roomId);
            }
        }
    }, 1000);
}

async function analyzeMessageRisk(text) {
    let result = { score: 0, flags: [], recommendation: 'Keine Aktion' };
    
    if (!text) return JSON.stringify(result);
    const lowerText = text.toLowerCase();

    const condensedMessage = lowerText.replace(/[^a-z0-9]/g, '');
    const foundProfanity = profanityBlocklist.find(word => 
        condensedMessage.includes(word.replace(/[^a-z0-9]/g, ''))
    );

    if (foundProfanity) {
        result.flags.push(`🚫 Blacklist: "${foundProfanity}"`);
        result.score += 100; 
        result.recommendation = '🔴 Kritisch: Wort auf Blacklist';
        return JSON.stringify(result); 
    }

    const urgentKeywords = ['hack', 'cheat', 'glitch', 'kaputt', 'bug', 'fehler', 'geht nicht', 'absturz', 'token', 'exploit'];
    const capsRatio = (text.replace(/[^A-Z]/g, "").length) / text.length;
    
    if (text.length > 10 && capsRatio > 0.7) {
        result.flags.push("CAPS-SPAM");
        result.score += 15;
    }
    
    if (/(.)\1{4,}/.test(text)) {
        result.flags.push("Zeichen-Spam");
        result.score += 10;
    }

    if (urgentKeywords.some(k => lowerText.includes(k))) {
        result.flags.push("Technisches Problem/Urgent");
        result.score += 20; 
        result.recommendation = "🔵 Info: Technischer Support";
    }

    if (toxicityModel) {
        try {
            const predictions = await toxicityModel.classify([text]);
            predictions.forEach(p => {
                if (p.results[0].match) {
                    const labelMap = {
                        'identity_attack': 'Hassrede', 'insult': 'Beleidigung', 'obscene': 'Obszön',
                        'severe_toxicity': 'Stark Toxisch', 'sexual_explicit': 'Sexuell', 'threat': 'Bedrohung', 'toxicity': 'Toxisch'
                    };
                    const flagName = labelMap[p.label] || p.label;
                    result.flags.push(flagName);
                    
                    if (['Hassrede', 'Bedrohung', 'Stark Toxisch', 'Sexuell'].includes(flagName)) {
                        result.score += 60;
                    } else {
                        result.score += 30;
                    }
                }
            });
        } catch (e) { console.error("Fehler bei KI-Analyse:", e); }
    }

    if (result.score >= 50) {
        result.recommendation = '🔴 Kritisch: Auto-Ban / Sofort prüfen';
    } else if (result.score >= 30) {
        result.recommendation = '🟡 Warnung: Moderation empfohlen';
    } else if (result.flags.includes("Technisches Problem/Urgent")) {
    } else if (result.flags.length > 0) {
        result.recommendation = '🟢 Unauffällig (Leichte Flags)';
    } else {
        result.recommendation = '🟢 Sauber';
    }

    return JSON.stringify(result);
}

async function startNextSurvivalTurn(roomId) {
    const room = rooms[roomId];
    if (!room) return;

    if (room.timer) clearInterval(room.timer);

    const nextPlayerId = Object.keys(room.players).find(pId => !room.playedPlayerIds.includes(pId));

    if (nextPlayerId) {
        room.currentPlayerTurn = nextPlayerId;
        Object.values(room.players).forEach(p => p.hasAnswered = false);
        sendSystemMessage(roomId, `Es ist jetzt der Zug von ${room.players[nextPlayerId].name}!`, 'special');
        await serveSurvivalQuestion(roomId);
    } else {
        await endSurvivalGame(roomId);
    }
}
function startBettingPhaseForSurvival(roomId) {
    const room = rooms[roomId];
    if (!room) return;
    
    room.gameState = 'betting';
    room.timeLeft = BETTING_SECONDS;
    room.bets = {};
    room.spectatorBets = {};

    sendSystemMessage(roomId, 'Die Wettphase beginnt jetzt!', 'special');
    broadcastState(roomId);

    const bettingTimerId = setInterval(() => {
        const currentRoom = rooms[roomId]; 
        
        if (!currentRoom) {
            return clearInterval(bettingTimerId);
        }

        currentRoom.timeLeft--;
        broadcastState(roomId);

        if (currentRoom.timeLeft <= 0) {
            clearInterval(bettingTimerId);
            startNextSurvivalTurn(roomId);
        }
    }, 1000);

    room.timer = bettingTimerId;
}

function executeBan({ token, reason, duration, ip }) {
    let bannedUntil = null;
    if (duration !== 'permanent') {
        const date = new Date();
        date.setHours(date.getHours() + parseInt(duration, 10));
        bannedUntil = date.toISOString();
    }

    dbRun(
        'INSERT INTO banned_users (user_token, ip_address, banned_until, reason, banned_by) VALUES (?, ?, ?, ?, ?)',
        [token, ip, bannedUntil, reason, 'Admin']
    );

    const targetSocket = Object.values(io.sockets.sockets).find(s => s.token === token);
    if (targetSocket) {
        targetSocket.emit('playerBanned', { reason, banned_until: bannedUntil });
    }
}

function startSuddenDeath(roomId, playerIds) {
    const room = rooms[roomId]; if (!room) return;

    room.gameState = 'sudden-death';
    const suddenDeathProblem = shuffleArray(problems.filter(p => p.difficulty === 'schwer'))[0] || shuffleArray(problems)[0];

    room.suddenDeath = {
        participants: playerIds,
        problem: suddenDeathProblem,
    };

    playerIds.forEach(id => {
        if(room.players[id]) room.players[id].hasAnswered = false;
    });
    room.roundSubmissions = {};

    sendSystemMessage(roomId, `🔥 Gleichstand! Ein Sudden-Death-Tiebreaker entscheidet über den Sieg!`, 'special');
    broadcastState(roomId);

    room.timeLeft = 15;
    room.timer = setInterval(() => {
        if (!rooms[roomId] || room.gameState !== 'sudden-death') return clearInterval(room.timer);
        room.timeLeft--;
        if (room.timeLeft <= 0) {
            sendSystemMessage(roomId, `Die Zeit ist um! Niemand hat den Tiebreaker gewonnen. Das Spiel endet unentschieden.`);
            room.gameState = 'finished';
            broadcastState(roomId);
            clearInterval(room.timer);
        }
    }, 1000);
}

function proceedToNextPhase(roomId) {
    const room = rooms[roomId];
    if (!room) return;

    const remaining = Object.values(room.players).filter(p => !p.isEliminated).length;
    const isDuelRound = room.settings.gameMode === 'elimination' && (room.currentRound === 2 || room.currentRound === 4) && remaining > 2;

    if (isDuelRound) {
        startDuel(roomId);
    } else if (room.currentRound >= room.totalRounds || (room.settings.gameMode === 'elimination' && remaining <= 1)) {
        endGame(roomId);
    } else {
        startEventVotingPhase(roomId);
    }
}

function startPlayerChoiceEvent(roomId, chooserId) {
    const room = rooms[roomId];
    if (!room) return;

    room.gameState = 'player-event-choice';

    const eventChoices = shuffleArray(Object.values(chaosEvents)).slice(0, 2);

    room.eventChoice = {
        chooserId,
        choices: eventChoices,
    };

    broadcastState(roomId);
}

function broadcastGuildUpdate(guildId) {
    const guild = getGuild(guildId);
    if (!guild) return;

    guild.detailedMembers = guild.members.map(memberToken => {
        const memberUser = getUser(memberToken);
        return memberUser ? {
            token: memberToken,
            name: memberUser.name,
            qcoins: memberUser.qcoins,
            avatar: memberUser.equippedAvatar
        } : null;
    }).filter(Boolean);

    const allGuilds = getAllGuilds();
    io.to(guildId).emit('showGuildData', { guild, guilds: allGuilds });
}



function createRoomState(roomId, hostId, settings) {
    const isTeamMode = settings.isTeamMode || false;

    return {
        roomId,
        hostId,
        players: {},
        spectators: {},
        gameState: 'waiting',
        settings,
        isPublic: settings.isPublic || false,
        gameProblems: [],
        currentRound: 0,
        totalRounds: settings.rounds,
        timeLeft: 0,
        timer: null,
        roundSubmissions: {},
        lastRoundResults: {},
        lastRoundCorrectAnswers: [],
        lastEliminated: null,
        cleanupTimer: setTimeout(() => delete rooms[roomId], INACTIVE_ROOM_CLEANUP_MS),
        chooserId: null,
        availableCategories: [],
        bannedTokens: [],
        chosenCategory: null,
        eventVoting: { choices: [], votes: {} },
        activeEvent: null,
        bets: {},
        spectatorBets: {},
        bountyOn: null,
        allVsOneTargetId: null,
        isSurvival: settings.gameMode === 'survival',
        currentPlayerTurn: null,
        playedPlayerIds: [],
        isTeamMode: isTeamMode,
        teamScores: isTeamMode ? { A: 0, B: 0 } : null,
    };
}

const sendSystemMessage = (roomId, message, type = 'standard') => io.to(roomId).emit('showSystemToast', sanitizeInput(message));
const broadcastState = (roomId) => {
    const room = rooms[roomId];
    if (!room) return;

    const publicState = getPublicRoomState(room);
    if (!publicState) return;

    io.to(roomId).emit('updateState', publicState);
};

const getPublicRooms = () => {
    return Object.values(rooms)
        .filter(room => room.isPublic && room.gameState === 'waiting')
        .map(room => ({
            roomId: room.roomId,
            hostName: room.players[room.hostId]?.name || 'Unbekannt',
            playerCount: Object.keys(room.players).length,
            maxPlayers: 8,
            gameMode: room.settings.gameMode,
            difficulty: room.settings.difficulty,
        }));
};


async function isAnswerCorrect(userAnswer, correctAnswers) {
    if (!userAnswer) return false;

const normUser = userAnswer.toLowerCase().trim();
const normCorrectArray = correctAnswers.map(a => a.toLowerCase().trim());
if (normCorrectArray.includes(normUser)) return true;
if (normUser.length < 3) return false;
if (!sentenceEncoderModel) {
        console.warn("KI-Modell nicht geladen, verwende einfachen String-Vergleich.");
        return normCorrectArray.some(correct => correct === normUser);
    }

    try {
        const embeddings = await sentenceEncoderModel.embed([normUser, ...normCorrectArray]);
        const userEmbedding = tf.slice(embeddings, [0, 0], [1, -1]);
        let maxSimilarity = 0;

        for (let i = 0; i < normCorrectArray.length; i++) {
            const correctEmbedding = tf.slice(embeddings, [i + 1, 0], [1, -1]);
            const similarity = tf.losses.cosineDistance(userEmbedding, correctEmbedding, 0).mul(-1).add(1).dataSync()[0];
            if (similarity > maxSimilarity) maxSimilarity = similarity;
        }
        
        tf.dispose([embeddings, userEmbedding]); 
        return maxSimilarity >= SIMILARITY_THRESHOLD;
    } catch(e) {
        console.error("Fehler bei KI-Auswertung:", e);
        return false;
    }
}

async function endSurvivalGame(roomId) {
    const room = rooms[roomId];
    if (!room) return;

    if (room.timer) clearInterval(room.timer);
    room.gameState = 'finished';

    Object.values(room.players).forEach(p => {
        let user = getUser(p.token);
        if (user) {
            user.stats.gamesPlayed = (user.stats.gamesPlayed || 0) + 1;
            
            if (p.survivalStats) {
                user.stats.correctAnswers = (user.stats.correctAnswers || 0) + p.survivalStats.correct;
                user.qcoins = (user.qcoins || 0) + p.survivalStats.qcoins;
                user = addXpToUser(user, p.survivalStats.xp, p.token); 
            }

            user = updateMissionProgressForUser(user, 'PLAY_GAMES');
            checkAndAwardTitles(p.token);
            upsertUser(user);
        }
    });

    const finalPlayers = Object.values(room.players).sort((a, b) => b.score - a.score);
    const winner = finalPlayers.length > 0 ? finalPlayers[0] : null;

    if (winner) {
        let winnerUser = getUser(winner.token);
        if (winnerUser) {
            winnerUser.stats.wins = (winnerUser.stats.wins || 0) + 1;
            winnerUser = addXpToUser(winnerUser, AVATAR_XP_AWARDS.WIN_GAME, winner.token);
            checkAndAwardAchievements(winner.socketId, 'endGame', { isWinner: true });
            upsertUser(winnerUser);
        }
    }

    broadcastState(roomId);
}

async function evaluateRound(roomId) {
    const room = rooms[roomId];
    if (!room || room.isSurvival) return;

    clearInterval(room.timer);
    room.gameState = 'round-over';
    const problem = room.gameProblems[room.currentRound - 1];
    if (!problem) return endGame(roomId);

    room.lastRoundCorrectAnswers = problem.answers;
    room.lastRoundResults = {};
    room.lastEliminated = null;
    let activePlayers = Object.values(room.players).filter(p => p && !p.isEliminated);
    const correctPlayersThisRound = [];
    const incorrectPlayersThisRound = [];

    const safeName = (p) => p?.name || 'Ein Spieler';

    for (const player of activePlayers) {
        const submission = room.roundSubmissions[player.socketId];
        let user = getUser(player.token);
        if (!user) continue;

        const isCorrect = submission ? await isAnswerCorrect(submission.answer, problem.answers) : false;
        let points = 0;

        if (isCorrect) {
            if (room.activeEvent === 'oneWordOnly' && submission.answer.trim().split(/\s+/).length > 1) {
                points = -50;
                sendSystemMessage(roomId, `Regelverstoß! ${safeName(player)} hat mehr als ein Wort geantwortet.`, 'elimination');
            } else {
                correctPlayersThisRound.push(player); 
                player.correctStreak++;
                user.stats.correctAnswers++;
                user = addXpToUser(user, AVATAR_XP_AWARDS.CORRECT_ANSWER, player.token);
                user = updateMissionProgressForUser(user, 'CORRECT_STREAK', player.correctStreak);
    if (problem.difficulty === 'leicht') {
        user = updateMissionProgressForUser(user, 'ANSWER_DIFFICULTY_EASY');
    }
    if (room.activeEvent) {
        user = updateMissionProgressForUser(user, 'SURVIVE_CHAOS');
    }

                let basePoints = 100;
                const timePercentage = submission.time / room.settings.duration;
                let speedBonus = (timePercentage > 0.75) ? 50 : (timePercentage > 0.5 ? 25 : 0);
                points = basePoints + speedBonus + (player.correctStreak * STREAK_BONUS_PER_ROUND);

                if (player.usedPowerup === 'powerup_double') points *= 2;
                if (room.goldenQuestionActive) points *= 10;
                if (room.activeAutomaticEvent?.id === 'goldenQuestion') points *= 10;

                checkAndAwardAchievements(player.socketId, 'correctAnswer', { difficulty: problem.difficulty, activeEvent: room.activeEvent });
            }
        } else {
            incorrectPlayersThisRound.push(player);
            player.incorrectAnswersThisGame++;
            user.stats.incorrectAnswers++;
            if (room.activeEvent === 'bloodRush') {
                player.isEliminated = true;
                room.lastEliminated = safeName(player);
                points = 0;
                sendSystemMessage(roomId, `🩸 BLUTRAUSCH! ${safeName(player)} hat falsch geantwortet und wurde eliminiert!`, 'elimination');
            } else {
                if (user.unlockedPerks?.includes('streak_saver') && !player.streakSaverUsed) {
                    player.streakSaverUsed = true;
                    sendSystemMessage(roomId, `🛡️ ${safeName(player)}'s Serie wurde durch den 'Streak-Retter'-Perk geschützt!`);
                } else {
                    player.correctStreak = 0;
                }
                points = -25;
            }
        }

        if (player.usedPowerup === 'joker_shield' && points < 0) points = 0;
        player.usedPowerup = null;

        if (room.activeEvent === 'reverseScoring') points *= -1;
        if (room.activeEvent === 'randomPoints') points = Math.floor(Math.random() * 121) - 40;

        player.score += points;
        room.lastRoundResults[player.socketId] = { result: isCorrect ? 'correct' : 'incorrect', points };
        upsertUser(user);
    }
    if (room.activeEvent === 'vampireRound' && correctPlayersThisRound.length > 0 && incorrectPlayersThisRound.length > 0) {
        const totalPointsLost = incorrectPlayersThisRound.length * 25; 
        const pointsToStealPerWinner = Math.floor(totalPointsLost / correctPlayersThisRound.length);
        correctPlayersThisRound.forEach(p => p.score += pointsToStealPerWinner);
        sendSystemMessage(roomId, `🧛 VAMPIR-RUNDE! Die Gewinner stehlen ${totalPointsLost} Punkte von den Verlierern!`, 'special');
    }

    if (room.activeEvent === 'mimic' && activePlayers.length > 1) {
        const submissionGroups = activePlayers.reduce((acc, p) => {
            const answer = room.roundSubmissions[p.socketId]?.answer?.toLowerCase().trim();
            if (answer && room.lastRoundResults[p.socketId]?.result === 'incorrect') {
                if (!acc[answer]) acc[answer] = [];
                acc[answer].push(p);
            }
            return acc;
        }, {});
        Object.values(submissionGroups).forEach(group => {
            if (group.length > 1) {
                group.forEach(p => {
                    p.score += 50;
                    sendSystemMessage(roomId, `🎭 NACHAHMER! ${safeName(p)} erhält 50 Bonuspunkte für eine kreative falsche Antwort!`, 'special');
                });
            }
        });
    }

    if (room.activeEvent === 'allVsOne' && room.allVsOneTargetId) {
        const target = room.players[room.allVsOneTargetId];
        if (target && room.lastRoundResults[target.socketId]?.result === 'incorrect') {
            const bonusPoints = 75;
            let bonusAwarded = false;
            activePlayers.forEach(player => {
                if (player.socketId !== target.socketId && room.lastRoundResults[player.socketId]?.result === 'correct') {
                    player.score += bonusPoints;
                    bonusAwarded = true;
                }
            });

            if (bonusAwarded) {
                sendSystemMessage(roomId, `🤝 ${safeName(target)} hat gepatzt! Alle anderen mit richtiger Antwort erhalten ${bonusPoints} Bonuspunkte!`, 'special');
            }
        }
        room.allVsOneTargetId = null;
    }

    if (room.activeEvent === 'coinToss') {
        sendSystemMessage(roomId, `🪙 Münzwurf-Event! Das Schicksal entscheidet...`, 'special');
        activePlayers.forEach(player => {
            if (Math.random() < 0.5) { 
                const newScore = Math.floor(player.score / 2);
                sendSystemMessage(roomId, `Kopf! Die Punkte von ${safeName(player)} werden auf ${newScore} halbiert.`, 'elimination');
                player.score = newScore;
            } else {
                const newScore = player.score * 2;
                sendSystemMessage(roomId, `Zahl! Die Punkte von ${safeName(player)} werden auf ${newScore} verdoppelt!`, 'special');
                player.score = newScore;
            }
        });
    }

    for (const socketId in room.bets) {
    const player = room.players[socketId];
    let user = player ? getUser(player.token) : null;
    if (!user) continue;

    const betAmount = room.bets[socketId];

    user = updateMissionProgressForUser(user, 'PLACE_BETS', betAmount);

    if (room.lastRoundResults[socketId]?.result === 'correct') {
        const totalReturn = Math.floor(betAmount * 1.5);
        const profit = totalReturn - betAmount;

        user.qcoins += totalReturn;
        player.qcoins = user.qcoins;

         user = updateMissionProgressForUser(user, 'EARN_QCOINS', profit);

        io.to(socketId).emit('showSystemToast', `Wette gewonnen! Du erhältst ${profit} 🪙 Gewinn! (Gesamt: ${totalReturn})`);
        checkAndAwardAchievements(socketId, 'winBet', { amount: betAmount });
        if (betAmount >= 100) {
        user.stats.highestBetWin = Math.max(user.stats.highestBetWin || 0, betAmount);
    }
    } else {
        io.to(socketId).emit('showSystemToast', `Wette verloren! Dein Einsatz von ${betAmount} 🪙 ist weg.`);
    }

    upsertUser(user);
}
room.bets = {};

    if (room.conspiracyPartners && room.conspiracyPartners.length === 2) {
        const [p1_id, p2_id] = room.conspiracyPartners;
        const p1_correct = room.lastRoundResults[p1_id]?.result === 'correct';
        const p2_correct = room.lastRoundResults[p2_id]?.result === 'correct';

        if (p1_correct && p2_correct) {
            const player1 = room.players[p1_id];
            const player2 = room.players[p2_id];
            const conspiracyBonus = 200;

            if(player1) player1.score += conspiracyBonus;
            if(player2) player2.score += conspiracyBonus;

            sendSystemMessage(roomId, `💥 Verschwörung erfolgreich! ${safeName(player1)} und ${safeName(player2)} waren die Verbündeten und erhalten ${conspiracyBonus} Bonuspunkte!`, 'special');
        }
        room.conspiracyPartners = [];
    }

    if (room.isTeamMode) {
        Object.values(room.players).forEach(p => {
            if (p.team && room.lastRoundResults[p.socketId]) {
                const points = room.lastRoundResults[p.socketId].points;
                const targetTeam = (room.activeEvent === 'teamBetrayal' && points > 0) ? (p.team === 'A' ? 'B' : 'A') : p.team;
                if(room.teamScores[targetTeam] !== undefined) room.teamScores[targetTeam] += points;
            }
        });
    }

    activePlayers = Object.values(room.players).filter(p => p && !p.isEliminated); 
    if (room.activeEvent === 'swapScores' && activePlayers.length >= 2) {
        const [p1, p2] = shuffleArray([...activePlayers]).slice(0, 2);
        if (p1 && p2) {
            [p1.score, p2.score] = [p2.score, p1.score];
            sendSystemMessage(roomId, `CHAOS! ${safeName(p1)} und ${safeName(p2)} haben ihre Punktestände getauscht!`, 'special');
        }
    }
    const bountyPlayer = room.bountyOn ? room.players[room.bountyOn] : null;
    if (bountyPlayer && room.lastRoundResults[bountyPlayer.socketId]?.result === 'incorrect') {
        const claimer = activePlayers.find(p => room.lastRoundResults[p.socketId]?.result === 'correct');
        if (claimer) {
            const bountyPoints = 150;
            claimer.score += bountyPoints;
            sendSystemMessage(roomId, `🎯 Kopfgeld kassiert! ${safeName(claimer)} hat ${safeName(bountyPlayer)} gestoppt und ${bountyPoints} Bonuspunkte erhalten!`, 'special');
            room.bountyOn = null;
            updateMissionProgress(claimer.token, 'CLAIM_BOUNTY');
        }
    }
        if (room.settings.gameMode === 'elimination' && activePlayers.length > 1) {
        const lowestScore = Math.min(...activePlayers.map(p => p.score));
        activePlayers.filter(p => p.score === lowestScore).forEach(p => {
            p.isEliminated = true;
            room.lastEliminated = safeName(p);
        });
    }
        for (const spectatorId in room.spectatorBets) {
        const bet = room.spectatorBets[spectatorId];
        const spectatorUser = getUser(room.spectators[spectatorId]?.token);
        const betOnPlayerResult = room.lastRoundResults[bet.onPlayerId];
        const targetPlayer = room.players[bet.onPlayerId]; 

        if (spectatorUser && betOnPlayerResult && targetPlayer) {
            const messagePlayerName = safeName(targetPlayer);
            if (betOnPlayerResult.result === 'correct') {
                const winnings = bet.amount * 2;
                spectatorUser.qcoins += winnings;
                io.to(spectatorId).emit('showSystemToast', `Wette auf ${messagePlayerName} gewonnen! +${winnings} 🪙.`);
                spectatorUser = updateMissionProgressForUser(spectatorUser, 'SPECTATOR_WIN_BET');
            } else {
                io.to(spectatorId).emit('showSystemToast', `Wette auf ${messagePlayerName} verloren.`);
            }
            upsertUser(spectatorUser);
        }
    }
    room.spectatorBets = {};

    broadcastState(roomId);

    room.goldenQuestionActive = false;
    
    setTimeout(() => {
    if (rooms[roomId]) {
        proceedToNextPhase(roomId);
    }
}, POST_ROUND_DELAY_MS);
}

const activateImposterEvent = (roomId) => {
    const room = rooms[roomId];
    if (!room || room.gameState !== 'playing') return;

    const activePlayers = Object.values(room.players).filter(p => !p.isEliminated);
    if (activePlayers.length === 0) return;

    const problem = room.gameProblems[room.currentRound - 1];
    const fakeAnswers = [
  "Berlin. Klar!",
  "Rom. Sicher!",
  "Paris. Ganz bestimmt.",
  "Tokio. Fix.",
  "London. Natürlich.",
  "Madrid. Definitiv.",
  "Athen. Eindeutig.",
  "Moskau. Ohne Frage.",
  "Wien. Ganz sicher.",
  "New York. Logo.",
  "Das ist Berlin.",
  "Ganz klar: Rom.",
  "Natürlich Paris.",
  "Ohne Zweifel: Tokio.",
  "100% London.",
  "Definitiv Madrid.",
  "Sicher Athen.",
  "Das kann nur Moskau sein.",
  "Eindeutig Wien.",
  "Na klar, New York.",
  "Berlin, easy.",
  "Rom, keine Diskussion.",
  "Paris, logisch.",
  "Tokio, klar doch.",
  "London, safe.",
  "Madrid, ohne Witz.",
  "Athen, das weiß man.",
  "Moskau, eh klar.",
  "Wien, absolut.",
  "New York, fix.",

  ...(problem?.description
    .split(' ')
    .filter(word => word.length > 4 && isNaN(word))
    .map(w => `${w}. Klar!`) || [])
];

    const numMessages = Math.floor(Math.random() * 3) + 2;

    for (let i = 0; i < numMessages; i++) {
        const delay = (Math.random() * (room.settings.duration - 5) + 3) * 1000;

        setTimeout(() => {
            const currentRoom = rooms[roomId];
            if (!currentRoom || currentRoom.gameState !== 'playing') return;

            const imposterPlayer = shuffleArray([...activePlayers])[0];
            const fakeMessage = shuffleArray(fakeAnswers)[0];

            if (imposterPlayer && fakeMessage) {
                sendSystemMessage(roomId, `Ein Hochstapler treibt sein Unwesen...`, 'special');
                io.to(roomId).emit('chatMessage', {
                    name: imposterPlayer.name,
                    message: fakeMessage,
                    color: imposterPlayer.chatColor,
                    token: imposterPlayer.token,
                    type: 'standard'
                });
            }
        }, delay);
    }
};

function generateTravelStory(destinationId) {
    const template = storyTemplates[destinationId];
    if (!template) {
        return "Du hattest eine ereignislose, aber sehr erholsame Reise.";
    }

    const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    return `${pickRandom(template.opening)} ${pickRandom(template.activity)} ${pickRandom(template.complication)} ${pickRandom(template.closing)}`;
}

function startBettingPhase(roomId, chooserId) {
    const room = rooms[roomId]; if (!room) return;
    room.gameState = 'betting';
    room.timeLeft = BETTING_SECONDS;
    room.chooserId = chooserId;
    room.bets = {};
    const allTags = new Set(problems.flatMap(p => p.tags || []));
    room.availableCategories = shuffleArray(Array.from(allTags)).slice(0, 3);
    if(room.availableCategories.length === 0) room.availableCategories.push("allgemein");

    broadcastState(roomId);
    room.timer = setInterval(() => {
        if (!rooms[roomId]) return clearInterval(room.timer);
        room.timeLeft--;
        broadcastState(roomId);
        if (room.timeLeft <= 0) {
            clearInterval(room.timer);
            room.gameState = 'category-choice';
            broadcastState(roomId);
        }
    }, 1000);
}

function startEventVotingPhase(roomId) {
    const room = rooms[roomId];
    if (!room) return;

    room.activeEvent = null; 
    const activePlayers = Object.values(room.players).filter(p => p && !p.isEliminated);
    const roundWinner = activePlayers.sort((a, b) => b.score - a.score)[0];
    const chooserId = roundWinner?.socketId || room.hostId; 
    const safeName = (p) => p?.name || 'Ein Spieler';

    const handleChosenEvent = (eventId) => {
        room.activeEvent = eventId;
        if(chaosEvents[eventId]) {
           sendSystemMessage(roomId, `Event aktiv: "${chaosEvents[eventId].name}"!`, 'special');
        }
        if (eventId === 'bountyHunt') {
           const leader = activePlayers.sort((a,b) => b.score - a.score)[0];
           if (leader) {
              room.bountyOn = leader.socketId;
              sendSystemMessage(roomId, `🎯 ${safeName(leader)} ist das Ziel der Kopfgeldjagd!`, 'special');
           }
        } else if (eventId === 'qCoinRain') {
            activePlayers.forEach(p => {
                const user = getUser(p.token);
                if(user) {
                    const qcoins = Math.floor(Math.random() * 101) + 50;
                    user.qcoins += qcoins;
                    p.qcoins = user.qcoins;
                    upsertUser(user);
                    io.to(p.socketId).emit('showSystemToast', `Du hast ${qcoins} 🪙 durch einen Q-Coin-Regen erhalten!`);
                }
            });
        } else if (eventId === 'giftFromAbove') {
            const nonLeaders = activePlayers.filter(p => p.socketId !== chooserId);
            if (nonLeaders.length > 0) { 
                const luckyPlayer = shuffleArray(nonLeaders)[0];
                luckyPlayer.score += 250;
                sendSystemMessage(roomId, `🎁 Ein Geschenk des Himmels! ${safeName(luckyPlayer)} erhält 250 Bonuspunkte!`, 'special');
            }
            if (eventId === 'allVsOne') {
           const activePlayers = Object.values(room.players).filter(p => p && !p.isEliminated);
           if (activePlayers.length > 1) {
              const leader = activePlayers.sort((a,b) => b.score - a.score)[0];
              room.allVsOneTargetId = leader.socketId; 
              sendSystemMessage(roomId, `🎯 ${safeName(leader)} ist das Ziel für "Alle gegen Einen"!`, 'special');
           }
        }
        } else if (eventId === 'goldenQuestion') {
            room.goldenQuestionActive = true;
            sendSystemMessage(roomId, `⭐ Goldene Frage! Die nächste Runde zählt 10-fach!`, 'special');
        } else if (eventId === 'loyaltyTest') {
            activePlayers.filter(p => p.score <= 0).forEach(p => {
                p.score += 150;
                sendSystemMessage(roomId, `🤝 Loyalitäts-Test! ${safeName(p)} erhält 150 Bonuspunkte!`, 'special');
            });
        } else if (eventId === 'bountySwap' && room.bountyOn) {
            const potentialTargets = activePlayers.filter(p => p.socketId !== room.bountyOn);
            if (potentialTargets.length > 0) {
                const oldTargetName = safeName(room.players[room.bountyOn]);
                const newTarget = shuffleArray(potentialTargets)[0];
                room.bountyOn = newTarget.socketId;
                sendSystemMessage(roomId, `🔁 Kopfgeld-Tausch! Das Kopfgeld springt von ${oldTargetName} auf ${safeName(newTarget)}!`, 'special');
            }
        } else if (eventId === 'anonymous') {
            sendSystemMessage(roomId, `🕶️ Anonym-Modus aktiviert! Alle Namen sind für diese Runde verborgen.`, 'special');
        
        } else if (eventId === 'verschwörung') {
            const activePlayers = Object.values(room.players).filter(p => p && !p.isEliminated);
            if (activePlayers.length >= 2) {
                const partners = shuffleArray(activePlayers).slice(0, 2);
                room.conspiracyPartners = partners.map(p => p.socketId);

                io.to(room.conspiracyPartners[0]).emit('secretConspiracyRole');
                io.to(room.conspiracyPartners[1]).emit('secretConspiracyRole');

                sendSystemMessage(roomId, `🤫 Eine Verschwörung ist im Gange! Zwei Spieler haben ein geheimes Ziel...`, 'special');
            }
        }

        startBettingPhase(roomId, chooserId);
    };

    if (Object.keys(room.spectators).length > 0) {
        room.gameState = 'event-voting';
        room.timeLeft = EVENT_VOTE_SECONDS;
        room.eventVoting.choices = shuffleArray(Object.values(chaosEvents)).slice(0, 3);
        room.eventVoting.votes = {}; 
        broadcastState(roomId);

        room.timer = setInterval(() => {
            if (!rooms[roomId] || room.gameState !== 'event-voting') return clearInterval(room.timer);
            room.timeLeft--;

            room.eventVoting.voteCounts = Object.values(room.eventVoting.votes).reduce((acc, vote) => {
                acc[vote] = (acc[vote] || 0) + 1;
                return acc;
            }, {});
            broadcastState(roomId);

            if (room.timeLeft <= 0) {
                clearInterval(room.timer);
                const winningEventId = Object.keys(room.eventVoting.voteCounts).sort((a,b) => room.eventVoting.voteCounts[b] - room.eventVoting.voteCounts[a])[0];
                handleChosenEvent(winningEventId || shuffleArray(room.eventVoting.choices)[0].id);
            }
        }, 1000);
    } else {
        startPlayerChoiceEvent(roomId, chooserId);
    }
}

function checkAndAwardTitles(token) {
    const user = getUser(token);
    if (!user) return;
    console.log(`[DEBUG] Checking titles for ${user.name}. Stats:`, JSON.stringify(user.stats || {})); 
    let newTitleUnlocked = false;
    for (const titleId in titles) {
        if (titles[titleId].check && !user.unlockedTitles.includes(titleId)) {
            console.log(`[DEBUG]   Checking title: ${titleId}`);
            if (titles[titleId].check(user)) {
                console.log(`[DEBUG]     -> Condition MET for ${titleId}`);
                user.unlockedTitles.push(titleId);
                const socket = Object.values(io.sockets.sockets).find(s => s.token === token);
                if (socket) {
                    socket.emit('showSystemToast', `Titel freigeschaltet: ${titles[titleId].name}!`);
                }
                newTitleUnlocked = true;
            } else {
                 console.log(`[DEBUG]     -> Condition NOT MET for ${titleId}`);
            }
        }
    }
    if (newTitleUnlocked) {
        console.log(`[DEBUG]   > ${user.name} unlocked new titles! Saving...`);
        upsertUser(user);
    }
}

function startCountdown(roomId) {
    const room = rooms[roomId]; if (!room) return;
    if (room.activeEvent === 'categoryMix') {
        room.chosenCategory = 'allgemein';
        sendSystemMessage(roomId, 'CHAOS! Die Kategorie wurde zufällig gewählt!', 'special');
    }
    room.gameState = 'countdown'; room.timeLeft = COUNTDOWN_SECONDS; room.currentRound++;
    room.roundSubmissions = {};
    Object.values(room.players).forEach(p => p.hasAnswered = false);

    const potentialProblems = problems.filter(p =>
        (p.tags?.includes(room.chosenCategory) || room.chosenCategory === 'allgemein') &&
        p.difficulty === room.settings.difficulty &&
        !room.gameProblems.some(gp => gp.id === p.id)
    );
    let nextProblem = shuffleArray(potentialProblems)[0] || shuffleArray(problems.filter(p => p.difficulty === room.settings.difficulty))[0] || shuffleArray(problems)[0];
    if (!nextProblem) return endGame(roomId);

    if (room.activeEvent === 'wordSalad') {
        const scrambledProblem = { ...nextProblem }; 
        
        const scramble = (text) => text ? text.split('').sort(() => 0.5 - Math.random()).join('') : '';
        scrambledProblem.title = scramble(scrambledProblem.title);
        scrambledProblem.description = scramble(scrambledProblem.description);
        
        nextProblem = scrambledProblem;
        sendSystemMessage(roomId, 'CHAOS! Die Buchstaben der Frage wurden durcheinandergewürfelt!', 'special');
    }

    room.gameProblems[room.currentRound - 1] = nextProblem;
    
    broadcastState(roomId);
    room.timer = setInterval(() => {
        if (!rooms[roomId]) return clearInterval(room.timer);
        room.timeLeft--;
        broadcastState(roomId);
        if (room.timeLeft <= 0) { clearInterval(room.timer); startNextRound(roomId); }
    }, 1000);
}

function startNextRound(roomId) {
    const room = rooms[roomId]; if (!room) return;
    room.gameState = 'playing';
    room.roundStartTime = Date.now(); 
    
    let duration = room.settings.duration;
    if (room.activeEvent === 'speedyRound' || room.activeEvent === 'shortCircuit' || room.activeAutomaticEvent?.id === 'shortCircuit') {
        duration = Math.ceil(duration / 2);
        sendSystemMessage(roomId, `⏱️ Die Zeit für diese Runde wurde halbiert!`, 'special');
    }
        if (room.sabotageTime) {
        duration = Math.max(5, duration - 5); 
        room.sabotageTime = false;
    }

    room.timeLeft = duration;
    broadcastState(roomId);

        if (room.activeEvent === 'imposter') {
        activateImposterEvent(roomId);
    }

    room.timer = setInterval(() => {
        if (!rooms[roomId]) return clearInterval(room.timer);
        room.timeLeft--;
        broadcastState(roomId);
        if (room.timeLeft <= 0) { evaluateRound(roomId); }
    }, 1000);
}

async function endGame(roomId) {
    const room = rooms[roomId];
    if (!room) return;

    if (room.timer) clearInterval(room.timer);
    if (room.cleanupTimer) clearTimeout(room.cleanupTimer); 

    if (room.deferredBans) {
        for (const token in room.deferredBans) {
            const banDetails = room.deferredBans[token];
            console.log(`[Bann-System] Führe vorgemerkten Bann für Spieler mit Token ${token} am Spielende aus.`);
            executeBan(banDetails); 
        }
        setTimeout(() => io.to('admins').emit('admin:data_update', getAdminData()), 1000);
    }

    let winningPlayers = [];
    const activePlayers = Object.values(room.players).filter(p => p && !p.isEliminated).sort((a, b) => b.score - a.score);

    if (activePlayers.length > 1 && activePlayers[0].score === activePlayers[1].score) {
        const tieScore = activePlayers[0].score;
        const tiedPlayers = activePlayers.filter(p => p.score === tieScore).map(p => p.socketId);
        if (room.gameState !== 'finished') {
            console.log(`[Game ${roomId}] Gleichstand erkannt. Starte Sudden Death für Spieler: ${tiedPlayers.join(', ')}`);
            return startSuddenDeath(roomId, tiedPlayers); 
        } else {
             console.log(`[Game ${roomId}] Spiel ist bereits beendet, trotz Gleichstand. Beende normal.`);
             winningPlayers = tiedPlayers.map(id => room.players[id]).filter(Boolean);
        }
    } else if (activePlayers.length > 0) {
        winningPlayers.push(activePlayers[0]);
    } else if (Object.keys(room.players).length > 0) {
        const lastManStanding = Object.values(room.players).sort((a, b) => b.score - a.score)[0];
         if(lastManStanding) winningPlayers.push(lastManStanding);
    }


    room.gameState = 'finished';

    const playerProcessingPromises = Object.values(room.players).map(async p => {
        if (!p || !p.token) return;

        let user = getUser(p.token);
        if (user) {
            const isWinner = winningPlayers.some(wp => wp && wp.socketId === p.socketId);

            user = addXpToUser(user, PARTICIPATION_XP, p.token); 

            if (!user.gameHistory) user.gameHistory = [];
            user.gameHistory.unshift({
                date: new Date().toISOString(),
                mode: room.settings.gameMode,
                difficulty: room.settings.difficulty,
                winner: winningPlayers.map(wp => wp ? wp.name : 'Unentschieden').join(', ') || 'Unentschieden',
                playerCount: Object.keys(room.players).length + Object.keys(room.spectators).length, 
                myScore: p.score,
                myRank: Object.values(room.players).sort((a, b) => b.score - a.score).findIndex(pl => pl.socketId === p.socketId) + 1,
            });
            if (user.gameHistory.length > 10) user.gameHistory.pop();

            user.stats.gamesPlayed = (user.stats.gamesPlayed || 0) + 1;
            user = updateMissionProgressForUser(user, 'PLAY_GAMES');
            user = updateMissionProgressForUser(user, 'HIGH_SCORE', p.score); 

            if (isWinner) {
                user.stats.wins = (user.stats.wins || 0) + 1;
                user.stats.winStreak = (user.stats.winStreak || 0) + 1;
                user = addXpToUser(user, AVATAR_XP_AWARDS.WIN_GAME, p.token); 

                if (room.settings.gameMode === 'classic') user = updateMissionProgressForUser(user, 'WIN_GAME_CLASSIC');
                if (room.settings.gameMode === 'elimination') user = updateMissionProgressForUser(user, 'WIN_GAME_ELIMINATION');
                if (room.isTeamMode) user = updateMissionProgressForUser(user, 'TEAM_PLAYER_WIN');
                user = updateMissionProgressForUser(user, 'WIN_STREAK', user.stats.winStreak);

                if (p.incorrectAnswersThisGame === 0) { 
                     user.stats.flawlessVictory = (user.stats.flawlessVictory || 0) + 1;
                     user = updateMissionProgressForUser(user, 'FLAWLESS_VICTORY');
                 }
                checkAndAwardAchievements(p.socketId, 'endGame', { isWinner: true, isTeamMode: room.isTeamMode });
                 if (p.gameStats?.claimedBounty) checkAndAwardAchievements(p.socketId, 'strategist');
                 if (p.gameStats?.wasInLastPlace) checkAndAwardAchievements(p.socketId, 'back_from_the_brink');
                 if (p.gameStats?.wasNeverLowest) checkAndAwardAchievements(p.socketId, 'untouchable');
                 if (p.gameStats?.answeredCategories?.size >= 3) checkAndAwardAchievements(p.socketId, 'globetrotter');
                 if (room.settings.gameMode === 'elimination' && Object.keys(room.players).length >= 4) checkAndAwardAchievements(p.socketId, 'survivor');
                 if (room.eventsOccurred && room.eventsOccurred.size >= 3) checkAndAwardAchievements(p.socketId, 'chaos_master');

            } else {
                user.stats.winStreak = 0;
            }

            if (user.guildId) {
                const guild = getGuild(user.guildId);
                if (guild) {
                    let guildScoreContribution = 10 + Math.floor(p.score / 50);
                    if (isWinner) guildScoreContribution += 50; 
                    guild.weeklyScore = (guild.weeklyScore || 0) + Math.floor(guildScoreContribution);
                    upsertGuild(guild); 
                }
            }

            checkAndAwardTitles(p.token);

            upsertUser(user);

const finalUser = getUser(p.token);
            if (finalUser) {
                const playerSocket = io.sockets.sockets.get(p.socketId);
                if (playerSocket) {
                    playerSocket.emit('itemEquipped', { updatedProfile: finalUser });
                    playerSocket.emit('shopUpdate', { qcoins: finalUser.qcoins, inventory: finalUser.inventory });
                    console.log(`[DEBUG] Updated profile sent for ${finalUser.name}: XP=${finalUser.xp}, Level=${finalUser.level}`);
                }
            } else {
                 console.warn(`[Game ${roomId}] User mit Token ${p.token} konnte am Spielende für das finale Update nicht gefunden werden.`);
        }
        }
    });

    await Promise.all(playerProcessingPromises);

    broadcastState(roomId);

    room.cleanupTimer = setTimeout(() => {
        console.log(`[Game ${roomId}] Raum wird wegen Inaktivität nach Spielende aufgeräumt.`);
        delete rooms[roomId];
        
        if (room.isPublic) {
            io.emit('publicRoomsUpdate', getPublicRooms());
        }
        broadcastAdminDataUpdate(); 
    }, INACTIVE_ROOM_CLEANUP_MS);
}

const casinoConfig = {
    symbols: [
        { symbol: '🍋', weight: 30, name: 'Zitrone' },
        { symbol: '🍒', weight: 22, name: 'Kirsche' },
        { symbol: '🔔', weight: 15, name: 'Glocke' },
        { symbol: 'BAR', weight: 10, name: 'BAR' },
        { symbol: '💎', weight: 5, name: 'Diamant' },
        { symbol: '❼', weight: 2, name: 'Sieben' }
    ],
    payouts: {
        '🍋': { 2: 0.5, 3: 2 },
        '🍒': { 2: 1,   3: 5 },
        '🔔': { 2: 2,   3: 10 },
        'BAR': { 2: 4,   3: 25 },
        '💎': { 2: 8,   3: 50 },
        '❼': { 2: 15,  3: 100 }
    }
};
const totalSymbolWeight = casinoConfig.symbols.reduce((sum, s) => sum + s.weight, 0);

const getRandomSymbol = () => {
    let random = Math.random() * totalSymbolWeight;
    for (const item of casinoConfig.symbols) {
        if (random < item.weight) return item.symbol;
        random -= item.weight;
    }
    return casinoConfig.symbols[0].symbol;
};

const handleCasinoSpin = (socket, betAmount) => {
    const token = socket.token;
    if (!token) return;

    const user = getUser(token);
    if (!user) return socket.emit('casino:result', { error: "Spieler nicht gefunden." });

    const bet = parseInt(betAmount, 10);
    if (isNaN(bet) || bet <= 0) return socket.emit('casino:result', { error: "Ungültiger Einsatz." });
    if (user.qcoins < bet) return socket.emit('casino:result', { error: "Nicht genug Q-Coins." });
    
    user.qcoins -= bet;

    const reels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    
    let payout = 0;
    let message = "Leider verloren.";
    let winType = null;
    let isWin = false;

    if (reels[0] === reels[1] && reels[1] === reels[2]) {
        const symbol = reels[0];
        if (casinoConfig.payouts[symbol]) {
            const multiplier = casinoConfig.payouts[symbol][3];
            payout = Math.floor(bet * multiplier);
            isWin = true;
            winType = { type: '3x', symbol: symbol };
            message = `JACKPOT! 3 x ${symbol} bringen dir ${payout} Q-Coins!`;
        }
    } else if (reels[0] === reels[1]) {
        const symbol = reels[0];
        if (casinoConfig.payouts[symbol]) {
            const multiplier = casinoConfig.payouts[symbol][2]; 
            payout = Math.floor(bet * multiplier);
            isWin = true;
            winType = { type: '2x_left', symbol: symbol };
            message = `Treffer! 2 x ${symbol} (links) bringen dir ${payout} Q-Coins!`;
        }
    } else if (reels[1] === reels[2]) {
        const symbol = reels[1];
        if (casinoConfig.payouts[symbol]) {
            const multiplier = casinoConfig.payouts[symbol][2];
            payout = Math.floor(bet * multiplier);
            isWin = true;
            winType = { type: '2x_right', symbol: symbol };
            message = `Treffer! 2 x ${symbol} (rechts) bringen dir ${payout} Q-Coins!`;
        }
    }

    if (isWin) { 
        user.qcoins += payout;
    }

    upsertUser(user);

    socket.emit('casino:result', {
        reels: reels,
        payout: payout, 
        newQCoins: user.qcoins,
        message: message,
        winType: winType,
        error: null
    });
};

const handleBankLoan = (socket, amount) => {
    const token = socket.token;
    if (!token) return;
    const user = getUser(token);
    if (!user) return socket.emit('bank:error', "Spieler nicht gefunden.");

    if ((user.debt || 0) > 0) {
        return socket.emit('bank:error', "Du musst erst deine alten Schulden zurückzahlen!");
    }

    const loanAmount = parseInt(amount, 10);
    if (isNaN(loanAmount) || loanAmount <= 0 || loanAmount > 10000) {
        return socket.emit('bank:error', "Ungültiger Kreditbetrag (max. 10.000).");
    }

    user.qcoins += loanAmount;
    user.debt = loanAmount;
    upsertUser(user);
    socket.emit('bank:update', { newQCoins: user.qcoins, newDebt: user.debt, message: `Kredit über ${loanAmount} erhalten!` });
};

const handleBankRepay = (socket, amount) => {
    const token = socket.token;
    if (!token) return;
    const user = getUser(token);
    if (!user) return socket.emit('bank:error', "Spieler nicht gefunden.");

    const repayAmount = parseInt(amount, 10);
    if (isNaN(repayAmount) || repayAmount <= 0) {
        return socket.emit('bank:error', "Ungültiger Betrag.");
    }
    if (user.qcoins < repayAmount) {
        return socket.emit('bank:error', "Du hast nicht genug Q-Coins für diese Zahlung.");
    }

    const actualRepay = Math.min(repayAmount, user.debt || 0);
    if (actualRepay === 0) {
        return socket.emit('bank:error', "Du hast keine Schulden zum zurückzahlen.");
    }

    user.qcoins -= actualRepay;
    user.debt -= actualRepay;
    upsertUser(user);
    let message = `Du hast ${actualRepay} deiner Schulden zurückgezahlt.`;
    if (user.debt === 0) {
        message = `Glückwunsch! Du hast deine Schulden komplett abbezahlt!`;
    }

    socket.emit('bank:update', { newQCoins: user.qcoins, newDebt: user.debt, message });
};

io.on('connection', (socket) => {
    const clientIp = socket.handshake.address;

    if (!connectionAttempts[clientIp]) connectionAttempts[clientIp] = [];
    const now = Date.now();
    connectionAttempts[clientIp] = connectionAttempts[clientIp].filter(time => now - time < CONNECTION_WINDOW);
    
    if (connectionAttempts[clientIp].length >= MAX_CONNECTIONS_PER_WINDOW) {
        console.warn(`[SECURITY] IP ${clientIp} blockiert wegen zu vieler Verbindungen.`);
        socket.disconnect(true);
        return;
    }
    connectionAttempts[clientIp].push(now);

    socket.on('submitUnbanRequest', ({ token, message }) => {
        const cleanMessage = sanitizeInput(message);
        if (!cleanMessage || cleanMessage.length < 20) {
            return socket.emit('unbanRequestStatus', { success: false, message: 'Deine Nachricht ist zu kurz.' });
        }
        
        dbRun(
            'INSERT INTO unban_requests (user_token, ip_address, appeal_message) VALUES (?, ?, ?)',
            [token, clientIp, cleanMessage]
        );
        
        broadcastAdminDataUpdate();
        
        socket.emit('unbanRequestStatus', { success: true, message: 'Dein Antrag wurde erfolgreich eingereicht und wird geprüft.' });
    });

const banInfo = isPlayerBanned(clientIp, null); 
    if (banInfo) {
        socket.emit('playerBanned', {
            reason: banInfo.reason,
            banned_until: banInfo.banned_until
        });
        return; 
    }


const safeHandler = (handler) => async (data) => {
    if (!socket.isAdmin && isRateLimited(socket.id, handler.name || 'general', 200)) {
        return; 
    }

    try {
        if (handler.name.startsWith('admin:')) {
            if (!data || !data.jwt) {
                console.warn(`[SECURITY] Admin-Aktion ohne Token von ${socket.id} blockiert.`);
                return socket.emit('admin:auth_fail');
            }
            try {
                const decoded = jwt.verify(data.jwt, process.env.JWT_SECRET);
                if (decoded.ip !== clientIp) {
                   console.warn(`[SECURITY] Admin-Token von einer anderen IP benutzt!`);
                   return socket.emit('admin:auth_fail');
                }
                socket.isAdmin = true; 
            } catch (err) {
                return socket.emit('admin:auth_fail'); 
            }
        }
        await handler(data); 
    } catch (error) { 
        console.error(`Fehler im Handler für ${socket.id}:`, error); 
        socket.emit('admin:action_fail', { message: 'Ein interner Serverfehler ist aufgetreten.' });
    }
};

    if (maintenanceMode.active) {
        socket.emit('maintenanceStatus', maintenanceMode);
        return;
    }

    socket.emit('connectionSuccess', { 
        avatars: defaultAvatars, 
        shopItems, 
        achievements, 
        chaosEvents, 
        titles,
        updateLogs: getUpdateLogs()
    });

    socket.on('admin:updatePlayerComment', safeHandler(({ token, comment, jwt }) => {
        if (!socket.isAdmin) return;
        const user = getUser(token);
        if (!user) {
            return socket.emit('admin:action_fail', { message: 'Spieler nicht gefunden.' });
        }
        
        dbRun('UPDATE users SET admin_comment = ? WHERE token = ?', [sanitizeInput(comment), token]);
        
        logAdminAction('Admin', 'UPDATE_PLAYER_COMMENT', token, { name: user.name });
        socket.emit('admin:action_success', { message: `Kommentar für ${user.name} gespeichert.` });
        broadcastAdminDataUpdate(); 
    }));

    socket.on('submitUnbanRequest', safeHandler(({ token, message }) => {
        const cleanMessage = sanitizeInput(message);
        if (!cleanMessage || cleanMessage.length < 20) {
            return socket.emit('unbanRequestStatus', { success: false, message: 'Deine Nachricht ist zu kurz.' });
        }

        dbRun(
            'INSERT INTO unban_requests (user_token, ip_address, appeal_message) VALUES (?, ?, ?)',
            [token, clientIp, cleanMessage]
        );
        
        broadcastAdminDataUpdate();
        
        socket.emit('unbanRequestStatus', { success: true, message: 'Dein Antrag wurde erfolgreich eingereicht und wird geprüft.' });
    }));

socket.on('shooter:playerInput', safeHandler(({ roomId, input, angle }) => {
    const game = shooterGames[roomId];
    const player = game?.players[socket.id];
    if (player && !player.isDead) {
        player.input = input;
        player.angle = angle;
    }
}));

socket.on('admin:setRole', safeHandler(({ token, role, jwt }) => {
    if (!socket.isAdmin) return;
    const validRoles = ['user', 'mod', 'admin', 'owner'];
    if (!validRoles.includes(role)) return socket.emit('admin:action_fail', { message: 'Ungültige Rolle.' });

    dbRun('UPDATE users SET role = ? WHERE token = ?', [role, token]);
    const user = getUser(token);
    
    logAdminAction('Admin', 'SET_ROLE', token, { role, name: user ? user.name : 'Unknown' });
    socket.emit('admin:action_success', { message: `Rolle von ${user ? user.name : token} auf ${role} gesetzt.` });
    io.to('admins').emit('admin:data_update', getAdminData());
}));

socket.on('admin:testAI', safeHandler(async ({ text, jwt }) => {
    if (!socket.isAdmin) return;
    const analysis = await analyzeMessageRisk(text);
    socket.emit('admin:aiResult', { text, analysis: JSON.parse(analysis) });
}));

socket.on('admin:generateSpectateLink', safeHandler(({ roomId, jwt }) => {
    if (!socket.isAdmin) return;
    const link = `/?spectate=${roomId}&adminBypass=true`; 
    socket.emit('admin:spectateLink', { url: `/?room=${roomId}&spectate=true` }); 
}));

    socket.on('bank:takeLoan', safeHandler(({ amount }) => {
        handleBankLoan(socket, amount);
    }));

socket.on('bank:repayDebt', safeHandler(({ amount }) => {
        handleBankRepay(socket, amount);
    }));

socket.on('requestUpdate', safeHandler(() => {
        const roomId = findRoomIdBySocketId(socket.id);
        if (roomId && rooms[roomId]) {
            socket.emit('updateState', getPublicRoomState(rooms[roomId]));
        }
    }));

socket.on('travel:getData', safeHandler(({ token }) => {
    const user = getUser(token);
    if (!user) return;

    let travelStats = user.travelData ? JSON.parse(user.travelData) : { activeTravel: null, collectedSouvenirs: [] };

    socket.emit('travel:showData', {
        destinations: travelData.destinations,
        souvenirs: travelData.souvenirs,
        sets: travelData.sets,
        playerTravel: travelStats,
        qcoins: user.qcoins,
        level: user.level
    });
}));

    socket.on('travel:start', safeHandler(({ token, destinationId }) => {
        const user = getUser(token);
        const destination = travelData.destinations[destinationId];
        if (!user || !destination) return socket.emit('travel:error', 'Ungültige Daten.');

        let travelStats = user.travelData ? JSON.parse(user.travelData) : { activeTravel: null, collectedSouvenirs: [] };
        if (travelStats.activeTravel) return socket.emit('travel:error', 'Du bist bereits auf einer Reise.');
        if (user.qcoins < destination.cost) return socket.emit('travel:error', 'Nicht genug Q-Coins.');
        if (user.level < destination.level) return socket.emit('travel:error', 'Dein Level ist zu niedrig für dieses Ziel.');
        
        user.qcoins -= destination.cost;
        travelStats.activeTravel = {
            destinationId: destinationId,
            startTime: Date.now(),
            endTime: Date.now() + destination.duration
        };
        user.travelData = JSON.stringify(travelStats);
        upsertUser(user);

        socket.emit('travel:showData', {
            destinations: travelData.destinations,
            souvenirs: travelData.souvenirs,
            sets: travelData.sets,
            playerTravel: travelStats
        });
        
        socket.emit('shopUpdate', { qcoins: user.qcoins, inventory: user.inventory });
    }));

    socket.on('travel:claim', safeHandler(({ token }) => {
        const user = getUser(token);
        if (!user) return;
        
        let travelStats = user.travelData ? JSON.parse(user.travelData) : { activeTravel: null, collectedSouvenirs: [] };
        const journey = travelStats.activeTravel;

        if (!journey || Date.now() < journey.endTime) return socket.emit('travel:error', 'Deine Reise ist noch nicht beendet.');

        const destination = travelData.destinations[journey.destinationId];
        
        const qcoinReward = destination.cost * 2;
        user.qcoins += qcoinReward;

        const regionKey = destination.region.toLowerCase();
        const possibleSouvenirs = travelData.souvenirs[regionKey] || [];
        let foundSouvenir = null;
        
        if (possibleSouvenirs.length > 0) { 
            foundSouvenir = possibleSouvenirs[Math.floor(Math.random() * possibleSouvenirs.length)];
            
            if (!travelStats.collectedSouvenirs.includes(foundSouvenir.id)) {
                travelStats.collectedSouvenirs.push(foundSouvenir.id);
            }
        }

        const story = generateTravelStory(journey.destinationId);

        let setBonus = 0;
        let completedSet = null;
for (const setName in travelData.sets) {
    const set = travelData.sets[setName];
    const regionKeyForSet = set.region.toLowerCase();
    const regionSouvenirs = travelData.souvenirs[regionKeyForSet] || [];
    if (regionSouvenirs.length > 0 && regionSouvenirs.every(s => travelStats.collectedSouvenirs.includes(s.id))) {
    const bonusClaimedId = `set_${set.region}`;
                 if (!travelStats.collectedSouvenirs.includes(bonusClaimedId)) {
                    setBonus = set.bonus;
                    user.qcoins += setBonus;
                    completedSet = setName;
                    travelStats.collectedSouvenirs.push(bonusClaimedId);
                    break;
                 }
            }
        }
        
        travelStats.activeTravel = null;
        user.travelData = JSON.stringify(travelStats);
        upsertUser(user);

socket.emit('travel:rewardClaimed', {
    qcoinReward,
    foundSouvenir,
    story,
    setBonus,
    completedSet,
    destinationName: destination.name, 
    playerTravel: travelStats,
    qcoins: user.qcoins
});
    }));

socket.on('casino:spin', safeHandler(({ betAmount }) => {
        handleCasinoSpin(socket, betAmount);
    }));

socket.on('login', safeHandler(async ({ name, token, avatar }) => {
    const userForBanCheck = token ? getUser(token) : null;
    const banInfo = isPlayerBanned(clientIp, userForBanCheck?.token);
    if (banInfo) {
        return socket.emit('playerBanned', { reason: banInfo.reason, banned_until: banInfo.banned_until });
    }

    if (token && !name) {
        const user = getUser(token);
        if (user) {
            socket.token = token;
            const today = new Date().toISOString().split('T')[0];
            const lastLogin = user.lastLoginDate;
            if (lastLogin && lastLogin !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                if (yesterday.toISOString().split('T')[0] === lastLogin) {
                    user.loginStreak = (user.loginStreak || 1) + 1;
                } else {
                    user.loginStreak = 1;
                }
                user.lastLoginDate = today;
                assignNewMissions(user);
                upsertUser(user);
            }
            return socket.emit('loginSuccess', { user, token, isNewUser: false });
        } else {
            return socket.emit('loginFail', { message: 'Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.' });
        }
    }
    const result = loginOrRegisterUser(name, token, avatar, clientIp);
    if (result.error) {
        return socket.emit('loginFail', { message: result.error });
    }

    socket.token = result.token;
    tokenToSocketId[result.token] = socket.id;
    socket.emit('loginSuccess', { user: result.user, token: result.token, isNewUser: result.isNewUser });
    if (result.isNewUser) {
        console.log(`Neuer Spieler registriert: ${result.user.name}. Sende Update an Admins.`);
        broadcastAdminDataUpdate();
    }
}));

    socket.on('admin:addLogEntry', safeHandler(({ version, type, description, jwt }) => {
        if (!socket.isAdmin) return;
        dbRun(
            'INSERT INTO update_log (version, type, description) VALUES (?, ?, ?)',
            [sanitizeInput(version), sanitizeInput(type), sanitizeInput(description)]
        );
        logAdminAction('Admin', 'ADD_UPDATE_LOG', version, { description });
        socket.emit('admin:action_success', { message: 'Log-Eintrag hinzugefügt.' });
        broadcastAdminDataUpdate();
        broadcastUpdateLog(); 
    }));

    socket.on('admin:updateLogEntry', safeHandler(({ id, version, type, description, jwt }) => {
        if (!socket.isAdmin) return;
        dbRun(
            'UPDATE update_log SET version = ?, type = ?, description = ? WHERE id = ?',
            [sanitizeInput(version), sanitizeInput(type), sanitizeInput(description), id]
        );
        logAdminAction('Admin', 'UPDATE_UPDATE_LOG', id, { version, description });
        socket.emit('admin:action_success', { message: 'Log-Eintrag aktualisiert.' });
        broadcastAdminDataUpdate();
        broadcastUpdateLog(); 
    }));

    socket.on('admin:deleteLogEntry', safeHandler(({ id, jwt }) => {
        if (!socket.isAdmin) return;
        dbRun('DELETE FROM update_log WHERE id = ?', [id]);
        logAdminAction('Admin', 'DELETE_UPDATE_LOG', id, {});
        socket.emit('admin:action_success', { message: 'Log-Eintrag gelöscht.' });
        broadcastAdminDataUpdate();
        broadcastUpdateLog();
    }));

socket.on('admin:getStatus', safeHandler(() => {
    socket.emit('admin:statusUpdate', getServerStatus());
}));

socket.on('admin:kickPlayer', safeHandler(({ token, reason, jwt }) => {
    if (!socket.isAdmin) return;
    const userToKick = getUser(token);
    if (!userToKick) {
        return socket.emit('admin:action_fail', { message: 'Spieler nicht gefunden.' });
    }
    let targetSocketId = null;
    let targetRoomId = null;
    for (const [roomId, room] of Object.entries(rooms)) {
        for (const [socketId, player] of Object.entries(room.players)) {
            if (player.token === token) {
                targetSocketId = socketId;
                targetRoomId = roomId;
                break;
            }
        }
        if (targetSocketId) break;
    }

    const targetSocket = targetSocketId ? io.sockets.sockets.get(targetSocketId) : null;

    if (targetSocket && targetRoomId) {
        sendSystemMessage(targetRoomId, `${userToKick.name} wurde von einem Admin aus dem Spiel entfernt.`, 'elimination');
        
        targetSocket.emit('forceKick', { reason: sanitizeInput(reason) || 'Kein Grund angegeben.' });
        targetSocket.leave(targetRoomId);
        targetSocket.disconnect(true);

        logAdminAction('Admin', 'KICK_PLAYER', token, { name: userToKick.name, reason });
        socket.emit('admin:action_success', { message: `${userToKick.name} wurde gekickt.` });
    } else {
        socket.emit('admin:action_fail', { message: 'Spieler ist in keinem aktiven Spiel.' });
    }
}));

socket.on('admin:resetPlayer', safeHandler(({ token, jwt }) => {
    if (!socket.isAdmin) return;
    const userToReset = getUser(token);
    if (!userToReset) {
        return socket.emit('admin:action_fail', { message: 'Spieler nicht gefunden.' });
    }
    if (userToReset.guildId) {
        const guild = getGuild(userToReset.guildId);
        if (guild) {
            if (guild.owner === token) {
                const otherMembers = guild.members.filter(m => m !== token);
                for (const memberToken of otherMembers) {
                    dbRun('UPDATE users SET guildId = NULL WHERE token = ?', [memberToken]);
                    const memberSocket = Object.values(io.sockets.sockets).find(s => s.token === memberToken);
                    if (memberSocket) {
                        memberSocket.emit('kickedFromGuild', { guildName: guild.name });
                        memberSocket.leave(guild.id);
                    }
                }
                deleteGuild(guild.id);
            } else {
                guild.members = guild.members.filter(m => m !== token);
                upsertGuild(guild);
                broadcastGuildUpdate(guild.id);
            }
        }
    }
    deleteUser(token);

    logAdminAction('Admin', 'RESET_PLAYER_ACCOUNT (DELETE)', token, { name: userToReset.name });

    const targetSocket = Object.values(io.sockets.sockets).find(s => s.token === token);
    if (targetSocket) {
        targetSocket.emit('forceRelog', { message: 'Dein Account wurde von einem Admin vollständig zurückgesetzt. Bitte melde dich neu an.' });
        targetSocket.disconnect(true);
    }
    
    socket.emit('admin:action_success', { message: `Account von ${userToReset.name} wurde vollständig GELÖSCHT und zurückgesetzt.` });
    io.to('admins').emit('admin:data_update', getAdminData());
}));

    socket.on('admin:toggleMaintenance', safeHandler(({ active, message, jwt }) => {
    if (!socket.isAdmin) return;

    maintenanceMode.active = active;
    if (message) {
        maintenanceMode.message = sanitizeInput(message);
    }
    
    io.emit('maintenanceStatus', maintenanceMode);

    logAdminAction('Admin', 'MAINTENANCE_TOGGLE', active ? 'ON' : 'OFF', { message: maintenanceMode.message });
    socket.emit('admin:action_success', { message: `Wartungsmodus wurde ${active ? 'aktiviert' : 'deaktiviert'}.` });

    if (active) {
        io.sockets.sockets.forEach((s) => {
            if (!s.isAdmin) {
                s.disconnect(true);
            }
        });
    }
}));

socket.on('submitGeneralReport', safeHandler(async ({ type, targetName, details, token }) => {
    if (!token || !type || !details) return;

    let reportedToken = null;
    let subject = '';

    if (type === 'player' && targetName) {
        const targetUser = dbGet('SELECT token FROM users WHERE name = ?', [targetName]);
        if (targetUser) {
            reportedToken = targetUser.token;
        }
        subject = `Spieler-Meldung: ${targetName}`;
    } else if (type === 'bug') {
        subject = 'Bug-Meldung';
    } else {
        subject = 'Allgemeines Feedback';
    }

    const aiAnalysis = await analyzeMessageRisk(details);

    dbRun(
        'INSERT INTO reports (reporter_token, reported_token, message, comment, ai_analysis) VALUES (?, ?, ?, ?, ?)',
        [token, reportedToken, subject, sanitizeInput(details), aiAnalysis]
    );
    
    io.to('admins').emit('admin:data_update', getAdminData());
}));

socket.on('admin:removeFromGuild', safeHandler(({ token, jwt }) => {
    if (!socket.isAdmin) return;

    const user = getUser(token);
    if (!user || !user.guildId) {
        return socket.emit('admin:action_fail', { message: 'Spieler ist in keiner Gilde.' });
    }

    const guild = getGuild(user.guildId);
    if (!guild) {
        dbRun('UPDATE users SET guildId = NULL WHERE token = ?', [token]);
        return socket.emit('admin:action_fail', { message: 'Gilde nicht gefunden. Mitgliedschaft des Spielers wurde zurückgesetzt.' });
    }

    if (guild.owner === token) {
        return socket.emit('admin:action_fail', { message: 'Kann den Gilden-Anführer nicht entfernen. Lösche stattdessen die ganze Gilde.' });
    }

    guild.members = guild.members.filter(m => m !== token);
    upsertGuild(guild);

    user.guildId = null;
    upsertUser(user);

    logAdminAction('Admin', 'REMOVE_FROM_GUILD', token, { guildId: guild.id, guildName: guild.name });

    const targetSocket = Object.values(io.sockets.sockets).find(s => s.token === token);
    if (targetSocket) {
        targetSocket.leave(guild.id);
        targetSocket.emit('kickedFromGuild', { guildName: guild.name });
    }
    
    broadcastGuildUpdate(guild.id);
    io.to('admins').emit('admin:data_update', getAdminData());
    socket.emit('admin:action_success', { message: `${user.name} wurde aus der Gilde ${guild.name} entfernt.` });
}));


socket.on('getGuildData', safeHandler(({ token }) => {
    const user = getUser(token);
    if (!user) return;
    
    const guild = user.guildId ? getGuild(user.guildId) : null;

    if (guild) {
        socket.join(guild.id);

        guild.detailedMembers = guild.members.map(memberToken => {
            const memberUser = getUser(memberToken);
            return memberUser 
                ? { 
                    token: memberToken, 
                    name: memberUser.name, 
                    qcoins: memberUser.qcoins, 
                    avatar: memberUser.equippedAvatar 
                } 
                : null;
        }).filter(Boolean);
    }
    
    const allGuilds = getAllGuilds();
    socket.emit('showGuildData', { guild, guilds: allGuilds });
}));

socket.on('createGuild', safeHandler(async ({ token, name, tag }) => {
    const user = getUser(token);
    const cost = 500;
    if (!user) return sendError(socket, 'Ungültiger Token.');
    if (user.guildId) return sendError(socket, 'Du bist bereits in einer Gilde.');
    if (user.qcoins < cost) return sendError(socket, `Du benötigst ${cost} QCoins, um eine Gilde zu gründen.`);
    if (name.length < 3 || name.length > 20 || tag.length < 3 || tag.length > 4) return sendError(socket, 'Ungültiger Name oder Tag.');

    user.qcoins -= cost;
    
    const guildId = generateGuildId();
    const newGuild = {
        id: guildId,
        name: sanitizeInput(name),
        tag: sanitizeInput(tag).toUpperCase(),
        owner: token,
        members: [token],
        treasury: 0,
        weeklyScore: 0,
        createdAt: new Date().toISOString(),
        chatHistory: []
    };
    upsertGuild(newGuild);

    user.guildId = guildId;
    upsertUser(user);

    socket.join(guildId);

    broadcastGuildUpdate(guildId);

    const gameRoomId = findRoomIdBySocketId(socket.id);
    if (gameRoomId) {
        sendSystemMessage(gameRoomId, `${user.name} hat die Gilde "[${newGuild.tag}] ${newGuild.name}" gegründet!`);
    }
}));

socket.on('admin:resolveUnbanRequest', safeHandler(({ requestId, action, jwt }) => { 
    if (!socket.isAdmin) return;
    
    const status = action === 'accepted' ? 'resolved_accepted' : 'resolved_rejected';
    
    dbRun('UPDATE unban_requests SET status = ? WHERE id = ?', [status, requestId]);

    const logDetail = action === 'accepted' ? 'Antrag ANGENOMMEN (Entbannung)' : 'Antrag ABGELEHNT';
    logAdminAction('Admin', 'RESOLVE_UNBAN_REQUEST', requestId, { decision: logDetail });

    socket.emit('admin:action_success', { message: `Antrag #${requestId} wurde verarbeitet: ${logDetail}` });
    io.to('admins').emit('admin:data_update', getAdminData());
}));

socket.on('admin:authenticate', safeHandler(async (password) => {
    const clientIp = socket.handshake.address;
    const now = Date.now();

    if (bannedIPs[clientIp] && now < bannedIPs[clientIp]) {
        console.warn(`[SECURITY] Blockierter Admin-Login-Versuch von temporär gesperrter IP: ${clientIp}`);
        socket.emit('admin:auth_fail');
        return;
    }
    delete bannedIPs[clientIp];

    if (!adminLoginAttempts[clientIp]) {
        adminLoginAttempts[clientIp] = { count: 0, firstAttempt: now };
    }

    const attempts = adminLoginAttempts[clientIp];
    if (now - attempts.firstAttempt > 15 * 60 * 1000) { 
        attempts.count = 0;
        attempts.firstAttempt = now;
    }

    if (attempts.count >= 5) {
        console.warn(`[SECURITY] Zu viele Fehlversuche von IP: ${clientIp}. IP für 15 Minuten gesperrt.`);
        bannedIPs[clientIp] = now + 15 * 60 * 1000;
        delete adminLoginAttempts[clientIp];
        socket.emit('admin:auth_fail');
        return;
    }

    try {
        const hash = process.env.ADMIN_PASSWORD_HASH;
        const match = await bcrypt.compare(password, hash);

        if (match) {
            const adminToken = jwt.sign(
                { admin: true, ip: clientIp }, 
                process.env.JWT_SECRET, 
                { expiresIn: '8h' } 
            );

            socket.isAdmin = true;
            socket.join('admins');
            socket.emit('admin:auth_success', { 
                token: adminToken, 
                adminData: getAdminData(), 
                shopItems: shopItems,
                chaosEvents: chaosEvents
            });
            logAdminAction(clientIp, 'ADMIN_LOGIN_SUCCESS', socket.id, {});
        } else {
            socket.emit('admin:auth_fail');
            logAdminAction(clientIp, 'ADMIN_LOGIN_FAIL', socket.id, {});
        }
    } catch (error) {
        console.error("Fehler bei der Admin-Authentifizierung:", error);
        socket.emit('admin:auth_fail');
    }
}));

        socket.on('admin:getPlayerDetails', safeHandler(({ token, jwt }) => {
        if (!socket.isAdmin) return;
        const playerDetails = dbGet('SELECT * FROM users WHERE token = ?', [token]);
        socket.emit('admin:playerDetails', playerDetails);
    }));

socket.on('admin:directMessage', safeHandler(({ token, message, jwt }) => {
    if (!socket.isAdmin) return;

    const targetSocket = Array.from(io.sockets.sockets.values()).find(s => s.token === token);

    if (targetSocket) {
        targetSocket.emit('adminDirectMessage', sanitizeInput(message));
        
        logAdminAction('Admin', 'DIRECT_MESSAGE', token, { message });
        socket.emit('admin:action_success', { message: 'Nachricht erfolgreich gesendet.' });
    } else {
        socket.emit('admin:action_fail', { message: 'Spieler konnte nicht gefunden werden (ist offline).' });
    }
}));

socket.on('admin:triggerBSOD', safeHandler(({ roomId, jwt }) => {
    if (!socket.isAdmin) return;
    
    const room = rooms[roomId];
    if (room) {
        io.to(roomId).emit('forceBSOD');
        logAdminAction('Admin', 'TRIGGER_BSOD', roomId, {});
        socket.emit('admin:action_success', { message: `BSOD in Raum ${roomId} ausgelöst.` });
    } else {
        socket.emit('admin:action_fail', { message: `Raum ${roomId} nicht gefunden.` });
    }
}));

socket.on('admin:triggerEvent', safeHandler(({ roomId, eventId, jwt }) => {
    if (!socket.isAdmin) return;
    
    const room = rooms[roomId];
    if (room) {
        room.activeEvent = eventId;
        
        const eventName = chaosEvents[eventId]?.name || eventId;
        
        io.to(roomId).emit('showSystemToast', `⚠️ ADMIN-INTERVENTION: Event "${eventName}" wurde aktiviert!`);
        io.to(roomId).emit('chatMessage', { name: 'SYSTEM', message: `Ein Admin hat das Event "${eventName}" erzwungen!`, type: 'special' });

        const publicState = getPublicRoomState(room);
        if (publicState) io.to(roomId).emit('updateState', publicState);

        logAdminAction('Admin', 'FORCE_EVENT', roomId, { event: eventName });
        socket.emit('admin:action_success', { message: `Event "${eventName}" in Raum ${roomId} gestartet.` });
    } else {
        socket.emit('admin:action_fail', { message: `Raum ${roomId} nicht gefunden.` });
    }
}));

    socket.on('admin:grantItem', safeHandler(({ token, itemId, quantity, jwt }) => {
    if (!socket.isAdmin) return;
    const user = getUser(token);
    const item = shopItems[itemId];
    const amount = Math.max(1, parseInt(quantity, 10) || 1); 
    if (!user || !item) {
        return socket.emit('admin:action_fail', { message: 'Spieler oder Item nicht gefunden.' });
    }
    if (!user.inventory) user.inventory = [];

    if (item.type !== 'powerup' && user.inventory.includes(itemId)) {
        return socket.emit('admin:action_fail', { message: `${user.name} besitzt dieses Item bereits.` });
    }
    for (let i = 0; i < amount; i++) {
        user.inventory.push(itemId);
    }
    upsertUser(user);

    logAdminAction('Admin', 'GRANT_ITEM', token, { itemId: itemId, itemName: item.name, quantity: amount });
    socket.emit('admin:action_success', { message: `${amount}x "${item.name}" wurde an ${user.name} vergeben.` });
    
    const targetSocket = Object.values(io.sockets.sockets).find(s => s.token === token);
    if(targetSocket) {
        targetSocket.emit('shopUpdate', { qcoins: user.qcoins, inventory: user.inventory });
    }
}));

socket.on('admin:addBlacklistWord', safeHandler(({ word, jwt }) => {
    if (!socket.isAdmin) return;
    const cleanWord = sanitizeInput(word).toLowerCase();
    if(cleanWord.length < 2) return;
    
    try {
        dbRun('INSERT INTO blocked_words (word) VALUES (?)', [cleanWord]);
        logAdminAction('Admin', 'ADD_BLACKLIST', cleanWord, {});
        socket.emit('admin:action_success', { message: `"${cleanWord}" zur Blacklist hinzugefügt.` });
        
        io.to('admins').emit('admin:blacklistUpdate', getBlockedWords());
    } catch (e) {
        socket.emit('admin:action_fail', { message: 'Wort existiert bereits.' });
    }
}));

socket.on('admin:removeBlacklistWord', safeHandler(({ word, jwt }) => {
    if (!socket.isAdmin) return;
    const cleanWord = sanitizeInput(word).trim().toLowerCase();
    
    dbRun('DELETE FROM blocked_words WHERE word = ?', [cleanWord]);
    logAdminAction('Admin', 'REMOVE_BLACKLIST', cleanWord, {});
    
    socket.emit('admin:action_success', { message: `"${cleanWord}" wurde entfernt.` });
    
    io.to('admins').emit('admin:blacklistUpdate', getBlockedWords());
}));

socket.on('admin:getBlacklist', safeHandler(({ jwt }) => {
    if (!socket.isAdmin) return;
    socket.emit('admin:blacklistUpdate', getBlockedWords());
}));

    socket.on('admin:unbanPlayer', safeHandler(({ banId, jwt }) => {
    if (!socket.isAdmin) return;
    dbRun('DELETE FROM banned_users WHERE id = ?', [banId]);
    logAdminAction('Admin', 'UNBAN_PLAYER', banId, {});
    socket.emit('admin:action_success', { message: 'Bann erfolgreich aufgehoben.' });
    io.to('admins').emit('admin:data_update', getAdminData());
}));

socket.on('admin:editBan', safeHandler(({ banId, newReason, jwt }) => {
    if (!socket.isAdmin) return;

    const cleanReason = sanitizeInput(newReason);
    if (!cleanReason) {
        return socket.emit('admin:action_fail', { message: 'Der Grund darf nicht leer sein.' });
    }

    const banInfo = dbGet('SELECT * FROM banned_users WHERE id = ?', [banId]);
    if (!banInfo) {
        return socket.emit('admin:action_fail', { message: 'Bann-Eintrag nicht gefunden.' });
    }
    dbRun('UPDATE banned_users SET reason = ? WHERE id = ?', [cleanReason, banId]);

    logAdminAction('Admin', 'EDIT_BAN_REASON', banId, { newReason: cleanReason });
    socket.emit('admin:action_success', { message: 'Banngrund wurde erfolgreich aktualisiert.' });

    broadcastAdminDataUpdate();
    const targetSocket = Object.values(io.sockets.sockets).find(s => s.token === banInfo.user_token);
    if (targetSocket) {
        targetSocket.emit('playerBanned', { reason: cleanReason, banned_until: banInfo.banned_until });
    }
}));

socket.on('admin:mutePlayer', safeHandler(({ token, duration, jwt }) => {
    if (!socket.isAdmin) return;
    const user = getUser(token);
    if (!user) return socket.emit('admin:action_fail', { message: 'Spieler nicht gefunden.' });
    
    const muteUntil = new Date();
    muteUntil.setHours(muteUntil.getHours() + parseInt(duration, 10));

    dbRun('UPDATE users SET mute_until = ? WHERE token = ?', [muteUntil, token]);
    logAdminAction('Admin', 'MUTE_PLAYER', token, { duration: `${duration}h` });
    socket.emit('admin:action_success', { message: `${user.name} für ${duration}h stummgeschaltet.` });
    io.to('admins').emit('admin:data_update', getAdminData());
}));

socket.on('admin:adjustQCoins', safeHandler(({ token, amount, jwt }) => {
    if (!socket.isAdmin) return;
    const user = getUser(token);
    if (!user) return socket.emit('admin:action_fail', { message: 'Spieler nicht gefunden.' });

    user.qcoins = (user.qcoins || 0) + amount;
    upsertUser(user);
    logAdminAction('Admin', 'ADJUST_QCOINS', token, { amount });
    socket.emit('admin:action_success', { message: `Q-Coins für ${user.name} angepasst.` });
    io.to('admins').emit('admin:data_update', getAdminData());
}));

socket.on('admin:broadcastMessage', safeHandler(({ message, jwt }) => {
    if (!socket.isAdmin) return;
    io.emit('systemBroadcast', { message: sanitizeInput(message) });
    logAdminAction('Admin', 'BROADCAST', 'ALL', { message });
    socket.emit('admin:action_success', { message: 'Nachricht an alle gesendet.' });
}));

socket.on('admin:forceEndGame', safeHandler(({ roomId, jwt }) => {
    if (!socket.isAdmin) return;
    
    const room = rooms[roomId];
    if (room) {
        if (room.timer) clearInterval(room.timer);
        
        sendSystemMessage(roomId, 'Dieses Spiel wurde von einem Administrator beendet.', 'elimination');
        
        endGame(roomId); 
        
        logAdminAction('Admin', 'FORCE_END_GAME', roomId, {});
        socket.emit('admin:action_success', { message: `Spiel in Raum ${roomId} wurde erfolgreich beendet.` });
    } else {
        socket.emit('admin:action_fail', { message: `Raum ${roomId} nicht gefunden.` });
    }
}));

socket.on('admin:banPlayer', safeHandler(({ token, reason, duration, jwt }) => {
    if (!socket.isAdmin) return;
    const userToBan = getUser(token);
    if (!userToBan) return socket.emit('admin:action_fail', { message: 'Spieler nicht gefunden.' });

    const targetSocket = Object.values(io.sockets.sockets).find(s => s.token === token);
    const roomId = targetSocket ? findRoomIdBySocketId(targetSocket.id) : null;
    const room = roomId ? rooms[roomId] : null;

    const banDetails = { token, reason, duration, ip: userToBan.last_known_ip };

    if (room && room.gameState !== 'waiting' && room.gameState !== 'finished') {
        if (!room.deferredBans) {
            room.deferredBans = {};
        }
        room.deferredBans[token] = banDetails;
        logAdminAction('Admin', 'DEFERRED_BAN_PLAYER', token, { reason, duration, roomId });
        socket.emit('admin:action_success', { message: `${userToBan.name} ist im Spiel. Bann wird nach der Runde angewendet.` });
    } else {
        executeBan(banDetails);
        logAdminAction('Admin', 'BAN_PLAYER', token, { reason, duration });
        socket.emit('admin:action_success', { message: `Spieler ${userToBan.name} wurde erfolgreich gebannt.` });
        io.to('admins').emit('admin:data_update', getAdminData());
    }
}));


socket.on('admin:deleteGuild', safeHandler(({ guildId, jwt }) => {
    if (!socket.isAdmin) return;
    const guild = getGuild(guildId);
    if (guild) {
        guild.members.forEach(memberToken => {
            dbRun('UPDATE users SET guildId = NULL WHERE token = ?', [memberToken]);
        });
        deleteGuild(guildId);
    }

    socket.emit('admin:action_success', { message: `Gilde mit ID ${guildId} wurde gelöscht.` });
    io.to('admins').emit('admin:data_update', getAdminData());
}));

socket.on('admin:resolveReport', safeHandler(({ reportId, jwt }) => {
    if (!socket.isAdmin) return;
    dbRun('UPDATE reports SET status = ? WHERE id = ?', ['resolved', reportId]);

    socket.emit('admin:action_success', { message: `Meldung #${reportId} wurde als erledigt markiert.` });
    io.to('admins').emit('admin:data_update', getAdminData());
}));

socket.on('reportChatMessage', safeHandler(async ({ reportedToken, message, comment, context }) => { 
    const reporterToken = socket.token;
    if (!reporterToken || !reportedToken) return;

    const contextString = context ? JSON.stringify(context) : '[]';
    
    const aiAnalysis = await analyzeMessageRisk(message);

    dbRun(
        'INSERT INTO reports (reporter_token, reported_token, message, comment, context, ai_analysis) VALUES (?, ?, ?, ?, ?, ?)', 
        [reporterToken, reportedToken, message, sanitizeInput(comment), contextString, aiAnalysis]
    );
    io.to('admins').emit('admin:data_update', getAdminData());
}));

socket.on('deleteAccount', safeHandler(async ({ token }) => {
    if (!token) return;

    const user = getUser(token);
    if (!user) return; 
    if (user.guildId) {
        const guild = getGuild(user.guildId);
        if (guild) {
            if (guild.owner === token) {
                const otherMembers = guild.members.filter(m => m !== token);
                for (const memberToken of otherMembers) {
                    dbRun('UPDATE users SET guildId = NULL WHERE token = ?', [memberToken]);
                    
                    const memberSocket = Object.values(io.sockets.sockets).find(s => s.token === memberToken);
                    if (memberSocket) {
                        memberSocket.emit('kickedFromGuild', { guildName: guild.name });
                        memberSocket.leave(guild.id);
                    }
                }
                deleteGuild(guild.id);
                console.log(`Gilde ${guild.name} [${guild.id}] wurde aufgelöst, da der Anführer seinen Account gelöscht hat.`);

            } else {
                guild.members = guild.members.filter(m => m !== token);
                upsertGuild(guild);
                broadcastGuildUpdate(guild.id);
            }
        }
    }

    deleteUser(token);

    socket.emit('accountDeleted');
    socket.disconnect(true);
}));

socket.on('joinGuild', safeHandler(async ({ token, guildId }) => {
    const user = getUser(token);
    const guild = getGuild(guildId);
    if (!user || !guild) return sendError(socket, 'Ungültiger Token oder Gilden-ID.');
    if (user.guildId) return sendError(socket, 'Du bist bereits in einer Gilde.');
    if (guild.members.length >= 20) return sendError(socket, 'Diese Gilde ist bereits voll.');

    const bannedMembers = guild.banned_members ? JSON.parse(guild.banned_members) : [];
    if (bannedMembers.includes(token)) {
        return sendError(socket, 'Du wurdest aus dieser Gilde gebannt und kannst nicht beitreten.');
    }

    guild.members.push(token);
    upsertGuild(guild);

    user.guildId = guildId;
    upsertUser(user);
    
    socket.join(guildId);
    broadcastGuildUpdate(guildId);
}));

socket.on('leaveGuild', safeHandler(async ({ token }) => {
    const user = getUser(token);
    if (!user || !user.guildId) return;
    
    const guildId = user.guildId;
    const guild = getGuild(guildId);

    if (guild) {
        guild.members = guild.members.filter(m => m !== token);
        if (guild.owner === token && guild.members.length > 0) {
            guild.owner = guild.members[0];
        }

        if (guild.members.length === 0) {
            deleteGuild(guildId);
        } else {
            upsertGuild(guild);
            broadcastGuildUpdate(guildId);
        }
    }

    user.guildId = null;
    upsertUser(user);
    
    socket.leave(guildId);
    socket.emit('showGuildData', { guild: null, guilds: getAllGuilds() });
}));


socket.on('guildChatMessage', safeHandler(async ({ token, message }) => {
    const user = getUser(token);
    if (!user || !user.guildId) return;

    const guild = getGuild(user.guildId);
    if (!guild) return;

    const chatMessage = {
        senderName: user.name,
        senderToken: token,
        message: sanitizeInput(message),
        timestamp: new Date()
    };

    if (!guild.chatHistory) guild.chatHistory = [];
    guild.chatHistory.push(chatMessage);
    if (guild.chatHistory.length > 50) guild.chatHistory.shift();

    io.to(user.guildId).emit('newGuildMessage', chatMessage);

     upsertGuild(guild);
}));

socket.on('kickGuildMember', safeHandler(async ({ token, targetToken, ban }) => {
    const owner = getUser(token);
    const targetUser = getUser(targetToken);
    if (!owner || !targetUser || !owner.guildId) return sendError(socket, 'Aktion nicht möglich.');

    const guild = getGuild(owner.guildId);
    if (!guild || guild.owner !== token || token === targetToken) {
        return sendError(socket, 'Du bist nicht der Gilden-Anführer oder kannst dich nicht selbst entfernen.');
    }

    guild.members = guild.members.filter(m => m !== targetToken);

    if (ban) {
        let bannedMembers = guild.banned_members ? JSON.parse(guild.banned_members) : [];
        if (!bannedMembers.includes(targetToken)) {
            bannedMembers.push(targetToken);
            guild.banned_members = JSON.stringify(bannedMembers);
        }
    }

    upsertGuild(guild);

    targetUser.guildId = null;
    upsertUser(targetUser);

const targetSocketId = tokenToSocketId[targetToken];
if (targetSocketId) {
    const targetSocket = io.sockets.sockets.get(targetSocketId);
    if (targetSocket) {
        targetSocket.leave(guild.id);
        targetSocket.emit('kickedFromGuild', { guildName: guild.name, wasBanned: ban });
    }
}

broadcastGuildUpdate(guild.id);
}));


socket.on('payoutFromTreasury', safeHandler(async ({ token, targetToken, amount }) => {
    const owner = getUser(token);
    const targetUser = getUser(targetToken);
    const payoutAmount = parseInt(amount, 10);

    if (!owner || !targetUser || !owner.guildId) return sendError(socket, 'Aktion nicht möglich.');
    const guild = getGuild(owner.guildId);
    if (!guild || guild.owner !== token) return sendError(socket, 'Nur der Anführer kann Auszahlungen tätigen.');
    if (isNaN(payoutAmount) || payoutAmount <= 0) return sendError(socket, 'Ungültiger Betrag.');
    if (guild.treasury < payoutAmount) return sendError(socket, 'Die Gildenkasse hat nicht genug QCoins.');

    guild.treasury -= payoutAmount;
    targetUser.qcoins += payoutAmount;

    upsertGuild(guild);
    upsertUser(targetUser);

    const targetSocket = Object.values(io.sockets.sockets).find(s => s.token === targetToken);
    if (targetSocket) {
        targetSocket.emit('showSystemToast', `Du hast ${payoutAmount} 🪙 aus der Gildenkasse von ${owner.name} erhalten!`);
    }
    
    broadcastGuildUpdate(guild.id);
}));

socket.on('host:kickPlayer', safeHandler(({ roomId, targetId, isBan }) => {
    const room = rooms[roomId];
    if (!room) return;
    
    if (socket.id !== room.hostId) return sendError(socket, "Nur der Host kann Spieler kicken.");
    
    if (targetId === room.hostId) return sendError(socket, "Du kannst dich nicht selbst kicken.");

    const targetPlayer = room.players[targetId] || room.spectators[targetId];
    if (!targetPlayer) return sendError(socket, "Spieler nicht gefunden.");

    if (isBan) {
        if (!room.bannedTokens) room.bannedTokens = [];
        room.bannedTokens.push(targetPlayer.token);
        logAdminAction('Host', 'ROOM_BAN', targetPlayer.token, { roomId });
    }

    const targetSocket = io.sockets.sockets.get(targetId);
    if (targetSocket) {
        const msg = isBan 
            ? "Du wurdest vom Host aus dem Raum gebannt." 
            : "Du wurdest vom Host aus dem Raum gekickt.";
        
        targetSocket.emit('updateState', { error: msg, forceLobby: true });
        targetSocket.leave(roomId);
        
        delete room.players[targetId];
        delete room.spectators[targetId];
        
        broadcastState(roomId);
        
        const actionWord = isBan ? "gebannt" : "gekickt";
        io.to(roomId).emit('chatMessage', { 
            name: 'System', 
            message: `${targetPlayer.name} wurde vom Host ${actionWord}.`, 
            type: 'elimination' 
        });
    }
}));

socket.on('donateToGuild', safeHandler(async ({ token, amount }) => {
    const user = getUser(token);
    const donateAmount = parseInt(amount, 10);
    if (!user || !user.guildId) return;
    const guild = getGuild(user.guildId);
    if (!guild) return;

    if (isNaN(donateAmount) || donateAmount <= 0 || user.qcoins < donateAmount) {
        return sendError(socket, 'Ungültiger Betrag.');
    }

    user.qcoins -= donateAmount;
    guild.treasury += donateAmount;
    
    if (!user.stats.totalDonated) user.stats.totalDonated = 0;
    user.stats.totalDonated += donateAmount;
    
    upsertUser(user);
    upsertGuild(guild);

    broadcastGuildUpdate(guild.id);
}));

socket.on('createRoom', safeHandler(({ token, settings }) => {
    const user = getUser(token);
    if (!token || !user) {
        return sendError(socket, 'Ungültiger Spieler-Token.');
    }

    const roomId = generateRoomId();
    const userData = { ...user, token };

    rooms[roomId] = createRoomState(roomId, socket.id, settings); 
    rooms[roomId].players[socket.id] = createPlayer(socket.id, userData, true);

    socket.join(roomId);
    socket.roomId = roomId;

    broadcastState(roomId);

    if (settings.isPublic) {
        io.emit('publicRoomsUpdate', getPublicRooms());
    }

    broadcastAdminDataUpdate();
}));

socket.on('getPublicRoomsList', safeHandler(() => {
    socket.emit('publicRoomsUpdate', getPublicRooms());
}));

    socket.on('validateToken', safeHandler(({ token }) => {
        const user = getUser(token);
        if (user) {
            socket.emit('validateToken', { user });
        }
    }));

socket.on('choosePlayerEvent', safeHandler(({ eventId }) => {
    const roomId = socket.roomId;
    const room = rooms[roomId];
    if (!room || room.gameState !== 'player-event-choice' || socket.id !== room.eventChoice.chooserId) return;

    room.activeEvent = eventId;
const choosingPlayer = room.players[socket.id];
sendSystemMessage(roomId, `${safeName(choosingPlayer)} hat das Event gewählt: "${chaosEvents[eventId].name}"!`, 'special');

    if (eventId === 'qCoinRain') {
        Object.values(room.players).filter(p => !p.isEliminated).forEach(p => {
            const user = getUser(p.token);
            if(user) {
                const qcoins = Math.floor(Math.random() * 101) + 50;
                user.qcoins += qcoins;
                p.qcoins = user.qcoins;
                upsertUser(user);
                io.to(p.socketId).emit('showSystemToast', `Du hast ${qcoins} 🪙 durch einen Q-Coin-Regen erhalten!`);
            }
        });
    }

    startBettingPhase(roomId, room.eventChoice.chooserId);
}));


socket.on('placeFinalBounty', safeHandler(({ targetSocketId }) => {
    const roomId = socket.roomId;
    const room = rooms[roomId];
    if (!room) return;

    const targetPlayer = room.players[targetSocketId];
    const actingPlayer = room.players[socket.id];

    if (targetPlayer && actingPlayer) {
    const bountyPoints = -75;
    targetPlayer.score += bountyPoints;
    sendSystemMessage(roomId, `😈 ${safeName(actingPlayer)} hat sich gerächt! Ein Kopfgeld von ${bountyPoints} Punkten wurde auf ${safeName(targetPlayer)} ausgesetzt!`, 'elimination');
    checkAndAwardAchievements(socket.id, 'avenger');
    broadcastState(roomId);
}

    proceedToNextPhase(roomId);
}));

socket.on('claimMissionReward', safeHandler(async ({ token, missionType }) => {
    let user = getUser(token);
    if (!user || !user.dailyMissions || !user.dailyMissions[missionType] || !user.dailyMissions[missionType].completed || user.dailyMissions[missionType].rewardClaimed) {
        return sendError(socket, "Belohnung kann nicht eingefordert werden.");
    }

    const mission = user.dailyMissions[missionType];
    user.qcoins += mission.reward;
    mission.rewardClaimed = true;

    const completedMissionTypes = Object.keys(user.dailyMissions);
    const availableNewMissions = Object.keys(missions).filter(m => !completedMissionTypes.includes(m));

    if (availableNewMissions.length > 0) {
        delete user.dailyMissions[missionType]; 
        const newMissionKey = shuffleArray(availableNewMissions)[0];
        const newMission = missions[newMissionKey];
        user.dailyMissions[newMissionKey] = { 
            ...newMission,
            progress: 0,
            completed: false,
            rewardClaimed: false,
        };
    }
    
    user = addXpToUser(user, AVATAR_XP_AWARDS.COMPLETE_MISSION, token); 
    upsertUser(user);
    socket.emit('shopUpdate', { qcoins: user.qcoins, inventory: user.inventory });
    socket.emit('missionsUpdate', { missions: user.dailyMissions }); 
}));

    socket.on('joinRoom', safeHandler(({ token, roomId, isSpectator }) => {
    if (token) tokenToSocketId[token] = socket.id;
    const user = getUser(token); 
    if (!token || !user) return sendError(socket, 'Ungültiger Spieler-Token.');
    const upperRoomId = sanitizeInput(roomId).toUpperCase();
    const room = rooms[upperRoomId];
    if (!room) return sendError(socket, 'Raum existiert nicht.', true);

    if (room.bannedTokens && room.bannedTokens.includes(token)) {
        return sendError(socket, 'Du wurdest von diesem Raum gebannt.', true);
    }

    const userData = { ...user, token };

    if (!isSpectator && Object.values(room.players).some(p => p.name === userData.name && p.token !== token)) {
        return sendError(socket, 'Ein anderer Spieler mit diesem Namen ist bereits im Raum.', true);
    }

    if (room.isPublic) {
    io.emit('publicRoomsUpdate', getPublicRooms());
}

    const existingPlayer = Object.values(room.players).find(p => p.token === token);
    if (existingPlayer) {
        const oldSocketId = existingPlayer.socketId;
        if (oldSocketId !== socket.id) {
            const oldPlayerData = room.players[oldSocketId];
            delete room.players[oldSocketId];
            
            socket.join(upperRoomId);
            socket.roomId = upperRoomId;
            room.players[socket.id] = oldPlayerData;
            room.players[socket.id].socketId = socket.id; 
            
            if (room.hostId === oldSocketId) {
                room.hostId = socket.id;
                room.players[socket.id].isHost = true;
            }

            sendSystemMessage(upperRoomId, `${userData.name} hat sich wieder verbunden.`, 'special');
            broadcastState(upperRoomId);
            return;
        }
    }

    socket.join(upperRoomId);
    socket.roomId = upperRoomId;

    if (isSpectator) {
        room.spectators[socket.id] = { name: userData.name, token };
        sendSystemMessage(upperRoomId, `${userData.name} schaut zu.`);
    } else {
        if (room.gameState !== 'waiting') return sendError(socket, 'Das Spiel läuft bereits.', true);
        room.players[socket.id] = createPlayer(socket.id, userData, false); 
        sendSystemMessage(upperRoomId, `${userData.name} hat den Raum betreten.`);
    }
    broadcastState(upperRoomId);
}));

socket.on('sabotage', safeHandler(async ({ token, action }) => {
    const roomId = socket.roomId;
    const room = rooms[roomId];
    const player = room?.players[socket.id];
    const user = getUser(token);

    if (!room || !player || !user || !player.isEliminated) return;

    const costs = { hint: 100, time: 75, swap: 50 };
    const cost = costs[action];

    if (!cost || user.qcoins < cost) {
        return sendError(socket, "Aktion nicht möglich oder zu wenig QCoins.");
    }

    user.qcoins -= cost;
    player.qcoins = user.qcoins;

    sendSystemMessage(roomId, `😈 Ein eliminierter Spieler sabotiert die Runde!`, 'elimination');

    switch (action) {
        case 'hint':
            if (room.gameState === 'playing' || room.gameState === 'dueling') {
                 const problem = room.gameProblems[room.currentRound - 1];
                 if (problem?.hint) {
                    io.to(roomId).emit('showHint', problem.hint);
                 }
            }
            break;
        case 'time':
            room.sabotageTime = true;
            sendSystemMessage(roomId, `Die Zeit in der nächsten Runde wird verkürzt!`);
            break;
        case 'swap':
            if (room.gameState === 'countdown' || room.gameState === 'category-choice') {
                const potentialProblems = problems.filter(p =>
                    p.difficulty === room.settings.difficulty &&
                    p.id !== room.gameProblems[room.currentRound - 1]?.id
                );
                const newProblem = shuffleArray(potentialProblems)[0] || room.gameProblems[room.currentRound - 1];
                room.gameProblems[room.currentRound - 1] = newProblem;
                sendSystemMessage(roomId, `Die Frage wurde ausgetauscht!`);
            }
            break;
    }
    checkAndAwardAchievements(socket.id, 'useSabotage');
    broadcastState(roomId);
}));

    socket.on('spectatorVoteEvent', safeHandler(({ eventId }) => {
    const roomId = socket.roomId;
    const room = rooms[roomId];
    const spectator = room?.spectators[socket.id];

    if (!room || !spectator || room.gameState !== 'event-voting') return;
    
    room.eventVoting.votes[socket.id] = eventId;
}));

  
socket.on('startGame', safeHandler(() => {
    const roomId = socket.roomId;
    const room = rooms[roomId];
    if (!room || socket.id !== room.hostId || (room.gameState !== 'waiting' && room.gameState !== 'finished')) return;

    Object.values(room.players).forEach(p => {
        p.score = 0;
        p.isEliminated = false;
        p.usedPowerup = null;
        p.streakSaverUsed = false;
        p.finalBountyUsed = false;
        p.incorrectAnswersThisGame = 0;
        
        const user = getUser(p.token);
        p.hasFreeHint = user ? user.unlockedPerks.includes('free_hint') : false;

        if (user && user.inventory) {
            p.powerups = user.inventory
            .filter(id => shopItems[id]?.type === 'powerup')
            .map(id => ({id, name: shopItems[id].name }));
        } else {
            p.powerups = [];
        }
        
        p.gameStats = {
            claimedBounty: false,
            wasInLastPlace: false,
            wasNeverLowest: true,
            answeredCategories: new Set(),
        };
    });

    if (room.isPublic) {
    io.emit('publicRoomsUpdate', getPublicRooms());
}
    
    room.currentRound = 0;
    room.bountyOn = null;
    room.eventsOccurred = new Set();
    room.gameProblems = [];
    room.playedPlayerIds = [];
    room.currentPlayerTurn = null;
    room.activeEvent = null;
    room.activeAutomaticEvent = null;
    room.conspiracyPartners = [];

    sendSystemMessage(roomId, 'Das Spiel wird vom Host gestartet!');

    if (room.settings.gameMode === 'survival') {
        startNextSurvivalTurn(roomId);
    } else {
        room.isSurvival = false;
        startEventVotingPhase(roomId);
    }
    broadcastAdminDataUpdate();
}));

socket.on('usePowerup', safeHandler(async ({ token, powerupId }) => {
    const roomId = socket.roomId;
    const room = rooms[roomId];
    if (!room || (room.gameState !== 'playing' && room.gameState !== 'dueling' && room.gameState !== 'sudden-death')) return;

    const player = room.players[socket.id];
    const user = getUser(token);
    if (!player || !user) return;

    if (player.usedPowerup) {
        return sendError(socket, 'Du hast in dieser Runde bereits einen Joker eingesetzt.');
    }
    if (powerupId === 'joker_hint_free') {
        if (player.hasFreeHint) {
            const problem = (room.gameState === 'dueling') ? room.duel.problem : (room.gameState === 'sudden-death' ? room.suddenDeath.problem : room.gameProblems[room.currentRound - 1]);
            if (problem && problem.hint) {
                socket.emit('showHint', problem.hint);
            }
            player.hasFreeHint = false;
            player.usedPowerup = 'joker_hint_free'; 
            socket.emit('powerupUsed', { powerupId });
            broadcastState(roomId);
            return;
        }
    }
    if (!user.inventory) user.inventory = [];
    const itemIndex = user.inventory.indexOf(powerupId);

    if (itemIndex > -1) {
        if (powerupId === 'joker_hint') {
            const problem = (room.gameState === 'dueling') ? room.duel.problem : room.gameProblems[room.currentRound - 1];
            if (problem && problem.hint) {
                socket.emit('showHint', problem.hint);
            }
        }
        
        player.usedPowerup = powerupId;
        
        const playerPowerupIndex = player.powerups.findIndex(p => p.id === powerupId);
        if(playerPowerupIndex > -1) player.powerups.splice(playerPowerupIndex, 1);
        
        updateMissionProgress(token, 'USE_POWERUP');
        upsertUser(user);

        socket.emit('powerupUsed', { powerupId });
        broadcastState(roomId);
    } else {
        sendError(socket, 'Du besitzt diesen Joker nicht.');
    }
}));
    
socket.on('chooseCategory', safeHandler(({ category }) => {
    const roomId = socket.roomId;
    const room = rooms[roomId];
    
    if (!room || room.gameState !== 'category-choice') return;

    if (socket.id !== room.chooserId) return;

    const player = room.players[room.chooserId]; 
    
    if (!player || player.isEliminated) {
        console.error(`Fehlerhafte Anfrage von einem nicht-existenten oder eliminierten Spieler ${socket.id} in Raum ${roomId} abgewehrt.`);
        return; 
    }
    
    room.chosenCategory = category;
    
    const safeName = (p) => p?.name || 'Ein Spieler';
    sendSystemMessage(roomId, `${safeName(player)} hat die Kategorie "${category}" gewählt!`);
    
    startCountdown(roomId);
}));

socket.on('placeBet', safeHandler(({ token, amount }) => {
    const roomId = socket.roomId;
    const room = rooms[roomId]; 
    const player = room?.players[socket.id]; 
    let user = getUser(token);

    if (!room || room.gameState !== 'betting' || !player || !user) return;

const betAmount = parseInt(amount, 10);
    if (isNaN(betAmount) || betAmount <= 0) return sendError(socket, 'Ungültiger Wetteinsatz.');
    
    if (!room.bets) room.bets = {};
    const currentBet = room.bets[socket.id] || 0;

    user.qcoins += currentBet;

    if (user.qcoins < betAmount) {
        user.qcoins -= currentBet;
        return sendError(socket, 'Du hast nicht genug QCoins für diese Wette.');
    }

    user.qcoins -= betAmount;
    player.qcoins = user.qcoins; 
    upsertUser(user); 

    room.bets[socket.id] = betAmount;

    socket.emit('betPlaced', { amount: betAmount, newBalance: player.qcoins });
}));
    
socket.on('submitSolution', safeHandler(async (data) => {
    const userAnswer = typeof data === 'object' ? data.answer : data;
    const captchaPassed = typeof data === 'object' ? data.captchaPassed : false;

    const roomId = socket.roomId;
    const room = rooms[roomId];
    if (!room) return;
    const player = room.players[socket.id];
    if (!player || player.hasAnswered) return;
    if (room.activeEvent === 'securityCheck' && !captchaPassed) {
        return socket.emit('captcha:required', { answer: userAnswer });
    }

    const timeTaken = Date.now() - room.roundStartTime;
    if (timeTaken > (room.settings.duration * 1000) + 500) {
        console.warn(`[SECURITY] Späte Antwort von ${player.name} in Raum ${roomId} blockiert.`);
        return;
    }

    if (room.isSurvival) {
        if (socket.id !== room.currentPlayerTurn) return;

        clearInterval(room.timer);
        player.hasAnswered = true;
        const correct = await isAnswerCorrect(userAnswer, room.currentProblem.answers);

        if (correct) {
            
            if (!player.survivalStats) player.survivalStats = { correct: 0, xp: 0, qcoins: 0 };

            if (room.currentProblem.isBonus) {
                const bonusQCoins = 25;
                player.survivalStats.qcoins += bonusQCoins;
                player.qcoins += bonusQCoins; 
                sendSystemMessage(roomId, `💰 ${player.name} erhält ${bonusQCoins} Q-Coins als Bonus!`, 'special');
            }
            
            player.score++;
            player.survivalStats.correct += 1;
            player.survivalStats.xp += AVATAR_XP_AWARDS.CORRECT_ANSWER;

            sendSystemMessage(roomId, `Richtig! ${player.name} ist weiter am Zug. Aktueller Score: ${player.score}`, 'special');
            await serveSurvivalQuestion(roomId);
        } else {
            let user = getUser(player.token);
            if (user) {
                user.stats.incorrectAnswers++;
                upsertUser(user);
            }
            sendSystemMessage(roomId, `Falsch! Der Zug von ${player.name} ist mit ${player.score} Punkten beendet.`, 'elimination');
            room.playedPlayerIds.push(room.currentPlayerTurn);
            room.currentPlayerTurn = null;
            broadcastState(roomId);
            await startNextSurvivalTurn(roomId);
        }
        return;
    }

    if (room.gameState === 'sudden-death') {
        if (!room.suddenDeath || !room.suddenDeath.participants.includes(socket.id)) return;
        player.hasAnswered = true;
        const correct = await isAnswerCorrect(userAnswer, room.suddenDeath.problem.answers);
        clearInterval(room.timer);

        if (correct) {
            const winnerPlayer = room.players[socket.id];
            winnerPlayer.score += 10000;
            Object.values(room.players).forEach(p => p.isEliminated = (p.socketId !== socket.id));
            endGame(roomId);
        } else {
            player.isEliminated = true;
            room.suddenDeath.participants = room.suddenDeath.participants.filter(id => id !== socket.id);
            if (room.suddenDeath.participants.length === 1) {
                const winnerId = room.suddenDeath.participants[0];
                room.players[winnerId].score += 10000;
                Object.values(room.players).forEach(p => p.isEliminated = (p.socketId !== winnerId));
                endGame(roomId);
            } else if (room.suddenDeath.participants.length === 0) {
                 sendSystemMessage(roomId, `Alle haben falsch geantwortet! Das Spiel endet unentschieden.`);
                 room.gameState = 'finished';
                 broadcastState(roomId);
            }
        }
        return;
    }

    if (room.gameState === 'dueling') {
        if (!room.duel || (socket.id !== room.duel.p1 && socket.id !== room.duel.p2)) return;
        player.hasAnswered = true;
        const correct = await isAnswerCorrect(userAnswer, room.duel.problem.answers);
        if (correct) {
            handleDuelResult(roomId, socket.id);
        } else {
             const winnerId = (socket.id === room.duel.p1) ? room.duel.p2 : room.duel.p1;
             handleDuelResult(roomId, winnerId);
        }
        return;
    }

    if (room.gameState !== 'playing') return;
    room.roundSubmissions[socket.id] = { answer: sanitizeInput(userAnswer), time: room.timeLeft };
    player.hasAnswered = true;
    const allAnswered = Object.values(room.players).filter(p => !p.isEliminated).every(p => p.hasAnswered);
    if (allAnswered) {
        await evaluateRound(roomId);
    } else {
        broadcastState(roomId);
    }
}));
    
    socket.on('buyItem', safeHandler(async ({ token, itemId }) => {
    let user = getUser(token);
    if (!user) return sendError(socket, 'Authentifizierung fehlgeschlagen.');

    const item = shopItems[itemId];
    if (!item) return sendError(socket, 'Dieses Item existiert nicht.');
    if (user.qcoins < item.cost) return sendError(socket, 'Du hast nicht genug QCoins.');
    if (item.type !== 'powerup' && user.inventory?.includes(itemId)) return sendError(socket, 'Du besitzt diesen Gegenstand bereits.');

    user.qcoins -= item.cost;
    if (!user.inventory) user.inventory = [];
    user.inventory.push(itemId);

    upsertUser(user); 

    user = updateMissionProgressForUser(user, 'FIRST_SHOP_PURCHASE');

    socket.emit('shopUpdate', { qcoins: user.qcoins, inventory: user.inventory });

    const roomId = socket.roomId;
    if (roomId && rooms[roomId]?.players[socket.id]) {
        rooms[roomId].players[socket.id].qcoins = user.qcoins;
        rooms[roomId].players[socket.id].inventory = user.inventory;
        broadcastState(roomId);
    }
}));

socket.on('spectatorPlaceBet', safeHandler(async ({ token, onPlayerId, amount }) => {
    const roomId = socket.roomId;
    const room = rooms[roomId];
    const spectator = room?.spectators[socket.id];
    let user = getUser(token); 
    const targetPlayer = room?.players[onPlayerId];

    if (!room || !spectator || !user || !targetPlayer || targetPlayer.isEliminated) {
        return sendError(socket, "Wette konnte nicht platziert werden.");
    }
    if (room.gameState !== 'betting') {
        return sendError(socket, "Die Wettphase ist bereits vorbei.");
    }

    const betAmount = parseInt(amount, 10);
    if (isNaN(betAmount) || betAmount <= 0) {
        return sendError(socket, "Ungültiger Wetteinsatz.");
    }

    if (!room.spectatorBets) room.spectatorBets = {};
    const currentBet = room.spectatorBets[socket.id] ? room.spectatorBets[socket.id].amount : 0;
    
    user.qcoins += currentBet;

    if (user.qcoins < betAmount) {
        user.qcoins -= currentBet;
        return sendError(socket, "Nicht genug QCoins für diese Wette.");
    }

    user.qcoins -= betAmount;
    upsertUser(user);
    
    room.spectatorBets[socket.id] = { onPlayerId, amount: betAmount };

socket.emit('spectatorBetPlaced', { onPlayerName: safeName(targetPlayer), amount: betAmount });
sendSystemMessage(roomId, `Eine Zuschauer-Wette wurde auf ${safeName(targetPlayer)} platziert!`);
}));
    
socket.on('equipItem', safeHandler(async ({ token, itemId }) => {
    const user = getUser(token); 
    if (!user) return sendError(socket, 'Authentifizierung fehlgeschlagen.');

    const item = shopItems[itemId];
    const title = titles[itemId]; 

    if (!item && !title) return sendError(socket, 'Gegenstand oder Titel nicht gefunden.');
    
    const isPowerUp = item && item.type === 'powerup';
    if (!isPowerUp && !user.inventory?.includes(itemId) && !user.unlockedTitles?.includes(itemId)) {
        return sendError(socket, 'Du besitzt dies nicht.');
    }

    if (item) {
        if (item.type === 'avatar') user.equippedAvatar = item.value;
        else if (item.type === 'chat_color' || item.type === 'chat_fx') user.equippedChatColor = item.value;
        else if (item.type === 'font') user.equippedFont = item.value;
        else return sendError(socket, 'Dieser Item-Typ kann nicht ausgerüstet werden.');
    } else if (title) { 
        user.equippedTitle = itemId;
    }

    upsertUser(user);
    socket.emit('itemEquipped', { updatedProfile: user });

    const roomId = socket.roomId;
    if (roomId && rooms[roomId]?.players[socket.id]) {
        const player = rooms[roomId].players[socket.id];
        if (item) {
            if (item.type === 'avatar') player.avatar = item.value;
            else if (item.type === 'chat_color' || item.type === 'chat_fx') player.chatColor = item.value;
        }
        if(title) player.equippedTitle = itemId; 
        broadcastState(roomId);
    }
}));


    socket.on('getMissions', safeHandler(({ token }) => {
    const user = getUser(token);
    if (user && user.dailyMissions) {
        const loginMission = user.dailyMissions['LOGIN_STREAK'];
        if(loginMission) {
            loginMission.progress = user.loginStreak;
            if (loginMission.progress >= loginMission.goal) {
                loginMission.completed = true;
            }
        }
        socket.emit('showMissions', { missions: user.dailyMissions });
    }
}));

socket.on('getPlayerProfile', safeHandler(({ token }) => {
    if (!token) return;
    const userProfile = getUser(token);
    if (userProfile) {
        socket.emit('showPlayerProfile', userProfile);
    }
}));

socket.on('chatMessage', safeHandler((msg) => {
        const roomId = socket.roomId;
        const user = getUser(socket.token);

        if (user && user.mute_until) {
            const now = new Date();
            const muteUntil = new Date(user.mute_until);
            if (now < muteUntil) {
                const timeLeft = Math.ceil((muteUntil - now) / (1000 * 60));
                socket.emit('chatMessage', { name: 'System', message: `Du bist noch für ${timeLeft} Minuten stummgeschaltet. a`, type: 'elimination' });
                return;
            }
        }

        if (!roomId) return;

        const now = Date.now();
        if (chatTimeouts[socket.id] && now < chatTimeouts[socket.id]) {
            const timeLeft = Math.ceil((chatTimeouts[socket.id] - now) / 1000);
            socket.emit('chatMessage', { name: 'System', message: `Du bist im Chat für ${timeLeft}s gesperrt.`, type: 'elimination' });
            return;
        }
        if (chatTimeouts[socket.id]) delete chatTimeouts[socket.id];

        if (!chatSpamTrack[socket.id]) chatSpamTrack[socket.id] = [];
        chatSpamTrack[socket.id].push(now);
        chatSpamTrack[socket.id] = chatSpamTrack[socket.id].filter(ts => now - ts < SPAM_TIME_FRAME_MS);
        
        if (chatSpamTrack[socket.id].length > SPAM_MESSAGE_LIMIT) {
            chatTimeouts[socket.id] = now + CHAT_TIMEOUT_MS;
            socket.emit('chatMessage', { name: 'System', message: 'Wow, mach mal langsam! 30s Chat-Pause für dich.', type: 'elimination' });
            delete chatSpamTrack[socket.id];
            return;
        }
        
        const cleanMessage = sanitizeInput(msg);
        if (!cleanMessage) return;

        const spyRoomName = rooms[roomId] && rooms[roomId].isPublic ? `Raum ${roomId}` : `Privat/Gilde`;
        const senderName = user ? user.name : 'Unbekannt';
        const isBlocked = isMessageInappropriate(cleanMessage);

        if (isBlocked) {
            socket.emit('chatMessage', { name: 'System', message: 'Deine Nachricht wurde vom Filter blockiert. Bleib sauber!', type: 'elimination' });
        }

        const room = rooms[roomId];
        let playerInfo = { name: senderName, color: '#FFFFFF', token: null, role: 'user' };

        if (room?.players[socket.id]) {
            const p = room.players[socket.id];
            playerInfo = { name: safeName(p), color: p.chatColor, token: p.token, role: p.role };
        } else if (room?.spectators[socket.id]) {
            const s = room.spectators[socket.id];
            const sUser = getUser(s.token); 
            playerInfo = { name: `${s.name} (Zuschauer)`, color: '#cccccc', token: s.token, role: sUser ? sUser.role : 'user' };
        }

        const spyLogEntry = {
            roomId: roomId,
            roomName: spyRoomName,
            sender: playerInfo.name,
            message: cleanMessage,
            blocked: isBlocked, 
            timestamp: Date.now()
        };

        globalSpyHistory.push(spyLogEntry);
        if (globalSpyHistory.length > 200) globalSpyHistory.shift(); 

        io.to('admins').emit('admin:liveChatLog', spyLogEntry);

        if (!isBlocked) {
            io.to(roomId).emit('chatMessage', { 
                name: playerInfo.name, 
                message: cleanMessage, 
                color: playerInfo.color, 
                token: playerInfo.token, 
                role: playerInfo.role,
                type: 'standard' 
            });
        }
    }));

socket.on('disconnect', () => {
    const roomId = socket.roomId;
    if (!roomId || !rooms[roomId]) return;

    const room = rooms[roomId];
    const player = room.players[socket.id];
    const spectator = room.spectators[socket.id];

        if (player && player.token) {
        delete tokenToSocketId[player.token];
    } else if (spectator && spectator.token) {
        delete tokenToSocketId[spectator.token];
    }
    
    let needsStateUpdate = false;

    if (player) {
        sendSystemMessage(roomId, `${player.name || 'Ein Spieler'} hat den Raum verlassen.`, 'elimination');
        if (socket.id === room.hostId && Object.keys(room.players).length > 1) {
            const otherPlayers = Object.values(room.players).filter(p => p.socketId !== socket.id);
            if (otherPlayers.length > 0) {
                const newHost = otherPlayers[0];
                newHost.isHost = true;
                room.hostId = newHost.socketId;
                sendSystemMessage(roomId, `${newHost.name || 'Ein Spieler'} ist jetzt der neue Host.`);
            }
        }
        delete room.players[socket.id];
        needsStateUpdate = true;
    } else if (spectator) {
        sendSystemMessage(roomId, `${spectator.name || 'Ein Zuschauer'} hat den Raum verlassen.`, 'elimination');
        delete room.spectators[socket.id];
        needsStateUpdate = true;
    }

    if (room.isPublic) {
    io.emit('publicRoomsUpdate', getPublicRooms());
}
    
    if (Object.keys(room.players).length === 0) {
        clearTimeout(room.cleanupTimer);
        delete rooms[roomId];
        
        broadcastAdminDataUpdate(); 
        return;
    }
    
    if (needsStateUpdate) {
        broadcastState(roomId);
    }
    broadcastAdminDataUpdate();
});

if (socketRateLimits[socket.id]) {
        delete socketRateLimits[socket.id];
    }
});

initializeApp().then(() => {
    server.listen(PORT, () => console.log(`🚀 Quizlino Server läuft auf http://localhost:3000`));
});