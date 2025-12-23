import { useState, useRef } from 'react';
import { Target, Eye, EyeOff } from 'lucide-react';
import { Mission } from '../types';

interface RevealScreenProps {
  currentKiller: string;
  mission: Mission;
  isLast: boolean;
  onNext: () => void;
}

export const RevealScreen = ({
  currentKiller,
  mission,
  isLast,
  onNext,
}: RevealScreenProps) => {
  const [isWaiting, setIsWaiting] = useState(true);
  const [isHolding, setIsHolding] = useState(false);
  const [isMissionRevealed, setIsMissionRevealed] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const isTouchDeviceRef = useRef(false);

  const handleStart = () => {
    setIsWaiting(false);
  };

  // Pour le web (souris) : toggle au clic
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Ne toggle que si ce n'est pas un appareil tactile
    if (!isTouchDeviceRef.current) {
      setIsHolding(prev => {
        const newValue = !prev;
        setIsMissionRevealed(newValue);
        return newValue;
      });
    }
  };

  // Pour le mobile (touch) : maintenir pour révéler, puis rester visible
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    isTouchDeviceRef.current = true;
    setIsHolding(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    // Sur mobile, une fois qu'on a touché, la mission reste révélée
    if (isTouchDeviceRef.current) {
      setIsMissionRevealed(true);
    }
    setIsHolding(false);
  };

  const handleTouchCancel = (e: React.TouchEvent) => {
    e.preventDefault();
    // Sur mobile, une fois qu'on a touché, la mission reste révélée
    if (isTouchDeviceRef.current) {
      setIsMissionRevealed(true);
    }
    setIsHolding(false);
  };

  const handleMemorized = () => {
    setIsRevealed(true);
  };

  const handleContinue = () => {
    onNext();
  };

  if (isWaiting) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex flex-col items-center justify-center">
        <div className="max-w-md mx-auto w-full text-center">
          <Target className="w-16 h-16 mx-auto mb-6 text-red-500" />
          <h2 className="text-2xl font-bold mb-4">
            C'est au tour de <span className="text-red-500">{currentKiller}</span>
          </h2>
          <p className="text-gray-400 mb-8">Prépare-toi...</p>
          <button
            onClick={handleStart}
            className="w-full py-4 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
          >
            C'est moi
          </button>
        </div>
      </div>
    );
  }

  if (isRevealed) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex flex-col items-center justify-center">
        <div className="max-w-md mx-auto w-full text-center">
          <EyeOff className="w-16 h-16 mx-auto mb-6 text-gray-600" />
          <h2 className="text-2xl font-bold mb-4">Mission mémorisée</h2>
          <p className="text-gray-400 mb-8">
            {isLast
              ? 'Tous les joueurs ont reçu leur mission !'
              : 'Passe le téléphone au joueur suivant'}
          </p>
          <button
            onClick={handleContinue}
            className="w-full py-4 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
          >
            {isLast ? 'Commencer le jeu' : 'Suivant'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 flex flex-col items-center justify-center">
      <div className="max-w-md mx-auto w-full text-center space-y-6">
        <Target className="w-16 h-16 mx-auto text-red-500" />
        <div>
          <h2 className="text-xl font-semibold mb-2">Ta cible :</h2>
          <p className="text-3xl font-bold text-red-500 mb-6">{mission.target}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Ta mission :</h3>
          {isHolding || isMissionRevealed ? (
            <div className="space-y-4">
              <Eye className="w-8 h-8 mx-auto text-green-500" />
              <p className="text-lg text-white leading-relaxed">{mission.mission}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <EyeOff className="w-8 h-8 mx-auto text-gray-600" />
              <p className="text-lg text-gray-500">Maintenir pour révéler</p>
            </div>
          )}
        </div>

        {!isMissionRevealed ? (
          <div
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
            className={`w-full py-4 rounded-lg font-semibold transition-colors text-center select-none cursor-pointer ${
              isHolding
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            role="button"
            tabIndex={0}
            style={{ userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'manipulation' }}
          >
            {isHolding ? '👁️ Maintenir pour voir' : '👁️‍🗨️ Maintenir pour révéler'}
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleMemorized}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              J'ai mémorisé, cacher la mission
            </button>
            {!isTouchDeviceRef.current && (
              <button
                onClick={() => setIsMissionRevealed(false)}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors text-sm"
              >
                Cacher la mission
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

