import { useState, useEffect, useRef } from 'react';
import { Plus, X, Users, Play, Settings, Trash2, Key, Sparkles } from 'lucide-react';
import { Player } from '../types';
import { storage } from '../utils/storage';

interface PlayerListScreenProps {
  onGenerate: (players: Player[], useOpenAI: boolean) => void;
  onSettings?: () => void;
}

export const PlayerListScreen = ({ onGenerate, onSettings }: PlayerListScreenProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showModeSelection, setShowModeSelection] = useState(false);
  const [useOpenAI, setUseOpenAI] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedPlayers = storage.getPlayers();
    if (savedPlayers.length > 0) {
      setPlayers(savedPlayers);
    }
  }, []);

  const addPlayer = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !players.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: trimmed,
      };
      const updated = [...players, newPlayer];
      setPlayers(updated);
      storage.setPlayers(updated);
      setInputValue('');
      // Remettre le focus sur le champ après l'ajout
      inputRef.current?.focus();
    }
  };

  const removePlayer = (id: string) => {
    const updated = players.filter(p => p.id !== id);
    setPlayers(updated);
    storage.setPlayers(updated);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addPlayer();
    }
  };

  const canGenerate = players.length >= 3;

  const handleGenerateClick = () => {
    if (canGenerate) {
      setShowModeSelection(true);
    }
  };

  const handleConfirmGenerate = () => {
    onGenerate(players, useOpenAI);
  };

  const handleReset = () => {
    if (showResetConfirm) {
      storage.clearAllData();
      window.location.reload();
    } else {
      setShowResetConfirm(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 flex flex-col">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        <div className="mb-8 text-center pt-8">
          <Users className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-3xl font-bold mb-2">Joueurs</h1>
          <p className="text-gray-400">
            Ajoutez au moins 3 joueurs pour commencer
          </p>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nom du joueur"
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            />
            <button
              onClick={addPlayer}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between px-4 py-3 bg-gray-800 rounded-lg"
              >
                <span className="text-white font-medium">{player.name}</span>
                <button
                  onClick={() => removePlayer(player.id)}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {players.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-8">
              Aucun joueur ajouté
            </p>
          )}
        </div>

        <div className="mt-8 space-y-3">
          {showModeSelection ? (
            <div className="space-y-4">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-white">Choisissez le mode de génération</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700 transition-colors">
                    <input
                      type="radio"
                      checked={useOpenAI}
                      onChange={() => setUseOpenAI(true)}
                      className="w-4 h-4 text-red-600"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        Mode IA (OpenAI)
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Génération créative avec l'IA (nécessite une clé API)
                      </p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700 transition-colors">
                    <input
                      type="radio"
                      checked={!useOpenAI}
                      onChange={() => setUseOpenAI(false)}
                      className="w-4 h-4 text-red-600"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Mode Sans Clé
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        100 missions prédéfinies amusantes
                      </p>
                    </div>
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleConfirmGenerate}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  Générer
                </button>
                <button
                  onClick={() => setShowModeSelection(false)}
                  className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={handleGenerateClick}
                disabled={!canGenerate}
                className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                  canGenerate
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Play className="w-5 h-5" />
                Générer la partie
              </button>
              {!canGenerate && (
                <p className="text-center text-gray-500 text-sm">
                  Minimum 3 joueurs requis
                </p>
              )}
            </>
          )}

          <div className="flex gap-2 pt-2 border-t border-gray-700">
            {onSettings && (
              <button
                onClick={onSettings}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors text-gray-300 text-sm"
              >
                <Settings className="w-4 h-4" />
                Paramètres
              </button>
            )}
            {showResetConfirm ? (
              <div className="flex-1 bg-red-900/30 border border-red-700 rounded-lg p-2">
                <p className="text-xs text-red-300 mb-2">Tout supprimer ?</p>
                <div className="flex gap-1">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-1 bg-red-600 hover:bg-red-700 rounded text-xs font-semibold transition-colors"
                  >
                    Oui
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs font-semibold transition-colors"
                  >
                    Non
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleReset}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors text-gray-300 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

