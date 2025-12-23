import { RotateCcw } from 'lucide-react';

interface GameStartedScreenProps {
  onNewGame: () => void;
}

export const GameStartedScreen = ({ onNewGame }: GameStartedScreenProps) => {

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
        </div>
      </div>
    </div>
  );
};

