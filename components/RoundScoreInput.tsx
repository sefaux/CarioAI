import React, { useState, useEffect, useRef } from 'react';
import { Player } from '../types';
import { CameraIcon, HelpIcon } from './icons';
import HelpModal from './HelpModal';
import { useTranslation } from '../hooks/useTranslation';

interface Round {
    name: string;
    description: string;
}

interface RoundScoreInputProps {
  players: Player[];
  currentRound: number;
  activeRounds: Round[];
  roundWinnerId: number;
  roundScores: Record<number, string>;
  setRoundScores: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  onRecordScores: () => void;
  onStartScan: (playerId: number) => void;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  cardScores: Record<string, number>;
}

const RoundScoreInput: React.FC<RoundScoreInputProps> = ({ players, currentRound, activeRounds, roundWinnerId, roundScores, setRoundScores, onRecordScores, onStartScan, isLoading, error, setError, cardScores }) => {
  const nonWinnerPlayers = players.filter(p => p.id !== roundWinnerId);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    inputRefs.current = new Array(nonWinnerPlayers.length);
  }, [nonWinnerPlayers.length]);
  
  const winner = players.find(p => p.id === roundWinnerId);
  const round = activeRounds[currentRound];

  const handleScoreChange = (playerId: number, score: string) => {
    if (score === '') {
        setRoundScores(prev => ({ ...prev, [playerId]: '' }));
        return;
    }
    const numericValue = parseInt(score, 10);
    if (!isNaN(numericValue)) {
        const clampedValue = Math.max(0, Math.min(240, numericValue));
        setRoundScores(prev => ({ ...prev, [playerId]: String(clampedValue) }));
    }
  };

  const areAllScoresEntered = players.every(p => roundScores[p.id] !== undefined && /^\d+$/.test(roundScores[p.id]));

  const handleSubmitScores = () => {
    if (!areAllScoresEntered) return;
    onRecordScores();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, currentIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      for (let i = 1; i <= nonWinnerPlayers.length; i++) {
        const nextIndex = (currentIndex + i) % nonWinnerPlayers.length;
        const nextPlayer = nonWinnerPlayers[nextIndex];
        if (roundScores[nextPlayer.id] === '' || roundScores[nextPlayer.id] === undefined) {
          inputRefs.current[nextIndex]?.focus();
          return;
        }
      }
      
      if (areAllScoresEntered) {
        handleSubmitScores();
      }
    }
  };
  
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmitScores();
  };
  
  useEffect(() => {
    if(error) {
        const timer = setTimeout(() => setError(null), 5000);
        return () => clearTimeout(timer);
    }
  }, [error, setError]);

  return (
    <>
    {showHelp && <HelpModal cardScores={cardScores} onClose={() => setShowHelp(false)} />}
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
        <form onSubmit={handleSubmitForm} className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center">
                <div className="flex justify-center items-center relative">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('round')} {currentRound + 1}</h1>
                    <button type="button" onClick={() => setShowHelp(true)} className="absolute right-0 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                        <HelpIcon />
                    </button>
                </div>
                <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold">{round.name}</p>
                 <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{round.description}</p>
            </div>
            
            {error && <div className="p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-md text-center">{error}</div>}
            {isLoading && <div className="p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-md text-center">{t('analyzingCards')}</div>}

            <div className="space-y-4">
                <div className="flex items-center justify-between py-3 px-4 bg-green-100 dark:bg-green-900/50 rounded-lg">
                    <span className="text-lg font-bold text-green-700 dark:text-green-400">{winner?.name} ({t('winner')})</span>
                    <span className="text-lg font-bold text-green-700 dark:text-green-400">0 {t('scorePoints')}</span>
                </div>
                {nonWinnerPlayers.map((player, index) => (
                    <div key={player.id} className="flex items-center justify-between space-x-2">
                        <label htmlFor={`score-${player.id}`} className="text-gray-900 dark:text-white text-lg flex-shrink-0">{player.name}</label>
                        <div className="flex items-center space-x-2">
                            <input
                                id={`score-${player.id}`}
                                type="number"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                min="0"
                                max="240"
                                ref={(el) => { inputRefs.current[index] = el; }}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                enterKeyHint={areAllScoresEntered ? 'done' : 'next'}
                                value={roundScores[player.id] || ''}
                                onChange={(e) => handleScoreChange(player.id, e.target.value)}
                                className="w-24 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-2 py-2 text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={t('scorePoints')}
                                required
                            />
                            <button type="button" onClick={() => onStartScan(player.id)} className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-gray-900 dark:text-white">
                                <CameraIcon />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                type="submit"
                disabled={!areAllScoresEntered || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 text-lg"
            >
                {t('recordScores')}
            </button>
        </form>
    </div>
    </>
  );
};

export default RoundScoreInput;