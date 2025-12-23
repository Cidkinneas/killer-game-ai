import { Play, Target, Sparkles } from 'lucide-react';

interface HomeScreenProps {
  onStart: () => void;
}

export const HomeScreen = ({ onStart }: HomeScreenProps) => {
  return (
    <div className="min-h-screen bg-gray-900 p-6 flex flex-col items-center justify-center">
      <div className="max-w-md mx-auto w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-4xl">🎯</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Killer AI</h1>
          <p className="text-xl text-gray-400 mb-2">Pass-and-Play</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700 text-left">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-red-500" />
            Comment jouer ?
          </h2>
          <ol className="space-y-3 text-gray-300 text-sm">
            <li className="flex gap-3">
              <span className="font-bold text-red-500">1.</span>
              <span>Ajoutez au moins 3 joueurs</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-red-500">2.</span>
              <span>Générez les missions (avec ou sans IA)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-red-500">3.</span>
              <span>Passez le téléphone à chaque joueur pour révéler sa mission</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-red-500">4.</span>
              <span>Chaque joueur doit éliminer sa cible en accomplissant sa mission</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-red-500">5.</span>
              <span>Le dernier joueur en vie gagne !</span>
            </li>
          </ol>
        </div>

        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <h3 className="font-semibold text-blue-300 mb-1">Mode Pass-and-Play</h3>
              <p className="text-xs text-blue-200">
                Cette application est conçue pour être jouée sur un seul téléphone que vous vous passez de main en main. 
                Chaque joueur découvre sa mission secrètement avant de commencer le jeu.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 bg-red-600 hover:bg-red-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors text-lg"
        >
          <Play className="w-6 h-6" />
          Démarrer une partie
        </button>
      </div>
    </div>
  );
};

