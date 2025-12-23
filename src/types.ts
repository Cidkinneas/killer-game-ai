export interface GameConfig {
  apiKey: string;
  temperature: number;
}

export interface Player {
  id: string;
  name: string;
}

export interface Mission {
  killer: string;
  target: string;
  mission: string;
}

export interface GameState {
  players: Player[];
  missions: Mission[];
  currentPlayerIndex: number;
  isRevealed: boolean;
  gameStarted: boolean;
}

export type Screen = 'home' | 'settings' | 'players' | 'generating' | 'manualMissions' | 'reveal' | 'gameStarted';

export type GenerationMode = 'openai' | 'predefined' | 'manual';

