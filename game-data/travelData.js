const travelData = {
    destinations: {
        'paris': { id: 'paris', name: 'Paris, Frankreich', region: 'Europa', duration: 4 * 60 * 60 * 1000, cost: 50, level: 1, icon: '🗼' },
        'rome': { id: 'rome', name: 'Rom, Italien', region: 'Europa', duration: 5 * 60 * 60 * 1000, cost: 60, level: 2, icon: '🏛️' },
        'berlin': { id: 'berlin', name: 'Berlin, Deutschland', region: 'Europa', duration: 3.5 * 60 * 60 * 1000, cost: 145, level: 2, icon: '🕍' },
        'madrid': { id: 'madrid', name: 'Madrid, Spanien', region: 'Europa', duration: 4.5 * 60 * 60 * 1000, cost: 255, level: 3, icon: '🏰' },
        'london': { id: 'london', name: 'London, Vereinigtes Königreich', region: 'Europa', duration: 4 * 60 * 60 * 1000, cost: 265, level: 3, icon: '🎡' },
        'amsterdam': { id: 'amsterdam', name: 'Amsterdam, Niederlande', region: 'Europa', duration: 3 * 60 * 60 * 1000, cost: 150, level: 2, icon: '🚲' },
        'zurich': { id: 'zurich', name: 'Zürich, Schweiz', region: 'Europa', duration: 3 * 60 * 60 * 1000, cost: 28000, level: 20, icon: '🏔️' },
        'st_petersburg': { id: 'st_petersburg', name: 'Sankt Petersburg, Russland', region: 'Europa', duration: 5.5 * 60 * 60 * 1000, cost: 795, level: 8, icon: '🎨' },
        'tokyo': { id: 'tokyo', name: 'Tokio, Japan', region: 'Asien', duration: 8 * 60 * 60 * 1000, cost: 300, level: 3, icon: '🌸' },
        'beijing': { id: 'beijing', name: 'Peking, China', region: 'Asien', duration: 8.5 * 60 * 60 * 1000, cost: 395, level: 4, icon: '🐉' },
        'bangkok': { id: 'bangkok', name: 'Bangkok, Thailand', region: 'Asien', duration: 9 * 60 * 60 * 1000, cost: 490, level: 4, icon: '🕌' },
        'seoul': { id: 'seoul', name: 'Seoul, Südkorea', region: 'Asien', duration: 8 * 60 * 60 * 1000, cost: 485, level: 5, icon: '🧧' },
        'singapore': { id: 'singapore', name: 'Singapur', region: 'Asien', duration: 10 * 60 * 60 * 1000, cost: 110, level: 3, icon: '🌆' },
        'mumbai': { id: 'mumbai', name: 'Mumbai, Indien', region: 'Asien', duration: 7 * 60 * 60 * 1000, cost: 580, level: 5, icon: '🎋' },
        'moscow': { id: 'moscow', name: 'Moskau, Russland', region: 'Asien', duration: 6 * 60 * 60 * 1000, cost: 520, level: 7, icon: '🏰' },
        'cairo': { id: 'cairo', name: 'Kairo, Ägypten', region: 'Afrika', duration: 6 * 60 * 60 * 1000, cost: 575, level: 5, icon: '🏺' },
        'nairobi': { id: 'nairobi', name: 'Nairobi, Kenia', region: 'Afrika', duration: 9 * 60 * 60 * 1000, cost: 395, level: 5, icon: '🦁' },
        'cape_town': { id: 'cape_town', name: 'Kapstadt, Südafrika', region: 'Afrika', duration: 11 * 60 * 60 * 1000, cost: 710, level: 8, icon: '⛰️' },
        'marrakesh': { id: 'marrakesh', name: 'Marrakesch, Marokko', region: 'Afrika', duration: 7 * 60 * 60 * 1000, cost: 685, level: 8, icon: '🕌' },
        'lagos': { id: 'lagos', name: 'Lagos, Nigeria', region: 'Afrika', duration: 8 * 60 * 60 * 1000, cost: 890, level: 9, icon: '🏝️' },
        'rio': { id: 'rio', name: 'Rio de Janeiro, Brasilien', region: 'Südamerika', duration: 12 * 60 * 60 * 1000, cost: 950, level: 8, icon: '🏞️' },
        'lima': { id: 'lima', name: 'Lima, Peru', region: 'Südamerika', duration: 11 * 60 * 60 * 1000, cost: 440, level: 7, icon: '🦙' },
        'buenos_aires': { id: 'buenos_aires', name: 'Buenos Aires, Argentinien', region: 'Südamerika', duration: 13 * 60 * 60 * 1000, cost: 955, level: 9, icon: '💃' },
        'bogota': { id: 'bogota', name: 'Bogotá, Kolumbien', region: 'Südamerika', duration: 12 * 60 * 60 * 1000, cost: 335, level: 7, icon: '☕' },
        'santiago': { id: 'santiago', name: 'Santiago, Chile', region: 'Südamerika', duration: 13 * 60 * 60 * 1000, cost: 745, level: 8, icon: '🏔️' },
        'new_york': { id: 'new_york', name: 'New York, USA', region: 'Nordamerika', duration: 9 * 60 * 60 * 1000, cost: 490, level: 9, icon: '🗽' },
        'los_angeles': { id: 'los_angeles', name: 'Los Angeles, USA', region: 'Nordamerika', duration: 10 * 60 * 60 * 1000, cost: 1125, level: 14, icon: '🎬' },
        'toronto': { id: 'toronto', name: 'Toronto, Kanada', region: 'Nordamerika', duration: 9 * 60 * 60 * 1000, cost: 415, level: 6, icon: '🍁' },
        'mexico_city': { id: 'mexico_city', name: 'Mexiko-Stadt, Mexiko', region: 'Nordamerika', duration: 11 * 60 * 60 * 1000, cost: 380, level: 7, icon: '🌮' },
        'las_vegas': { id: 'las_vegas', name: 'Las Vegas, USA', region: 'Nordamerika', duration: 10 * 60 * 60 * 1000, cost: 540, level: 9, icon: '🎰' },
        'sydney': { id: 'sydney', name: 'Sydney, Australien', region: 'Ozeanien', duration: 10 * 60 * 60 * 1000, cost: 620, level: 10, icon: '🌉' },
        'melbourne': { id: 'melbourne', name: 'Melbourne, Australien', region: 'Ozeanien', duration: 11 * 60 * 60 * 1000, cost: 725, level: 10, icon: '🎭' },
        'auckland': { id: 'auckland', name: 'Auckland, Neuseeland', region: 'Ozeanien', duration: 11 * 60 * 60 * 1000, cost: 730, level: 10, icon: '🏔️' },
        'fiji': { id: 'fiji', name: 'Fidschi-Inseln', region: 'Ozeanien', duration: 12 * 60 * 60 * 1000, cost: 1140, level: 11, icon: '🏝️' },
        'dubai': { id: 'dubai', name: 'Dubai, Vereinigte Arabische Emirate', region: 'Mittlerer Osten', duration: 7 * 60 * 60 * 1000, cost: 3495, level: 13, icon: '🏙️' },
        'istanbul': { id: 'istanbul', name: 'Istanbul, Türkei', region: 'Mittlerer Osten', duration: 5 * 60 * 60 * 1000, cost: 280, level: 4, icon: '🕌' },
        'doha': { id: 'doha', name: 'Doha, Katar', region: 'Mittlerer Osten', duration: 6 * 60 * 60 * 1000, cost: 385, level: 5, icon: '🏗️' },
        'reykjavik': { id: 'reykjavik', name: 'Reykjavík, Island', region: 'Arktis', duration: 5 * 60 * 60 * 1000, cost: 970, level: 5, icon: '❄️' },
        'longyearbyen': { id: 'longyearbyen', name: 'Longyearbyen, Spitzbergen', region: 'Arktis', duration: 6 * 60 * 60 * 1000, cost: 485, level: 7, icon: '🧊' }
    },

souvenirs: {
    'europa': [
        { id: 'souvenir_eiffel', name: 'Eiffelturm-Miniatur', icon: 'europa/eiffel_tower.png' },
        { id: 'souvenir_mona', name: 'Mona Lisa Postkarte', icon: 'europa/mona_lisa_postcard.png' },
        { id: 'souvenir_colosseum', name: 'Mini-Kolosseum', icon: 'europa/colosseum.png' },
        { id: 'souvenir_crown', name: 'Königskrone', icon: 'europa/crown.png' },
        { id: 'souvenir_bierstein', name: 'Bierkrug', icon: 'europa/beerstein.png' },
        { id: 'souvenir_tulip', name: 'Tulpenzwiebel', icon: 'europa/tulip.png' },
        { id: 'souvenir_clog', name: 'Holzschuh aus Amsterdam', icon: 'europa/clog.png' },
        { id: 'souvenir_fan_madrid', name: 'Spanischer Fächer', icon: 'europa/spanish_fan.png' },
        { id: 'souvenir_paella', name: 'Paella-Pfännchen', icon: 'europa/paella_pan.png' },
        { id: 'souvenir_berlinbear', name: 'Berliner Bär-Figur', icon: 'europa/berlin_bear.png' },
        { id: 'souvenir_zurich_chocolate', name: 'Schweizer Schokolade', icon: 'europa/swiss_chocolate.png' },
        { id: 'souvenir_stpetersburg_matryoshka', name: 'Matroschka-Puppe', icon: 'europa/matryoshka.png' }
    ],

    'asien': [
        { id: 'souvenir_maneki', name: 'Maneki-neko Katze', icon: 'asien/maneki_neko.png' },
        { id: 'souvenir_sakura', name: 'Kirschblüten-Samen', icon: 'asien/sakura.png' },
        { id: 'souvenir_lantern', name: 'Rote Papierlaterne', icon: 'asien/lantern.png' },
        { id: 'souvenir_dragon', name: 'Drachenfigur', icon: 'asien/dragon.png' },
        { id: 'souvenir_tea', name: 'Grüner Tee', icon: 'asien/tea.png' },
        { id: 'souvenir_kimchi', name: 'Kimchi-Glas', icon: 'asien/kimchi_jar.png' },
        { id: 'souvenir_hanbok', name: 'Mini-Hanbok', icon: 'asien/hanbok.png' },
        { id: 'souvenir_merlion', name: 'Mini-Merlion', icon: 'asien/merlion.png' },
        { id: 'souvenir_orchid', name: 'Orchideen-Seife', icon: 'asien/orchid_soap.png' },
        { id: 'souvenir_elephant', name: 'Mini-Elefantenfigur', icon: 'asien/elephant.png' },
        { id: 'souvenir_tuk', name: 'Tuk-Tuk-Modell', icon: 'asien/tuk_tuk.png' },
        { id: 'souvenir_batik', name: 'Batik-Tuch', icon: 'asien/batik.png' },
        { id: 'souvenir_gtr', name: 'Nissan GT-R Modellauto', icon: 'asien/gtr_model.png' },
        { id: 'souvenir_moscow_kremlin', name: 'Mini-Kreml', icon: 'asien/kremlin.png' }
    ],

    'afrika': [
        { id: 'souvenir_mask', name: 'Traditionelle Maske', icon: 'afrika/mask.png' },
        { id: 'souvenir_pyramid', name: 'Pyramidenmodell', icon: 'afrika/pyramid.png' },
        { id: 'souvenir_drum', name: 'Djembe-Trommel', icon: 'afrika/drum.png' },
        { id: 'souvenir_scarab', name: 'Skarabäus-Amulett', icon: 'afrika/scarab.png' },
        { id: 'souvenir_maasai', name: 'Maasai-Perlenarmband', icon: 'afrika/maasai_bracelet.png' },
        { id: 'souvenir_safarihat', name: 'Safarihut', icon: 'afrika/safari_hat.png' },
        { id: 'souvenir_coffee_kenya', name: 'Kenia-Kaffee', icon: 'afrika/kenya_coffee.png' },
        { id: 'souvenir_lion', name: 'Löwen-Schnitzfigur', icon: 'afrika/lion_figure.png' }
    ],

    'südamerika': [
        { id: 'souvenir_llama', name: 'Lama-Plüsch', icon: 'suedamerika/llama.png' },
        { id: 'souvenir_pan_flute', name: 'Panflöte', icon: 'suedamerika/pan_flute.png' },
        { id: 'souvenir_carnival', name: 'Karnevalsmaske', icon: 'suedamerika/carnival_mask.png' },
        { id: 'souvenir_coffee', name: 'Kaffeebohnen', icon: 'suedamerika/coffee.png' },
        { id: 'souvenir_hat', name: 'Panama-Hut', icon: 'suedamerika/panama_hat.png' },
        { id: 'souvenir_mate', name: 'Mate-Becher', icon: 'suedamerika/mate_cup.png' },
        { id: 'souvenir_condor', name: 'Anden-Kondor-Figur', icon: 'suedamerika/condor.png' },
        { id: 'souvenir_chili', name: 'Chili-Anhänger', icon: 'suedamerika/chili.png' }
    ],

    'nordamerika': [
        { id: 'souvenir_statue', name: 'Freiheitsstatue-Miniatur', icon: 'nordamerika/statue.png' },
        { id: 'souvenir_hotdog', name: 'Hotdog', icon: 'nordamerika/hotdog.png' },
        { id: 'souvenir_dollar', name: 'Dollar-Münze', icon: 'nordamerika/dollar.png' },
        { id: 'souvenir_cowboy', name: 'Cowboyhut', icon: 'nordamerika/cowboy_hat.png' },
        { id: 'souvenir_filmreel', name: 'Filmrolle aus Hollywood', icon: 'nordamerika/film_reel.png' },
        { id: 'souvenir_casinochip', name: 'Casino-Chip aus Las Vegas', icon: 'nordamerika/casino_chip.png' },
        { id: 'souvenir_surfboard', name: 'Mini-Surfbrett', icon: 'nordamerika/surfboard.png' },
        { id: 'souvenir_burger', name: 'Mini-Burger-Anhänger', icon: 'nordamerika/burger.png' }
    ],

    'ozeanien': [
        { id: 'souvenir_boome', name: 'Bumerang', icon: 'ozeanien/boomerang.png' },
        { id: 'souvenir_shell', name: 'Muschel-Kette', icon: 'ozeanien/shell_necklace.png' },
        { id: 'souvenir_tiki', name: 'Tiki-Skulptur', icon: 'ozeanien/tiki.png' },
        { id: 'souvenir_kiwi', name: 'Kiwi-Figur', icon: 'ozeanien/kiwi.png' },
        { id: 'souvenir_opal', name: 'Opal-Stein', icon: 'ozeanien/opal.png' },
        { id: 'souvenir_surf', name: 'Mini-Surfbrett', icon: 'ozeanien/surfboard.png' },
        { id: 'souvenir_kava', name: 'Kava-Schale', icon: 'ozeanien/kava_bowl.png' },
        { id: 'souvenir_coral', name: 'Korallenstück', icon: 'ozeanien/coral.png' }
    ],

    'arktis': [
        { id: 'souvenir_ice', name: 'Eiswürfel-Skulptur', icon: 'arktis/ice_sculpture.png' },
        { id: 'souvenir_polarbear', name: 'Eisbär-Figur', icon: 'arktis/polar_bear.png' },
        { id: 'souvenir_woolhat', name: 'Wollmütze', icon: 'arktis/wool_hat.png' },
        { id: 'souvenir_snowglobe', name: 'Schneekugel von Spitzbergen', icon: 'arktis/snowglobe.png' },
        { id: 'souvenir_northstar', name: 'Nordstern-Anhänger', icon: 'arktis/north_star.png' }
    ],

    'mittlerer osten': [
        { id: 'souvenir_dhow', name: 'Dhow-Schiffsmodell', icon: 'naher_osten/dhow.png' },
        { id: 'souvenir_spice', name: 'Gewürzmischung aus dem Souk', icon: 'naher_osten/spices.png' },
        { id: 'souvenir_falcon', name: 'Falkenfigur', icon: 'naher_osten/falcon.png' },
        { id: 'souvenir_gold', name: 'Goldener Anhänger aus Doha', icon: 'naher_osten/gold.png' }
    ]
},

sets: {
    'Europa-Entdecker': { region: 'europa', bonus: 500 },
    'Asien-Abenteurer': { region: 'asien', bonus: 750 },
    'Afrika-Forscher': { region: 'afrika', bonus: 600 },
    'Südamerika-Spezialist': { region: 'südamerika', bonus: 1000 },
    'Nordamerika-Entdecker': { region: 'nordamerika', bonus: 900 },
    'Ozeanien-Experte': { region: 'ozeanien', bonus: 850 },
    'Arktis-Pionier': { region: 'arktis', bonus: 700 },
    'Nahost-Entdecker': { region: 'mittlerer osten', bonus: 800 }
}
};

module.exports = travelData;