import { useState, useEffect } from 'react';
import { Save, Key, ExternalLink, HelpCircle, Sparkles, Trash2 } from 'lucide-react';
import { storage } from '../utils/storage';

interface SettingsScreenProps {
  onNext: () => void;
  onReset?: () => void;
}

export const SettingsScreen = ({ onNext, onReset }: SettingsScreenProps) => {
  const [useOpenAI, setUseOpenAI] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [saved, setSaved] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const savedKey = storage.getApiKey();
    const savedTemp = storage.getTemperature();
    const savedUseOpenAI = storage.getUseOpenAI();
    
    if (savedKey) {
      setApiKey(savedKey);
    }
    setTemperature(savedTemp);
    setUseOpenAI(savedUseOpenAI);
  }, []);

  const handleSave = () => {
    storage.setUseOpenAI(useOpenAI);
    if (useOpenAI && apiKey.trim()) {
      storage.setApiKey(apiKey.trim());
      storage.setTemperature(temperature);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const canProceed = !useOpenAI || apiKey.trim().length > 0;

  const openApiKeyPage = () => {
    window.open('https://platform.openai.com/api-keys', '_blank');
  };

  const handleReset = () => {
    if (showResetConfirm) {
      storage.clearAllData();
      setApiKey('');
      setTemperature(0.7);
      setUseOpenAI(true);
      setShowResetConfirm(false);
      if (onReset) {
        onReset();
      }
      // Recharger la page pour réinitialiser complètement l'état
      window.location.reload();
    } else {
      setShowResetConfirm(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 flex flex-col">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="mb-8 text-center">
          <Key className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-3xl font-bold mb-2">Configuration</h1>
          <p className="text-gray-400">Choisissez votre mode de génération</p>
        </div>

        <div className="space-y-6">
          {/* Choix du mode */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <input
                type="radio"
                checked={useOpenAI}
                onChange={() => setUseOpenAI(true)}
                className="w-4 h-4 text-red-600"
              />
              <div className="flex-1">
                <div className="font-semibold text-white flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Mode OpenAI (IA)
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Génération créative avec l'IA (nécessite une clé API)
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                checked={!useOpenAI}
                onChange={() => setUseOpenAI(false)}
                className="w-4 h-4 text-red-600"
              />
              <div className="flex-1">
                <div className="font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Mode Sans Clé (100 missions prédéfinies)
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Utilise une liste de 100 missions amusantes
                </p>
              </div>
            </label>
          </div>

          {/* Guide pour obtenir une clé */}
          {useOpenAI && !apiKey && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2 text-white">Besoin d'une clé API ?</h3>
                  {!showGuide ? (
                    <>
                      <p className="text-sm text-gray-400 mb-3">
                        Vous devez créer une clé API sur le site OpenAI. Cliquez sur le bouton ci-dessous pour accéder à la page de création.
                      </p>
                      <button
                        onClick={openApiKeyPage}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors mb-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Créer une clé API sur OpenAI
                      </button>
                      <button
                        onClick={() => setShowGuide(true)}
                        className="w-full text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Voir le guide étape par étape
                      </button>
                    </>
                  ) : (
                    <div className="space-y-3 text-sm text-gray-300">
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Cliquez sur le bouton "Créer une clé API" ci-dessous</li>
                        <li>Connectez-vous à votre compte OpenAI (ou créez-en un)</li>
                        <li>Sur la page des clés API, cliquez sur "Create new secret key"</li>
                        <li>Donnez un nom à votre clé (ex: "Killer Game")</li>
                        <li>Copiez la clé qui commence par "sk-..."</li>
                        <li>Collez-la dans le champ ci-dessous</li>
                      </ol>
                      <button
                        onClick={openApiKeyPage}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors mt-3"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Ouvrir OpenAI API Keys
                      </button>
                      <button
                        onClick={() => setShowGuide(false)}
                        className="w-full text-sm text-gray-500 hover:text-gray-400 transition-colors"
                      >
                        Masquer le guide
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {useOpenAI && (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">
                    Clé API OpenAI
                  </label>
                  {!apiKey && (
                    <button
                      onClick={openApiKeyPage}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Obtenir une clé
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Votre clé est stockée uniquement dans ce navigateur
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Température (Créativité) : {temperature.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Prévisible</span>
                  <span>Créatif</span>
                </div>
              </div>
            </>
          )}

          {!useOpenAI && (
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
              <p className="text-sm text-green-300">
                ✓ Mode sans clé activé. Vous pouvez continuer directement vers les joueurs !
              </p>
            </div>
          )}

          {useOpenAI && (
            <button
              onClick={handleSave}
              className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Save className="w-5 h-5" />
              {saved ? 'Sauvegardé !' : 'Sauvegarder'}
            </button>
          )}

          {canProceed && (
            <button
              onClick={() => {
                if (!useOpenAI) {
                  handleSave();
                }
                onNext();
              }}
              className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
            >
              Continuer vers les joueurs
            </button>
          )}

          {/* Bouton de réinitialisation */}
          <div className="pt-4 border-t border-gray-700">
            {showResetConfirm ? (
              <div className="space-y-3">
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
    </div>
  );
};

