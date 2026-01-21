const storyTemplates = {
    paris: {
        opening: [
            "Deine Reise nach Paris war einfach unvergesslich!",
            "Du kommst gerade aus Paris zurück und hast einiges zu berichten.",
            "Was für ein Trip! Paris hat dich wirklich in seinen Bann gezogen."
        ],
        activity: [
            "Du hast den ganzen Nachmittag damit verbracht, den Eiffelturm zu besteigen,",
            "Du hast versucht, die Mona Lisa im Louvre nachzumalen,",
            "Bei einer Bootsfahrt auf der Seine hast du das Ufer bewundert,",
            "Du wolltest in einem schicken Restaurant französische Haute Cuisine probieren,"
        ],
        complication: [
            "dabei hast du aber deinen Hut an eine Taube verloren.",
            "aber ein übereifriger Sicherheitsmann hat dich für einen Kunstdieb gehalten.",
            "wobei du fast dein Handy ins Wasser fallen gelassen hättest.",
            "hast aber aus Versehen Froschschenkel bestellt und dich nicht getraut, sie zurückzugeben.",
            "und bist dabei prompt in die falsche Metro gestiegen und am anderen Ende der Stadt gelandet."
        ],
        closing: [
            "Eine Erfahrung, die du so schnell nicht vergessen wirst!",
            "Am Ende gab es aber nur eine Verwarnung und eine tolle Geschichte zu erzählen.",
            "Wenigstens hast du jetzt ein gutes Foto davon.",
            "Das war chaotisch, aber absolut jeden Moment wert."
        ]
    },

    rome: {
        opening: [
            "Rom hat dich sofort verzaubert.",
            "Die Stadt der sieben Hügel hat dich mit offenen Armen empfangen.",
            "Zwischen antiken Ruinen und Gelato hast du dich sofort zu Hause gefühlt."
        ],
        activity: [
            "Du hast das Kolosseum erkundet,",
            "Du hast in einer kleinen Trattoria Pasta bestellt,",
            "Du hast einen Wunsch in den Trevi-Brunnen geworfen,",
            "Du bist durch die engen Gassen von Trastevere geschlendert,"
        ],
        complication: [
            "aber ein Straßenkünstler wollte dich unbedingt malen – gegen Bezahlung natürlich.",
            "und bist fast in einer Touristengruppe gelandet, die auf Latein sang.",
            "wobei eine Möwe dein Gelato gestohlen hat.",
            "doch plötzlich fing es an zu regnen – und du hattest natürlich keinen Schirm."
        ],
        closing: [
            "Aber hey – Rom ohne Chaos wäre nicht Rom.",
            "Zumindest hast du jetzt ein echtes Urlaubsfoto mit Drama.",
            "Am Ende war’s genau das, was du gebraucht hast.",
            "Ein Kapitel deiner Reise, das du nie vergessen wirst."
        ]
    },

    berlin: {
        opening: [
            "Berlin – wild, laut, kreativ. Du bist mittendrin!",
            "Die Hauptstadt hat dich sofort mit ihrer Energie mitgerissen.",
            "Du wolltest nur kurz bleiben, doch Berlin hatte andere Pläne."
        ],
        activity: [
            "Du hast am Brandenburger Tor ein Selfie gemacht,",
            "Du warst im berühmten Club Berghain,",
            "Du hast Currywurst am Alexanderplatz probiert,",
            "Du bist mit dem Fahrrad an der Spree entlanggefahren,"
        ],
        complication: [
            "doch dein Navi hat dich in eine Techno-Demo geführt.",
            "aber die Schlange war länger als dein Geduldsfaden.",
            "und plötzlich fiel dein Senf auf deine weiße Jacke.",
            "nur um von einem Straßenkünstler in ein improvisiertes Konzert verwickelt zu werden."
        ],
        closing: [
            "Berlin eben – immer ein bisschen verrückt, aber unvergesslich.",
            "Du bist mit einem Lächeln und Ohrwurm zurückgekommen.",
            "Das war definitiv nicht dein letzter Besuch.",
            "Eine Stadt, die du erlebt haben musst – und du hast’s getan."
        ]
    },

    london: {
        opening: [
            "London hat dich mit Regen und Charme begrüßt.",
            "Du hast sofort gemerkt: Hier ist Geschichte in jeder Straße.",
            "Fish & Chips, Doppeldeckerbusse und jede Menge Abenteuer – das war London!"
        ],
        activity: [
            "Du bist über die Tower Bridge spaziert,",
            "Du hast im Hyde Park ein Picknick gemacht,",
            "Du hast versucht, mit einem britischen Akzent Tee zu bestellen,",
            "Du hast den Buckingham Palace besucht,"
        ],
        complication: [
            "und wurdest dabei fast von einer Taube angegriffen.",
            "doch der Tee war so heiß, dass du dir die Zunge verbrannt hast.",
            "aber die Wache hat nicht mal gezuckt, als du gewunken hast.",
            "nur um festzustellen, dass du deinen Regenschirm im Bus vergessen hast."
        ],
        closing: [
            "Trotz allem – very British und sehr charmant.",
            "Du bist klatschnass, aber glücklich zurückgekommen.",
            "Ein Abenteuer, das dich lächeln lässt.",
            "London – chaotisch, aber voller Herz."
        ]
    },
    tokyo: {
        opening: [
            "Tokio war eine Reizüberflutung im besten Sinne!",
            "Du bist von der Mischung aus Tradition und Moderne total fasziniert.",
            "Wow, Japan ist wirklich eine andere Welt. Du kommst mit vielen Eindrücken zurück."
        ],
        activity: [
            "Du hast die berühmte Shibuya-Kreuzung überquert,",
            "Bei einem Ausflug zum Senso-ji Tempel hast du dein Glück vorausgesagt,",
            "In einem Katzencafé hast du dich mit flauschigen Vierbeinern angefreundet,",
            "Du hast an einem Sushi-Meisterkurs teilgenommen,"
        ],
        complication: [
            "und wurdest dabei fast von einer Cosplay-Gruppe überrannt.",
            "aber dein Orakelzettel sagte nur 'Vorsicht vor fliegenden Fischen'.",
            "wobei eine Katze versucht hat, dein Souvenir zu stehlen.",
            "hast aber so viel Wasabi auf dein Nigiri getan, dass dir die Tränen kamen.",
            "und hast dich dabei so in den High-Tech-Toiletten verlaufen, dass du fast zu spät kamst."
        ],
        closing: [
            "Ein unvergessliches Abenteuer in der Metropole!",
            "Du musst unbedingt wieder hin, um das zu klären.",
            "Das wirst du deinen Freunden als Erstes erzählen müssen.",
            "Eine Lektion fürs Leben, verpackt in einer verrückten Reise."
        ]
    },

    beijing: {
        opening: [
            "Dein Besuch in Peking war einfach beeindruckend!",
            "Die Geschichte Chinas hat dich tief berührt.",
            "Du hast Peking mit neugierigen Augen erkundet."
        ],
        activity: [
            "Du bist auf der Chinesischen Mauer spaziert,",
            "Du hast die Verbotene Stadt besucht,",
            "Du hast Pekinger Ente probiert,",
            "Du hast den Himmelstempel bewundert,"
        ],
        complication: [
            "doch dein Guide war plötzlich verschwunden.",
            "aber der Wind hat dein Hutfoto fast ruiniert.",
            "und der Kellner brachte dir drei Gerichte zu viel.",
            "doch plötzlich fing ein Sandsturm an – mitten im Frühling."
        ],
        closing: [
            "Eine Stadt voller Überraschungen.",
            "Du bist staubig, satt und glücklich zurückgekehrt.",
            "Das war mehr als nur Sightseeing – das war Geschichte zum Anfassen."
        ]
    },

    bangkok: {
        opening: [
            "Bangkok war heiß, laut und unglaublich lebendig!",
            "Du hast in Bangkok gelernt, dass Chaos Spaß machen kann.",
            "Zwischen Tempeln und Streetfood hast du dein Glück gefunden."
        ],
        activity: [
            "Du hast den Wat Arun bei Sonnenuntergang besucht,",
            "Du hast Pad Thai auf einem schwimmenden Markt gegessen,",
            "Du bist mit einem Tuk-Tuk durch die Stadt gerast,",
            "Du hast auf dem Chatuchak-Markt Souvenirs gehandelt,"
        ],
        complication: [
            "doch dein Fahrer hat dich mitten in einer Hochzeit abgesetzt.",
            "und du hast aus Versehen super-scharfe Chili gegessen.",
            "wobei dir ein Affe deine Wasserflasche geklaut hat.",
            "aber dein Tuk-Tuk blieb im Verkehr stecken – direkt neben einem Elefanten!"
        ],
        closing: [
            "Bangkok – pure Lebensfreude im Chaos.",
            "Du hast geschwitzt, gelacht und jede Sekunde genossen.",
            "Das wird definitiv nicht dein letzter Besuch gewesen sein."
        ]
    },
    sydney: {
        opening: [
            "Down Under hat dich in seinen Bann gezogen!",
            "Sydney hat dir Sonne, Meer und Abenteuer geboten.",
            "Australien hat dich von Anfang an begeistert."
        ],
        activity: [
            "Du bist über die Harbour Bridge geklettert,",
            "Du hast am Bondi Beach gesurft,",
            "Du hast das Opernhaus bei Nacht fotografiert,",
            "Du hast in einem Rooftop-Bistro Kängurusteak probiert,"
        ],
        complication: [
            "und wurdest prompt von einer Möwe angegriffen.",
            "aber dein Surfbrett hat dich mehrmals abgeworfen.",
            "doch dein Handy fiel dir fast ins Wasser.",
            "und plötzlich kam ein Regensturm mitten in der Sonne."
        ],
        closing: [
            "Australien – wild, herzlich und unvergesslich.",
            "Ein Tag, der dich noch lange begleiten wird.",
            "Du hast Sonne im Herzen und Sand in den Schuhen mitgenommen."
        ]
    },

    new_york: {
        opening: [
            "New York – die Stadt, die niemals schläft!",
            "Du fühlst dich, als wärst du mitten in einem Film.",
            "Der Lärm, die Lichter, die Energie – New York ist überwältigend!"
        ],
        activity: [
            "Du bist durch den Central Park spaziert,",
            "Du hast die Freiheitsstatue besucht,",
            "Du hast in Brooklyn Pizza gegessen,",
            "Du hast versucht, ein Taxi in der Rush Hour zu kriegen,"
        ],
        complication: [
            "und bist mitten in eine Broadway-Parade geraten.",
            "doch dein Taxi fuhr einfach am Ziel vorbei.",
            "wobei du fast in einen Straßenkünstler getreten wärst.",
            "aber dein Pizzastück wurde dir vom Wind aus der Hand geweht."
        ],
        closing: [
            "New York – laut, chaotisch, aber einfach magisch.",
            "Du wirst noch lange von dieser Energie zehren.",
            "Ein Stück deines Herzens bleibt in Manhattan."
        ]
    },

    cairo: {
        opening: [
            "Kairo hat dich sofort in eine andere Zeit versetzt.",
            "Die Sonne Ägyptens brannte heiß, doch du warst fasziniert.",
            "Zwischen Wüste und Pyramiden fühltest du dich wie ein Entdecker."
        ],
        activity: [
            "Du hast die Cheops-Pyramide erklommen,",
            "Du hast den Nil bei Sonnenuntergang überquert,",
            "Du hast das Ägyptische Museum besucht,",
            "Du hast in einem Basar um Gewürze gefeilscht,"
        ],
        complication: [
            "doch dein Kamel hatte eigene Pläne und lief einfach los.",
            "aber der Verkäufer wollte plötzlich dein Handy als Bezahlung.",
            "und ein Sandsturm kam genau in dem Moment auf.",
            "doch ein Straßenjunge verkaufte dir 'echte Pharaonen-Souvenirs' aus Plastik."
        ],
        closing: [
            "Ein Wüstenabenteuer mit viel Sand – und noch mehr Geschichten.",
            "Das war kein gewöhnlicher Ausflug, sondern ein Sprung in die Geschichte.",
            "Du kehrst staubig, aber glücklich zurück."
        ]
    },

    cape_town: {
        opening: [
            "Kapstadt hat dich mit seiner Mischung aus Bergen und Meer verzaubert.",
            "Du wusstest sofort: Hier ist Natur pures Kino.",
            "Kapstadt hat dir gezeigt, wie schön Freiheit schmeckt."
        ],
        activity: [
            "Du bist auf den Tafelberg gewandert,",
            "Du hast am Boulders Beach die Pinguine besucht,",
            "Du hast eine Safari im Umland gemacht,",
            "Du hast am Kap der Guten Hoffnung gestanden,"
        ],
        complication: [
            "aber der Wind war so stark, dass dein Hut ins Meer flog.",
            "und dein Jeep blieb mitten im Nirgendwo liegen.",
            "wobei ein Pavian deine Snacks geklaut hat.",
            "doch plötzlich zog Nebel auf – und du hattest keine Orientierung mehr."
        ],
        closing: [
            "Am Ende hast du gelacht und den Moment genossen.",
            "Ein Abenteuer voller Sonne, Staub und Lebensfreude.",
            "Du hast Afrika gespürt – wild und echt."
        ]
    },

    marrakesh: {
        opening: [
            "Marrakesch – bunt, laut und voller Düfte.",
            "Kaum angekommen, hat dich der Zauber des Orients gepackt.",
            "Ein Labyrinth aus Farben und Gerüchen empfing dich in Marrakesch."
        ],
        activity: [
            "Du hast durch die Souks gestöbert,",
            "Du hast in einem Riad Tee mit Minze getrunken,",
            "Du hast Gewürze auf dem Djemaa el Fna gekauft,",
            "Du hast dich auf einem Basar verhandelt,"
        ],
        complication: [
            "aber du hast dich in den Gassen völlig verlaufen.",
            "und ein Händler wollte dir zehn Teppiche verkaufen.",
            "doch plötzlich fing der Muezzin an zu rufen – direkt über dir.",
            "aber ein Affe sprang dir auf die Schulter und ließ nicht los."
        ],
        closing: [
            "Marrakesch – ein Chaos, das man lieben muss.",
            "Ein Tag, so bunt wie die Stadt selbst.",
            "Du bist müde, aber mit glänzenden Augen zurückgekehrt."
        ]
    },
    rio: {
        opening: [
            "Rio de Janeiro – pure Lebensfreude!",
            "Samba, Sonne, Strand – Rio hat dich verzaubert.",
            "Du bist in einer Stadt gelandet, die nie stillsteht."
        ],
        activity: [
            "Du hast am Strand von Copacabana getanzt,",
            "Du bist zur Christusstatue aufgestiegen,",
            "Du hast Caipirinhas am Meer getrunken,",
            "Du hast beim Karneval mitgetanzt,"
        ],
        complication: [
            "aber dein Tanzpartner war ein verkleideter Tourist aus Bayern.",
            "doch dein Handy ist fast im Sand versunken.",
            "und du hast deinen Flip-Flop in einer Parade verloren.",
            "aber ein Papagei hat dein Eis geklaut."
        ],
        closing: [
            "Sonne, Musik und Chaos – Rio pur!",
            "Ein Erlebnis, das in deinem Herzen nachklingt.",
            "So viel Farbe, so viel Leben – du wirst wiederkommen."
        ]
    },

    lima: {
        opening: [
            "Lima hat dich mit Kultur und Küche überrascht.",
            "Die Hauptstadt Perus war wilder, als du gedacht hättest.",
            "Ein Hauch von Abenteuer lag in der Luft, als du in Lima ankamst."
        ],
        activity: [
            "Du hast Ceviche in einem kleinen Restaurant probiert,",
            "Du hast die Klippen von Miraflores besucht,",
            "Du bist über den Markt von Surquillo geschlendert,",
            "Du hast alte Inka-Ruinen in der Stadt entdeckt,"
        ],
        complication: [
            "doch ein Straßenhund wollte dein Mittagessen stehlen.",
            "und plötzlich fing es an zu regnen – mitten in der Wüste.",
            "aber du hast dich in einem Food-Festival verirrt.",
            "doch der Busfahrer sprach nur Quechua und fuhr dich in die falsche Richtung."
        ],
        closing: [
            "Ein kulinarisches Abenteuer, das du nie vergisst.",
            "Lima hat dir gezeigt, dass Chaos köstlich sein kann.",
            "Ein Tag voller Geschmack, Sonne und Geschichten."
        ]
    },

    buenos_aires: {
        opening: [
            "Buenos Aires – die Stadt des Tangos und der Leidenschaft.",
            "Du hast schnell gemerkt: Hier tanzt das Leben selbst.",
            "In Buenos Aires ist jeder Tag ein Fest der Sinne."
        ],
        activity: [
            "Du hast einen Tangokurs besucht,",
            "Du hast ein Steak in einem Parilla-Restaurant gegessen,",
            "Du hast durch das Viertel La Boca flaniert,",
            "Du hast dich auf einer Plaza von Musik mitreißen lassen,"
        ],
        complication: [
            "aber dein Tanzpartner hatte zwei linke Füße.",
            "doch ein Kellner hat dein Getränk in dein Haar geschüttet.",
            "und plötzlich hast du in einer Milonga selbst auftreten müssen.",
            "aber dein Handy vibrierte mitten im Lied."
        ],
        closing: [
            "Buenos Aires – voller Rhythmus und Herzblut.",
            "Du verlässt die Stadt mit einem Tango im Kopf und einem Lächeln.",
            "Das war Leidenschaft pur!"
        ]
    },
    toronto: {
        opening: [
            "Toronto war modern, freundlich und überraschend grün.",
            "Kanadas Metropole hat dich mit offener Herzlichkeit empfangen.",
            "Eine Stadt, die auf Wolkenkratzer und Seen trifft – Toronto hat Stil."
        ],
        activity: [
            "Du bist auf den CN Tower gestiegen,",
            "Du hast am Ontariosee spaziert,",
            "Du hast Poutine probiert,",
            "Du hast dich in Kensington Market verlaufen,"
        ],
        complication: [
            "doch dein Selfiestick fiel fast vom Turm.",
            "aber die Möwen wollten deinen Snack.",
            "und plötzlich kam ein Regenschauer aus dem Nichts.",
            "doch du bist in ein Straßenfestival geraten – komplett durchnässt."
        ],
        closing: [
            "Ein typisch kanadisches Abenteuer – freundlich, nass, unvergesslich.",
            "Toronto – cool, charmant und voller Überraschungen."
        ]
    },

    mexico_city: {
        opening: [
            "Mexiko-Stadt hat dich mit Farben, Lärm und Leben begrüßt.",
            "Kaum angekommen, warst du mitten im Chaos – und hast es geliebt.",
            "In Mexiko-Stadt riecht es nach Gewürzen, Musik und Abenteuer."
        ],
        activity: [
            "Du hast die Ruinen von Teotihuacán besucht,",
            "Du hast Tacos an einem Straßenstand gegessen,",
            "Du hast durch den Zócalo getanzt,",
            "Du hast in einem Markt nach Souvenirs gesucht,"
        ],
        complication: [
            "doch du hast aus Versehen den schärfsten Taco des Landes erwischt.",
            "aber ein Mariachi wollte dich zum Mitsingen bringen.",
            "und dein Rucksack blieb in der Metro stecken.",
            "doch plötzlich fiel der Strom in der ganzen Straße aus."
        ],
        closing: [
            "Ein Abenteuer, das so heiß war wie das Essen.",
            "Du verlässt die Stadt mit feurigem Magen und vollem Herzen."
        ]
    },
    dubai: {
        opening: [
            "Dubai hat dich mit Glanz und Wüste begrüßt.",
            "Die Stadt der Superlative hat dich sofort beeindruckt.",
            "Zwischen Sand und Wolkenkratzern hast du dich gefühlt wie in einer anderen Welt."
        ],
        activity: [
            "Du bist mit dem Aufzug im Burj Khalifa gefahren,",
            "Du bist auf einer Wüstensafari durch die Dünen gerast,",
            "Du hast in einem Luxushotel Tee getrunken,",
            "Du hast Gold auf dem Markt bestaunt,"
        ],
        complication: [
            "doch dein Handy ist fast im Sand verschwunden.",
            "aber dein Kamel wollte nicht mehr weiterlaufen.",
            "und plötzlich kam ein Sandsturm auf.",
            "doch du hast dein Portemonnaie in der Mall verloren – fast."
        ],
        closing: [
            "Glanz, Staub und Staunen – so fühlt sich Dubai an.",
            "Ein Erlebnis zwischen Hitze und Hightech."
        ]
    },

    istanbul: {
        opening: [
            "Istanbul – wo Osten und Westen sich die Hand geben.",
            "Die Stadt am Bosporus hat dich mit Geschichte und Leben überflutet.",
            "Du hast dich sofort in das Chaos und die Schönheit Istanbuls verliebt."
        ],
        activity: [
            "Du hast die Hagia Sophia besucht,",
            "Du bist über den Großen Basar geschlendert,",
            "Du hast türkischen Kaffee probiert,",
            "Du bist mit der Fähre über den Bosporus gefahren,"
        ],
        complication: [
            "doch du hast dich in den Gewürzgängen verlaufen.",
            "aber dein Kaffee war so stark, dass du drei Stunden wach warst.",
            "und plötzlich rief der Muezzin genau über dir.",
            "doch dein Verhandlungspartner war besser im Feilschen."
        ],
        closing: [
            "Ein Ort, der dich nie mehr loslässt.",
            "Istanbul – laut, warmherzig, unvergesslich."
        ]
    },
    reykjavik: {
        opening: [
            "Reykjavík war kalt, magisch und wunderschön.",
            "Island hat dich mit Wind, Eis und Wunderlich begrüßt.",
            "Du fühltest dich wie in einer anderen Welt."
        ],
        activity: [
            "Du hast Nordlichter gesehen,",
            "Du hast in einer heißen Quelle gebadet,",
            "Du bist durch Lavafelder gewandert,",
            "Du hast Wale im Ozean beobachtet,"
        ],
        complication: [
            "doch deine Kamera ist im Schnee gelandet.",
            "aber dein Handtuch wurde vom Wind davongetragen.",
            "und plötzlich fing es an zu schneien – im Juni!",
            "doch dein Mietwagen wollte im Eis nicht mehr starten."
        ],
        closing: [
            "Ein eisiges, aber herzerwärmendes Abenteuer.",
            "Island – wild, ruhig und unvergesslich schön."
        ]
    },

        madrid: {
        opening: [
            "Madrid hat dich mit Sonne, Tapas und Temperament begrüßt.",
            "Die Straßen Madrids waren voller Leben, Musik und Lachen.",
            "Kaum angekommen, warst du mitten im Herzen Spaniens."
        ],
        activity: [
            "Du hast den Königspalast besucht,",
            "Du hast Tapas in einer kleinen Bar bestellt,",
            "Du bist durch den Retiro-Park spaziert,",
            "Du hast ein Fußballspiel im Bernabéu-Stadion gesehen,"
        ],
        complication: [
            "doch du hast das Trinkgeld in der falschen Währung gegeben.",
            "aber die Siesta hat alles plötzlich zum Stillstand gebracht.",
            "und deine Sonnenbrille fiel in einen Springbrunnen.",
            "doch du hast aus Versehen scharfe Oliven bestellt."
        ],
        closing: [
            "Madrid – heiß, herzlich und voller Leben.",
            "Du verlässt die Stadt mit Sonne im Herzen und Hunger auf mehr."
        ]
    },

    amsterdam: {
        opening: [
            "Amsterdam – Kanäle, Fahrräder und Freiheit pur.",
            "Kaum angekommen, hast du dich sofort in den Charme der Stadt verliebt.",
            "Zwischen Grachten und Giebelhäusern fühltest du dich wie in einem Traum."
        ],
        activity: [
            "Du bist mit dem Fahrrad durch die Stadt gefahren,",
            "Du hast im Rijksmuseum die alten Meister bestaunt,",
            "Du hast Stroopwafels auf dem Markt probiert,",
            "Du hast eine Grachtenfahrt bei Sonnenuntergang gemacht,"
        ],
        complication: [
            "doch du hast fast zehnmal das gleiche Fahrrad geparkt.",
            "aber eine Möwe klaute dir dein Sandwich.",
            "und dein Boot wurde fast von einem Hausboot gerammt.",
            "doch du bist in den falschen Coffeeshop gegangen."
        ],
        closing: [
            "Amsterdam – charmant, chaotisch, einfach wunderbar.",
            "Eine Stadt, die du garantiert wieder besuchen wirst."
        ]
    },
    seoul: {
        opening: [
            "Seoul hat dich mit Neonlichtern und Geschichte begrüßt.",
            "In der Stadt der Kontraste fühltest du dich sofort willkommen.",
            "Seoul war laut, lecker und lebendig – wie ein endloses Musikvideo."
        ],
        activity: [
            "Du hast den Gyeongbokgung-Palast besucht,",
            "Du hast in Myeongdong Street Food probiert,",
            "Du hast K-Pop-Fans beim Tanzen zugesehen,",
            "Du hast Hanbok getragen und Selfies gemacht,"
        ],
        complication: [
            "doch du hast zu viel Kimchi probiert.",
            "aber dein Karaoke-Auftritt wurde live gestreamt.",
            "und du bist in der Metro in die falsche Richtung gefahren.",
            "doch dein Handy-Akku war bei -3 % mitten im Shoppingviertel."
        ],
        closing: [
            "Seoul – laut, bunt und absolut unvergesslich.",
            "Ein Abenteuer zwischen Tempeln, Technik und Tteokbokki."
        ]
    },

    singapore: {
        opening: [
            "Singapur – modern, tropisch und makellos sauber.",
            "Du hast die Stadt der Zukunft betreten.",
            "Zwischen Skyline und Dschungel fühltest du dich wie in einem Film."
        ],
        activity: [
            "Du hast die Gardens by the Bay besucht,",
            "Du bist durch Chinatown geschlendert,",
            "Du hast einen Cocktail im Marina Bay Sands getrunken,",
            "Du hast im Hawker Centre gegessen,"
        ],
        complication: [
            "doch dein Drink kostete mehr als dein Flugticket.",
            "aber du hast dich in einem botanischen Garten verirrt.",
            "und ein tropischer Regenguss hat dich völlig durchnässt.",
            "doch du hast deinen Regenschirm im Taxi vergessen."
        ],
        closing: [
            "Ein tropisches Hightech-Paradies, das dich sprachlos machte.",
            "Singapur bleibt dir als glänzender Traum in Erinnerung."
        ]
    },

    mumbai: {
        opening: [
            "Mumbai – laut, bunt und voller Energie.",
            "Die Stadt, die niemals schläft, hat dich sofort in ihren Bann gezogen.",
            "Zwischen Chaos und Charme fühltest du dich plötzlich ganz lebendig."
        ],
        activity: [
            "Du hast den Gateway of India besucht,",
            "Du bist mit der legendären Mumbai Local gefahren,",
            "Du hast Streetfood am Chowpatty Beach probiert,",
            "Du hast die Filmstudios von Bollywood besichtigt,"
        ],
        complication: [
            "doch dein Zugticket war plötzlich verschwunden.",
            "aber ein Affe klaute dir deinen Snack.",
            "und der Regen der Monsunzeit hat dich überrascht.",
            "doch du wurdest spontan Statist in einem Film."
        ],
        closing: [
            "Mumbai – chaotisch, magisch, menschlich.",
            "Eine Stadt, die dich zum Staunen gebracht hat."
        ]
    },
    nairobi: {
        opening: [
            "Nairobi war wild, warm und voller Abenteuer.",
            "Die Stadt am Rande der Savanne begrüßte dich mit Lebensfreude.",
            "Du fühltest dich wie mitten in einem Safari-Film."
        ],
        activity: [
            "Du hast Giraffen im Nationalpark gesehen,",
            "Du hast den Karen-Blixen-Garten besucht,",
            "Du hast ein traditionelles kenianisches Gericht probiert,",
            "Du hast dich durch den Verkehr der Innenstadt gekämpft,"
        ],
        complication: [
            "doch ein Affe sprang plötzlich auf dein Auto.",
            "aber dein GPS wollte nur nach Uganda navigieren.",
            "und ein kleiner Sandsturm überraschte dich mitten in der Stadt.",
            "doch dein Fahrer hatte andere Musikvorlieben."
        ],
        closing: [
            "Ein Tag voller Natur und Chaos – typisch Afrika.",
            "Nairobi hat dir gezeigt, was echtes Abenteuer heißt."
        ]
    },

zurich: {
    opening: [
        "Zürich hat dich mit Bergblick, Seen und Schokolade empfangen.",
        "Die Stadt der Banken und Gemütlichkeit begrüßte dich herzlich.",
        "Zwischen Altstadtgassen und Alpenpanorama fühltest du dich sofort zuhause."
    ],
    activity: [
        "Du hast den Zürichsee entlang spaziert,",
        "Du hast im Lindenhof die Aussicht genossen,",
        "Du hast Schweizer Schokolade in kleinen Läden probiert,",
        "Du bist durch die Altstadt mit ihren historischen Gebäuden geschlendert,"
    ],
    complication: [
        "doch du hast aus Versehen ein teures Uhrengeschäft betreten.",
        "aber ein plötzlicher Regenschauer überraschte dich mitten auf der Straße.",
        "und dein Zug nach Luzern hatte Verspätung.",
        "doch du hast dein Fondue fast verschüttet."
    ],
    closing: [
        "Zürich – charmant, sauber und voller Genuss.",
        "Du verlässt die Stadt mit süßen Erinnerungen und Alpenluft im Herzen."
    ]
},

st_petersburg: {
    opening: [
        "Sankt Petersburg hat dich mit prunkvollen Palästen und Kanälen begrüßt.",
        "Die Stadt der Weißen Nächte faszinierte dich sofort.",
        "Zwischen Museen und Brücken fühltest du dich wie in einem Märchen."
    ],
    activity: [
        "Du hast die Eremitage besucht,",
        "Du bist über die Nevsky-Prospekt geschlendert,",
        "Du hast eine Bootsfahrt durch die Kanäle gemacht,",
        "Du hast klassische Musik in einem alten Theater genossen,"
    ],
    complication: [
        "doch du hast die Uhrzeit für die Palastführung verwechselt.",
        "aber ein Regenschauer überraschte dich mitten auf der Brücke.",
        "und du bist in der falschen Metro-Linie gelandet.",
        "doch dein Souvenir-Laden hatte schon geschlossen."
    ],
    closing: [
        "Sankt Petersburg – majestätisch, geheimnisvoll und unvergesslich.",
        "Die Stadt der Kunst und Geschichte bleibt in deinem Herzen."
    ]
},

moscow: {
    opening: [
        "Moskau hat dich mit roten Mauern und imposanten Kirchen empfangen.",
        "Die Hauptstadt Russlands präsentierte sich stolz und lebendig.",
        "Zwischen Kreml und Straßen voller Geschichte fühltest du dich sofort mittendrin."
    ],
    activity: [
        "Du hast den Roten Platz besucht,",
        "Du hast die Basilius-Kathedrale bestaunt,",
        "Du hast die Metro-Stationen als Paläste erkundet,",
        "Du hast in einem traditionellen russischen Café Tee getrunken,"
    ],
    complication: [
        "doch dein Stadtplan verwirrte dich komplett.",
        "aber ein plötzlicher Schneesturm überraschte dich im Frühling.",
        "und du hast die U-Bahn Richtung falsches Viertel genommen.",
        "doch dein Souvenir-Mini-Kreml ist fast zerbrochen."
    ],
    closing: [
        "Moskau – groß, beeindruckend und voller Überraschungen.",
        "Die Stadt der Kontraste hinterlässt einen bleibenden Eindruck."
    ]
},

    lagos: {
        opening: [
            "Lagos – laut, lebendig und voller Energie.",
            "Kaum angekommen, spürtest du den Rhythmus der Stadt.",
            "Die Megacity Nigerias vibrierte in jeder Sekunde."
        ],
        activity: [
            "Du hast den Markt von Balogun erkundet,",
            "Du hast den Strand von Tarkwa Bay besucht,",
            "Du hast Suya vom Grill probiert,",
            "Du hast dich durch den Verkehr von Victoria Island gekämpft,"
        ],
        complication: [
            "doch dein Fahrer fuhr plötzlich rückwärts in eine Gasse.",
            "aber dein Essen war doppelt so scharf wie erwartet.",
            "und du wurdest in einen spontanen Tanz verwickelt.",
            "doch ein Straßenhändler wollte dein T-Shirt tauschen."
        ],
        closing: [
            "Lagos – laut, bunt, voller Leben.",
            "Ein Erlebnis, das in deinem Gedächtnis tanzt."
        ]
    },
    bogota: {
        opening: [
            "Bogotá liegt hoch, bunt und voller Leben.",
            "Die kolumbianische Hauptstadt begrüßte dich mit Musik und Kaffee.",
            "Du hast schnell gemerkt: Bogotá ist ein Gefühl, kein Ort."
        ],
        activity: [
            "Du bist mit der Seilbahn auf den Monserrate gefahren,",
            "Du hast kolumbianischen Kaffee in einer kleinen Bar getrunken,",
            "Du hast das Goldmuseum besucht,",
            "Du hast auf einer Plaza Cumbia getanzt,"
        ],
        complication: [
            "doch der Nebel war so dicht, dass du nichts gesehen hast.",
            "aber du hast dich in der Altstadt verlaufen.",
            "und dein Kaffee war so stark, dass du drei Nächte wach warst.",
            "doch du hast versehentlich scharfe Arepas bestellt."
        ],
        closing: [
            "Bogotá – hoch oben, aber mitten im Herzen.",
            "Ein Abenteuer zwischen Wolken, Musik und guter Laune."
        ]
    },

    santiago: {
        opening: [
            "Santiago de Chile hat dich mit Andenblick und Großstadtflair überrascht.",
            "Die klare Luft und das Bergpanorama ließen dich sofort durchatmen.",
            "Du wusstest sofort: Hier trifft Abenteuer auf Eleganz."
        ],
        activity: [
            "Du bist auf den Cerro San Cristóbal gestiegen,",
            "Du hast chilenischen Wein verkostet,",
            "Du bist durch das Viertel Bellavista geschlendert,",
            "Du hast dich auf einem Markt durch Früchte probiert,"
        ],
        complication: [
            "doch ein Straßenkünstler nahm dich mit in seine Show.",
            "aber du hast dein Glas fallen lassen – vor dem Sommelier.",
            "und ein plötzlicher Windstoß wehte deinen Hut davon.",
            "doch du hast dich verlaufen und bist auf einer Hochzeit gelandet."
        ],
        closing: [
            "Santiago – entspannt, elegant, einfach schön.",
            "Du verlässt Chile mit einem Lächeln und Weingeschmack auf den Lippen."
        ]
    },
    los_angeles: {
        opening: [
            "Los Angeles – Sonne, Palmen, Träume.",
            "Kaum angekommen, hast du Hollywood-Luft geschnuppert.",
            "L.A. ist genau so verrückt, wie du es dir vorgestellt hast."
        ],
        activity: [
            "Du bist zum Hollywood-Sign gewandert,",
            "Du hast an den Venice Beach geschlendert,",
            "Du hast in einem Foodtruck Tacos probiert,",
            "Du hast Sterne auf dem Walk of Fame gesucht,"
        ],
        complication: [
            "doch du hast aus Versehen einen Promi verwechselt.",
            "aber dein E-Scooter-Akku ging mitten im Sunset Boulevard aus.",
            "und dein Taco fiel direkt auf deine weißen Sneaker.",
            "doch du wurdest in eine Filmaufnahme hineingezogen."
        ],
        closing: [
            "L.A. – Sonne, Chaos und Kameraaction inklusive.",
            "Du gehst mit Sand in den Schuhen und einem Lächeln im Gesicht."
        ]
    },

    las_vegas: {
        opening: [
            "Las Vegas – wo Tag und Nacht gleich hell sind.",
            "Die Stadt der Lichter hat dich sofort in ihren Bann gezogen.",
            "Kaum angekommen, hattest du das Gefühl, in einem Film zu sein."
        ],
        activity: [
            "Du hast an einem Spielautomaten dein Glück versucht,",
            "Du bist durch die künstliche Wüste des Strips gelaufen,",
            "Du hast eine Zaubershow besucht,",
            "Du hast ein All-you-can-eat-Buffet gestürmt,"
        ],
        complication: [
            "doch du hast deine Zimmernummer vergessen.",
            "aber der Magier hat dich fast auf die Bühne geholt.",
            "und dein Portemonnaie war plötzlich leer.",
            "doch du hast dich in der Nachbildung von Venedig verlaufen."
        ],
        closing: [
            "Vegas – ein Traum aus Licht, Lärm und Lachen.",
            "Was in Vegas passiert, bleibt in deiner Erinnerung."
        ]
    },
    melbourne: {
        opening: [
            "Melbourne – kreativ, cool und voller Kaffee.",
            "Die australische Stadt hat dich mit Stil und Sonne empfangen.",
            "Du hast dich sofort in die entspannte Atmosphäre verliebt."
        ],
        activity: [
            "Du hast Street Art in Hosier Lane bewundert,",
            "Du hast einen Flat White in einem Hipster-Café getrunken,",
            "Du hast den Queen Victoria Market besucht,",
            "Du bist an der Great Ocean Road entlanggefahren,"
        ],
        complication: [
            "doch dein Fahrradreifen platzte mitten in der Stadt.",
            "aber ein Papagei landete auf deinem Kopf.",
            "und du hast dein Ticket fürs Tramnetz verloren.",
            "doch du bist in einem Straßenkonzert hängen geblieben."
        ],
        closing: [
            "Melbourne – locker, lebendig, wunderbar anders.",
            "Eine Stadt, die dich sofort willkommen heißt."
        ]
    },

    auckland: {
        opening: [
            "Auckland – die Stadt der Segel und des Windes.",
            "Neuseeland empfing dich mit grünen Hügeln und Meerblick.",
            "Du hattest sofort das Gefühl, am anderen Ende der Welt zu sein."
        ],
        activity: [
            "Du bist auf den Sky Tower gestiegen,",
            "Du hast an einem Segelausflug teilgenommen,",
            "Du hast Fish and Chips am Hafen gegessen,",
            "Du hast Maorikunst in einem Museum bewundert,"
        ],
        complication: [
            "doch eine Möwe klaute dein Mittagessen.",
            "aber dein Boot geriet in einen kleinen Sturm.",
            "und du hast deine Sonnenbrille ins Wasser fallen lassen.",
            "doch du hast versehentlich auf der falschen Straßenseite gewartet."
        ],
        closing: [
            "Auckland – windig, wild und wunderschön.",
            "Ein Erlebnis zwischen Himmel, Wasser und Weite."
        ]
    },

    fiji: {
        opening: [
            "Fidschi – türkisblau, sonnig und traumhaft.",
            "Kaum angekommen, warst du im Paradies.",
            "Das Leben auf den Inseln fühlte sich wie ein Traum an."
        ],
        activity: [
            "Du hast im klaren Meer geschnorchelt,",
            "Du hast mit Einheimischen Kokosnüsse getrunken,",
            "Du hast eine traditionelle Tanzzeremonie erlebt,",
            "Du hast am Strand unter Palmen geschlafen,"
        ],
        complication: [
            "doch eine Krabbe hat deinen Schuh geklaut.",
            "aber dein Sonnenhut flog ins Meer.",
            "und plötzlich begann ein tropischer Regenguss.",
            "doch du bist auf einer Nachbarinsel gestrandet – kurzzeitig."
        ],
        closing: [
            "Ein Paradies mit Ecken und Wellen – Fidschi pur.",
            "Du verlässt die Insel mit Salz in den Haaren und Glück im Herzen."
        ]
    },
    doha: {
        opening: [
            "Doha – Wüste trifft auf Wolkenkratzer.",
            "Die Hauptstadt Katars hat dich mit Luxus und Sand empfangen.",
            "Zwischen Tradition und Moderne fühltest du dich wie in einem Traum."
        ],
        activity: [
            "Du hast das Museum of Islamic Art besucht,",
            "Du bist auf einer Wüstensafari gefahren,",
            "Du hast durch den Souq Waqif gebummelt,",
            "Du hast Tee mit Einheimischen getrunken,"
        ],
        complication: [
            "doch dein Jeep blieb im Sand stecken.",
            "aber ein Falke setzte sich auf dein Autodach.",
            "und die Sonne brannte gnadenlos.",
            "doch du hast dich in der Mall verirrt."
        ],
        closing: [
            "Doha – heiß, herzlich, faszinierend.",
            "Ein Ort, der Wüste und Zukunft vereint."
        ]
    },

    singapore: {
    opening: [
        "Singapur – modern, tropisch und makellos sauber.",
        "Du hast die Stadt der Zukunft betreten.",
        "Zwischen Skyline und Dschungel fühltest du dich wie in einem Film.",
        "Deine Reise nach Singapur war ein Rausch aus Licht, Kultur und Düften.",
        "Schon beim Anflug auf die glitzernde Stadt spürtest du: Hier wartet etwas Besonderes."
    ],
    activity: [
        "Du hast die schwebenden Supertrees in den Gardens by the Bay bestaunt,",
        "Du bist durch die quirligen Gassen von Chinatown geschlendert,",
        "Du hast im Marina Bay Sands einen Drink mit Aussicht genossen,",
        "Du hast dich im Botanischen Garten zwischen Orchideen verloren,",
        "Du hast dich durch ein Hawker Centre voller Düfte und Geräusche gegessen,"
    ],
    complication: [
        "doch plötzlich kam ein tropischer Regenguss aus dem Nichts.",
        "aber dein Drink war so teuer, dass du kurz deinen Kontostand überprüft hast.",
        "wobei du dich in der Metro verfahren hast – trotz perfekter Beschilderung.",
        "und dein Chili Crab war so scharf, dass du fast Feuer gespuckt hättest.",
        "doch dein Selfie mit den Supertrees wurde von einem fliegenden Gürteltier sabotiert."
    ],
    closing: [
        "Singapur – futuristisch, lecker und voller Überraschungen.",
        "Du hast gelernt, dass Ordnung und Abenteuer sich nicht ausschließen.",
        "Ein Ort, der dich noch lange faszinieren wird.",
        "Du verlässt die Stadt mit vollen Taschen, brennender Zunge und einem breiten Grinsen.",
        "Ein weiteres Kapitel deiner Reise, das nach Mango und Chili schmeckt."
    ]
},
    longyearbyen: {
        opening: [
            "Longyearbyen – die nördlichste Stadt der Welt.",
            "Ewiges Eis, endlose Stille und ein Himmel voller Magie.",
            "Du fühltest dich wie am Rand der Welt."
        ],
        activity: [
            "Du hast das Polarlicht gesehen,",
            "Du bist mit einem Schneemobil durch die Eiswüste gefahren,",
            "Du hast mit Forschern über das Klima gesprochen,",
            "Du hast im Dunkeln den Sternenhimmel beobachtet,"
        ],
        complication: [
            "doch dein Atem gefror sofort zu Eiskristallen.",
            "aber ein Eisbär tauchte in der Ferne auf.",
            "und deine Kamera streikte bei -25 Grad.",
            "doch du hast deine Handschuhe im Schnee verloren."
        ],
        closing: [
            "Ein Erlebnis zwischen Kälte und Staunen.",
            "Longyearbyen – wo die Welt stillzustehen scheint."
        ]
    }
};

module.exports = storyTemplates;
