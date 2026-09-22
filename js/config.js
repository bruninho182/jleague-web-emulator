/* ============================================
   CONFIG.JS - Configurações globais
   ============================================ */

const APP_CONFIG = {
    emulator: {
        core: 'psx',
        system: 'psx',
        biosUrl: null,
        disableDat: true,
        threads: true,
        startOnLoad: false,
        volume: 0.7,
        gameName: 'J.League Winning Eleven 2000',
        backgroundColor: '#000000',
    },

    chat: {
        maxMessages: 100,
        maxLength: 200,
    },

    // ============================================
    // TIMES DA J.LEAGUE 2000 - J1 e J2
    // Estatísticas: offense, defense, power, speed, technique (1-10)
    // ============================================
    teams: {
        j1: [
            { name: 'Kashima Antlers',       city: 'Kashima',   color: '#c8102e', color2: '#000000', shield: 'assets/shields/kashima.png',   stadium: 'Kashima Soccer Stadium',   founded: 1947, titles: 5, star: 'Zico (histórico)', stats: { offense: 9, defense: 8, power: 8, speed: 8, technique: 9 }, fact: 'Zico, lenda do futebol brasileiro, jogou aqui entre 1991 e 1994 e iniciou a era de ouro do clube.' },
            { name: 'Júbilo Iwata',           city: 'Iwata',     color: '#0066cc', color2: '#ffffff', shield: 'assets/shields/jubilo.png',    stadium: 'Yamaha Stadium',           founded: 1972, titles: 3, star: 'Nakayama',           stats: { offense: 9, defense: 7, power: 7, speed: 8, technique: 9 }, fact: 'Foi o time dominante da J.League no fim dos anos 90, com 3 títulos em 4 anos.' },
            { name: 'Shimizu S-Pulse',        city: 'Shizuoka',  color: '#ff6600', color2: '#ffffff', shield: 'assets/shields/shimizu.png',   stadium: 'Nihondaira Stadium',       founded: 1991, titles: 0, star: 'Santos',             stats: { offense: 7, defense: 7, power: 7, speed: 7, technique: 8 }, fact: 'Time jovem da era profissional, conhecido pela torcida apaixonada e pelo estádio com vista para o Monte Fuji.' },
            { name: 'Yokohama F. Marinos',    city: 'Yokohama',  color: '#003399', color2: '#ffffff', shield: 'assets/shields/yokohama.png',  stadium: 'Nissan Stadium',           founded: 1972, titles: 3, star: 'Nakamura',           stats: { offense: 8, defense: 7, power: 8, speed: 7, technique: 8 }, fact: 'Nasceu da fusão entre Nissan Motors e Yokohama Marinos. Revelou Shunsuke Nakamura.' },
            { name: 'Urawa Red Diamonds',     city: 'Saitama',   color: '#cc0000', color2: '#000000', shield: 'assets/shields/urawa.png',     stadium: 'Saitama Stadium',          founded: 1950, titles: 2, star: 'Ono',                stats: { offense: 6, defense: 6, power: 7, speed: 6, technique: 7 }, fact: 'Tem uma das maiores torcidas do Japão e é conhecido pelo hino "We Are Reds".' },
            { name: 'Kashiwa Reysol',         city: 'Kashiwa',   color: '#ffcc00', color2: '#000000', shield: 'assets/shields/kashiwa.png',   stadium: 'Hitachi Kashiwa Stadium',  founded: 1940, titles: 1, star: 'Hong',               stats: { offense: 7, defense: 6, power: 7, speed: 7, technique: 7 }, fact: 'Primeiro time japonês a vencer a Copa Suruga. Suas cores amarelo e preto são icônicas.' },
            { name: 'Cerezo Osaka',           city: 'Osaka',     color: '#ff69b4', color2: '#000066', shield: 'assets/shields/cerezo.png',    stadium: 'Nagai Stadium',            founded: 1957, titles: 0, star: 'Morishima',          stats: { offense: 6, defense: 5, power: 6, speed: 6, technique: 7 }, fact: 'O nome "Cerezo" significa "cerejeira" em espanhol, simbolizando a beleza de Osaka.' },
            { name: 'Gamba Osaka',            city: 'Osaka',     color: '#0033cc', color2: '#000000', shield: 'assets/shields/gamba.png',     stadium: 'Expo \'70 Stadium',        founded: 1980, titles: 1, star: 'Matsunaga',          stats: { offense: 6, defense: 5, power: 7, speed: 7, technique: 7 }, fact: 'Rival histórico do Cerezo no "Dérbi de Osaka". O nome vem de "Ganbaru" (esforçar-se).' },
            { name: 'Nagoya Grampus',         city: 'Nagoya',    color: '#ff3300', color2: '#000000', shield: 'assets/shields/nagoya.png',    stadium: 'Mizuho Stadium',           founded: 1939, titles: 0, star: 'Stojkovic',          stats: { offense: 7, defense: 7, power: 7, speed: 7, technique: 8 }, fact: 'Foi treinado por Arsène Wenger antes dele ir ao Arsenal. Stojkovic foi ídolo nos anos 90.' },
            { name: 'Sanfrecce Hiroshima',    city: 'Hiroshima', color: '#6633cc', color2: '#ffffff', shield: 'assets/shields/sanfrecce.png', stadium: 'Hiroshima Big Arch',       founded: 1938, titles: 0, star: 'Kubo',               stats: { offense: 6, defense: 6, power: 6, speed: 6, technique: 7 }, fact: 'O nome é uma mistura de "San" (três) com "Frecce" (flechas em italiano), do símbolo de Hiroshima.' },
            { name: 'Avispa Fukuoka',         city: 'Fukuoka',   color: '#0033aa', color2: '#ffffff', shield: 'assets/shields/avispa.png',    stadium: 'Hakatanomori Stadium',     founded: 1982, titles: 0, star: 'Nagai',              stats: { offense: 5, defense: 5, power: 6, speed: 6, technique: 6 }, fact: '"Avispa" significa "vespa" em espanhol. Time conhecido pela garra no ataque.' },
            { name: 'Vissel Kobe',            city: 'Kobe',      color: '#990000', color2: '#000000', shield: 'assets/shields/vissel.png',    stadium: 'Kobe Wing Stadium',        founded: 1966, titles: 0, star: 'Mirosavljević',      stats: { offense: 6, defense: 6, power: 7, speed: 6, technique: 6 }, fact: 'Vissel vem de "Victory" + "Vessel" (navio). Kobe é cidade portuária, daí o nome.' },
            { name: 'Consadole Sapporo',      city: 'Sapporo',   color: '#cc0000', color2: '#000000', shield: 'assets/shields/sapporo.png',   stadium: 'Sapporo Dome',             founded: 1935, titles: 0, star: 'Yoshida',            stats: { offense: 5, defense: 5, power: 6, speed: 6, technique: 5 }, fact: 'O nome vem de "Consado" (do espanhol "cansado") + "Ole". Joga em Hokkaido.' },
            { name: 'Verdy Kawasaki',         city: 'Kawasaki',  color: '#006633', color2: '#ffffff', shield: 'assets/shields/verdy.png',     stadium: 'Todoroki Stadium',         founded: 1969, titles: 2, star: 'Miura',              stats: { offense: 7, defense: 6, power: 6, speed: 7, technique: 8 }, fact: 'Foi o time de Kazuyoshi Miura ("King Kazu"), que jogou até os 50+ anos.' },
            { name: 'Kyoto Purple Sanga',     city: 'Kyoto',     color: '#6633aa', color2: '#ffffff', shield: 'assets/shields/kyoto.png',     stadium: 'Nishikyogoku Stadium',     founded: 1922, titles: 0, star: 'Park',               stats: { offense: 5, defense: 5, power: 5, speed: 5, technique: 6 }, fact: '"Sanga" vem do sânscrito "sangha" (comunidade). Cores roxas remetem à tradição imperial de Kyoto.' },
            { name: 'JEF United Ichihara',    city: 'Ichihara',  color: '#006633', color2: '#ffcc00', shield: 'assets/shields/jef.png',       stadium: 'Ichihara Seaside Stadium', founded: 1946, titles: 0, star: 'Muto',               stats: { offense: 6, defense: 7, power: 6, speed: 6, technique: 6 }, fact: 'Nome original: Furukawa Electric. JEF = JR East Furukawa, fusão das empresas ferroviárias.' },
        ],
        j2: [
            { name: 'Kawasaki Frontale',      city: 'Kawasaki',  color: '#0099cc', color2: '#000000', shield: 'assets/shields/frontale.png',  stadium: 'Todoroki Stadium',         founded: 1955, titles: 0, star: 'Júnior',             stats: { offense: 6, defense: 6, power: 6, speed: 6, technique: 6 }, fact: '"Frontale" significa "frontal" em italiano, referência ao ataque direto.' },
            { name: 'FC Tokyo',               city: 'Tokyo',     color: '#003399', color2: '#cc0000', shield: 'assets/shields/fctokyo.png',   stadium: 'Ajinomoto Stadium',        founded: 1999, titles: 0, star: 'Amaral',             stats: { offense: 6, defense: 6, power: 6, speed: 6, technique: 7 }, fact: 'Time mais jovem da lista, criado em 1999 a partir da fusão Tokyo Gas + Tokyo FC.' },
            { name: 'Oita Trinita',           city: 'Oita',      color: '#0033cc', color2: '#ffffff', shield: 'assets/shields/oita.png',      stadium: 'Oita Stadium',             founded: 1994, titles: 0, star: 'Takagi',             stats: { offense: 5, defense: 5, power: 5, speed: 5, technique: 5 }, fact: '"Trinita" significa "trindade" em italiano. Fundado em 1994, é um dos mais novos.' },
            { name: 'Montedio Yamagata',      city: 'Yamagata',  color: '#006633', color2: '#ffffff', shield: 'assets/shields/yamagata.png',  stadium: 'ND Soft Stadium',          founded: 1984, titles: 0, star: 'Sato',               stats: { offense: 5, defense: 5, power: 5, speed: 5, technique: 5 }, fact: '"Montedio" junta "Monte" (montanha) + "Dio" (deus). Yamagata é região montanhosa.' },
            { name: 'Vegalta Sendai',         city: 'Sendai',    color: '#ffcc00', color2: '#003399', shield: 'assets/shields/sendai.png',    stadium: 'Yurtec Stadium',           founded: 1988, titles: 0, star: 'Nakayama',           stats: { offense: 5, defense: 5, power: 5, speed: 6, technique: 5 }, fact: '"Vegalta" vem de "Vega" (estrela) + "Alta" (alta). Cores amarelo e azul.' },
            { name: 'Sagan Tosu',             city: 'Tosu',      color: '#ff0066', color2: '#ffffff', shield: 'assets/shields/tosu.png',      stadium: 'Best Amenity Stadium',     founded: 1997, titles: 0, star: 'Toyoda',             stats: { offense: 5, defense: 5, power: 5, speed: 5, technique: 5 }, fact: '"Sagan" tem origem na palavra japonesa para "areia movediça". Time de Kyushu.' },
            { name: 'Albirex Niigata',        city: 'Niigata',   color: '#ff6600', color2: '#003399', shield: 'assets/shields/niigata.png',   stadium: 'Big Swan Stadium',         founded: 1955, titles: 0, star: 'Takahara',           stats: { offense: 5, defense: 5, power: 5, speed: 6, technique: 5 }, fact: '"Albirex" vem de "Albi" (branco) + "Rex" (rei). As cores laranja e azul representam o mar do Japão.' },
            { name: 'Ventforet Kofu',         city: 'Kofu',      color: '#0033aa', color2: '#ffffff', shield: 'assets/shields/kofu.png',      stadium: 'Kose Sports Park',         founded: 1965, titles: 0, star: 'Baré',               stats: { offense: 5, defense: 5, power: 5, speed: 5, technique: 5 }, fact: '"Ventforet" vem de "Vent" (vento) + "Forêt" (floresta). Kofu é cercada por montanhas.' },
            { name: 'Otsuka Pharmaceutical',  city: 'Tokushima', color: '#0099cc', color2: '#ffffff', shield: 'assets/shields/otsuka.png',    stadium: 'Naruto Athletic Park',     founded: 1955, titles: 0, star: 'Ishikawa',           stats: { offense: 4, defense: 4, power: 5, speed: 5, technique: 5 }, fact: 'Nome da farmacêutica dona do time. Joga em Tokushima, na ilha de Shikoku.' },
            { name: 'Mito HollyHock',         city: 'Mito',      color: '#0033cc', color2: '#ffffff', shield: 'assets/shields/mito.png',      stadium: 'K\'s denki Stadium',       founded: 1990, titles: 0, star: 'Yoshida',            stats: { offense: 4, defense: 4, power: 4, speed: 5, technique: 4 }, fact: '"HollyHock" é uma flor típica de Mito. Time fundado em 1990 pela prefeitura.' },
            { name: 'Shonan Bellmare',        city: 'Hiratsuka', color: '#009966', color2: '#ffffff', shield: 'assets/shields/shonan.png',    stadium: 'Hiratsuka Stadium',        founded: 1968, titles: 0, star: 'Nakamura',           stats: { offense: 5, defense: 5, power: 5, speed: 5, technique: 6 }, fact: '"Bellmare" vem de "Bello" (belo) + "Mare" (mar). A região de Shonan é litorânea.' },
        ],
    },
};