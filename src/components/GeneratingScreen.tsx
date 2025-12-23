import { Loader2 } from 'lucide-react';

interface GeneratingScreenProps {
  progress: number;
  total: number;
}

const loadingMessages = [
  'Recrutement des agents secrets...',
  'Affûtage des couteaux en plastique...',
  'Formation des assassins...',
  'Préparation des missions...',
  'Mélange des identités...',
  'Activation du mode furtif...',
];

export const GeneratingScreen = ({ progress, total }: GeneratingScreenProps) => {
  const percentage = Math.round((progress / total) * 100);
  const messageIndex = Math.min(
    Math.floor((progress / total) * loadingMessages.length),
    loadingMessages.length - 1
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6 flex flex-col items-center justify-center">
      <div className="max-w-md mx-auto w-full text-center">
        <Loader2 className="w-16 h-16 mx-auto mb-6 text-red-500 animate-spin" />
        <h2 className="text-2xl font-bold mb-4">Génération en cours...</h2>
        <p className="text-gray-400 mb-8">{loadingMessages[messageIndex]}</p>
        
        <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
          <div
            className="bg-red-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">
          {progress} / {total} missions générées
        </p>
      </div>
    </div>
  );
};

