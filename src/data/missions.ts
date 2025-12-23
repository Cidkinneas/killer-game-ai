// Liste de 100 missions prédéfinies pour le mode sans clé OpenAI
// Missions adaptées pour être jouées en famille, entre amis et collègues
export const PREDEFINED_MISSIONS = [
  "Ta cible doit chercher un objet rouge et un objet vert dans la maison.",
  "Ta cible doit chanter au moins une phrase d’un chant de Noël.",
  "Ta cible doit mettre un accessoire de Noël (bonnet, serre-tête renne, pull moche…)",
  "Lui faire parler avec un accent (du Sud, anglais exagéré, québécois, belge…) pendant au moins 30 secondes.",
  "Ta cible doit imiter un animal (chat, lion, singe…) dans une conversation ou un jeu.",
  "Lui faire faire une mini danse (quelques pas) sur une musique.",
  "Lui faire mettre du vernis à ongles (à lui-même ou à quelqu’un d’autre)",
  "Lui faire faire quelques mouvements de sport",
  "Lui faire porter quelque chose qui t’appartient (habit, bijou…) pendant au moins 1h",
  "Lui faire faire un 'je te tiens par la barbichette'",
  "Lui faire nettoyer quelque chose que tu as sali/renversé",
  "Faire un selfie duck face à la cible (bouche en cul de poule)",
  "Faire croire une information ridicule sur soi à la cible",
  "Lui faire faire un pierre-feuille-ciseaux",
  "Lui faire goûter quelque chose les yeux fermés",
];

// Fonction pour obtenir une mission aléatoire
export const getRandomMission = (): string => {
  const randomIndex = Math.floor(Math.random() * PREDEFINED_MISSIONS.length);
  return PREDEFINED_MISSIONS[randomIndex];
};
