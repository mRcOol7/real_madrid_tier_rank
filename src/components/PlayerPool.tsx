import React, { useState } from 'react';
import { PlayerCard } from './PlayerCard';
import type { Player } from '../types';

interface PlayerPoolProps {
  players: Player[];
  filter: string;
}

export const PlayerPool: React.FC<PlayerPoolProps> = ({ players, filter }) => {
  const [era, setEra] = useState<'all' | 'current' | 'legend'>('all');
  
  const filteredPlayers = players.filter(player => {
    const nameMatch = player.name.toLowerCase().includes(filter.toLowerCase());
    const eraMatch = era === 'all' ? true : player.era === era;
    return nameMatch && eraMatch;
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold">Available Players</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setEra('all')}
            className={`px-3 py-1 rounded-full text-sm ${
              era === 'all'
                ? 'bg-[#004D98] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setEra('current')}
            className={`px-3 py-1 rounded-full text-sm ${
              era === 'current'
                ? 'bg-[#004D98] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Current
          </button>
          <button
            onClick={() => setEra('legend')}
            className={`px-3 py-1 rounded-full text-sm ${
              era === 'legend'
                ? 'bg-[#004D98] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Legends
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
        {filteredPlayers.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
      {filteredPlayers.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No players found. Try adjusting your search or filters.
        </p>
      )}
    </div>
  );
};