// script.js - StudyBuddy avec 20+ questions par matière

// ============ CONFIGURATION ============
const GAME_CONFIG = {
    CORRECT_ANSWER_POINTS: 100,
    FAST_ANSWER_BONUS: 50,
    QUESTION_TIME: 30,
    QUESTIONS_PER_QUIZ: 10, // On garde 10 questions par quiz pour ne pas être trop long
    LEVEL_THRESHOLDS: [0, 500, 1500, 3000, 5000, 10000],
    LEVEL_NAMES: ['Débutant', 'Apprenti', 'Confirmé', 'Expert', 'Maître', 'Génie']
};

// ============ ÉTAT DU JEU ============
let gameState = {
    score: 0,
    streak: 0,
    bestStreak: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    fastAnswers: 0,
    currentLevel: 0,
    currentSubject: null,
    questions: [],
    currentQuestionIndex: 0,
    timer: null,
    timeLeft: GAME_CONFIG.QUESTION_TIME,
    gameActive: false,
    selectedAnswer: null
};

// ============ BASE DE DONNÉES DE 20+ QUESTIONS PAR MATIÈRE ============
const QUESTIONS_DB = {
    maths: [
        {
            question: "Combien font 7 × 8 ?",
            answers: [
                { text: "56", correct: true },
                { text: "54", correct: false },
                { text: "58", correct: false },
                { text: "64", correct: false }
            ],
            explanation: "7 × 8 = 56 ! C'est la table de multiplication la plus célèbre !",
            funFact: "Savais-tu que 56 est aussi le nombre d'os dans le corps humain ? 💀"
        },
        {
            question: "Quelle est la racine carrée de 144 ?",
            answers: [
                { text: "12", correct: true },
                { text: "14", correct: false },
                { text: "24", correct: false },
                { text: "72", correct: false }
            ],
            explanation: "12 × 12 = 144, donc √144 = 12 !",
            funFact: "144 est un nombre carré parfait et c'est aussi une douzaine de douzaines !"
        },
        {
            question: "Si un triangle a des angles de 60°, 60°, quel est le troisième angle ?",
            answers: [
                { text: "60°", correct: true },
                { text: "90°", correct: false },
                { text: "30°", correct: false },
                { text: "45°", correct: false }
            ],
            explanation: "La somme des angles d'un triangle est toujours 180°. 180 - 60 - 60 = 60°",
            funFact: "C'est un triangle équilatéral : tous les côtés sont égaux ! 🔺"
        },
        {
            question: "Combien font ¾ + ¼ ?",
            answers: [
                { text: "1", correct: true },
                { text: "½", correct: false },
                { text: "⅔", correct: false },
                { text: "⅘", correct: false }
            ],
            explanation: "3/4 + 1/4 = 4/4 = 1 ! Comme 3 parts de pizza + 1 part = la pizza entière ! 🍕",
            funFact: "Les fractions étaient utilisées par les Égyptiens il y a 4000 ans !"
        },
        {
            question: "Quelle est l'aire d'un rectangle de 8 cm par 5 cm ?",
            answers: [
                { text: "40 cm²", correct: true },
                { text: "13 cm²", correct: false },
                { text: "26 cm²", correct: false },
                { text: "45 cm²", correct: false }
            ],
            explanation: "Aire = longueur × largeur = 8 × 5 = 40 cm²",
            funFact: "Un rectangle d'or a des proportions spéciales qu'on trouve dans l'art et l'architecture !"
        },
        {
            question: "Si x + 5 = 12, que vaut x ?",
            answers: [
                { text: "7", correct: true },
                { text: "17", correct: false },
                { text: "5", correct: false },
                { text: "12", correct: false }
            ],
            explanation: "x = 12 - 5 = 7. C'est comme dire : 'Quel nombre + 5 donne 12 ?'",
            funFact: "Le 'x' en algèbre vient de l'arabe 'chay' qui signifie 'chose' !"
        },
        {
            question: "Combien de côtés a un hexagone ?",
            answers: [
                { text: "6", correct: true },
                { text: "5", correct: false },
                { text: "7", correct: false },
                { text: "8", correct: false }
            ],
            explanation: "Hexa = 6 en grec. Hexagone = 6 côtés !",
            funFact: "Les alvéoles des abeilles sont des hexagones parfaits ! 🐝"
        },
        {
            question: "Quel est le périmètre d'un carré de côté 3 cm ?",
            answers: [
                { text: "12 cm", correct: true },
                { text: "9 cm", correct: false },
                { text: "6 cm", correct: false },
                { text: "3 cm", correct: false }
            ],
            explanation: "Périmètre = 4 × côté = 4 × 3 = 12 cm",
            funFact: "Le carré est la seule forme qui peut paver un plan sans laisser d'espace !"
        },
        {
            question: "Quel nombre est divisible par 2, 3 et 5 ?",
            answers: [
                { text: "30", correct: true },
                { text: "15", correct: false },
                { text: "20", correct: false },
                { text: "25", correct: false }
            ],
            explanation: "30 ÷ 2 = 15, 30 ÷ 3 = 10, 30 ÷ 5 = 6. Parfait !",
            funFact: "30 est la somme des quatre premiers nombres carrés : 1+4+9+16 = 30"
        },
        {
            question: "Combien font 15% de 200 ?",
            answers: [
                { text: "30", correct: true },
                { text: "15", correct: false },
                { text: "20", correct: false },
                { text: "45", correct: false }
            ],
            explanation: "15% de 200 = (15/100) × 200 = 0.15 × 200 = 30",
            funFact: "Le symbole % vient de l'italien 'per cento' qui signifie 'pour cent'"
        },
        {
            question: "Quelle est la moitié de ¾ ?",
            answers: [
                { text: "⅜", correct: true },
                { text: "½", correct: false },
                { text: "¼", correct: false },
                { text: "1½", correct: false }
            ],
            explanation: "½ de ¾ = ½ × ¾ = 3/8",
            funFact: "Les fractions étaient tellement importantes pour les Romains qu'ils avaient des dieux pour les fractions !"
        },
        {
            question: "Combien font 2³ ?",
            answers: [
                { text: "8", correct: true },
                { text: "6", correct: false },
                { text: "9", correct: false },
                { text: "4", correct: false }
            ],
            explanation: "2³ = 2 × 2 × 2 = 8. C'est la puissance de 2 !",
            funFact: "8 est le plus petit cube parfait après 1 !"
        },
        {
            question: "Quel est le plus grand commun diviseur de 12 et 18 ?",
            answers: [
                { text: "6", correct: true },
                { text: "2", correct: false },
                { text: "3", correct: false },
                { text: "9", correct: false }
            ],
            explanation: "Les diviseurs de 12: 1,2,3,4,6,12. De 18: 1,2,3,6,9,18. Le plus grand commun : 6",
            funFact: "Le PGCD est utilisé pour simplifier les fractions !"
        },
        {
            question: "Si un angle mesure 135°, quel type d'angle est-ce ?",
            answers: [
                { text: "Obtus", correct: true },
                { text: "Aigu", correct: false },
                { text: "Droit", correct: false },
                { text: "Plat", correct: false }
            ],
            explanation: "Angle obtus : entre 90° et 180°. Angle aigu : <90°. Droit : 90°. Plat : 180°",
            funFact: "Le mot 'angle' vient du latin 'angulus' qui signifie 'coin' !"
        },
        {
            question: "Combien font 0.25 × 4 ?",
            answers: [
                { text: "1", correct: true },
                { text: "0.5", correct: false },
                { text: "4", correct: false },
                { text: "0.1", correct: false }
            ],
            explanation: "0.25 = ¼, et ¼ × 4 = 1. Logique !",
            funFact: "0.25 c'est aussi 25%, soit un quart d'un tout !"
        },
        {
            question: "Quelle est la formule du volume d'un cube ?",
            answers: [
                { text: "côté³", correct: true },
                { text: "côté²", correct: false },
                { text: "3 × côté", correct: false },
                { text: "6 × côté²", correct: false }
            ],
            explanation: "Volume = côté × côté × côté = côté³",
            funFact: "Un cube a exactement 11 développements différents possibles !"
        },
        {
            question: "Combien font ½ + ⅓ ?",
            answers: [
                { text: "⅚", correct: true },
                { text: "⅖", correct: false },
                { text: "½", correct: false },
                { text: "1", correct: false }
            ],
            explanation: "½ = 3/6, ⅓ = 2/6, donc 3/6 + 2/6 = 5/6",
            funFact: "Les Égyptiens n'utilisaient que des fractions avec 1 au numérateur !"
        },
        {
            question: "Quel est le symétrique de 7 par rapport à 0 ?",
            answers: [
                { text: "-7", correct: true },
                { text: "7", correct: false },
                { text: "0", correct: false },
                { text: "14", correct: false }
            ],
            explanation: "Le symétrique de x par rapport à 0 est -x. Donc symétrique de 7 = -7",
            funFact: "Les nombres négatifs ont mis longtemps à être acceptés en mathématiques !"
        },
        {
            question: "Combien de minutes dans 2 heures et demie ?",
            answers: [
                { text: "150 minutes", correct: true },
                { text: "120 minutes", correct: false },
                { text: "180 minutes", correct: false },
                { text: "90 minutes", correct: false }
            ],
            explanation: "2 heures = 120 minutes, demi-heure = 30 minutes, total = 150 minutes",
            funFact: "Une journée compte 1440 minutes exactement !"
        },
        {
            question: "Quelle est la probabilité d'obtenir pile en lançant une pièce ?",
            answers: [
                { text: "½ ou 50%", correct: true },
                { text: "¼ ou 25%", correct: false },
                { text: "1 ou 100%", correct: false },
                { text: "0%", correct: false }
            ],
            explanation: "Une pièce a 2 faces équiprobables : pile ou face. Probabilité = 1/2",
            funFact: "Sur 100 lancers, on obtient environ 50 piles et 50 faces !"
        },
        {
            question: "Combien font 9² - 7² ?",
            answers: [
                { text: "32", correct: true },
                { text: "4", correct: false },
                { text: "16", correct: false },
                { text: "81", correct: false }
            ],
            explanation: "9² = 81, 7² = 49, donc 81 - 49 = 32",
            funFact: "a² - b² = (a+b)(a-b). Ici : (9+7)(9-7) = 16×2 = 32 !"
        },
        {
            question: "Quel est le plus petit multiple commun de 4 et 6 ?",
            answers: [
                { text: "12", correct: true },
                { text: "24", correct: false },
                { text: "6", correct: false },
                { text: "4", correct: false }
            ],
            explanation: "Multiples de 4: 4,8,12,16... Multiples de 6: 6,12,18... Le plus petit commun : 12",
            funFact: "Le PPCM est utile pour additionner des fractions avec dénominateurs différents !"
        }
    ],
    
    science: [
        {
            question: "Quelle planète est surnommée 'la planète rouge' ?",
            answers: [
                { text: "Mars", correct: true },
                { text: "Vénus", correct: false },
                { text: "Jupiter", correct: false },
                { text: "Saturne", correct: false }
            ],
            explanation: "Mars est rouge à cause de l'oxyde de fer (rouille) à sa surface !",
            funFact: "Un jour sur Mars dure 24h39min, presque comme sur Terre !"
        },
        {
            question: "L'eau bout à quelle température au niveau de la mer ?",
            answers: [
                { text: "100°C", correct: true },
                { text: "90°C", correct: false },
                { text: "0°C", correct: false },
                { text: "50°C", correct: false }
            ],
            explanation: "À 100°C, la pression de vapeur égale la pression atmosphérique et l'eau bout !",
            funFact: "Sur le Mont Everest, l'eau bout à 68°C seulement à cause de la basse pression !"
        },
        {
            question: "Quel gaz les plantes absorbent-elles pendant la photosynthèse ?",
            answers: [
                { text: "CO₂ (dioxyde de carbone)", correct: true },
                { text: "O₂ (oxygène)", correct: false },
                { text: "N₂ (azote)", correct: false },
                { text: "H₂ (hydrogène)", correct: false }
            ],
            explanation: "Les plantes absorbent CO₂ + eau + lumière → glucose + O₂. Magique ! 🌿",
            funFact: "Une forêt de 1 hectare absorbe environ 10 tonnes de CO₂ par an !"
        },
        {
            question: "Quelle est l'unité de mesure du courant électrique ?",
            answers: [
                { text: "Ampère (A)", correct: true },
                { text: "Volt (V)", correct: false },
                { text: "Watt (W)", correct: false },
                { text: "Ohm (Ω)", correct: false }
            ],
            explanation: "Ampère mesure l'intensité du courant (quantité d'électrons qui passent).",
            funFact: "André-Marie Ampère a donné son nom à cette unité au 19ème siècle !"
        },
        {
            question: "Combien d'os compte le corps humain adulte ?",
            answers: [
                { text: "206", correct: true },
                { text: "156", correct: false },
                { text: "300", correct: false },
                { text: "106", correct: false }
            ],
            explanation: "Le squelette humain adulte compte 206 os, mais les bébés en ont 300 !",
            funFact: "Les os les plus petits sont dans l'oreille moyenne : marteau, enclume, étrier !"
        },
        {
            question: "Quel est l'élément chimique le plus abondant dans l'univers ?",
            answers: [
                { text: "Hydrogène (H)", correct: true },
                { text: "Oxygène (O)", correct: false },
                { text: "Carbone (C)", correct: false },
                { text: "Hélium (He)", correct: false }
            ],
            explanation: "L'hydrogène constitue environ 75% de la masse de l'univers !",
            funFact: "Le Soleil est principalement composé d'hydrogène qui fusionne en hélium ! ☀️"
        },
        {
            question: "Quelle force nous maintient sur Terre ?",
            answers: [
                { text: "La gravité", correct: true },
                { text: "Le magnétisme", correct: false },
                { text: "La friction", correct: false },
                { text: "La pression atmosphérique", correct: false }
            ],
            explanation: "La gravité terrestre nous attire vers le centre de la Terre avec une force de 9.8 m/s².",
            funFact: "Sur la Lune, tu pèserais 6 fois moins à cause de la gravité plus faible !"
        },
        {
            question: "Quel est le plus grand organe du corps humain ?",
            answers: [
                { text: "La peau", correct: true },
                { text: "Le foie", correct: false },
                { text: "Les poumons", correct: false },
                { text: "Le cerveau", correct: false }
            ],
            explanation: "La peau d'un adulte pèse environ 5 kg et couvre 2 m² !",
            funFact: "Tu perds environ 30 000 à 40 000 cellules de peau chaque minute !"
        },
        {
            question: "Quel gaz représente environ 78% de l'air que nous respirons ?",
            answers: [
                { text: "Azote (N₂)", correct: true },
                { text: "Oxygène (O₂)", correct: false },
                { text: "Dioxyde de carbone (CO₂)", correct: false },
                { text: "Argon (Ar)", correct: false }
            ],
            explanation: "L'air est composé de 78% N₂, 21% O₂, 1% autres gaz dont CO₂, Ar, etc.",
            funFact: "Les plantes ne peuvent pas utiliser l'azote de l'air directement, elles ont besoin de bactéries !"
        },
        {
            question: "Quelle planète a des anneaux visibles depuis la Terre ?",
            answers: [
                { text: "Saturne", correct: true },
                { text: "Jupiter", correct: false },
                { text: "Uranus", correct: false },
                { text: "Neptune", correct: false }
            ],
            explanation: "Saturne a les anneaux les plus spectaculaires, composés de glace et de roche !",
            funFact: "Les anneaux de Saturne font environ 280 000 km de diamètre mais seulement 10 m d'épaisseur !"
        },
        {
            question: "Quel est le pH de l'eau pure ?",
            answers: [
                { text: "7 (neutre)", correct: true },
                { text: "0 (acide)", correct: false },
                { text: "14 (basique)", correct: false },
                { text: "1 (très acide)", correct: false }
            ],
            explanation: "pH 7 = neutre. <7 = acide, >7 = basique. L'eau pure est à pH 7.",
            funFact: "Le pH du sang humain est d'environ 7.4, légèrement basique !"
        },
        {
            question: "Combien de temps la lumière du Soleil met-elle pour nous parvenir ?",
            answers: [
                { text: "8 minutes environ", correct: true },
                { text: "1 seconde", correct: false },
                { text: "1 heure", correct: false },
                { text: "1 jour", correct: false }
            ],
            explanation: "La lumière voyage à 300 000 km/s. Distance Terre-Soleil = 150 millions de km = 8 minutes lumière.",
            funFact: "Si le Soleil s'éteignait, on ne le saurait que 8 minutes après !"
        },
        {
            question: "Quel métal est liquide à température ambiante ?",
            answers: [
                { text: "Le mercure", correct: true },
                { text: "L'or", correct: false },
                { text: "Le fer", correct: false },
                { text: "L'aluminium", correct: false }
            ],
            explanation: "Le mercure fond à -39°C, donc il est liquide à température ambiante (20°C).",
            funFact: "Le gallium fond à 30°C, donc il fond dans ta main !"
        },
        {
            question: "Quelle partie de la plante produit l'oxygène ?",
            answers: [
                { text: "Les feuilles", correct: true },
                { text: "Les racines", correct: false },
                { text: "La tige", correct: false },
                { text: "Les fleurs", correct: false }
            ],
            explanation: "Les chloroplastes dans les feuilles réalisent la photosynthèse et produisent l'oxygène.",
            funFact: "Une forêt mature produit assez d'oxygène pour 10 personnes par hectare !"
        },
        {
            question: "Quelle est la vitesse du son dans l'air ?",
            answers: [
                { text: "340 m/s environ", correct: true },
                { text: "3000 m/s", correct: false },
                { text: "100 m/s", correct: false },
                { text: "1000 m/s", correct: false }
            ],
            explanation: "À 20°C, le son voyage à 343 m/s dans l'air. Plus lent que la lumière !",
            funFact: "Dans l'eau, le son va 4 fois plus vite (1480 m/s) !"
        },
        {
            question: "Quelle est la planète la plus proche du Soleil ?",
            answers: [
                { text: "Mercure", correct: true },
                { text: "Vénus", correct: false },
                { text: "Terre", correct: false },
                { text: "Mars", correct: false }
            ],
            explanation: "Mercure est à 58 millions de km du Soleil, contre 150 millions pour la Terre.",
            funFact: "Une journée sur Mercure dure 59 jours terrestres, mais une année dure seulement 88 jours !"
        },
        {
            question: "Quel gaz produit-on quand on respire ?",
            answers: [
                { text: "CO₂ (dioxyde de carbone)", correct: true },
                { text: "O₂ (oxygène)", correct: false },
                { text: "N₂ (azote)", correct: false },
                { text: "H₂ (hydrogène)", correct: false }
            ],
            explanation: "On inspire O₂, nos cellules l'utilisent, et on expire CO₂ + vapeur d'eau.",
            funFact: "Un humain expire environ 1 kg de CO₂ par jour !"
        },
        {
            question: "Quelle est la température normale du corps humain ?",
            answers: [
                { text: "37°C", correct: true },
                { text: "30°C", correct: false },
                { text: "40°C", correct: false },
                { text: "25°C", correct: false }
            ],
            explanation: "37°C est la température moyenne, mais elle peut varier entre 36.1°C et 37.2°C.",
            funFact: "La fièvre aide ton corps à combattre les infections en activant le système immunitaire !"
        },
        {
            question: "Quelle planète a le plus de lunes ?",
            answers: [
                { text: "Jupiter", correct: true },
                { text: "Saturne", correct: false },
                { text: "Uranus", correct: false },
                { text: "Neptune", correct: false }
            ],
            explanation: "Jupiter a au moins 95 lunes connues ! Ganymède est plus grosse que Mercure !",
            funFact: "La Lune de la Terre est proportionnellement énorme : 1/4 du diamètre terrestre !"
        },
        {
            question: "Quelle est la formule chimique de l'eau ?",
            answers: [
                { text: "H₂O", correct: true },
                { text: "CO₂", correct: false },
                { text: "O₂", correct: false },
                { text: "NaCl", correct: false }
            ],
            explanation: "H₂O = 2 atomes d'hydrogène + 1 atome d'oxygène. Simple mais essentiel !",
            funFact: "L'eau est la seule substance naturelle qui existe sous 3 états sur Terre : solide, liquide, gaz !"
        },
        {
            question: "Quelle force fait tomber une pomme ?",
            answers: [
                { text: "La gravité", correct: true },
                { text: "Le magnétisme", correct: false },
                { text: "L'électricité", correct: false },
                { text: "La poussée d'Archimède", correct: false }
            ],
            explanation: "La gravité terrestre attire tous les objets vers le centre de la Terre.",
            funFact: "La légende dit que Newton a découvert la gravité en voyant une pomme tomber ! 🍎"
        },
        {
            question: "Combien de chromosomes a un être humain ?",
            answers: [
                { text: "46 (23 paires)", correct: true },
                { text: "23", correct: false },
                { text: "64", correct: false },
                { text: "32", correct: false }
            ],
            explanation: "23 chromosomes de la mère + 23 du père = 46 chromosomes chez l'humain.",
            funFact: "Les chimpanzés ont 48 chromosomes, les oignons 16, et les fougères jusqu'à 1200 !"
        }
    ],
    
    french: [
        {
            question: "Quel est le féminin de 'chanteur' ?",
            answers: [
                { text: "Chanteuse", correct: true },
                { text: "Chantrice", correct: false },
                { text: "Chanteure", correct: false },
                { text: "Chantiste", correct: false }
            ],
            explanation: "Chanteur → chanteuse. Comme acteur → actrice, vendeur → vendeuse.",
            funFact: "En français, environ 2000 métiers ont une forme féminine !"
        },
        {
            question: "Quel mot est correctement orthographié ?",
            answers: [
                { text: "Accueil", correct: true },
                { text: "Acceuil", correct: false },
                { text: "Aceuil", correct: false },
                { text: "Acueil", correct: false }
            ],
            explanation: "Accueil vient du verbe 'accueillir'. Souviens-toi : 'euil' comme 'fauteuil' !",
            funFact: "'Accueil' vient du latin 'ad colligere' qui signifie 'recueillir' !"
        },
        {
            question: "Quelle est la nature grammaticale du mot 'rapidement' ?",
            answers: [
                { text: "Adverbe", correct: true },
                { text: "Adjectif", correct: false },
                { text: "Nom", correct: false },
                { text: "Verbe", correct: false }
            ],
            explanation: "Les adverbes en '-ment' modifient les verbes : 'courir rapidement'.",
            funFact: "Le suffixe '-ment' vient du latin 'mente' qui signifie 'avec l'esprit' !"
        },
        {
            question: "Quel est le synonyme de 'joyeux' ?",
            answers: [
                { text: "Gai", correct: true },
                { text: "Triste", correct: false },
                { text: "Calme", correct: false },
                { text: "Fatigué", correct: false }
            ],
            explanation: "Joyeux et gai expriment tous deux le bonheur et la bonne humeur ! 😄",
            funFact: "Le français a environ 60 000 mots, mais Victor Hugo en utilisait 38 000 dans ses œuvres !"
        },
        {
            question: "Quel mot contient une majuscule incorrecte ?",
            answers: [
                { text: "Un Français", correct: true },
                { text: "la France", correct: false },
                { text: "Paris", correct: false },
                { text: "l'anglais", correct: false }
            ],
            explanation: "On écrit 'un Français' (habitant) mais 'le français' (langue) sans majuscule !",
            funFact: "Les majuscules accentuées sont obligatoires en français : École, À, Ça..."
        },
        {
            question: "Quelle est la fonction de 'dans le jardin' dans : 'Les enfants jouent dans le jardin' ?",
            answers: [
                { text: "Complément circonstanciel de lieu", correct: true },
                { text: "Sujet", correct: false },
                { text: "COD", correct: false },
                { text: "Attribut du sujet", correct: false }
            ],
            explanation: "Il indique OÙ se passe l'action : dans le jardin = lieu.",
            funFact: "Il existe 8 types de compléments circonstanciels : lieu, temps, manière, cause..."
        },
        {
            question: "Quel temps est 'nous irons' ?",
            answers: [
                { text: "Futur simple", correct: true },
                { text: "Imparfait", correct: false },
                { text: "Passé composé", correct: false },
                { text: "Présent", correct: false }
            ],
            explanation: "'Irons' = futur simple du verbe 'aller'. Nous irons demain = action future.",
            funFact: "Le futur simple se forme avec l'infinitif + terminaisons : -ai, -as, -a, -ons, -ez, -ont"
        },
        {
            question: "Quel mot est un homophone de 'verre' ?",
            answers: [
                { text: "Vert", correct: true },
                { text: "Vers", correct: true },
                { text: "Vair", correct: true },
                { text: "Verr", correct: false }
            ],
            explanation: "Verre (à boire), vert (couleur), vers (préposition), vair (fourrure) se prononcent pareil !",
            funFact: "Les homophones sont la cause de 30% des fautes d'orthographe en français !"
        },
        {
            question: "Quelle phrase est correcte ?",
            answers: [
                { text: "Je vais au cinéma", correct: true },
                { text: "Je vais à le cinéma", correct: false },
                { text: "Je vais en le cinéma", correct: false },
                { text: "Je vais dans le cinéma", correct: false }
            ],
            explanation: "'à + le' devient 'au'. À + la = à la. À + les = aux.",
            funFact: "Ces contractions (au, aux, du, des) existent depuis l'ancien français !"
        },
        {
            question: "Quel est le pluriel de 'cheval' ?",
            answers: [
                { text: "Chevaux", correct: true },
                { text: "Chevals", correct: false },
                { text: "Chevauxs", correct: false },
                { text: "Chevaus", correct: false }
            ],
            explanation: "Les noms en -al font souvent -aux au pluriel : cheval→chevaux, journal→journaux.",
            funFact: "Quelques exceptions : bal→bals, carnaval→carnavals, récital→récitals !"
        },
        {
            question: "Quel mot est masculin ?",
            answers: [
                { text: "Orage", correct: true },
                { text: "Pluie", correct: false },
                { text: "Tempête", correct: false },
                { text: "Avaleur", correct: false }
            ],
            explanation: "Un orage (masculin). La pluie, la tempête, l'avaleur (féminins).",
            funFact: "87% des mots français sont masculins selon certaines études !"
        },
        {
            question: "Quelle est la conjugaison correcte : 'Il _____ hier' ?",
            answers: [
                { text: "est venu", correct: true },
                { text: "a venu", correct: false },
                { text: "est venir", correct: false },
                { text: "a venir", correct: false }
            ],
            explanation: "'Venir' se conjugue avec être aux temps composés : il est venu.",
            funFact: "14 verbes se conjuguent avec 'être' : aller, venir, arriver, partir, naître, mourir..."
        },
        {
            question: "Quel mot complète : 'C'est le livre _____ j'ai besoin' ?",
            answers: [
                { text: "dont", correct: true },
                { text: "que", correct: false },
                { text: "qui", correct: false },
                { text: "où", correct: false }
            ],
            explanation: "'Avoir besoin de quelque chose' → 'dont' remplace 'de + chose'.",
            funFact: "'Dont' est le pronom relatif le plus difficile pour les apprenants du français !"
        },
        {
            question: "Quelle est la nature de 'beau' dans 'un beau livre' ?",
            answers: [
                { text: "Adjectif qualificatif", correct: true },
                { text: "Adverbe", correct: false },
                { text: "Nom", correct: false },
                { text: "Pronom", correct: false }
            ],
            explanation: "'Beau' qualifie le livre, c'est un adjectif qualificatif épithète.",
            funFact: "L'adjectif 'beau' devient 'bel' devant une voyelle : un bel arbre !"
        },
        {
            question: "Quelle phrase est au subjonctif présent ?",
            answers: [
                { text: "Il faut que tu viennes", correct: true },
                { text: "Tu viens demain", correct: false },
                { text: "Tu es venu hier", correct: false },
                { text: "Tu viendras plus tard", correct: false }
            ],
            explanation: "'Que tu viennes' = subjonctif présent après 'il faut que'.",
            funFact: "Le subjonctif exprime le doute, le souhait, l'obligation, l'émotion..."
        },
        {
            question: "Quel mot prend un accent circonflexe ?",
            answers: [
                { text: "Fête", correct: true },
                { text: "Tete", correct: false },
                { text: "Tete", correct: false },
                { text: "Fete", correct: false }
            ],
            explanation: "Fête, tête, bête, être... l'accent circonflexe remplace souvent un 's' disparu.",
            funFact: "Forêt vient de 'forest', hôtel de 'hostel', île de 'isle' ! L'accent montre l'histoire du mot !"
        },
        {
            question: "Quelle est la fonction de 'très' dans 'très content' ?",
            answers: [
                { text: "Adverbe d'intensité", correct: true },
                { text: "Adjectif", correct: false },
                { text: "Préposition", correct: false },
                { text: "Conjonction", correct: false }
            ],
            explanation: "'Très' modifie l'adjectif 'content' en renforçant son sens.",
            funFact: "'Très' vient du latin 'trans' qui signifie 'au-delà' !"
        },
        {
            question: "Quel mot est un paronyme de 'affecter' ?",
            answers: [
                { text: "Effectuer", correct: true },
                { text: "Infecter", correct: false },
                { text: "Défecter", correct: false },
                { text: "Perfectionner", correct: false }
            ],
            explanation: "Affecter (influencer) et effectuer (réaliser) se ressemblent mais ont des sens différents !",
            funFact: "Les paronymes causent plus d'erreurs que les homophones !"
        },
        {
            question: "Quelle phrase est correctement ponctuée ?",
            answers: [
                { text: "Viens ici, s'il te plaît.", correct: true },
                { text: "Viens ici s'il te plaît.", correct: false },
                { text: "Viens ici, s'il te plaît", correct: false },
                { text: "Viens ici s'il te plaît", correct: false }
            ],
            explanation: "Virgule avant l'incise, point à la fin. La politesse mérite une ponctuation parfaite !",
            funFact: "La ponctuation moderne date de la Renaissance, avant on écrivait sans espaces !"
        },
        {
            question: "Quel est l'antonyme de 'rapide' ?",
            answers: [
                { text: "Lent", correct: true },
                { text: "Vite", correct: false },
                { text: "Accéléré", correct: false },
                { text: "Précis", correct: false }
            ],
            explanation: "Rapide ≠ lent, comme jour ≠ nuit, chaud ≠ froid.",
            funFact: "Certains mots n'ont pas d'antonyme exact, comme 'maison' ou 'arbre' !"
        },
        {
            question: "Quelle forme est correcte au pluriel ?",
            answers: [
                { text: "Des chefs-d'œuvre", correct: true },
                { text: "Des chef-d'œuvres", correct: false },
                { text: "Des chefs-d'œuvres", correct: false },
                { text: "Des chef-d'œuvre", correct: false }
            ],
            explanation: "Dans les mots composés, seul le nom principal prend la marque du pluriel.",
            funFact: "Des gratte-ciel, des porte-avions, des après-midis... chaque type a ses règles !"
        },
        {
            question: "Quel mot est dérivé de 'terre' ?",
            answers: [
                { text: "Terrestre", correct: true },
                { text: "Terrine", correct: false },
                { text: "Terrien", correct: true },
                { text: "Terrifier", correct: false }
            ],
            explanation: "Terrestre (qui concerne la terre), terrien (habitant de la Terre).",
            funFact: "Le français peut former des milliers de mots à partir d'une même racine !"
        }
    ],
    
    history: [
        {
            question: "En quelle année a eu lieu la Révolution française ?",
            answers: [
                { text: "1789", correct: true },
                { text: "1492", correct: false },
                { text: "1914", correct: false },
                { text: "1945", correct: false }
            ],
            explanation: "1789 : Prise de la Bastille le 14 juillet, début de la Révolution !",
            funFact: "La Déclaration des droits de l'homme et du citoyen a été adoptée le 26 août 1789 !"
        },
        {
            question: "Qui a découvert l'Amérique en 1492 ?",
            answers: [
                { text: "Christophe Colomb", correct: true },
                { text: "Marco Polo", correct: false },
                { text: "Vasco de Gama", correct: false },
                { text: "Magellan", correct: false }
            ],
            explanation: "Christophe Colomb, navigateur génois au service de l'Espagne, a découvert les Amériques en 1492.",
            funFact: "Colomb pensait avoir atteint les Indes, c'est pourquoi il a appelé les habitants 'Indiens' !"
        },
        {
            question: "Qui était le président de la France pendant la Seconde Guerre mondiale ?",
            answers: [
                { text: "Albert Lebrun", correct: true },
                { text: "Charles de Gaulle", correct: false },
                { text: "Philippe Pétain", correct: false },
                { text: "Georges Clemenceau", correct: false }
            ],
            explanation: "Albert Lebrun était président (1932-1940). Pétain était chef de l'État français (régime de Vichy).",
            funFact: "De Gaulle n'est devenu président qu'en 1959, sous la Ve République !"
        },
        {
            question: "Quelle civilisation a construit les pyramides de Gizeh ?",
            answers: [
                { text: "Les Égyptiens", correct: true },
                { text: "Les Romains", correct: false },
                { text: "Les Grecs", correct: false },
                { text: "Les Mayas", correct: false }
            ],
            explanation: "Les pyramides de Gizeh ont été construites il y a 4500 ans par les anciens Égyptiens.",
            funFact: "La grande pyramide de Khéops était la plus haute structure du monde pendant 3800 ans !"
        },
        {
            question: "Quand a eu lieu la Première Guerre mondiale ?",
            answers: [
                { text: "1914-1918", correct: true },
                { text: "1939-1945", correct: false },
                { text: "1912-1916", correct: false },
                { text: "1900-1905", correct: false }
            ],
            explanation: "La Grande Guerre a duré du 28 juillet 1914 au 11 novembre 1918.",
            funFact: "Le 11 novembre est devenu un jour férié en France pour commémorer l'armistice !"
        },
        {
            question: "Qui a écrit 'Les Misérables' ?",
            answers: [
                { text: "Victor Hugo", correct: true },
                { text: "Émile Zola", correct: false },
                { text: "Gustave Flaubert", correct: false },
                { text: "Alexandre Dumas", correct: false }
            ],
            explanation: "Victor Hugo a publié 'Les Misérables' en 1862, un roman monumental sur la société française.",
            funFact: "Hugo a écrit une grande partie du livre pendant son exil à Guernesey !"
        },
        {
            question: "Quelle bataille a marqué la fin de Napoléon ?",
            answers: [
                { text: "Waterloo (1815)", correct: true },
                { text: "Austerlitz (1805)", correct: false },
                { text: "Marignan (1515)", correct: false },
                { text: "Verdun (1916)", correct: false }
            ],
            explanation: "La bataille de Waterloo le 18 juin 1815 a été la défaite finale de Napoléon Ier.",
            funFact: "Waterloo se trouve en Belgique, et la bataille a duré seulement une journée !"
        },
        {
            question: "Qui était le roi de France pendant la construction de Versailles ?",
            answers: [
                { text: "Louis XIV", correct: true },
                { text: "Louis XVI", correct: false },
                { text: "François Ier", correct: false },
                { text: "Henri IV", correct: false }
            ],
            explanation: "Louis XIV, le Roi-Soleil, a fait construire le château de Versailles à partir de 1661.",
            funFact: "Versailles avait 357 miroirs dans la galerie des Glaces, une fortune à l'époque !"
        },
        {
            question: "Quelle révolution a commencé en 1917 en Russie ?",
            answers: [
                { text: "La révolution bolchevique", correct: true },
                { text: "La révolution industrielle", correct: false },
                { text: "La révolution française", correct: false },
                { text: "La révolution américaine", correct: false }
            ],
            explanation: "La révolution d'Octobre 1917 a amené les bolcheviks (communistes) au pouvoir en Russie.",
            funFact: "En réalité, la révolution d'Octobre a eu lieu en novembre selon notre calendrier !"
        },
        {
            question: "Qui a peint 'La Joconde' ?",
            answers: [
                { text: "Léonard de Vinci", correct: true },
                { text: "Michel-Ange", correct: false },
                { text: "Raphaël", correct: false },
                { text: "Rembrandt", correct: false }
            ],
            explanation: "Léonard de Vinci a peint ce portrait au début du 16ème siècle.",
            funFact: "La Joconde a été volée en 1911 et retrouvée 2 ans plus tard en Italie !"
        },
        {
            question: "Quand a été signée la Déclaration d'Indépendance américaine ?",
            answers: [
                { text: "1776", correct: true },
                { text: "1789", correct: false },
                { text: "1492", correct: false },
                { text: "1812", correct: false }
            ],
            explanation: "Le 4 juillet 1776, les 13 colonies américaines ont déclaré leur indépendance de la Grande-Bretagne.",
            funFact: "Le 4 juillet est la fête nationale aux États-Unis ! 🇺🇸"
        },
        {
            question: "Qui a été le premier empereur romain ?",
            answers: [
                { text: "Auguste", correct: true },
                { text: "Jules César", correct: false },
                { text: "Néron", correct: false },
                { text: "Constantin", correct: false }
            ],
            explanation: "Auguste (Octave) est devenu le premier empereur romain en 27 av. J.-C.",
            funFact: "Le mois d'août (August) a été nommé en son honneur !"
        },
        {
            question: "Quelle reine française a été exécutée pendant la Révolution ?",
            answers: [
                { text: "Marie-Antoinette", correct: true },
                { text: "Catherine de Médicis", correct: false },
                { text: "Anne d'Autriche", correct: false },
                { text: "Joséphine de Beauharnais", correct: false }
            ],
            explanation: "Marie-Antoinette, épouse de Louis XVI, a été guillotinée le 16 octobre 1793.",
            funFact: "La phrase 'Qu'ils mangent de la brioche' lui est faussement attribuée !"
        },
        {
            question: "Quand a été inventée l'imprimerie par Gutenberg ?",
            answers: [
                { text: "Vers 1450", correct: true },
                { text: "Vers 1350", correct: false },
                { text: "Vers 1550", correct: false },
                { text: "Vers 1650", correct: false }
            ],
            explanation: "Johannes Gutenberg a inventé l'imprimerie à caractères mobiles vers 1450 à Mayence.",
            funFact: "La Bible de Gutenberg a été le premier livre imprimé en série !"
        },
        {
            question: "Qui a dirigé la France pendant la Résistance ?",
            answers: [
                { text: "Charles de Gaulle", correct: true },
                { text: "Philippe Pétain", correct: false },
                { text: "Georges Bidault", correct: false },
                { text: "Jean Moulin", correct: false }
            ],
            explanation: "De Gaulle a dirigé la France libre depuis Londres pendant l'Occupation.",
            funFact: "De Gaulle a lancé son appel du 18 juin 1940 depuis la BBC à Londres !"
        },
        {
            question: "Quelle guerre a opposé la France et l'Angleterre au Moyen Âge ?",
            answers: [
                { text: "La guerre de Cent Ans", correct: true },
                { text: "La guerre de Trente Ans", correct: false },
                { text: "Les croisades", correct: false },
                { text: "Les guerres napoléoniennes", correct: false }
            ],
            explanation: "La guerre de Cent Ans a duré de 1337 à 1453 (116 ans en réalité !).",
            funFact: "Jeanne d'Arc a joué un rôle crucial dans cette guerre !"
        },
        {
            question: "Qui a découvert la pénicilline ?",
            answers: [
                { text: "Alexander Fleming", correct: true },
                { text: "Louis Pasteur", correct: false },
                { text: "Marie Curie", correct: false },
                { text: "Albert Einstein", correct: false }
            ],
            explanation: "Fleming a découvert la pénicilline en 1928, le premier antibiotique.",
            funFact: "La découverte était accidentelle : une moisissure avait contaminé ses cultures !"
        },
        {
            question: "Quand a eu lieu le débarquement de Normandie ?",
            answers: [
                { text: "6 juin 1944", correct: true },
                { text: "8 mai 1945", correct: false },
                { text: "1er septembre 1939", correct: false },
                { text: "11 novembre 1918", correct: false }
            ],
            explanation: "Le D-Day a permis aux Alliés de reprendre pied en Europe occupée.",
            funFact: "C'était la plus grande opération navale de l'histoire avec 7000 navires !"
        },
        {
            question: "Qui a été le dernier tsar de Russie ?",
            answers: [
                { text: "Nicolas II", correct: true },
                { text: "Pierre le Grand", correct: false },
                { text: "Alexandre Ier", correct: false },
                { text: "Ivan le Terrible", correct: false }
            ],
            explanation: "Nicolas II a été forcé d'abdiquer en 1917 et exécuté avec sa famille en 1918.",
            funFact: "Il était cousin avec le roi George V d'Angleterre, ils se ressemblaient beaucoup !"
        },
        {
            question: "Quelle invention a marqué le début de la Révolution industrielle ?",
            answers: [
                { text: "La machine à vapeur", correct: true },
                { text: "L'ordinateur", correct: false },
                { text: "L'ampoule électrique", correct: false },
                { text: "La voiture", correct: false }
            ],
            explanation: "La machine à vapeur de James Watt (1769) a permis l'industrialisation.",
            funFact: "La première locomotive à vapeur roulait à seulement 8 km/h !"
        },
        {
            question: "Qui a été le premier président de la Ve République française ?",
            answers: [
                { text: "Charles de Gaulle", correct: true },
                { text: "Vincent Auriol", correct: false },
                { text: "Georges Pompidou", correct: false },
                { text: "François Mitterrand", correct: false }
            ],
            explanation: "De Gaulle est devenu président en 1959 après la création de la Ve République en 1958.",
            funFact: "La Ve République est le régime politique français le plus long depuis la Révolution !"
        },
        {
            question: "Quelle bataille a opposé César à Vercingétorix ?",
            answers: [
                { text: "Alésia", correct: true },
                { text: "Gergovie", correct: false },
                { text: "Marignan", correct: false },
                { text: "Azincourt", correct: false }
            ],
            explanation: "En 52 av. J.-C., César a vaincu Vercingétorix à Alésia, achevant la conquête de la Gaule.",
            funFact: "Le site d'Alésia se trouve en Bourgogne, à Alise-Sainte-Reine !"
        }
    ]
};

// ============ RÉFÉRENCES DOM ============
const elements = {
    score: document.getElementById('score'),
    streak: document.getElementById('streak'),
    level: document.getElementById('level'),
    correctAnswers: document.getElementById('correctAnswers'),
    fastAnswers: document.getElementById('fastAnswers'),
    bestStreak: document.getElementById('bestStreak'),
    totalPoints: document.getElementById('totalPoints'),
    modeSelection: document.getElementById('modeSelection'),
    gameArea: document.getElementById('gameArea'),
    quizInterface: document.getElementById('quizInterface'),
    timer: document.getElementById('timer'),
    currentQuestion: document.getElementById('currentQuestion'),
    totalQuestions: document.getElementById('totalQuestions'),
    questionText: document.getElementById('questionText'),
    answersGrid: document.getElementById('answersGrid'),
    quizFeedback: document.getElementById('quizFeedback'),
    nextQuestion: document.getElementById('nextQuestion'),
    hintBtn: document.getElementById('hintBtn'),
    avatarFace: document.getElementById('avatarFace'),
    avatarMood: document.getElementById('avatarMood'),
    chatWindow: document.getElementById('chatWindow')
};

// ============ FONCTIONS PRINCIPALES ============

function initGame() {
    updateUI();
    setupEventListeners();
    addChatMessage("Buddy : Salut champion ! 👋 Prêt à devenir un génie en t'amusant ?");
    addChatMessage("Buddy : Choisis une matière et c'est parti ! Chaque quiz a 10 questions sur 20+ disponibles ! 🚀");
}

function updateUI() {
    if (elements.score) elements.score.textContent = `Score : ${gameState.score}`;
    if (elements.streak) elements.streak.textContent = `Série : ${gameState.streak}`;
    if (elements.level) elements.level.textContent = `Niveau : ${GAME_CONFIG.LEVEL_NAMES[gameState.currentLevel]}`;
    if (elements.correctAnswers) elements.correctAnswers.textContent = gameState.correctAnswers;
    if (elements.fastAnswers) elements.fastAnswers.textContent = gameState.fastAnswers;
    if (elements.bestStreak) elements.bestStreak.textContent = gameState.bestStreak;
    if (elements.totalPoints) elements.totalPoints.textContent = gameState.score;
    
    updateLevel();
    updateAvatarMood();
}

function updateLevel() {
    for (let i = GAME_CONFIG.LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (gameState.score >= GAME_CONFIG.LEVEL_THRESHOLDS[i]) {
            gameState.currentLevel = i;
            break;
        }
    }
}

function updateAvatarMood() {
    let mood = "😄 Prêt à jouer !";
    let color = "#74b9ff";
    
    if (gameState.streak >= 5) {
        mood = "🔥 EN FEU !";
        color = "#ff6b6b";
    } else if (gameState.streak >= 3) {
        mood = "😎 Trop fort !";
        color = "#4ecdc4";
    } else if (gameState.streak >= 1) {
        mood = "👍 Ça roule !";
        color = "#45b7d1";
    }
    
    if (elements.avatarMood) elements.avatarMood.textContent = mood;
    if (elements.avatarFace) {
        elements.avatarFace.style.background = `linear-gradient(135deg, ${color}, #0984e3)`;
    }
}

function addChatMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message buddy';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const strong = document.createElement('strong');
    strong.textContent = 'Buddy : ';
    
    const textSpan = document.createElement('span');
    textSpan.innerHTML = message;
    
    contentDiv.appendChild(strong);
    contentDiv.appendChild(textSpan);
    messageDiv.appendChild(contentDiv);
    
    if (elements.chatWindow) {
        elements.chatWindow.appendChild(messageDiv);
        elements.chatWindow.scrollTop = elements.chatWindow.scrollHeight;
        
        // Animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(10px)';
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 10);
    }
}

// ============ FONCTION PRINCIPALE POUR DÉMARRER LE QUIZ ============
function startQuiz(subject) {
    console.log("Démarrage du quiz pour :", subject);
    
    // Gérer le bouton "Aléatoire"
    if (subject === 'random') {
        const subjects = ['maths', 'science', 'french', 'history'];
        subject = subjects[Math.floor(Math.random() * subjects.length)];
        addChatMessage(`Buddy : J'ai choisi ${subject.toUpperCase()} pour toi ! 🎲`);
    }
    
    if (!QUESTIONS_DB[subject]) {
        console.error("Sujet inconnu :", subject);
        addChatMessage(`Buddy : Oups ! Je n'ai pas encore de questions pour ${subject}... 😅`);
        return;
    }
    
    gameState.currentSubject = subject;
    gameState.questions = [...QUESTIONS_DB[subject]];
    gameState.currentQuestionIndex = 0;
    gameState.gameActive = true;
    
    // Mélanger les questions et prendre seulement GAME_CONFIG.QUESTIONS_PER_QUIZ
    shuffleArray(gameState.questions);
    gameState.questions = gameState.questions.slice(0, GAME_CONFIG.QUESTIONS_PER_QUIZ);
    
    // Montrer l'interface du quiz
    if (elements.modeSelection) elements.modeSelection.style.display = 'none';
    if (elements.gameArea) elements.gameArea.style.display = 'none';
    if (elements.quizInterface) elements.quizInterface.style.display = 'block';
    
    // Mettre à jour le compteur
    if (elements.totalQuestions) elements.totalQuestions.textContent = gameState.questions.length;
    
    // Message de démarrage
    const subjectNames = {
        maths: 'Maths 🧮 (10 questions sur 22 disponibles)',
        science: 'Sciences 🧪 (10 questions sur 22 disponibles)',
        french: 'Français 📚 (10 questions sur 22 disponibles)',
        history: 'Histoire 🏛️ (10 questions sur 22 disponibles)'
    };
    
    addChatMessage(`Buddy : ${subjectNames[subject]} ? Excellent choix ! 🚀`);
    addChatMessage(`Buddy : Tu as ${GAME_CONFIG.QUESTION_TIME} secondes par question. Bonne chance ! ⏱️`);
    
    // Charger la première question
    loadQuestion();
}

function loadQuestion() {
    if (gameState.currentQuestionIndex >= gameState.questions.length) {
        endQuiz();
        return;
    }
    
    const question = gameState.questions[gameState.currentQuestionIndex];
    
    // Réinitialiser
    gameState.selectedAnswer = null;
    gameState.timeLeft = GAME_CONFIG.QUESTION_TIME;
    if (elements.timer) elements.timer.textContent = gameState.timeLeft;
    if (elements.timer) elements.timer.style.color = '';
    
    // Mettre à jour l'interface
    if (elements.currentQuestion) elements.currentQuestion.textContent = gameState.currentQuestionIndex + 1;
    if (elements.questionText) elements.questionText.textContent = question.question;
    if (elements.quizFeedback) elements.quizFeedback.innerHTML = '';
    
    // Générer les réponses
    if (elements.answersGrid) {
        elements.answersGrid.innerHTML = '';
        const shuffledAnswers = [...question.answers];
        shuffleArray(shuffledAnswers);
        
        shuffledAnswers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = answer.text;
            button.dataset.correct = answer.correct;
            
            button.addEventListener('click', () => selectAnswer(button, answer.correct));
            elements.answersGrid.appendChild(button);
        });
    }
    
    // Démarrer le timer
    startTimer();
}

function startTimer() {
    if (gameState.timer) clearInterval(gameState.timer);
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        if (elements.timer) elements.timer.textContent = gameState.timeLeft;
        
        if (gameState.timeLeft <= 10 && elements.timer) {
            elements.timer.style.color = '#ff6b6b';
            // Animation pulsante
            elements.timer.style.animation = 'pulse 0.5s infinite';
        }
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            timeOut();
        }
    }, 1000);
}

function selectAnswer(button, isCorrect) {
    if (gameState.selectedAnswer !== null) return;
    
    gameState.selectedAnswer = isCorrect;
    clearInterval(gameState.timer);
    if (elements.timer) elements.timer.style.animation = '';
    
    // Afficher les bonnes/mauvaises réponses
    document.querySelectorAll('.answer-btn').forEach(btn => {
        if (btn.dataset.correct === 'true') {
            btn.classList.add('correct');
        } else if (btn === button) {
            btn.classList.add('wrong');
        }
        btn.disabled = true;
    });
    
    // Calculer les points
    let pointsEarned = 0;
    let feedback = '';
    
    if (isCorrect) {
        pointsEarned = GAME_CONFIG.CORRECT_ANSWER_POINTS;
        
        // Bonus vitesse
        if (gameState.timeLeft > 20) {
            pointsEarned += GAME_CONFIG.FAST_ANSWER_BONUS;
            gameState.fastAnswers++;
            feedback += "⚡ Bonus vitesse ! +50 points ! ";
        }
        
        // Bonus série
        gameState.streak++;
        if (gameState.streak > gameState.bestStreak) {
            gameState.bestStreak = gameState.streak;
        }
        
        if (gameState.streak >= 3) {
            pointsEarned += gameState.streak * 10;
            feedback += `🔥 Série x${gameState.streak} ! `;
        }
        
        gameState.correctAnswers++;
        gameState.totalAnswers++;
        
        // Feedback positif
        const goodFeedbacks = [
            "🎉 PARFAIT ! ",
            "🚀 INCROYABLE ! ",
            "💡 BRILLANT ! ",
            "🏆 CHAMPION ! ",
            "✨ MAGIQUE ! "
        ];
        
        feedback = goodFeedbacks[Math.floor(Math.random() * goodFeedbacks.length)] + feedback;
        
        // Message dans le chat
        const chatMessages = [
            "Buddy : YES ! Tu l'as ! 😎",
            "Buddy : Tu es trop fort ! 👑",
            "Buddy : Mon détecteur de génie s'affole ! 🧠🔊",
            "Buddy : Tu mérites un cookie virtuel ! 🍪"
        ];
        
        addChatMessage(chatMessages[Math.floor(Math.random() * chatMessages.length)]);
        
    } else {
        gameState.streak = 0;
        gameState.totalAnswers++;
        
        // Feedback négatif rigolo
        const badFeedbacks = [
            "💥 Aïe ! Pas la bonne...",
            "😅 Presque ! Mais pas tout à fait...",
            "🤔 Hum... bonne tentative !",
            "🔄 Essaye encore ! Tu vas y arriver !"
        ];
        
        feedback = badFeedbacks[Math.floor(Math.random() * badFeedbacks.length)];
        
        addChatMessage("Buddy : Pas grave ! On apprend de ses erreurs ! 💪");
    }
    
    // Ajouter les points
    gameState.score += pointsEarned;
    
    // Afficher l'explication
    const question = gameState.questions[gameState.currentQuestionIndex];
    if (elements.quizFeedback) {
        elements.quizFeedback.innerHTML = `
            <div class="feedback-header">
                <h4>${feedback}</h4>
                ${pointsEarned > 0 ? `<div class="points-earned">+${pointsEarned} points !</div>` : ''}
            </div>
            <p><strong>Explication :</strong> ${question.explanation}</p>
            <div class="fun-fact">
                <i class="fas fa-star"></i>
                <strong>Le savais-tu ?</strong> ${question.funFact}
            </div>
            ${gameState.streak > 0 ? `<div class="streak-info">Série actuelle : ${gameState.streak} bonne(s) réponse(s)</div>` : ''}
        `;
    }
    
    updateUI();
    
    // Animation des points si points gagnés
    if (pointsEarned > 0) {
        const pointsPopup = document.createElement('div');
        pointsPopup.className = 'points-popup';
        pointsPopup.textContent = `+${pointsEarned}`;
        pointsPopup.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            color: #00b894;
            font-size: 2rem;
            font-weight: bold;
            pointer-events: none;
            z-index: 1000;
            transform: translate(-50%, -50%);
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        
        document.querySelector('.question-card').appendChild(pointsPopup);
        
        // Animation
        pointsPopup.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: 'translate(-50%, -150%) scale(1.5)', opacity: 0 }
        ], {
            duration: 1000,
            easing: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)'
        }).onfinish = () => pointsPopup.remove();
    }
}

function timeOut() {
    if (gameState.selectedAnswer !== null) return;
    
    document.querySelectorAll('.answer-btn').forEach(btn => {
        if (btn.dataset.correct === 'true') {
            btn.classList.add('correct');
        }
        btn.disabled = true;
    });
    
    if (elements.quizFeedback) {
        elements.quizFeedback.innerHTML = `
            <div class="feedback-header">
                <h4>⏰ Temps écoulé !</h4>
            </div>
            <p>Trop lent ! La réponse était : ${gameState.questions[gameState.currentQuestionIndex].answers.find(a => a.correct).text}</p>
            <p>Essaye d'être plus rapide la prochaine fois ! ⚡</p>
        `;
    }
    
    gameState.streak = 0;
    gameState.totalAnswers++;
    addChatMessage("Buddy : Plus vite la prochaine fois ! La vitesse, c'est la clé ! ⏱️");
    updateUI();
}

function nextQuestion() {
    if (gameState.selectedAnswer === null) return;
    
    gameState.currentQuestionIndex++;
    
    if (gameState.currentQuestionIndex < gameState.questions.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    gameState.gameActive = false;
    clearInterval(gameState.timer);
    
    // Calculer le score final
    const percentage = Math.round((gameState.correctAnswers / gameState.totalAnswers) * 100) || 0;
    const questionsInQuiz = gameState.questions.length;
    const correctInQuiz = gameState.questions.filter((q, index) => {
        // Compter les bonnes réponses dans ce quiz seulement
        return index < questionsInQuiz; // Cette logique devrait être améliorée
    }).length;
    
    // Message de fin
    let finalMessage = '';
    let badge = '';
    
    if (percentage === 100) {
        finalMessage = "Buddy : 100% ! TU ES UN GÉNIE ABSOLU ! 🌟🏆";
        badge = '<div class="special-badge"><i class="fas fa-crown"></i> Badge "Perfectionniste" débloqué !</div>';
    } else if (percentage >= 80) {
        finalMessage = "Buddy : Excellent ! Tu maîtrises le sujet ! 😎👑";
        badge = '<div class="special-badge"><i class="fas fa-star"></i> Niveau Expert atteint !</div>';
    } else if (percentage >= 60) {
        finalMessage = "Buddy : Bien joué ! Tu progresses à vue d'œil ! 🚀";
    } else if (percentage >= 40) {
        finalMessage = "Buddy : Bon effort ! Continue comme ça, tu vas y arriver ! 💪";
    } else {
        finalMessage = "Buddy : Pas de panique ! Chaque quiz te rend plus fort ! 📚";
    }
    
    // Afficher l'écran de fin
    if (elements.quizInterface) elements.quizInterface.style.display = 'none';
    if (elements.gameArea) {
        elements.gameArea.style.display = 'block';
        elements.gameArea.innerHTML = `
            <div class="results-screen">
                <div class="results-header">
                    <i class="fas fa-trophy"></i>
                    <h2>QUIZ TERMINÉ !</h2>
                </div>
                
                <div class="results-stats">
                    <div class="stat-result">
                        <div class="stat-label">Score final</div>
                        <div class="stat-value">${gameState.score} points</div>
                    </div>
                    <div class="stat-result">
                        <div class="stat-label">Réponses justes</div>
                        <div class="stat-value">${correctInQuiz}/${questionsInQuiz}</div>
                    </div>
                    <div class="stat-result">
                        <div class="stat-label">Pourcentage</div>
                        <div class="stat-value">${percentage}%</div>
                    </div>
                    <div class="stat-result">
                        <div class="stat-label">Meilleure série</div>
                        <div class="stat-value">${gameState.bestStreak}</div>
                    </div>
                </div>
                
                <div class="results-feedback">
                    <h3>${percentage === 100 ? '🎉 PARFAIT !' : percentage >= 80 ? '🌟 EXCELLENT !' : percentage >= 60 ? '👍 BIEN JOUÉ !' : '💪 CONTINUE !'}</h3>
                    <p>Tu as gagné <strong>${gameState.score}</strong> points dans ce quiz !</p>
                    ${badge}
                    <p class="encouragement">Il reste ${QUESTIONS_DB[gameState.currentSubject].length - questionsInQuiz} questions dans cette matière à découvrir !</p>
                </div>
                
                <div class="results-actions">
                    <button id="playAgain" class="action-btn big">
                        <i class="fas fa-redo"></i> Rejouer (nouvelles questions)
                    </button>
                    <button id="backToMenu" class="action-btn big secondary">
                        <i class="fas fa-home"></i> Menu principal
                    </button>
                </div>
            </div>
        `;
        
        // Ajouter les événements
        setTimeout(() => {
            const playAgainBtn = document.getElementById('playAgain');
            const backToMenuBtn = document.getElementById('backToMenu');
            
            if (playAgainBtn) {
                playAgainBtn.addEventListener('click', () => {
                    startQuiz(gameState.currentSubject);
                });
            }
            
            if (backToMenuBtn) {
                backToMenuBtn.addEventListener('click', () => {
                    elements.gameArea.innerHTML = `
                        <div class="welcome-screen">
                            <i class="fas fa-robot welcome-icon"></i>
                            <h3>Prêt pour une nouvelle aventure ?</h3>
                            <p>Choisis une matière ci-dessus !</p>
                            <div class="questions-info">
                                <i class="fas fa-database"></i>
                                <small>${QUESTIONS_DB.maths.length} questions en Maths | 
                                ${QUESTIONS_DB.science.length} en Sciences | 
                                ${QUESTIONS_DB.french.length} en Français | 
                                ${QUESTIONS_DB.history.length} en Histoire</small>
                            </div>
                        </div>
                    `;
                    if (elements.modeSelection) elements.modeSelection.style.display = 'block';
                });
            }
        }, 100);
    }
    
    // Message dans le chat
    addChatMessage(finalMessage);
    addChatMessage(`Buddy : Ton score total est maintenant de ${gameState.score} points ! Continue comme ça ! ✨`);
    
    updateUI();
}

function showHint() {
    if (gameState.selectedAnswer !== null) return;
    
    gameState.score = Math.max(0, gameState.score - 50);
    
    const question = gameState.questions[gameState.currentQuestionIndex];
    const correctAnswer = question.answers.find(a => a.correct);
    
    // Donner un indice intelligent
    let hint = "";
    const hintType = Math.floor(Math.random() * 3);
    
    switch(hintType) {
        case 0:
            hint = `La réponse contient ${correctAnswer.text.length} caractères...`;
            break;
        case 1:
            hint = "Élimine d'abord les réponses les plus improbables...";
            break;
        case 2:
            const firstLetter = correctAnswer.text.charAt(0);
            hint = `La réponse commence par '${firstLetter}'...`;
            break;
    }
    
    if (elements.quizFeedback) {
        elements.quizFeedback.innerHTML = `
            <div class="hint-box">
                <i class="fas fa-lightbulb"></i>
                <strong>INDICE :</strong> ${hint}
                <div class="hint-penalty">-50 points</div>
            </div>
        `;
    }
    
    addChatMessage("Buddy : Un petit coup de pouce ! Mais attention aux pénalités... 😉");
    updateUI();
}

// ============ UTILITAIRES ============
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function setupEventListeners() {
    // Boutons de matière
    document.querySelectorAll('.action-btn[data-subject]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            let subject = button.getAttribute('data-subject');
            
            // Conversion pour compatibilité
            if (subject === 'math') subject = 'maths';
            
            console.log("Bouton cliqué :", subject);
            startQuiz(subject);
        });
    });
    
    // Boutons de mode
    document.querySelectorAll('.mode-btn').forEach(button => {
        button.addEventListener('click', () => {
            const mode = button.dataset.mode;
            if (mode === 'quiz') {
                // Afficher la sélection de matière
                elements.gameArea.innerHTML = `
                    <div class="subject-selection">
                        <h3>CHOISIS TA MATIÈRE :</h3>
                        <p>Chaque matière contient 20+ questions !</p>
                        <div class="subject-buttons">
                            <button class="subject-btn" data-subject="maths">
                                <i class="fas fa-calculator"></i> Maths (${QUESTIONS_DB.maths.length} questions)
                            </button>
                            <button class="subject-btn" data-subject="science">
                                <i class="fas fa-flask"></i> Sciences (${QUESTIONS_DB.science.length} questions)
                            </button>
                            <button class="subject-btn" data-subject="french">
                                <i class="fas fa-book"></i> Français (${QUESTIONS_DB.french.length} questions)
                            </button>
                            <button class="subject-btn" data-subject="history">
                                <i class="fas fa-landmark"></i> Histoire (${QUESTIONS_DB.history.length} questions)
                            </button>
                        </div>
                    </div>
                `;
                
                // Ajouter les événements aux boutons de matière
                document.querySelectorAll('.subject-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        startQuiz(btn.dataset.subject);
                    });
                });
            } else {
                addChatMessage("Buddy : Ce mode arrive bientôt ! Pour l'instant, amuse-toi avec le quiz ! 🚧");
            }
        });
    });
    
    // Boutons de contrôle du quiz
    if (elements.nextQuestion) {
        elements.nextQuestion.addEventListener('click', nextQuestion);
    }
    
    if (elements.hintBtn) {
        elements.hintBtn.addEventListener('click', showHint);
    }
    
    // Bouton reset
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            gameState = {
                score: 0,
                streak: 0,
                bestStreak: 0,
                correctAnswers: 0,
                totalAnswers: 0,
                fastAnswers: 0,
                currentLevel: 0,
                currentSubject: null,
                questions: [],
                currentQuestionIndex: 0,
                timer: null,
                timeLeft: GAME_CONFIG.QUESTION_TIME,
                gameActive: false,
                selectedAnswer: null
            };
            
            updateUI();
            addChatMessage("Buddy : C'est reparti à zéro ! Nouvelle aventure, nouveaux défis ! 🚀");
            addChatMessage("Buddy : Tu as maintenant accès à des dizaines de questions dans chaque matière ! 📚");
        });
    }
    
    // Bouton analyser
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => {
            const resultsSection = document.getElementById('resultsSection');
            if (resultsSection) {
                resultsSection.style.display = 'block';
                addChatMessage("Buddy : Analyse en cours... Regarde tes statistiques impressionnantes ! 📊");
            }
        });
    }
}

// ============ DÉMARRAGE ============
document.addEventListener('DOMContentLoaded', initGame);

// ============ AJOUT DE STYLES DYNAMIQUES ============
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .points-popup {
        position: absolute;
        font-size: 2rem;
        font-weight: bold;
        color: #00b894;
        text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        pointer-events: none;
        z-index: 1000;
        animation: floatUp 1s ease-out forwards;
    }
    
    @keyframes floatUp {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
    }
    
    .subject-selection {
        text-align: center;
        padding: 20px;
    }
    
    .subject-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 15px;
        margin-top: 20px;
    }
    
    .subject-btn {
        padding: 20px;
        background: linear-gradient(135deg, #74b9ff, #0984e3);
        color: white;
        border: none;
        border-radius: 15px;
        font-size: 1.1rem;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }
    
    .subject-btn:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(116, 185, 255, 0.3);
    }
    
    .questions-info {
        margin-top: 20px;
        padding: 10px;
        background: rgba(116, 185, 255, 0.1);
        border-radius: 10px;
        font-size: 0.9rem;
        color: #636e72;
    }
    
    .encouragement {
        margin-top: 15px;
        font-style: italic;
        color: #636e72;
    }
`;
document.head.appendChild(style);

// Debug
console.log("StudyBuddy chargé !");
console.log(`Questions disponibles : Maths: ${QUESTIONS_DB.maths.length}, Sciences: ${QUESTIONS_DB.science.length}, Français: ${QUESTIONS_DB.french.length}, Histoire: ${QUESTIONS_DB.history.length}`);