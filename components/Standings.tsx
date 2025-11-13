import React, { useState, useMemo } from 'react';
import { Player } from '../types';
import { CrownIcon } from './icons';
import { useTranslation } from '../hooks/useTranslation';

interface Round {
    name: string;
    description: string;
}

interface StandingsProps {
  players: Player[];
  currentRound: number;
  activeRounds: Round[];
  onNextRound: () => void;
}

const Standings: React.FC<StandingsProps> = ({ players, currentRound, activeRounds, onNextRound }) => {
  const [activeTab, setActiveTab] = useState<'standings' | 'scores'>('standings');
  const { t } = useTranslation();

  const calculateTotal = (player: Player) => {
    return player.scores.reduce((acc, score) => acc + (score || 0), 0);
  };
  
  const sortedPlayers = useMemo(() => 
    [...players].sort((a, b) => calculateTotal(a) - calculateTotal(b)),
    [players]
  );
  
  const isLastRound = currentRound === activeRounds.length - 1;

  const TabButton: React.FC<{tab: 'standings' | 'scores', children: React.ReactNode}> = ({ tab, children }) => (
    <button
        onClick={() => setActiveTab(tab)}
        className={`w-1/2 py-3 text-center font-semibold text-lg transition-colors duration-200 rounded-t-lg ${
            activeTab === tab 
            ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
    >
        {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('endOfRound')} {currentRound + 1}</h1>
            <p className="text-xl text-gray-500 dark:text-gray-400">{activeRounds[currentRound].name}</p>
        </div>

        <div className="flex">
            <TabButton tab="standings">{t('standings')}</TabButton>
            <TabButton tab="scores">{t('scoreSheet')}</TabButton>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-b-2xl shadow-xl p-4 sm:p-6">
            {activeTab === 'standings' ? (
                <div className="space-y-3">
                    {sortedPlayers.map((player, index) => (
                        <div key={player.id} className={`flex items-center justify-between p-4 rounded-lg ${index === 0 ? 'bg-green-100 dark:bg-green-900/50' : 'bg-gray-100 dark:bg-gray-700/50'}`}>
                            <div className="flex items-center space-x-4">
                                <span className={`text-xl font-bold ${index === 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}>#{index + 1}</span>
                                <span className="text-lg text-gray-900 dark:text-white">{player.name}</span>
                                {index === 0 && <div className="text-yellow-500 dark:text-yellow-400"><CrownIcon/></div>}
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">{calculateTotal(player)} {t('scorePoints')}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
                        <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-200 dark:bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('round')}</th>
                            {players.map(player => (
                            <th key={player.id} scope="col" className="px-6 py-3 text-center">{player.name}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {activeRounds.map((round, roundIndex) => (
                            <tr key={roundIndex} className={`border-b border-gray-200 dark:border-gray-700 ${roundIndex > currentRound ? 'opacity-50' : ''}`}>
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{round.name}</td>
                            {players.map((player) => (
                                <td key={player.id} className="px-6 py-4 text-center">
                                    {player.scores[roundIndex] ?? '-'}
                                </td>
                            ))}
                            </tr>
                        ))}
                        </tbody>
                        <tfoot className="bg-gray-200 dark:bg-gray-700/50 text-gray-900 dark:text-white font-bold">
                        <tr>
                            <td className="px-6 py-4 uppercase">{t('total')}</td>
                            {players.map(player => (
                            <td key={player.id} className="px-6 py-4 text-center text-lg">{calculateTotal(player)}</td>
                            ))}
                        </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>

        <div className="mt-8 flex justify-center">
            <button
                onClick={onNextRound}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-lg transition-all duration-200 text-xl"
            >
                {isLastRound ? t('viewFinalResults') : t('nextRound')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Standings;