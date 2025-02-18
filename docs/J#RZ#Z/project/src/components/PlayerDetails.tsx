import React from 'react';
import { Player } from '../types';
import { cn } from '../lib/utils';

interface PlayerDetailsProps {
  player: Player;
  className?: string;
}

export const PlayerDetails: React.FC<PlayerDetailsProps> = ({
  player,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center p-8 bg-opacity-90',
        className
      )}
      style={{
        backgroundColor: player.team === 'chiefs' ? '#E31837' : '#004C54',
        color: player.team === 'chiefs' ? '#FFB81C' : '#A5ACAF',
      }}
    >
      <img
        src={player.imageUrl}
        alt={player.name}
        className="w-48 h-48 rounded-full object-cover mb-6"
      />
      
      <h2 className="text-3xl font-bold mb-2">{player.name}</h2>
      <p className="text-xl mb-4">{player.position}</p>
      
      <div className="text-lg">
        <p className="mb-2">Seasons with team: {player.seasonsWithTeam}</p>
        {player.playedForOpponent && (
          <p className="text-yellow-300">
            Previously played for {player.team === 'chiefs' ? 'Eagles' : 'Chiefs'}
          </p>
        )}
      </div>
    </div>
  );
};