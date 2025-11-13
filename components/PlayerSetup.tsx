import React, { useState } from 'react';
import { Player, GameSettings } from '../types';
import { PlusIcon, TrashIcon } from './icons';
import { ROUNDS_WITH_DESCRIPTIONS } from '../constants';
import InstructionsModal from './InstructionsModal';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../hooks/useTranslation';

interface PlayerSetupProps {
  players: Player[];
  gameSettings: GameSettings;
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (id: number) => void;
  onStartGame: () => void;
  setGameSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ players, onAddPlayer, onRemovePlayer, onStartGame, gameSettings, setGameSettings }) => {
  const [playerName, setPlayerName] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { t } = useTranslation();

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onAddPlayer(playerName.trim());
      setPlayerName('');
    }
  };

  const handleToggleRound = (roundName: string) => {
    setGameSettings(prev => {
        const enabledRounds = prev.enabledRounds.includes(roundName)
            ? prev.enabledRounds.filter(r => r !== roundName)
            : [...prev.enabledRounds, roundName];
        return {...prev, enabledRounds};
    });
  };

  const handleScoreChange = (card: string, value: string) => {
    const score = parseInt(value, 10);
    if (!isNaN(score)) {
        setGameSettings(prev => ({
            ...prev,
            cardScores: {
                ...prev.cardScores,
                [card]: score
            }
        }));
    }
  };

  return (
    <>
    {showInstructions && <InstructionsModal onClose={() => setShowInstructions(false)} />}
    <div style={{
        backgroundImage: `url('https://www.publicdomainpictures.net/pictures/160000/velka/scattered-playing-cards.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }}>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black/70 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-6">
                <div className="flex justify-between items-start">
                    <div className="text-left">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">{t('setupSubtitle')}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </div>
                </div>
                
                <form onSubmit={handleAddPlayer} className="flex space-x-2">
                <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder={t('playerNamePlaceholder')}
                    className="flex-grow bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg flex items-center justify-center transition-colors duration-200">
                    <PlusIcon />
                </button>
                </form>

                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-700 pb-2">{t('players')}</h2>
                    {players.length > 0 ? (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {players.map((player) => (
                        <li key={player.id} className="flex items-center justify-between py-3">
                            <span className="text-gray-900 dark:text-white text-lg">{player.name}</span>
                            <button onClick={() => onRemovePlayer(player.id)} className="text-red-600 hover:text-red-500 transition-colors">
                            <TrashIcon />
                            </button>
                        </li>
                        ))}
                    </ul>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-500 text-center py-4">{t('addAtLeastTwo')}</p>
                    )}
                </div>

                <div>
                    <button onClick={() => setShowSettings(!showSettings)} className="w-full text-left text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                        {showSettings ? t('hideAdvancedOptions') : t('showAdvancedOptions')}
                    </button>
                    {showSettings && (
                        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">{t('activeRounds')}</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    {ROUNDS_WITH_DESCRIPTIONS.map(round => (
                                        <label key={round.name} className="flex items-center space-x-2">
                                            <input type="checkbox" checked={gameSettings.enabledRounds.includes(round.name)} onChange={() => handleToggleRound(round.name)} className="form-checkbox h-4 w-4 rounded bg-gray-300 dark:bg-gray-800 border-gray-400 dark:border-gray-600 text-blue-500 focus:ring-blue-500"/>
                                            <span>{round.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">{t('cardScoresForScanner')}</h3>
                                <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
                                    {Object.entries(gameSettings.cardScores).map(([card, score]) => (
                                        <div key={card} className="flex items-center space-x-2">
                                            <label className="w-8">{card}:</label>
                                            <input 
                                                type="number" 
                                                value={score} 
                                                onChange={(e) => handleScoreChange(card, e.target.value)}
                                                className="w-16 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-center"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setShowInstructions(true)}
                    className="w-full bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    {t('gameInstructions')}
                </button>

                <button
                onClick={onStartGame}
                disabled={players.length < 2 || gameSettings.enabledRounds.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 text-lg"
                >
                {t('startGame')}
                </button>
            </div>
        </div>
    </div>
    </>
  );
};

export default PlayerSetup;