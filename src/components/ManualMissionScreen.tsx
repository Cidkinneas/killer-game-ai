import { useState, useRef, useEffect } from 'react';
import { Edit3, ArrowRight, Check } from 'lucide-react';
import { Player } from '../types';

interface ManualMissionScreenProps {
  players: Player[];
  onComplete: (missionTexts: string[]) => void;
}

export const ManualMissionScreen = ({ players, onComplete }: ManualMissionScreenProps) => {
  const numberOfMissions = players.length;
  const [missions, setMissions] = useState<Record<number, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentMission = missions[currentIndex] || '';
  const isLast = currentIndex === numberOfMissions - 1;
  const canProceed = currentMission.trim().length > 0;

  // Mettre le focus sur le textarea quand on change de mission
  useEffect(() => {
    textareaRef.current?.focus();
  }, [currentIndex]);

  const handleMissionChange = (value: string) => {
    setMissions((prev) => ({
      ...prev,
      [currentIndex]: value,
    }));
  };

  const handleNext = () => {
    if (isLast) {
      // Créer la liste des missions (juste les textes, sans couples)
      const missionTexts: string[] = [];
      for (let i = 0; i < numberOfMissions; i++) {
        missionTexts.push(missions[i] || '');
      }
      onComplete(missionTexts);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 flex flex-col">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        <div className="mb-8 text-center pt-8">
          <Edit3 className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-3xl font-bold mb-2">Créer les missions</h1>
          <p className="text-gray-400">
            Mission {currentIndex + 1} sur {numberOfMissions}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            L'application mélangera ensuite les joueurs et les missions
          </p>
          <div className="mt-4 w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-red-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / numberOfMissions) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">Mission #{currentIndex + 1}</p>
              <p className="text-lg text-white font-semibold">
                Créez une mission amusante
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Description de la mission
              </label>
              <textarea
                ref={textareaRef}
                value={currentMission}
                onChange={(e) => handleMissionChange(e.target.value)}
                placeholder="Ex: Fais en sorte que ta cible dise 'Je suis un ninja secret' en public..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white resize-none"
                rows={6}
                autoFocus
              />
              <p className="mt-2 text-xs text-gray-500">
                {currentMission.length} caractères
              </p>
            </div>
          </div>

          {numberOfMissions > 1 && (
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Progression</p>
              <div className="space-y-2">
                {Array.from({ length: numberOfMissions }, (_, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 text-sm ${
                      index === currentIndex
                        ? 'text-white font-semibold'
                        : missions[index]?.trim()
                        ? 'text-green-400'
                        : 'text-gray-500'
                    }`}
                  >
                    {missions[index]?.trim() ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-current" />
                    )}
                    <span>
                      Mission {index + 1}
                      {missions[index]?.trim() && (
                        <span className="text-xs ml-2">
                          ({missions[index].substring(0, 30)}...)
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-3">
          <div className="flex gap-2">
            {currentIndex > 0 && (
              <button
                onClick={handlePrevious}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
              >
                Précédent
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                canProceed
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLast ? (
                <>
                  <Check className="w-5 h-5" />
                  Terminer
                </>
              ) : (
                <>
                  Suivant
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
          {!canProceed && (
            <p className="text-center text-gray-500 text-sm">
              Veuillez saisir une mission avant de continuer
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

