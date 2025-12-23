import { useState } from 'react';
import { Screen, Player, Mission, GameState, GenerationMode } from './types';
import { storage } from './utils/storage';
import { generateAllMissions } from './utils/openai';
import { PREDEFINED_MISSIONS_COUNT } from './data/missions';
import { HomeScreen } from './components/HomeScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { PlayerListScreen } from './components/PlayerListScreen';
import { GeneratingScreen } from './components/GeneratingScreen';
import { ManualMissionScreen } from './components/ManualMissionScreen';
import { RevealScreen } from './components/RevealScreen';
import { GameStartedScreen } from './components/GameStartedScreen';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  const handleHomeStart = () => {
    setScreen('players');
  };

  const handleSettingsNext = () => {
    setScreen('players');
  };

  const handleGenerate = async (players: Player[], mode: GenerationMode) => {
    if (mode === 'manual') {
      // Mode manuel : rediriger vers l'écran de création manuelle
      setScreen('manualMissions');
      return;
    }

    const apiKey = storage.getApiKey();
    const temperature = storage.getTemperature();
    const useOpenAI = mode === 'openai';

    if (useOpenAI && !apiKey) {
      setError('Veuillez configurer votre clé API dans les paramètres d\'abord.');
      setScreen('settings');
      return;
    }

    setScreen('generating');
    setGenerationProgress({ current: 0, total: players.length });

    try {
      const missions = await generateAllMissions(
        players,
        useOpenAI,
        apiKey,
        temperature,
        (current, total) => {
          setGenerationProgress({ current, total });
        }
      );

      setGameState({
        players,
        missions,
        currentPlayerIndex: 0,
        isRevealed: false,
        gameStarted: false,
      });

      setScreen('reveal');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération');
      setScreen('players');
    }
  };

  const handleManualMissionsComplete = (missionTexts: string[]) => {
    const players = storage.getPlayers();
    
    // Algorithme de Fisher-Yates pour mélanger les joueurs
    const shuffleArray = <T,>(array: T[]): T[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // Mélanger les joueurs
    const shuffledPlayers = shuffleArray(players);
    
    // Mélanger les missions
    const shuffledMissions = shuffleArray(missionTexts);
    
    // Créer les couples tueur/victime en cercle fermé et associer les missions mélangées
    const finalMissions: Mission[] = shuffledPlayers.map((killer, index) => ({
      killer: killer.name,
      target: shuffledPlayers[(index + 1) % shuffledPlayers.length].name,
      mission: shuffledMissions[index],
    }));
    
    setGameState({
      players,
      missions: finalMissions,
      currentPlayerIndex: 0,
      isRevealed: false,
      gameStarted: false,
    });

    setScreen('reveal');
  };

  const handleRevealNext = () => {
    if (!gameState) return;

    const nextIndex = gameState.currentPlayerIndex + 1;
    
    if (nextIndex >= gameState.missions.length) {
      // Tous les joueurs ont vu leur mission
      setGameState({
        ...gameState,
        gameStarted: true,
      });
      setScreen('gameStarted');
    } else {
      setGameState({
        ...gameState,
        currentPlayerIndex: nextIndex,
        isRevealed: false,
      });
      // Reste sur l'écran reveal pour le joueur suivant
    }
  };

  const handleNewGame = () => {
    storage.clearGameData();
    setGameState(null);
    setScreen('home');
  };

  const getCurrentMission = (): Mission | null => {
    if (!gameState) return null;
    return gameState.missions[gameState.currentPlayerIndex] || null;
  };

  const getCurrentKiller = (): string => {
    if (!gameState) return '';
    const mission = gameState.missions[gameState.currentPlayerIndex];
    return mission?.killer || '';
  };

  if (error) {
    const isQuotaError = error.includes('QUOTA_API_DEPASSE');
    const errorMessage = isQuotaError 
      ? error.replace('QUOTA_API_DEPASSE: ', '')
      : error;

    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="max-w-md mx-auto w-full text-center">
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-6 mb-4">
            <h2 className="text-xl font-bold mb-3 text-red-400">
              {isQuotaError ? 'Quota API dépassé' : 'Erreur'}
            </h2>
            <p className="text-gray-300 mb-4">{errorMessage}</p>
            
            {isQuotaError && (
              <div className="mt-4 pt-4 border-t border-red-800 text-left">
                <p className="text-sm text-gray-300 mb-3">
                  <strong className="text-white">Que faire maintenant ?</strong>
                </p>
                <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
                  <li>Utilisez le <strong className="text-white">mode sans clé</strong> avec {PREDEFINED_MISSIONS_COUNT} missions prédéfinies</li>
                  <li>Attendez que votre quota OpenAI soit renouvelé</li>
                  <li>Vérifiez votre compte OpenAI pour augmenter votre limite</li>
                </ul>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            {isQuotaError ? (
              <>
                <button
                  onClick={() => {
                    setError(null);
                    setScreen('players');
                  }}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
                >
                  Retourner aux joueurs (choisir mode sans clé)
                </button>
                <button
                  onClick={() => {
                    setError(null);
                    setScreen('settings');
                  }}
                  className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                >
                  Aller aux paramètres
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setError(null);
                  setScreen('settings');
                }}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
              >
                Retour aux paramètres
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  switch (screen) {
    case 'home':
      return <HomeScreen onStart={handleHomeStart} />;
    
    case 'settings':
      return <SettingsScreen onNext={handleSettingsNext} />;
    
    case 'players':
      return <PlayerListScreen onGenerate={handleGenerate} onSettings={() => setScreen('settings')} />;
    
    case 'generating':
      return (
        <GeneratingScreen
          progress={generationProgress.current}
          total={generationProgress.total}
        />
      );
    
    case 'manualMissions':
      return (
        <ManualMissionScreen
          players={storage.getPlayers()}
          onComplete={handleManualMissionsComplete}
        />
      );
    
    case 'reveal':
      const mission = getCurrentMission();
      if (!mission) return null;
      return (
        <RevealScreen
          key={`reveal-${gameState?.currentPlayerIndex}`}
          currentKiller={getCurrentKiller()}
          mission={mission}
          isLast={gameState?.currentPlayerIndex === (gameState?.missions.length ?? 0) - 1}
          onNext={handleRevealNext}
        />
      );
    
    case 'gameStarted':
      return <GameStartedScreen onNewGame={handleNewGame} />;
    
    default:
      return null;
  }
}

export default App;

