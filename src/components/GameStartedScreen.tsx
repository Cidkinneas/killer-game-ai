import { useState } from 'react';
import { RotateCcw, Trash2 } from 'lucide-react';
import { storage } from '../utils/storage';

interface GameStartedScreenProps {
  onNewGame: () => void;
}

export const GameStartedScreen = ({ onNewGame }: GameStartedScreenProps) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    if (showResetConfirm) {
      storage.clearAllData();
      window.location.reload();
    } else {
      setShowResetConfirm(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 flex flex-col items-center justify-center">
      <div className="max-w-md mx-auto w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-4xl">🎯</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Le jeu a commencé !</h1>
          <p className="text-lg text-gray-400 mb-2">
            Ne laissez personne voir votre téléphone.
          </p>
          <p className="text-sm text-gray-500">
            Chaque joueur connaît sa cible et sa mission.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Règles du jeu</h2>
          <ul className="text-left space-y-2 text-gray-300 text-sm">
            <li>• Chaque joueur a une cible à éliminer</li>
            <li>• Accomplissez votre mission pour éliminer votre cible</li>
            <li>• Ne révélez pas votre mission aux autres</li>
            <li>• Le dernier joueur en vie gagne !</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={onNewGame}
            className="w-full py-4 bg-red-600 hover:bg-red-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Nouvelle partie
          </button>

          {showResetConfirm ? (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
              <p className="text-sm text-red-300 mb-3">
                ⚠️ Êtes-vous sûr de vouloir supprimer toutes les données ? Cette action est irréversible.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-colors"
                >
                  Oui, tout supprimer
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleReset}
              className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors text-gray-300"
            >
              <Trash2 className="w-5 h-5" />
              Réinitialiser toutes les données
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

