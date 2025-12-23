import { Player } from '../types';

const API_KEY_STORAGE = 'killer_ai_api_key';
const TEMPERATURE_STORAGE = 'killer_ai_temperature';
const PLAYERS_STORAGE = 'killer_ai_players';
const USE_OPENAI_STORAGE = 'killer_ai_use_openai';

export const storage = {
  getApiKey: (): string => {
    return localStorage.getItem(API_KEY_STORAGE) || '';
  },

  setApiKey: (key: string): void => {
    localStorage.setItem(API_KEY_STORAGE, key);
  },

  getTemperature: (): number => {
    const temp = localStorage.getItem(TEMPERATURE_STORAGE);
    return temp ? parseFloat(temp) : 0.7;
  },

  setTemperature: (temp: number): void => {
    localStorage.setItem(TEMPERATURE_STORAGE, temp.toString());
  },

  getPlayers: (): Player[] => {
    const players = localStorage.getItem(PLAYERS_STORAGE);
    return players ? JSON.parse(players) : [];
  },

  setPlayers: (players: Player[]): void => {
    localStorage.setItem(PLAYERS_STORAGE, JSON.stringify(players));
  },

  getUseOpenAI: (): boolean => {
    const useOpenAI = localStorage.getItem(USE_OPENAI_STORAGE);
    return useOpenAI !== 'false'; // Par défaut, on utilise OpenAI si une clé est présente
  },

  setUseOpenAI: (useOpenAI: boolean): void => {
    localStorage.setItem(USE_OPENAI_STORAGE, useOpenAI.toString());
  },

  clearGameData: (): void => {
    // On garde la clé API et la température, mais on efface les joueurs et les missions
    localStorage.removeItem(PLAYERS_STORAGE);
    // Les missions ne sont jamais stockées pour éviter la triche
  },

  clearAllData: (): void => {
    // Efface toutes les données stockées
    localStorage.removeItem(API_KEY_STORAGE);
    localStorage.removeItem(TEMPERATURE_STORAGE);
    localStorage.removeItem(PLAYERS_STORAGE);
    localStorage.removeItem(USE_OPENAI_STORAGE);
  },
};

