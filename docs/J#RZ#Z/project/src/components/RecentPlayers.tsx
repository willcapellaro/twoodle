import React from 'react';
import { cn } from '../lib/utils';

interface RecentPlayersProps {
  players: any[];
  side: 'left' | 'right';
  onSelectPlayer?: (player: any) => void;
}

export const RecentPlayers: React.FC<RecentPlayersProps> = ({
  players,
  side,
  onSelectPlayer,
}) => {
  const formatPlayerName = (name: string) => {
    const parts = name.split(' ');
    if (parts.length === 1) return name;
    
    const lastName = parts.pop();
    const initials = parts.map(part => part[0]).join('. ');
    return `${initials}. ${lastName}`;
  };

  return (
    <div 
      className={cn(
        "absolute bottom-0 p-4 w-full bg-black bg-opacity-50",
        side === 'left' ? "left-0" : "right-0"
      )}
    >
      <h3 className="text-white text-lg mb-2">Recent Players</h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {players.map((player) => (
          <button
            key={player['#']}
            onClick={() => onSelectPlayer?.(player)}
            className="flex flex-col items-center bg-white bg-opacity-10 rounded p-2 min-w-[80px] hover:bg-opacity-20 transition-all"
          >
            <span className="text-white text-sm">#{player['#']}</span>
            <span className="text-white text-xs font-bold">{player.Pos}</span>
            <span className="text-white text-xs truncate max-w-[70px]">
              {formatPlayerName(player.Player)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}