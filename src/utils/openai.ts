import { Player, Mission } from '../types';
import { getRandomMission, PREDEFINED_MISSIONS_COUNT } from '../data/missions';

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

export const generateAllMissions = async (
  players: Player[],
  useOpenAI: boolean,
  apiKey: string,
  temperature: number,
  onProgress?: (current: number, total: number) => void
): Promise<Mission[]> => {
  // Mélanger les joueurs de manière aléatoire avec Fisher-Yates
  const shuffled = shuffleArray(players);
  
  const missions: Mission[] = [];
  
  for (let i = 0; i < shuffled.length; i++) {
    const killer = shuffled[i];
    const target = shuffled[(i + 1) % shuffled.length];
    
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
      // Mode sans clé : utiliser une mission prédéfinie
      // Simuler un petit délai pour l'expérience utilisateur
      await new Promise(resolve => setTimeout(resolve, 100));
      mission = getRandomMission();
    }
    
    missions.push({
      killer: killer.name,
      target: target.name,
      mission,
    });
  }
  
  return missions;
};

