/* Objectifs permanents des cinq rebirths.
   Chaque quantité est le nombre d'exemplaires CONSOMMÉS.
   Les identifiants correspondent à cartes.js : ne change pas les ids existants.
   XP et niveaux sont cosmétiques : ils ne changent pas les taux de drop.
*/
window.TCG_PROGRESSION = {
  vitrinePlaces: 6,
  rebirths: [
    { title: 'Premier sacrifice', xp: 150, cards: [
      { id: 'original-001', count: 2 }, { id: 'anime-001', count: 2 }
    ] },
    { title: 'Le goût du risque', xp: 250, cards: [
      { id: 'original-028', count: 2 }, { id: 'anime-027', count: 2 },
      { id: 'original-002', count: 3 }
    ] },
    { title: 'Passage dans l’élite', xp: 400, cards: [
      { id: 'original-041', count: 1 }, { id: 'anime-041', count: 1 },
      { id: 'original-029', count: 3 }, { id: 'anime-028', count: 3 }
    ] },
    { title: 'Le prix de la gloire', xp: 600, cards: [
      { id: 'original-048', count: 1 }, { id: 'anime-046', count: 1 },
      { id: 'original-042', count: 2 }, { id: 'anime-042', count: 2 }
    ] },
    { title: 'Au sommet de Kylian', xp: 1000, cards: [
      { id: 'original-049', count: 2 }, { id: 'anime-047', count: 2 },
      { id: 'original-050', count: 1 }, { id: 'anime-048', count: 1 },
      { id: 'original-043', count: 3 }, { id: 'anime-043', count: 3 }
    ] }
  ]
};
