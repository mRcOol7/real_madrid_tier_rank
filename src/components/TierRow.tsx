import React from 'react';
import { useDrop } from 'react-dnd';
import type { TierCategory, Player } from '../types';
import { PlayerCard } from './PlayerCard';

interface TierRowProps {
  tier: TierCategory;
  players: Player[];
  onDrop: (playerId: string, tierId: string) => void;
}

export const TierRow: React.FC<TierRowProps> = ({ tier, players, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'player',
    drop: (item: { id: string }) => onDrop(item.id, tier.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div className="flex items-stretch gap-2 sm:gap-4 p-2 sm:p-4 border-b border-gray-200">
      <div className={`
        ${tier.color} rounded-lg flex flex-col items-center justify-center p-2 sm:p-4
        w-20 sm:w-28 text-center shrink-0
      `}>
        <span className="text-white font-bold text-sm sm:text-lg">{tier.name}</span>
        <span className="text-white/75 text-[10px] sm:text-xs mt-1 hidden sm:block">
          {tier.description}
        </span>
      </div>
      <div
        ref={drop}
        className={`
          flex-1 min-h-[5rem] sm:min-h-[7rem] rounded-lg p-2 sm:p-4
          flex flex-wrap gap-2 sm:gap-3 transition-colors
          ${isOver ? 'bg-gray-100 ring-2 ring-blue-400 ring-opacity-50' : 'bg-gray-50'}
        `}
      >
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} inTier />
        ))}
        {players.length === 0 && (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Drop players here
          </div>
        )}
      </div>
    </div>
  );
};