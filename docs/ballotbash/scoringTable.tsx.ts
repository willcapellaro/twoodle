import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { RefreshCw, Menu, ChevronDown, Eye, Dice1 as Dice, ListStart } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { type Player, type Nominee } from '../types';
import { cn } from '../utils';

type PlayerScore = {
  player: Player;
  score: number;
  viewedCount: number;
  totalVotes: number;
  successRate: number;
};

export function ScoreTable() {
  const { state, nominees, actions } = useGame();
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [showChecksums, setShowChecksums] = useState(false);
  const [isDebugMenuOpen, setIsDebugMenuOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const games = Object.entries(state.games)
    .sort(([, a], [, b]) => b.created - a.created);
  
  const currentGame = selectedGameId ? state.games[selectedGameId] : null;

  const checksums = useMemo(() => {
    if (!currentGame) return null;

    const stats = currentGame.players.reduce((acc, player) => {
      const playerData = state.playerData[selectedGameId!]?.[player.id];
      if (!playerData || player.id === 'scorekeeping') return acc;

      const wins = Object.values(playerData.votes).length;
      const losses = Object.keys(state.playerData.default.scorekeeping.votes).length - wins;
      const watched = playerData.seen.length;
      const unwatched = new Set(nominees.map(n => n.filmCode)).size - watched;

      // Group by win/loss count
      const winKey = `${wins}/${losses}`;
      if (!acc.winCounts[winKey]) acc.winCounts[winKey] = 0;
      acc.winCounts[winKey]++;

      // Group by watched count
      const watchKey = `${watched}/${unwatched}`;
      if (!acc.watchCounts[watchKey]) acc.watchCounts[watchKey] = 0;
      acc.watchCounts[watchKey]++;

      return acc;
    }, {
      winCounts: {} as Record<string, number>,
      watchCounts: {} as Record<string, number>
    });

    return stats;
  }, [currentGame, selectedGameId, state.playerData, nominees]);

  const scoreData = useMemo(() => {
    if (!currentGame) return [];

    return currentGame.players
      .filter(player => player.id !== 'scorekeeping')
      .map(player => {
        const playerData = state.playerData[selectedGameId!]?.[player.id];
        if (!playerData) return { player, score: 0, viewedCount: 0 };

        const totalVotes = Object.keys(playerData.votes).length;
        const score = Object.entries(playerData.votes).reduce((total, [catCode, nomineeId]) => {
          // Use the universal scorekeeping data from default.scorekeeping
          const isWinner = state.playerData.default.scorekeeping.votes[catCode] === nomineeId;
          return total + (isWinner ? 1 : 0);
        }, 0);

        return {
          player,
          score,
          viewedCount: playerData.seen.length,
          totalVotes,
          successRate: totalVotes > 0 ? (score / totalVotes) * 100 : 0
        };
      });
  }, [state.playerData, currentGame, selectedGameId, refreshKey]);

  const columnDefs = useMemo(() => [
    {
      headerName: 'Player',
      field: 'player',
      valueGetter: (params: any) => {
        const player = params.data.player;
        return `${player.name}${player.isHost ? ' (Host)' : ''}`;
      },
      flex: 1
    },
    {
      headerName: 'Score',
      field: 'score',
      width: 120,
      type: 'numericColumn'
    },
    {
      headerName: 'Total Votes',
      field: 'totalVotes',
      width: 120,
      type: 'numericColumn'
    },
    {
      headerName: 'Success Rate',
      field: 'successRate',
      width: 120,
      type: 'numericColumn',
      valueFormatter: (params: any) => `${params.value.toFixed(1)}%`
    },
    {
      headerName: 'Films Viewed',
      field: 'viewedCount',
      width: 150,
      type: 'numericColumn'
    }
  ], []);

  return (
    <div className="space-y-4">
      {/* Game Selection Tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {games.map(([gameId, game]) => (
            <button
              key={gameId}
              onClick={() => setSelectedGameId(gameId)}
              className={`px-4 py-2 whitespace-nowrap rounded-lg transition-colors ${
                selectedGameId === gameId
                  ? 'bg-[#007664] text-white'
                  : 'bg-white border border-gray-200 hover:border-[#007664]'
              }`}
            >
              {game.name || `Game ${gameId.slice(0, 4)}`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setIsDebugMenuOpen(!isDebugMenuOpen)}
              onBlur={() => setTimeout(() => setIsDebugMenuOpen(false), 100)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                isDebugMenuOpen ? "bg-[var(--color-hover)]" : ""
              )}
            >
              <Menu className="w-4 h-4" />
              <span>Debug</span>
            <ChevronDown className="w-4 h-4" />
            </button>

            {isDebugMenuOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-[var(--color-border)] p-2 min-w-[200px] z-50">
                <button
                  onClick={() => {
                    setShowChecksums(!showChecksums);
                    setIsDebugMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full p-2 rounded hover:bg-[var(--color-hover)] text-primary"
                >
                  <Eye className="w-4 h-4" />
                  <span>
                    {showChecksums ? 'Hide' : 'Show'} Debug Stats
                  </span>
                </button>
                <button
                  onClick={() => {
                    if (!currentGame) return;
                    
                    currentGame.players.forEach(player => {
                      if (player.id === 'scorekeeping') return;
                      
                      // Randomly decide how many categories to vote for
                      const categories = new Set(nominees.map(n => n.catCode));
                      const numCategories = Math.floor(Math.random() * categories.size);
                      const selectedCategories = [...categories]
                        .sort(() => Math.random() - 0.5)
                        .slice(0, numCategories);
                      
                      // For each selected category, pick a random nominee
                      selectedCategories.forEach(catCode => {
                        const categoryNominees = nominees.filter(n => n.catCode === catCode);
                        const randomIndex = Math.floor(Math.random() * categoryNominees.length);
                        actions.vote(categoryNominees[randomIndex].id);
                      });
                    });
                    setIsDebugMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full p-2 rounded hover:bg-[var(--color-hover)] text-primary"
                >
                  <Dice className="w-4 h-4" />
                  <span>Vote Randomly for All Players</span>
                </button>
                <button
                  onClick={() => {
                    if (!currentGame) return;
                    
                    currentGame.players.forEach(player => {
                      if (player.id === 'scorekeeping') return;
                      
                      // Group nominees by category and pick first in each
                      const categories = new Map();
                      nominees.forEach(nominee => {
                        if (!categories.has(nominee.catCode)) {
                          categories.set(nominee.catCode, nominee.id);
                          actions.vote(nominee.id);
                        }
                      });
                    });
                    setIsDebugMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full p-2 rounded hover:bg-[var(--color-hover)] text-primary"
                >
                  <ListStart className="w-4 h-4" />
                  <span>Vote First for All Players</span>
                </button>
              </div>
            )}
          </div>

          {selectedGameId && (
            <button
              onClick={() => setRefreshKey(k => k + 1)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4 dark:text-gray-400" />
              <span className="dark:text-gray-100">Refresh Scores</span>
            </button>
          )}
        </div>
      </div>

      {/* Score Table */}
      {selectedGameId ? (
        <div className="ag-theme-alpine w-full h-[300px]">
          <AgGridReact
            rowData={scoreData}
            columnDefs={columnDefs}
            defaultColDef={{
              sortable: true,
              resizable: true
            }}
          />
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-300">
          Select a game to view scores
        </div>
      )}

      {/* Debug Stats Panel */}
      {showChecksums && checksums && (
        <div className="mt-8 p-4 bg-[var(--card-bg)] rounded-lg border border-[var(--color-border)]">
          <h3 className="text-lg font-medium mb-4 text-primary">Debug Statistics</h3>
          
          <div className="space-y-6">
            {/* Win/Loss Distribution */}
            <div>
              <h4 className="text-sm font-medium text-secondary mb-2">Win/Loss Distribution</h4>
              <div className="space-y-2">
                {Object.entries(checksums.winCounts).map(([ratio, count]) => (
                  <div key={ratio} className="text-sm text-primary">
                    {count} users have {ratio} total wins and losses
                  </div>
                ))}
              </div>
            </div>

            {/* Watch/Unwatch Distribution */}
            <div>
              <h4 className="text-sm font-medium text-secondary mb-2">Watch/Unwatch Distribution</h4>
              <div className="space-y-2">
                {Object.entries(checksums.watchCounts).map(([ratio, count]) => (
                  <div key={ratio} className="text-sm text-primary">
                    {count} users have {ratio} total watches and unwatched
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}