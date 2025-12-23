import { Player, Mission } from '../types';
import { PREDEFINED_MISSIONS, PREDEFINED_MISSIONS_COUNT } from '../data/missions';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface GenerateMissionParams {
  apiKey: string;
  temperature: number;
  killer: string;
  target: string;
}

export const generateMission = async ({
  apiKey,
  temperature,
  killer,
  target,
}: GenerateMissionParams): Promise<string> => {
  const prompt = `Tu es un maître du jeu de Killer. Génère un gage pour un joueur qui doit éliminer sa cible. Le gage doit être drôle, légèrement absurde, et réalisable en public sans être dangereux ou déplacé. Le but est que la cible fasse une action spécifique ou dise une phrase précise sans se rendre compte qu'il s'agit d'un piège. Format de réponse : JSON uniquement avec le champ 'mission'.`;

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: `Le joueur "${killer}" doit éliminer "${target}". Génère un gage créatif et amusant.`,
        },
      ],
      temperature,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 401) {
      throw new Error('Clé API invalide. Vérifiez vos paramètres.');
    }
    if (response.status === 429) {
      throw new Error(`QUOTA_API_DEPASSE: Le quota de votre clé API OpenAI a été dépassé. Vous pouvez utiliser le mode sans clé avec ${PREDEFINED_MISSIONS_COUNT} missions prédéfinies comme alternative.`);
    }
    throw new Error(error.error?.message || 'Erreur lors de la génération de la mission.');
  }

  const data = await response.json();
  const content = JSON.parse(data.choices[0].message.content);
  return content.mission || 'Mission secrète activée !';
};

// Algorithme de Fisher-Yates pour un mélange vraiment aléatoire
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Fonction pour créer une assignation aléatoire des cibles
// Chaque joueur a une cible unique et différente de lui-même (permutation aléatoire)
const assignRandomTargets = (players: Player[]): Map<Player, Player> => {
  const assignment = new Map<Player, Player>();
  
  // Cas spécial : si un seul joueur, pas de cible possible
  if (players.length <= 1) {
    return assignment;
  }
  
  // Créer une permutation aléatoire des cibles
  let targets = shuffleArray([...players]);
  
  // Vérifier et corriger les cas où un joueur est sa propre cible
  // On itère jusqu'à ce qu'on ait une permutation valide
  let attempts = 0;
  const maxAttempts = 100;
  
  while (attempts < maxAttempts) {
    let hasSelfTarget = false;
    
    // Vérifier s'il y a des joueurs assignés à eux-mêmes
    for (let i = 0; i < players.length; i++) {
      if (targets[i].name === players[i].name) {
        hasSelfTarget = true;
        // Échanger avec un autre joueur aléatoire
        const swapIndex = Math.floor(Math.random() * players.length);
        if (swapIndex !== i) {
          [targets[i], targets[swapIndex]] = [targets[swapIndex], targets[i]];
        }
      }
    }
    
    // Si aucune auto-assignation, on a une permutation valide
    if (!hasSelfTarget) {
      break;
    }
    
    attempts++;
    
    // Si trop d'essais, remélanger complètement
    if (attempts >= maxAttempts) {
      targets = shuffleArray([...players]);
      // Dernière correction manuelle si nécessaire
      for (let i = 0; i < players.length; i++) {
        if (targets[i].name === players[i].name) {
          const nextIndex = (i + 1) % players.length;
          [targets[i], targets[nextIndex]] = [targets[nextIndex], targets[i]];
        }
      }
    }
  }
  
  // Créer l'assignation finale
  for (let i = 0; i < players.length; i++) {
    assignment.set(players[i], targets[i]);
  }
  
  return assignment;
};

export const generateAllMissions = async (
  players: Player[],
  useOpenAI: boolean,
  apiKey: string,
  temperature: number,
  onProgress?: (current: number, total: number) => void
): Promise<Mission[]> => {
  // Mélanger les joueurs de manière aléatoire avec Fisher-Yates
  const shuffled = shuffleArray(players);
  
  // Assigner des cibles de manière aléatoire (pas juste la personne suivante)
  const targetAssignment = assignRandomTargets(shuffled);
  
  // Pour le mode sans clé : mélanger les missions prédéfinies une seule fois
  let shuffledMissions: string[] = [];
  if (!useOpenAI) {
    shuffledMissions = shuffleArray([...PREDEFINED_MISSIONS]);
  }
  
  const missions: Mission[] = [];
  
  for (let i = 0; i < shuffled.length; i++) {
    const killer = shuffled[i];
    const target = targetAssignment.get(killer)!;
    
    onProgress?.(i + 1, shuffled.length);
    
    let mission: string;
    
    if (useOpenAI) {
      // Mode OpenAI : génération via API
      mission = await generateMission({
        apiKey,
        temperature,
        killer: killer.name,
        target: target.name,
      });
    } else {
      // Mode sans clé : utiliser une mission prédéfinie (sans doublon)
      // Simuler un petit délai pour l'expérience utilisateur
      await new Promise(resolve => setTimeout(resolve, 100));
      // Utiliser la mission à l'index i modulo le nombre de missions disponibles
      // Cela garantit qu'on utilise chaque mission une fois avant de réutiliser
      mission = shuffledMissions[i % shuffledMissions.length];
    }
    
    missions.push({
      killer: killer.name,
      target: target.name,
      mission,
    });
  }
  
  return missions;
};

