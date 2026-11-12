# Kylian TCG — édition Évolution

## Modifier les cartes

Ouvre **cartes.js** dans VS Code. Tout le catalogue est dans ce seul fichier.

- `original` : premier booster.
- `anime` : booster Duo animé.
- Dans chacun : `common` (communes), `rare`, `epic` (épiques), `legendary` (légendaires).

## Changer une carte

Modifie `name` (nom), `img` (image), `desc` (description) ou `type` (label).
Les descriptions nouvelles sont volontairement vides : tu les écris toi-même.
Les noms et descriptions déjà personnalisés du premier booster ont été conservés quand l'image correspond.

**Ne change jamais son `id`.** Tu peux déplacer la carte ou changer sa rareté sans perdre les exemplaires sauvegardés.

## Ajouter une carte

1. Copie ton image dans le dossier `img` de ton choix.
2. Copie un bloc dans la bonne section de `cartes.js`.
3. Donne-lui un identifiant jamais utilisé : `original-054` ou `anime-049`, par exemple.
4. Remplace les autres valeurs. Garde la virgule après le bloc.
5. Recharge la page. Le total, les numéros et les tirages se mettent à jour.

```js
{
  "id": "anime-049",
  "name": "Nom de ma nouvelle carte",
  "img": "img/anime/rare/ma-photo.png",
  "desc": "Ma description",
  "type": "Nom de l’animé"
},
```

Pour changer la rareté, déplace le bloc entier dans une autre section, en conservant son id.
Le dossier de l'image peut rester le même : c'est sa section dans `cartes.js` qui décide de sa rareté.
Une image non référencée dans `cartes.js` n'apparaît pas automatiquement dans le jeu.
Les dossiers reflètent le classement initial reçu dans ton ZIP.

## Réglages

**reglages.js** : identifiant/mot de passe admin commun, délai entre boosters et chances de rareté.
**jeu.js** : fonctionnement du jeu, normalement rien à modifier pour ajouter des cartes.
**style.css** : apparence. **index.html** : structure de la page.

## Installer

Décompresse le ZIP et remplace les fichiers du site par ceux fournis, en copiant aussi le nouveau dossier `img`.
Conserve tes autres images si tu veux encore les utiliser.
Ouvre index.html ou utilise ton hébergement habituel. Aucun outil de compilation nécessaire.
Pour garder les sauvegardes : même navigateur et même adresse de site.

Les anciens exemplaires sont associés à leur image plutôt qu'à leur position dans la liste.
Quatre anciennes cartes dont les images ne figurent pas dans ton ZIP sont conservées en sauvegarde archivée, hors collection active.
Les identifiants admin restent `admin` / `KylianAdmin2026!`, modifiables dans reglages.js.
Cet accès reste une démonstration locale : les identifiants sont visibles dans le code et les appareils ne sont pas synchronisés.

Les images ont été optimisées en WebP pour alléger le site ; tes PNG d'origine restent dans le ZIP que tu as fourni.


## Nouveautés : profils et progression

- **Mon profil** : pseudo affiché (l’identifiant de connexion reste identique), description de 240 caractères, photo JPG/PNG/WebP de moins de 5 Mo (recadrée au centre et compressée en 256 × 256), quatre couleurs de bannière.
- **Vitrine** : six cartes possédées, avec ajout, retrait et ordre modifiable. Si le dernier exemplaire disparaît à la suite d’un échange, d’un rebirth ou d’une réinitialisation, la carte est retirée de la vitrine.
- **Amis → Voir le profil** : consulter la bio, les badges et la vitrine d’un autre compte présent dans ce navigateur. La photo et la bio peuvent être modifiées uniquement depuis le profil du compte connecté.
- **Badge de collection** : évolue avec le pourcentage de cartes uniques actuellement possédées, toutes séries confondues. Paliers : 0 %, 10 %, 25 %, 50 %, 75 % et 100 %. Une carte en plusieurs exemplaires compte une seule fois. Si la collection baisse, le badge reflète le nouveau pourcentage.
- **XP** : 200 XP par niveau de collectionneur. Récompenses cosmétiques, sans modification des taux de drop.

## Les cinq rebirths

Les objectifs se modifient dans **progression-reglages.js**, en utilisant les ids de **cartes.js**.
Chaque objectif demande des cartes précises avec une quantité par carte. Ces quantités sont consommées à la validation, après confirmation. Il est possible d’utiliser son dernier exemplaire : la carte redevient alors à découvrir dans la collection.

Seules ces quantités sont retirées. Les autres cartes, le surplus d’exemplaires, les XP, les compteurs de boosters et les délais sont conservés. Le badge Prestige est permanent. Il faut accomplir les cinq paliers dans l’ordre et chacun ne peut être réclamé qu’une fois.

Les cinq paliers rapportent respectivement 150, 250, 400, 600 et 1 000 XP. L’écran Rebirth affiche le nom, l’image, la série, la rareté, le nombre d’exemplaires réunis et le coût exact de chaque carte. Si une carte est supprimée du catalogue alors qu’un objectif l’utilise, le rebirth concerné est bloqué jusqu’à la correction de son id dans les réglages.

Les boosters restent ouvrables après une collection complète pour obtenir des doublons. Les chances de rareté restent 60 % / 25 % / 11 % / 4 % par carte, sans bonus lié au niveau ou au prestige.

## Boosters gratuits et réserve

Chaque série possède une réserve indépendante de **5 boosters gratuits maximum**. Une unité se recharge toutes les **5 minutes**, même lorsque le site est fermé. Le temps est calculé au retour à partir de l’heure de la dernière recharge enregistrée.

- Un nouveau compte commence avec **1 booster gratuit par série**.
- Une ancienne sauvegarde conserve les cartes, XP, prestiges et profils ; le premier stock est calculé à partir de sa dernière ouverture connue, avec le plafond de 5.
- Quand la réserve atteint 5, les recharges excédentaires ne sont pas mises en attente. Après avoir utilisé une unité d’une réserve pleine, la recharge suivante prend 5 minutes.
- Si la réserve n’était pas pleine, dépenser une unité ne remet pas son compteur à zéro : le temps déjà écoulé est conservé.
- Une ouverture consomme un seul booster du stock et donne 5 cartes de sa série.
- Les paramètres `delaiMinutes` et `stockMaximum` sont dans **reglages.js**.

## Monnaie virtuelle et boosters supplémentaires

Les quêtes donnent des **XP et des pièces** lorsque le joueur récupère leur récompense. Le portefeuille est affiché en haut du site et sur la page Quêtes. **100 pièces = un booster supplémentaire** (paramètre `prixBooster` dans **reglages.js**).

L’achat est une ouverture immédiate de cinq cartes. Il n’utilise aucun booster gratuit et ne redémarre pas le compteur de recharge. Les boosters achetés ont exactement les mêmes chances de rareté que les gratuits. Le prix est débité et les cartes sont sauvegardées ensemble ; si la sauvegarde échoue, le solde et le stock sont restaurés. Les pièces sont une monnaie de jeu uniquement : aucun paiement réel n’est proposé.

Les anciennes quêtes déjà récupérées restent marquées comme récupérées. Elles ne donnent pas de pièces rétroactivement.

## Quêtes quotidiennes, hebdomadaires et permanentes

- **8 quêtes quotidiennes** parmi 14 variantes, renouvelées à minuit, heure de Paris. Les quatre missions de la première édition sont conservées pour la même date, avec quatre missions supplémentaires.
- **3 quêtes hebdomadaires**, renouvelées le lundi à minuit, heure de Paris : ouvertures, cartes rares et nombre de cartes obtenues.
- **6 objectifs de parcours permanents** : collection de 10 / 25 / 50 cartes, première légendaire, premier prestige et vitrine de trois cartes.

Chaque récompense indique ses XP et ses pièces. Un clic sur « Récupérer XP + pièces » donne les deux en une fois. Elle ne peut être récupérée qu’une fois par période, ou une fois au total pour le parcours permanent. Les récompenses quotidiennes et hebdomadaires non récupérées expirent. Les changements d’heure sont pris en compte via le fuseau Europe/Paris.

Les ouvertures gratuites et celles payées avec des pièces comptent toutes deux dans les objectifs de tirage (sauf les missions qui demandent explicitement des gratuits). Les échanges, réinitialisations et rebirths ne comptent pas comme des tirages. Les compteurs hebdomadaires commencent avec cette édition ; les quêtes quotidiennes existantes sont conservées. Les objectifs de collection vérifient la possession actuelle et ne sont pas réclamables une deuxième fois après consommation puis récupération des mêmes cartes.

Les montants et objectifs des quêtes se modifient dans les tableaux `questPool`, `weeklyPool` et `collectionPool` de **progression.js**. Ne renomme pas les ids d’objectifs déjà utilisés dans les sauvegardes.

## Insignes et distinctions

Le niveau augmente tous les 200 XP. L’insigne évolue graphiquement : recrue (1), éclaireur (5), élite (10), champion (20), maître (35), mythique (50), transcendant (100). Les formes gagnent des ailes, une couronne et des ornements. Les cinq prestiges ont leurs propres insignes : bronze, argent, or, astral et souverain.

Le profil propose **12 distinctions permanentes** : cartes uniques, première légendaire, découverte des deux univers, nombre de boosters ouverts, prestige, vitrine remplie, pièces gagnées au total et niveau 20. Une fois débloquées et sauvegardées, elles restent acquises. Elles sont cosmétiques et ne modifient pas les chances de tirage.

## Téléphone et couvertures

Le site dispose d’une navigation horizontale défilante sur téléphone, de boutons tactiles, de formulaires à largeur adaptée et de mises en page en une ou deux colonnes suivant l’écran.

Deux couvertures SVG sont fournies : **couvertures/original.svg** (or et violet, « Les Origines ») et **couvertures/anime.svg** (cyan et violet, « Duo animé »). Ce sont des visuels vectoriels, sans dépendance externe. Les chemins se modifient dans l’objet `COLLECTIONS` de **jeu.js**.

## Quels fichiers modifier ?

| Fichier | Rôle |
| --- | --- |
| cartes.js | Catalogue des cartes : inchangé dans cette édition |
| reglages.js | Taux de drop, délai et accès admin de démonstration |
| progression-reglages.js | Objectifs et récompenses des cinq rebirths, places de vitrine (1 à 6) |
| progression.js | Profils, vitrine, badges, XP, quêtes et rebirths |
| progression.css | Apparence des profils, vitrines et rebirths |
| economie.js | Portefeuille, réserve et recharge des boosters gratuits |
| evolution.css | Couvertures, insignes, portefeuille et adaptations mobiles |
| couvertures/*.svg | Les deux couvertures de boosters |
| jeu.js | Moteur des boosters, comptes locaux, amis et échanges |

## Sauvegardes et limites de cette édition

Les cartes et les comptes existants sont conservés si tu remplaces les fichiers à la même adresse et dans le même navigateur. Ne vide pas les données du site. Déplacer un fichier local vers un autre dossier ou passer à une adresse hébergée peut produire un autre espace de sauvegarde : garde ton ancien dossier en secours avant de tester.

Cette version **ne branche pas encore Supabase** et n’est pas publiée. Les profils, quêtes et échanges sont locaux. Ils ne sont pas synchronisés entre les appareils. Les trois tables créées précédemment dans Supabase ne sont pas utilisées ni modifiées par cette édition. Les cartes, XP, horloges et droits admin restent modifiables dans le navigateur : les contrôles serveur seront nécessaires lors du passage en ligne.

Vérifications réalisées : initialisation complète du moteur, migration des anciennes cartes, cinq rebirths, annulation et échec de sauvegarde, double récompense bloquée, renouvellements quotidiens et hebdomadaires, réserve hors ligne et plafond de cinq, conservation du compteur partiel, achat sans toucher aux gratuits, solde et stock restaurés si la sauvegarde échoue, sauvegardes de l’argent et des quêtes, insignes évolutifs, limite de photo à 5 Mo et séparation des deux séries.

Dans le navigateur : les sept écrans ont été vérifiés dans un cadre responsive de 320, 375, 430 et 1 100 pixels, sans débordement horizontal de page. L’édition du profil à 375 pixels, la récupération XP + pièces et les deux modes d’ouverture ont aussi été vérifiés avec des données fictives. Il ne s’agit pas d’un test sur un téléphone physique. Les pages de test et les données fictives ne sont pas dans le ZIP.
