🧠 Quizlino – Die Next-Gen Echtzeit-Quiz-Plattform
(Falls das Bild oben dein Logo/Screenshot ist, wird es hier angezeigt)

Status: Active Development 🟢 | Version: 3.0.0 | License: MIT

Quizlino ist eine hochmoderne, webbasierte Multiplayer-Quiz-Applikation, die sich durch Echtzeit-Kommunikation, gamifizierte Chaos-Elemente und ein robustes Administrations-Backend auszeichnet. Im Gegensatz zu herkömmlichen Quiz-Spielen setzt Quizlino auf direkte Duelle, eine integrierte In-Game-Ökonomie und Anti-Cheat-Maßnahmen, um ein faires und aufregendes Spielerlebnis zu gewährleisten.

📑 Inhaltsverzeichnis
Features & Highlights

Technische Architektur

Deep Dive: Code-Analyse

Installation & Setup

Admin-Panel & Moderation

Sicherheit & Anti-Cheat

Projektstruktur

🚀 Features & Highlights
🎮 Gameplay Experience
Echtzeit-Synchronisation: Dank Socket.io erleben alle Spieler Spielstände, Chat-Nachrichten und Events ohne Verzögerung.

Dynamische Lobbys: Erstellung von öffentlichen und privaten Räumen mit Host-Migration (wenn der Host geht, wird ein neuer bestimmt).

Zuschauer-Modus: Spieler können laufenden Matches beitreten und live zusehen.

Chaos-Events: Einzigartige Features wie "Ear Destroyer" (Audio-Störgeräusche), Jumpscares und Bildschirm-Effekte erhöhen den Stressfaktor und Spaß.

💰 In-Game Ökonomie (Gamification)
Währungssystem: Verdienen von Coins durch Wissen.

Casino & Bank: Interaktive Module zum Vermehren (oder Verlieren) von Spielwährung.

Shop-System: Kaufbare Items, Titel und kosmetische Upgrades.

Reise-Manager: Virtuelles Reisen zu verschiedenen Orten innerhalb des Spiels.

💬 Kommunikation & Soziales
"Chatti" System: Ein voll integrierter Echtzeit-Chat mit Typing-Indikatoren.

Gilden-System: Spieler können sich in Gruppen organisieren.

Erfolge & Titel: Visuelle Belohnungen für Langzeitspieler.

🛠 Technische Architektur
Das Projekt basiert auf einem Node.js Backend und einem Vanilla JavaScript Frontend, optimiert für maximale Performance und geringe Latenz.

Komponente	Technologie	Beschreibung
Backend	Node.js / Express	REST API und Statisches Hosting.
Echtzeit	Socket.io	Bidirektionale Event-basierte Kommunikation.
Frontend	Vanilla JS (ES6+)	Leichtgewichtig, ohne Framework-Overhead.
Styling	CSS3 (Variables)	Modernes Design mit Dark-Mode Fokus & Animationen.
Security	JWT / Bcrypt	Token-basierte Auth für Admins & Passwort-Hashing.
Effekte	Vanilla-Tilt.js	3D-Parallax-Effekte im UI.
🔍 Deep Dive: Code-Analyse
Hier wird analysiert, wie die Kernkomponenten unter der Haube arbeiten:

1. Das Server-Herzstück (server.js)
Der Server nutzt eine Event-Loop-Architektur, um Tausende von gleichzeitigen Verbindungen zu verwalten.

Rate Limiting: Eigene Implementierung (isRateLimited), um Spam-Attacken auf Socket-Events zu verhindern.

State Management: Der Server hält den gesamten Spielzustand (rooms, players, chaosEvents) im Arbeitsspeicher für schnellen Zugriff.

Dynamische Admin-Pfade: Der Admin-Zugang wird verschleiert (ADMIN_PANEL_PATH), um Brute-Force-Angriffe zu erschweren.

2. Client-Side Orchestration (app.js)
Der Client ist modular aufgebaut:

Manager-Pattern: Der Code ist in logische Einheiten unterteilt (tutorialManager, casinoManager, bankManager), um die Wartbarkeit zu erhöhen.

Audio-Engine: Ein Array aus Audio-Objekten (earDestroyerSounds) ermöglicht komplexes Sound-Mixing direkt im Browser.

Socket-Handling: Robuste Reconnection-Strategien (reconnectionAttempts: 5) sorgen für Stabilität bei schlechter Internetverbindung.

3. UI/UX Design (style.css & index.html)
CSS-Variablen: Ein zentrales Theme-System (--bg-primary, --accent-primary) ermöglicht konsistentes Design.

Responsive Animationen: Nutzung von @keyframes für Glitch-Effekte und sanfte Übergänge (Transitions).

DOM-Manipulation: Effiziente Updates des DOMs ohne Virtual DOM, für rohe Performance.

💻 Installation & Setup
Befolge diese Schritte, um eine lokale Entwicklungsinstanz zu starten.

Voraussetzungen
Node.js (v14 oder höher)

npm (Node Package Manager)

Schritt-für-Schritt
Repository klonen:

Bash
git clone https://github.com/DEIN-USERNAME/quizlino.git
cd quizlino
Abhängigkeiten installieren:

Bash
npm install
Umgebungsvariablen konfigurieren (.env): Erstelle eine .env Datei im Hauptverzeichnis:

Code-Snippet
PORT=3000
JWT_SECRET=DeinGeheimesSuperToken123
ADMIN_PASSWORD_HASH=DerBcryptHashDeinesPassworts
# Optional: Fester Admin Pfad (sonst zufällig)
# ADMIN_PANEL_PATH=/secret-admin
Server starten:

Bash
node server.js
Die Konsole zeigt dir nun den generierten Admin-Link an.

Öffnen: Gehe im Browser auf http://localhost:3000.

🛡️ Admin-Panel & Moderation
Quizlino verfügt über ein verstecktes, leistungsstarkes Admin-Dashboard (admin.html, admin.js), das über ein JWT-Token gesichert ist.

Funktionen des Dashboards:
Live Chat Spy: Administratoren können Chat-Nachrichten in allen Räumen in Echtzeit mitlesen (Monitoring).

Wartungsmodus: Per Knopfdruck kann der Server in den Wartungsmodus versetzt werden (Global Broadcast an alle Clients).

Blacklist Management: Dynamisches Entfernen von verbotenen Wörtern aus dem Filter.

User Reports: Einsicht in gemeldete Spieler und Verstöße.

🔒 Sicherheit & Anti-Cheat
Fairness ist oberstes Gebot. Quizlino implementiert mehrere Schutzschichten:

Clipboard Hijacking (Anti-Paste): Versucht ein Spieler Text zu kopieren (um zu googeln), wird die Zwischenablage automatisch mit Unsinn überschrieben:

"Hier wird nicht geschummelt!", "Quizlino Security Protocol Active"

Input Sanitization: Alle User-Inputs werden durch safeSanitize (DOMPurify oder Regex-Fallback) gereinigt, um XSS (Cross-Site Scripting) zu verhindern.

Decoy-Detection: Erkennung von Mausbewegungen, um Bots oder Skripte zu identifizieren.

Socket Rate Limiting: Verhindert DoS-Attacken durch zu viele Anfragen pro Sekunde von einem Client.

📂 Projektstruktur
Plaintext
quizlino/
├── assets/                 # Bilder, Audio (Jumpscares, Coins, etc.)
├── admin.html              # Das Admin-Panel Interface
├── admin.js                # Logik für das Admin-Dashboard
├── admin.css               # Styling für das Admin-Dashboard
├── app.js                  # Haupt-Client-Logik (Spiel, Socket, UI)
├── index.html              # Hauptseite (Lobby & Spielbereich)
├── server.js               # Node.js Server & Socket.io Backend
├── style.css               # Globales Stylesheet
└── package.json            # Abhängigkeiten & Skripte
🤝 Contributing
Beiträge sind willkommen! Bitte erstelle einen Fork, führe deine Änderungen durch und sende einen Pull Request.

Fork das Projekt

Erstelle deinen Feature Branch (git checkout -b feature/AmazingFeature)

Commit deine Änderungen (git commit -m 'Add some AmazingFeature')

Push auf den Branch (git push origin feature/AmazingFeature)

Öffne einen Pull Request

Credits
Entwickelt mit ❤️ und viel Koffein. Icons powered by Google Material Icons. Fonts via Google Fonts (Rajdhani, Roboto Mono).

© 2026 Quizlino Project. All Rights Reserved.
