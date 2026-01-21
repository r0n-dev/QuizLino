const chaosEvents = {
    reverseScoring: { 
        id: 'reverseScoring', 
        name: 'Umgekehrte Wertung', 
        description: 'Richtige ████ geben Minuspunkte, █████ Pluspunkte!' 
    },
    speedyRound: { 
        id: 'speedyRound', 
        name: 'Turbo-Runde', 
        description: 'Die █████zeit wird ████.' 
    },
    swapScores: { 
        id: 'swapScores', 
        name: 'Punkte-Tausch', 
        description: 'Zwei zufällige ██████ █████ ihre ██████████!' 
    },
    randomPoints: { 
        id: 'randomPoints', 
        name: 'Punkte-Lotterie', 
        description: 'Die █████ werden ███████ ██████!' 
    },
    vampireRound: { 
        id: 'vampireRound', 
        name: 'Vampir-Runde', 
        description: 'Richtige ███████ stehlen █████ von ██████ mit ███████ ███████!' 
    },
    mirroredInput: { 
        id: 'mirroredInput', 
        name: 'Gespiegelte Eingabe', 
        description: 'Dein ███████ ist █████ und schreibt ████████████.' 
    },
    categoryMix: { 
        id: 'categoryMix', 
        name: 'Kategorien-Mix', 
        description: 'Die ███████ Kategorie wird ███████ und eine ███████ Frage ██████.' 
    },
    bountyHunt: { 
        id: 'bountyHunt', 
        name: 'Kopfgeldjagd', 
        description: 'Auf den ████████ wird sofort ein ████████ █████████!' 
    },
    backwardsRound: { 
        id: 'backwardsRound', 
        name: 'Rückwärts-Runde', 
        description: 'Eure ██████ ist ████████ UND █████████. ████ ████!' 
    },
    minimalistRound: { 
        id: 'minimalistRound', 
        name: 'Minimalisten-Runde', 
        description: 'Die ██████████████ wird █████████. Nur der █████ bleibt!' 
    },
    teamBetrayal: { 
        id: 'teamBetrayal', 
        name: 'Team-Verrat', 
        description: 'Im ████-████ geben █████ ███████ ██████ dem ██████ ██████!' 
    },
    oneWordOnly: { 
        id: 'oneWordOnly', 
        name: 'Ein-Wort-Limit', 
        description: 'Eure █████ darf nur aus einem ███████ Wort bestehen.' 
    },
    giftFromAbove: { 
        id: 'giftFromAbove', 
        name: 'Geschenk des Himmels', 
        description: 'Ein ████████ Spieler, der ████ auf Platz █ ist, █████ einen ███████ ███████████ ███ ████!' 
    },
    loyaltyTest: { 
        id: 'loyaltyTest', 
        name: 'Loyalitäts-Test', 
        description: 'Alle █████ mit 0 oder ██████ ███████ ████████ einen █████ von ███ Punkten.' 
    },
    bountySwap: { 
        id: 'bountySwap', 
        name: 'Kopfgeld-Tausch', 
        description: 'Wenn ein ███████ █████ ist, wird es auf einen ███████ ██████ Spieler ██████████.' 
    },
    mimic: { 
        id: 'mimic', 
        name: 'Nachahmer', 
        description: 'Wer die █████ (██████) █████ gibt wie ein ███████ █████, ██████ trotzdem ████████.' 
    },
    digitalStorm: { 
        id: 'digitalStorm', 
        name: 'Digitaler Sturm', 
        description: 'Ein ████████! Die █████ ist in einem █████ aus ████████ █████████ ███████.' 
    },
    verschwörung: { 
        id: 'verschwörung', 
        name: 'Verschwörung', 
        description: 'Zwei ██████ werden zu ████████ █████████. Antworten █████ ███████, gibt es einen █████-Bonus!' 
    },
    coinToss: { 
        id: 'coinToss', 
        name: 'Münzwurf', 
        description: 'Jeder █████ hat eine ██/██ █████, ██████ ██████████ zu █████████ – oder zu ████████.' 
    },
    allVsOne: { 
        id: 'allVsOne', 
        name: 'Alle gegen Einen', 
        description: 'Der ██████ mit den ██████ ██████ wird das ████ – alle ███████ ██████ ███████, wenn sie ██████ ███████ und er ████.' 
    },
    popupWahnsinn: { 
        id: 'popupWahnsinn', 
        name: 'Pop-up-Wahnsinn', 
        description: '█████████ pur! Dein ████████ wird mit ████████ ████-██████ geflutet, die ████ ███████████ auf eine █████ █████ ██████.' 
    },
    tastenChaos: { 
        id: 'tastenChaos', 
        name: 'Tasten-Chaos', 
        description: 'Dein ███████ und deine ████ spielen ███████! █████ sind ████████ und die ███████ ████████. ████ Chaos!' 
    },
    randomLanguage: { 
        id: 'randomLanguage', 
        name: 'Sprach-Wirrwarr', 
        description: '████████! Die █████ wird in einer ████████, ██████████ Sprache █████████.' 
    },
    decoyAnswer: { 
        id: 'decoyAnswer', 
        name: 'Lockvogel-Antwort', 
        description: 'Ein ████████ ████ zeigt eine ███████ Antwort ███, ██████ mir :)!' 
    },
    discoTime: { 
        id: 'discoTime', 
        name: 'Disco Time!', 
        description: 'Der ████████ wird zur ████████! ████-██████ und █████ █████ deine ████████████.' 
    },
    mirroredScreen: { 
        id: 'mirroredScreen', 
        name: 'Spiegelverkehrt', 
        description: 'Alles ist █████ █████! Der ███████ ███████ ist ███████████ ████████.' 
    },
    securityCheck: { 
        id: 'securityCheck', 
        name: 'Sicherheits-Check 🤖', 
        description: '████ vor dem ████████ ein ███████ ██████.' 
    },
    autocorrectCurse: { 
        id: 'autocorrectCurse', 
        name: 'Fluch des Autokorrektors ✍️', 
        description: 'Deine ███████ wird durch ████████, █████████ Wörter ██████████.' 
    },
    threeDGlasses: { 
        id: 'threeDGlasses', 
        name: '3D-Brillen-Modus', 
        description: 'Alles █████ wie ein ████ 3D-████ ohne █████ – ██████ und █████████.' 
    },
    ufoAbduction: { 
        id: 'ufoAbduction', 
        name: 'UFO-Entführung', 
        description: 'Ein ████ des ████████ wird von einem ███-██████ „████████“. ██████ dabei ███████ █████? ████ █████.' 
    },
    pixelPanic: { 
        id: 'pixelPanic', 
        name: 'Pixel-Panik', 
        description: 'Dein ████████ wird in █████ █████████ verwandelt, wie ein ████ aus den ██ern. Die █████ ist noch ██████… ██████.' 
    },
    jumpscare: { 
        id: 'jumpscare', 
        name: 'Jumpscare!', 
        description: 'Ein ████████ ████ für 5 ███████!' 
    },
    ohrenzerstoerer: { 
        id: 'ohrenzerstoerer', 
        name: 'Ohrenzerstörer', 
        description: 'Eine ███████████ ████████████ für █████ █████.' 
    },
    pikaSqueak: { 
        id: 'pikaSqueak', 
        name: 'Pika-Fluch', 
        description: 'Jeder ██████████ im ██████████ macht ein... ███████.' 
    },
    lagMonster: { 
        id: 'lagMonster', 
        name: 'Lag-Monster', 
        description: 'Alles reagiert verzögert, Eingaben tauchen verspätet auf – absolutes Chaos.' 
    },
    imposter: { 
        id: 'imposter', 
        name: 'Der Hochstapler', 
        description: 'Ein „falscher Spieler“ taucht im Chat auf und schreibt zufällige Antworten unter dem Namen eines echten Teilnehmers.' 
    },
};

module.exports = chaosEvents;