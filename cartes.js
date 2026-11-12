/* KYLIAN TCG — CATALOGUE DES CARTES

  Ce fichier est le seul à modifier pour ajouter ou changer les cartes.
  Les cartes sont rangées par booster puis par rareté.

  AJOUTER : copie un bloc, donne-lui un id unique (ex. original-054
  ou anime-049), puis modifie name, img, desc et type.
  L'id d'une carte existante NE DOIT JAMAIS changer : il sert aux sauvegardes.
  Tu peux changer son nom, son image, sa description, son ordre ou sa rareté.
  Pour changer la rareté, déplace tout son bloc dans la bonne section.
  Chaque bloc doit être séparé du suivant par une virgule.
  Les nombres de cartes et les boosters sont calculés automatiquement.

  id   : identifiant unique permanent, sans espaces
  name : nom affiché sur la carte
  img  : chemin de l'image depuis index.html
  desc : description (peut rester vide)
  type : animé ou petit label (peut rester vide)
*/
window.TCG_CARTES = {

  // ==================== PREMIER BOOSTER ====================
  original: {

    // COMMUNES — 27 cartes
    common: [
      {
        "id": "original-001",
        "name": "Kyky Braqueur",
        "img": "img/original/commun/Braquage de la dernière frite.webp",
        "desc": "Bro a cru il était Tom Cruise",
        "type": ""
      },
      {
        "id": "original-002",
        "name": "Pause caf",
        "img": "img/original/commun/Bureau en fuite, café intact.webp",
        "desc": "C'est moi ou il a le cul en feu ?",
        "type": ""
      },
      {
        "id": "original-003",
        "name": "J.O",
        "img": "img/original/commun/Champion olympique du lancer de pantoufle.webp",
        "desc": "POV: Le seul sport ou il est bon: lancer la pantoufle pour éteindre la lumière",
        "type": ""
      },
      {
        "id": "original-004",
        "name": "Moustique",
        "img": "img/original/commun/Chasse nocturne au moustique géant.webp",
        "desc": "On dirait Indiana Jones en 2090 frr",
        "type": ""
      },
      {
        "id": "original-005",
        "name": "Chevalier anti-moustique en armure",
        "img": "img/original/commun/Chevalier anti-moustique en armure.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-006",
        "name": "Chef d'orchestre",
        "img": "img/original/commun/Kylian dirige l’orchestre des canards.webp",
        "desc": "coin coin.",
        "type": ""
      },
      {
        "id": "original-007",
        "name": "Red Dead Nulos 2",
        "img": "img/original/commun/Kylian dompte l’aspirateur robot.webp",
        "desc": "Arthur Morgan a la retraite",
        "type": ""
      },
      {
        "id": "original-008",
        "name": "Ovni",
        "img": "img/original/commun/Kylian inspecte un OVNI cabossé.webp",
        "desc": "Pov: il répare la voiture de sa soeur",
        "type": ""
      },
      {
        "id": "original-009",
        "name": "DJ",
        "img": "img/original/commun/Kylian, DJ de la maison hantée(1).webp",
        "desc": "OUAIS DJ KYKY",
        "type": ""
      },
      {
        "id": "original-010",
        "name": "Kylian Lloris",
        "img": "img/original/commun/Kylian, gardien lunaire des météorites.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-011",
        "name": "Radin",
        "img": "img/original/commun/Kylian, plongeur du canapé géant.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-012",
        "name": "Lidl",
        "img": "img/original/commun/Le boss final du Lidl.webp",
        "desc": "Bro à la carte Lidl pro max ++",
        "type": ""
      },
      {
        "id": "original-013",
        "name": "Météo",
        "img": "img/original/commun/Le bulletin météo du réfrigérateur.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-014",
        "name": "Cuisto",
        "img": "img/original/commun/Le chef étoilé du micro-ondes.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-015",
        "name": "Chirurgien",
        "img": "img/original/commun/Le chirurgien de la dernière chips.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-016",
        "name": "Chaussette",
        "img": "img/original/commun/Le conseil des chaussettes orphelines.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-017",
        "name": "Pizza",
        "img": "img/original/commun/Le livreur de pizza face au T-Rex.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-018",
        "name": "Prêtre",
        "img": "img/original/commun/Le miracle de l’imprimante médiévale.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-019",
        "name": "Le dompteur",
        "img": "img/original/commun/Le négociateur, le croissant et les oies.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-020",
        "name": "Le photographe",
        "img": "img/original/commun/Le photographe des mariés squelettes.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-021",
        "name": "Harry Péteur",
        "img": "img/original/commun/Le sorcier réparateur de dragons.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-022",
        "name": "Bohnome de neige",
        "img": "img/original/commun/Le thanatopracteur des bonshommes de neige.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-023",
        "name": "Archéologue",
        "img": "img/original/commun/L’archéologue du câble USB fossilisé.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-024",
        "name": "Pigeon",
        "img": "img/original/commun/L’héritier royal des pigeons.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-025",
        "name": "Il pêche quoi même",
        "img": "img/original/commun/Pêcheur de nuages au coucher du soleil.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-026",
        "name": "Magicien",
        "img": "img/original/commun/Téléachat, pierre maudite et mains fantomatiques.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-027",
        "name": "Kylian videur ?",
        "img": "img/original/commun/Videur de pingouins dans l’iceberg.webp",
        "desc": "",
        "type": ""
      },
    ],

    // RARES — 13 cartes
    rare: [
      {
        "id": "original-028",
        "name": "Chevalier",
        "img": "img/original/rare/Chevalier baroque en claquettes, cathédrale en ruine.webp",
        "desc": "Il s'est cru dans elden ring ou c'est comment ?",
        "type": ""
      },
      {
        "id": "original-029",
        "name": "Douanier",
        "img": "img/original/rare/Douane infernale au guichet.webp",
        "desc": "Si le gars était noir ce serait bien plus problématique",
        "type": ""
      },
      {
        "id": "original-030",
        "name": "Interrogatoire nocturne d’un cornichon",
        "img": "img/original/rare/Interrogatoire nocturne d’un cornichon.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-031",
        "name": "Kylian au curling avec un robot aspirateur",
        "img": "img/original/rare/Kylian au curling avec un robot aspirateur.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-032",
        "name": "Kylian explore un nid géant de spaghettis",
        "img": "img/original/rare/Kylian explore un nid géant de spaghettis.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-033",
        "name": "Turbo",
        "img": "img/original/rare/Kylian jockey sur un escargot géant.webp",
        "desc": "Même PIXAR est choqué de l'idée",
        "type": ""
      },
      {
        "id": "original-034",
        "name": "Verstappute",
        "img": "img/original/rare/Kylian, roi du circuit en tondeuse.webp",
        "desc": "Même Hamilton est choqué du manque de charisme",
        "type": ""
      },
      {
        "id": "original-035",
        "name": "Kylian, sculpture vivante",
        "img": "img/original/rare/Kylian, sculpture vivante.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-036",
        "name": "Le rituel nocturne de l’imprimante",
        "img": "img/original/rare/Le rituel nocturne de l’imprimante.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-037",
        "name": "Wi-fi",
        "img": "img/original/rare/L’exorciste de la box Wi‑Fi.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-038",
        "name": "Promenade nocturne avec un aspirateur",
        "img": "img/original/rare/Promenade nocturne avec un aspirateur.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-039",
        "name": "Réunion de crise avec six peluches",
        "img": "img/original/rare/Réunion de crise avec six peluches.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-040",
        "name": "Croque-mort",
        "img": "img/original/rare/Stagiaire croque-mort à la pelle dorée.webp",
        "desc": "tellment il est petit le costume est gigantesque (cest du xxs miskine)",
        "type": ""
      },
    ],

    // ÉPIQUES — 7 cartes
    epic: [
      {
        "id": "original-041",
        "name": "Ninja",
        "img": "img/original/epic/Capitaine du Gotei 13 à la baguette.webp",
        "desc": "Attention kylian tu risque de te faire mal",
        "type": ""
      },
      {
        "id": "original-042",
        "name": "Kebab romantique, frites en bouquet",
        "img": "img/original/epic/Kebab romantique, frites en bouquet.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-043",
        "name": "Avocat",
        "img": "img/original/epic/Kylian avocat du grille-pain.webp",
        "desc": "Même avec un job stylé il fait quand même de la merde",
        "type": ""
      },
      {
        "id": "original-044",
        "name": "Kylian dort paisiblement sous la couette",
        "img": "img/original/epic/Kylian dort paisiblement sous la couette.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-045",
        "name": "Le bras de fer des Kylian",
        "img": "img/original/epic/Le bras de fer des Kylian.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-046",
        "name": "Le solo de flûte au stade",
        "img": "img/original/epic/Le solo de flûte au stade.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-047",
        "name": "Momie (Raph)",
        "img": "img/original/epic/SAV des momies dans la pyramide.webp",
        "desc": "",
        "type": ""
      },
    ],

    // LÉGENDAIRES — 6 cartes
    legendary: [
      {
        "id": "original-048",
        "name": "Avec le Z",
        "img": "img/original/legendaire/Câlin surprise entre Kylian et Éric Zemmour.webp",
        "desc": "Quand kyky rencontre son ame soeur -->",
        "type": ""
      },
      {
        "id": "original-049",
        "name": "Kylian et Staline, une écharpe rose",
        "img": "img/original/legendaire/Kylian et Staline, une écharpe rose.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-050",
        "name": "Le dessin raté reçoit un grand X",
        "img": "img/original/legendaire/Le dessin raté reçoit un grand X.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-051",
        "name": "Le milkshake de Kylian et Dua Lipa",
        "img": "img/original/legendaire/Le milkshake de Kylian et Dua Lipa.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-052",
        "name": "Ourson rose géant à la fête foraine",
        "img": "img/original/legendaire/Ourson rose géant à la fête foraine.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "original-053",
        "name": "Razzia au Monopoly, portefeuille presque vide",
        "img": "img/original/legendaire/Razzia au Monopoly, portefeuille presque vide.webp",
        "desc": "",
        "type": ""
      },
    ],
  },

  // ==================== BOOSTER DUO ANIMÉ ====================
  anime: {

    // COMMUNES — 26 cartes
    common: [
      {
        "id": "anime-001",
        "name": "Android 18, cric humain et roue crevée",
        "img": "img/anime/commun/Android 18, cric humain et roue crevée.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-002",
        "name": "Aqua noie la taverne, Kylian soupire",
        "img": "img/anime/commun/Aqua noie la taverne, Kylian soupire.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-003",
        "name": "Fléchettes partout, cible intacte",
        "img": "img/anime/commun/Fléchettes partout, cible intacte.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-004",
        "name": "Frieren et la télécommande magique",
        "img": "img/anime/commun/Frieren et la télécommande magique.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-005",
        "name": "Inosuke défie le robot aspirateur",
        "img": "img/anime/commun/Inosuke défie le robot aspirateur.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-006",
        "name": "Inspection militaire des saucisses brûlées",
        "img": "img/anime/commun/Inspection militaire des saucisses brûlées.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-007",
        "name": "Kylian agrippé au toit avec Mikasa",
        "img": "img/anime/commun/Kylian agrippé au toit avec Mikasa.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-008",
        "name": "Kylian et Tsunade, maîtres de la pince",
        "img": "img/anime/commun/Kylian et Tsunade, maîtres de la pince.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-009",
        "name": "Kylian et Yor, duel de légumes(1)",
        "img": "img/anime/commun/Kylian et Yor, duel de légumes(1).webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-010",
        "name": "Kylian pose avec le rondin de substitution",
        "img": "img/anime/commun/Kylian pose avec le rondin de substitution.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-011",
        "name": "Kylian présente, Aizawa dort",
        "img": "img/anime/commun/Kylian présente, Aizawa dort.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-012",
        "name": "Kylian sous le nuage de Nami",
        "img": "img/anime/commun/Kylian sous le nuage de Nami.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-013",
        "name": "Le bocal rebelle et les huit mains",
        "img": "img/anime/commun/Le bocal rebelle et les huit mains.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-014",
        "name": "Le CV pour le chat patron",
        "img": "img/anime/commun/Le CV pour le chat patron.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-015",
        "name": "Le festin d’une seule frite",
        "img": "img/anime/commun/Le festin d’une seule frite.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-016",
        "name": "Le toast glacé et carbonisé",
        "img": "img/anime/commun/Le toast glacé et carbonisé.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-017",
        "name": "Mikasa en mission rideaux, Kylian observe",
        "img": "img/anime/commun/Mikasa en mission rideaux, Kylian observe.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-018",
        "name": "Mitsuri et la tour d’assiettes",
        "img": "img/anime/commun/Mitsuri et la tour d’assiettes.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-019",
        "name": "Nami paie les frites en or",
        "img": "img/anime/commun/Nami paie les frites en or.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-020",
        "name": "Naruto s’éclipse, Kylian face aux bols",
        "img": "img/anime/commun/Naruto s’éclipse, Kylian face aux bols.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-021",
        "name": "Noelle lave la doudoune de Kylian",
        "img": "img/anime/commun/Noelle lave la doudoune de Kylian.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-022",
        "name": "Recrutement pirate, regard perplexe",
        "img": "img/anime/commun/Recrutement pirate, regard perplexe.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-023",
        "name": "Selfie à rallonge de Luffy et Kylian",
        "img": "img/anime/commun/Selfie à rallonge de Luffy et Kylian.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-024",
        "name": "Sukuna perd à la pince, Kylian gagne",
        "img": "img/anime/commun/Sukuna perd à la pince, Kylian gagne.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-025",
        "name": "Un petit coup, un gros désastre",
        "img": "img/anime/commun/Un petit coup, un gros désastre.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-026",
        "name": "Zoro, la sortie sous le nez",
        "img": "img/anime/commun/Zoro, la sortie sous le nez.webp",
        "desc": "",
        "type": ""
      },
    ],

    // RARES — 14 cartes
    rare: [
      {
        "id": "anime-027",
        "name": "Chika triomphe, Kylian porte le trophée",
        "img": "img/anime/rare/Chika triomphe, Kylian porte le trophée.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-028",
        "name": "Défilé gothique, cape trop longue",
        "img": "img/anime/rare/Défilé gothique, cape trop longue.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-029",
        "name": "Examen sous surveillance tentaculaire",
        "img": "img/anime/rare/Examen sous surveillance tentaculaire.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-030",
        "name": "Épée géante, gâteau minuscule",
        "img": "img/anime/rare/Épée géante, gâteau minuscule.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-031",
        "name": "Jolyne tricote une écharpe géante",
        "img": "img/anime/rare/Jolyne tricote une écharpe géante.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-032",
        "name": "Kylian apprend la danse à Vegeta",
        "img": "img/anime/rare/Kylian apprend la danse à Vegeta.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-033",
        "name": "Kylian perdu face aux lapins de Rukia",
        "img": "img/anime/rare/Kylian perdu face aux lapins de Rukia.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-034",
        "name": "La dernière frite, protégée par l’Infini",
        "img": "img/anime/rare/La dernière frite, protégée par l’Infini.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-035",
        "name": "Le filet géant face au minuscule papillon",
        "img": "img/anime/rare/Le filet géant face au minuscule papillon.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-036",
        "name": "Maomao analyse une canette suspecte",
        "img": "img/anime/rare/Maomao analyse une canette suspecte.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-037",
        "name": "Pédaler pour sauver 1 %",
        "img": "img/anime/rare/Pédaler pour sauver 1 %.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-038",
        "name": "Pizza découpée à la lance anime",
        "img": "img/anime/rare/Pizza découpée à la lance anime.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-039",
        "name": "Temari et le linge envolé",
        "img": "img/anime/rare/Temari et le linge envolé.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-040",
        "name": "Vingt bols, un seul petit pois",
        "img": "img/anime/rare/Vingt bols, un seul petit pois.webp",
        "desc": "",
        "type": ""
      },
    ],

    // ÉPIQUES — 5 cartes
    epic: [
      {
        "id": "anime-041",
        "name": "Enquête au bureau _ chaise contre tabouret",
        "img": "img/anime/epic/Enquête au bureau _ chaise contre tabouret.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-042",
        "name": "Jotaro pose, Kylian désespère",
        "img": "img/anime/epic/Jotaro pose, Kylian désespère.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-043",
        "name": "Kylian et Yoruichi traquent le laser",
        "img": "img/anime/epic/Kylian et Yoruichi traquent le laser.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-044",
        "name": "Levi traque une poussière minuscule",
        "img": "img/anime/epic/Levi traque une poussière minuscule.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-045",
        "name": "Rangiku et Kylian, les bras chargés",
        "img": "img/anime/epic/Rangiku et Kylian, les bras chargés.webp",
        "desc": "",
        "type": ""
      },
    ],

    // LÉGENDAIRES — 3 cartes
    legendary: [
      {
        "id": "anime-046",
        "name": "Kylian et Bulma dans la chambre gaming",
        "img": "img/anime/legendaire/Kylian et Bulma dans la chambre gaming.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-047",
        "name": "Kylian, la recrue bricolée de Team Rocket",
        "img": "img/anime/legendaire/Kylian, la recrue bricolée de Team Rocket.webp",
        "desc": "",
        "type": ""
      },
      {
        "id": "anime-048",
        "name": "Selfie complice avec Marine Kitagawa",
        "img": "img/anime/legendaire/Selfie complice avec Marine Kitagawa.webp",
        "desc": "",
        "type": ""
      },
    ],
  },
};
