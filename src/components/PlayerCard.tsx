import React from 'react';
import { useDrag } from 'react-dnd';
import type { Player } from '../types';

interface PlayerCardProps {
  player: Player;
  inTier?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, inTier = false }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'player',
    item: { type: 'player', id: player.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`
        relative group cursor-move rounded-lg overflow-hidden
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${inTier ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-full aspect-square max-w-[140px] mx-auto'}
        transition-all duration-200 hover:shadow-lg
        ${inTier ? 'hover:scale-110' : 'hover:scale-105'}
      `}
      style={{ backgroundImage: `url(${player.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200">
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <p className="text-white text-xs sm:text-sm text-center px-1 sm:px-2 font-medium">
            {player.name}
          </p>
        </div>
      </div>
      <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
        player.era === 'legend' ? 'bg-yellow-400' : 'bg-blue-400'
      } bg-opacity-75`} />
    </div>
  );
};