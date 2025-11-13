import React from 'react';
import { Player } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface Round {
    name: string;
    description: string;
}

interface RoundWinnerSelectionProps {
  players: Player[];
  currentRound: number;
  activeRounds: Round[];
  onSelectWinner: (winnerId: number) => void;
  onNewGame: () => void;
  onSkipRound: () => void;
}

const RoundWinnerSelection: React.FC<RoundWinnerSelectionProps> = ({ players, currentRound, activeRounds, onSelectWinner, onNewGame, onSkipRound }) => {
  const { t } = useTranslation();
  const round = activeRounds[currentRound];
  const canSkip = ["3 Escalas", "Escala Sucia", "Escala Real"].includes(round.name);
  const is13CardsRound = ["Escala Sucia", "Escala Real"].includes(round.name);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('round')} {currentRound + 1}</h1>
            <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold">{round.name}</p>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{round.description}</p>
            {is13CardsRound && <p className="text-yellow-600 dark:text-yellow-400 mt-2 text-sm">{t('thirteenCardRoundInfo')}</p>}
        </div>
        
        <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{t('whoWonTheRound')}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{t('winnerGetsZero')}</p>
        </div>

        <div className="space-y-3">
          {players.map((player) => (
            <button
              key={player.id}
              onClick={() => onSelectWinner(player.id)}
              className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-blue-600 text-gray-900 dark:text-white hover:text-white font-bold py-4 px-4 rounded-lg transition-all duration-200 text-lg"
            >
              {player.name}
            </button>
          ))}
        </div>
        
        {canSkip && (
             <button
                onClick={onSkipRound}
                className="w-full bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                {t('skipRound')}
            </button>
        )}

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
             <button
                onClick={onNewGame}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                {t('startNewGame')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default RoundWinnerSelection;