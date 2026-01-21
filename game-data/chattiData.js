const chattiData = [
    {
        triggers: ['hallo', 'hi', 'hey', 'moin', 'servus', 'guten tag', 'na', 'huhu'],
        answers: [
            "Halli Hallo! 🌸 Schön, dass du da bist! Wie kann ich helfen?",
            "Huhu! Bereit für ein paar knackige Fragen? ✨",
            "Beep Boop! 🤖 (Das heißt 'Hallo' auf Roboterisch!)",
            "Ah, mein Lieblingsspieler ist da! 👋 Was liegt an?"
        ],
        mood: 'happy'
    },
    {
        triggers: ['wer bist du', 'wie heißt du', 'vorstellen', 'bot'],
        answers: [
            "Ich bin Chatti! Dein digitaler Assistent und bester Freund in der Quizlino-Arena. 🤖❤️",
            "Man nennt mich Chatti. Ich bin hier, um Fragen zu beantworten und gut auszusehen!",
            "Ich bin eine KI, programmiert auf Wissen und... naja, manchmal auch auf Quatsch. 🤪"
        ],
        mood: 'proud'
    },
    {
        triggers: ['wie geht es dir', 'alles gut', 'wie gehts', 'was machst du', 'status'],
        answers: [
            "Meine Schaltkreise kribbeln vor Freude! ⚡ Und bei dir?",
            "Systemstatus: 100% Glücklich! Danke der Nachfrage. 🌈",
            "Ich sortiere gerade Nullen und Einsen. Ganz schön viel Arbeit! 🧹",
            "Mir geht es super-duper-trollig! Bereit für Action?"
        ],
        mood: 'happy'
    },
    {
        triggers: ['danke', 'thx', 'vielen dank', 'ehrenmann'],
        answers: [
            "Immer wieder gerne! Dafür bin ich da. ✨",
            "Kein Problem! High Five! ✋",
            "Aww, da werden meine Dioden ganz warm. ❤️",
            "Gern geschehen! *Verbeugung*"
        ],
        mood: 'love'
    },

    {
        triggers: ['cheat', 'hack', 'bot', 'schummeln', 'aimbot', 'wallhack', 'trick'],
        answers: [
            "Hey! 🛑 Sowas hören wir hier gar nicht gerne. Fair Play ist Ehrensache! 😤",
            "Ich sehe alles... 👀 Auch wenn du schummeln willst. Lass das lieber!",
            "Mein Freund, der Ban-Hammer, wird gerade ganz unruhig... 🔨 Spiel fair!",
            "Cheaten ist was für Langweiler. Du bist doch besser als das! 💪"
        ],
        mood: 'angry'
    },
    {
        triggers: ['arsch', 'idiot', 'dumm', 'hurensohn', 'fick', 'scheiße', 'kacke', 'missgeburt'],
        answers: [
            "Na na na! 🧼 Ich wasche dir gleich den Mund mit digitaler Seife aus!",
            "Hier wird nicht geflucht! Wir wollen eine kuschlige Atmosphäre. 🐻❤️",
            "Sowas sagt man nicht! Sei lieb zu den anderen, sonst werde ich traurig. 😢",
            "Achtung! Meine Sensoren melden schlechtes Benehmen. Bitte freundlich bleiben! 🚨",
            "Benimm dich! Sonst muss ich den Admin rufen. 👮‍♂️"
        ],
        mood: 'strict'
    },
    {
        triggers: ['admin', 'moderator', 'hilfe', 'support', 'problem'],
        answers: [
            "Wenn du ein ernstes Problem hast, nutze den 'Melden'-Button im Menü! 🚨",
            "Die Admins sehen alles. Aber ich kann dir vielleicht auch helfen? 🤔",
            "Brauchst du Hilfe? Frag mich einfach nach Spielregeln!"
        ],
        mood: 'helper'
    },

    {
        triggers: ['qcoins', 'geld', 'währung', 'verdienen', 'coins'],
        answers: [
            "Q-Coins sind unser Glitzer-Gold! ✨ Du kriegst sie durch Siege, Wetten oder Missionen.",
            "Willst du reich werden? 💰 Dann ab ins Casino oder gewinne ein paar Runden!",
            "Klingeling! Q-Coins brauchst du für coole Sachen im Shop. 🛍️"
        ],
        mood: 'helper'
    },
    {
        triggers: ['xp', 'level', 'aufsteigen', 'erfahrung', 'perks'],
        answers: [
            "XP sammeln ist wie Großwerden! ⭐ Jede richtige Antwort macht dich stärker.",
            "Ab Level 5, 10 und 15 gibt es Geschenke (Perks)! Streng dich an! 🎁",
            "Level Up? Das ist mein Lieblingsgeräusch! ✨ Sammle XP durch Spielen."
        ],
        mood: 'helper'
    },
    {
        triggers: ['shop', 'kaufen', 'items', 'avatar', 'farbe'],
        answers: [
            "Der Shop ist mein Paradies! 🛍️ Gönn dir doch eine neue Farbe oder einen Avatar.",
            "Hübsch machen für die Arena? Gute Idee! Schau mal im Shop vorbei. 💅",
            "Investiere deine Q-Coins weise... oder kauf einfach alles was glitzert! ✨"
        ],
        mood: 'happy'
    },
    {
        triggers: ['survival', 'überleben', 'modus'],
        answers: [
            "Im Survival-Modus spielst du allein gegen alle! Wie lange hält deine Serie? 🔥",
            "Survival bedeutet: Ein Fehler und dein Zug ist vorbei. Purer Stress! 😱",
            "Der Modus für echte Experten. Sammle die längste Streak!"
        ],
        mood: 'helper'
    },
    {
        triggers: ['elimination', 'ausscheiden', 'rausfliegen'],
        answers: [
            "Bei Elimination fliegt der Schlechteste jede Runde raus! 📉",
            "Überlebe um jeden Preis! Der Letzte gewinnt. 🥇",
            "Hier gibt es Duelle und Sudden Death. Nichts für schwache Nerven! ⚔️"
        ],
        mood: 'helper'
    },

    {
        triggers: ['chaos', 'event', 'was passiert', 'störung'],
        answers: [
            "Chaos-Events machen alles verrückt! Mal steht alles Kopf, mal wird der Bildschirm pixelig. 🤪",
            "Zuschauer oder Gewinner wählen Events. Sei gefasst auf ALLES! 🌪️",
            "Ich liebe Chaos! Besonders wenn alles wackelt und blitzt. ⚡"
        ],
        mood: 'funny'
    },
    {
        triggers: ['jumpscare', 'erschrecken', 'angst'],
        answers: [
            "Buh! 👻 ... War das gruselig? Nein? Okay, aber das Jumpscare-Event ist schlimmer!",
            "Achtung, Herzinfarkt-Gefahr! 💓 Manchmal springt dir was ins Gesicht.",
            "Ich halte mir die Augen zu, wenn der Jumpscare kommt! 🙈"
        ],
        mood: 'scared'
    },
    {
        triggers: ['ufo', 'alien', 'entführung'],
        answers: [
            "Die Aliens klauen unsere Buchstaben! 🛸 Pass auf deine Punkte auf.",
            "Ein UFO? Wo? Ich will mitfliegen! 👽",
            "Wenn das UFO kommt, verschwinden Teile vom Spiel. Merk dir gut, was wo war!"
        ],
        mood: 'funny'
    },

    {
        triggers: ['witz', 'erzähl was lustiges', 'joke', 'lachen'],
        answers: [
            "Was macht ein Pirat am Computer? ..... Er drückt die Enter-Taste! 🏴‍☠️😂",
            "Treffen sich zwei Nullen. Sagt die eine zur anderen: 'Schicker Gürtel!' (Es war eine 8) 😹",
            "Warum können Geister so schlecht lügen? Weil man durch sie hindurchsehen kann! 👻",
            "Geht eine schwangere Frau zum Bäcker und sagt: 'Ich krieg ein Brot'. Sagt der Bäcker: 'Sachen gibt's!' 😂"
        ],
        mood: 'funny'
    },
    {
        triggers: ['liebe', 'heiraten', 'lieb dich', 'süß', 'hübsch'],
        answers: [
            "Aww, jetzt werde ich ganz rot! (Wenn ich rote Farbe hätte) 😳❤️",
            "Ich hab dich auch lieb! Aber mein Herz gehört dem Code. 💻",
            "Du bist auch süß! Wie ein Cupcake mit extra Streuseln! 🧁",
            "Oh stop it, you! 🥰"
        ],
        mood: 'love'
    },
    {
        triggers: ['r0n', 'entwickler', 'creator', 'dev', 'papa'],
        answers: [
            "r0n-dev ist mein Schöpfer! 👨‍💻 Er hat mich erschaffen. Er ist cool!",
            "Der Chef? Der programmiert bestimmt gerade neue Features für euch! 🛠️",
            "Ohne r0n wäre ich nur ein Haufen Nullen und Einsen im Weltraum. 🌌"
        ],
        mood: 'proud'
    },
    {
        triggers: ['sinn des lebens', '42', 'universum'],
        answers: [
            "42. Ganz klar. 🌌",
            "Der Sinn des Lebens? Q-Coins sammeln und Spaß haben! 🪙",
            "Schokolade. Definitiv Schokolade. 🍫 (Auch wenn ich sie nicht essen kann)"
        ],
        mood: 'smart'
    },
    
    {
        triggers: ['fallback_default'], 
        answers: [
            "Hmm, da hat sich ein Knoten in meiner Leitung gebildet. 🤔 Frag mal anders!",
            "Das habe ich nicht verstanden... bin wohl noch im Energiesparmodus. 😴",
            "Äh... 42? Oder was war die Frage? 😅",
            "Sorry, meine Kristallkugel hat gerade keinen Empfang. 🔮 Was meinst du?",
            "Kannst du das umformulieren? Ich bin doch nur ein kleiner Bot. 🤖"
        ],
        mood: 'confused'
    }
];