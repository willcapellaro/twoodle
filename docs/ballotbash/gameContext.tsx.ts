import React, { createContext, useContext, useEffect, useState } from 'react';
import { type Nominee, type Game, type PlayerData, type GameData } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { toast } from 'react-hot-toast';
import { generateId } from '../utils';

type GameContextType = {
  state: {
    currentGameId: string | null;
    currentPlayerId: string | null;
    syncVotes: boolean;
    votingLocked: boolean;
    hostName: string;
    games: Record<string, Game>;
    playerData: Record<string, Record<string, PlayerData>>;
  };
  nominees: Nominee[];
  stats: {
    votedCategories: number;
    totalCategories: number;
    seenFilms: number;
    totalFilms: number;
  };
  actions: {
    vote: (id: string) => void;
    toggleSeen: (id: string) => void;
    updateSeenFilms: (filmCodes: string[]) => void;
    createGame: (gameId: string, hostId: string, name?: string) => void;
    deleteGame: (gameId: string) => void;
    selectGame: (gameId: string | null) => void;
    addPlayer: (gameId: string, playerId: string, name?: string) => void;
    deletePlayer: (gameId: string, playerId: string) => void;
    selectPlayer: (playerId: string) => void;
    clearGameData: (gameId: string) => void;
    clearPlayerData: (gameId: string, playerId: string) => void;
    clearVotes: () => void;
    clearWinnerSelections: () => void;
    setSyncVotes: (value: boolean) => void;
    renameGame: (gameId: string, newName: string) => void;
    setVotingLocked: (value: boolean) => void;
    renamePlayer: (gameId: string, playerId: string, newName: string) => void;
    setWinner: (nomineeId: string, catCode: string) => void;
    setHostName: (name: string) => void;
  };
};

const GameContext = createContext<GameContextType | null>(null);

const initialGameData: GameData = {
  currentGameId: null,
  currentPlayerId: generateId(),
  syncVotes: true,
  votingLocked: false,
  hostName: '',
  games: {},
  playerData: {
    default: {
      scorekeeping: { votes: {}, seen: [] }
    }
  }
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameData, setGameData] = useLocalStorage<GameData>('ballotbash_game_data', initialGameData);
  const [nominees, setNominees] = useState<Nominee[]>([]);

  useEffect(() => {
    fetch('/data/Golden_Ballot_Data.json')
      .then(res => res.json())
      .then(data => {
        const formattedData = data.map((item: any) => ({
          id: item.UUID,
          category: item.category,
          catCode: item.category.toLowerCase().replace(/[^a-z0-9]/g, ''),
          names: [item.name, item.name2, item.name3, item.name4, item.name5].filter(Boolean),
          film: item.film,
          filmCode: item.filmcode,
          order: parseInt(item.order),
          emoji: item.emoji,
          music: item.music,
          country: item.country,
          posterUrl: item.filmcode ? `/images/${item.filmcode}.jpg` : undefined
        }));
        
        formattedData.sort((a, b) => {
          if (a.order !== b.order) {
            return a.order - b.order;
          }
          return a.category.localeCompare(b.category);
        });
        
        setNominees(formattedData);
      });
  }, []);

  const getCurrentPlayerData = (): PlayerData => {
    const gameId = gameData.currentGameId || 'default';
    const playerId = gameData.currentPlayerId || 'default';
    return (
      gameData.playerData[gameId]?.[playerId] || 
      { votes: {}, seen: [] }
    );
  };

  const playerData = getCurrentPlayerData();
  const stats = {
    votedCategories: Object.keys(playerData.votes).length,
    totalCategories: new Set(nominees.map(n => n.catCode)).size,
    seenFilms: playerData.seen.length,
    totalFilms: new Set(nominees.map(n => n.filmCode)).size,
  };

  const updatePlayerData = (
    playerId: string,
    updateFn: (playerData: PlayerData) => PlayerData
  ) => {
    setGameData(prev => {
      const newData = { ...prev };
      const currentGameId = prev.currentGameId || 'default';
      
      // Initialize game data structures if they don't exist
      if (!newData.playerData.default) {
        newData.playerData.default = {};
      }
      if (!newData.playerData.default[playerId]) {
        newData.playerData.default[playerId] = { votes: {}, seen: [] };
      }
      
      // Update default data first
      newData.playerData.default[playerId] = updateFn(
        newData.playerData.default[playerId]
      );

      // Then update current game data
      if (currentGameId !== 'default') {
        if (!newData.playerData[currentGameId]) {
          newData.playerData[currentGameId] = {};
        }
        if (!newData.playerData[currentGameId][playerId]) {
          newData.playerData[currentGameId][playerId] = { votes: {}, seen: [] };
        }
        newData.playerData[currentGameId][playerId] = updateFn(
          newData.playerData[currentGameId][playerId]
        );
      }

      // If this is a host and syncVotes is enabled, sync changes to all their games
      if (prev.syncVotes) {
        Object.entries(prev.games).forEach(([gameId, game]) => {
          if (game.hostId === playerId) {
            if (!newData.playerData[gameId]) {
              newData.playerData[gameId] = {};
            }
            newData.playerData[gameId][playerId] = { 
              ...newData.playerData.default[playerId] 
            };
          }
        });
      }

      return newData;
    });
  };

  const actions = {
    vote: (id: string) => {
      if (gameData.votingLocked) return;

      const nominee = nominees.find(n => n.id === id);
      if (!nominee) return;

      const playerId = gameData.currentPlayerId || 'default';
      
      updatePlayerData(playerId, (playerData) => {
        const currentVotes = { ...playerData.votes };
        const catCode = nominee.catCode;
        
        if (currentVotes[catCode] === id) {
          delete currentVotes[catCode];
        } else {
          currentVotes[catCode] = id;
        }

        return {
          ...playerData,
          votes: currentVotes
        };
      });
    },

    updateSeenFilms: (filmCodes: string[]) => {
      const playerId = gameData.currentPlayerId || 'default';
      
      updatePlayerData(playerId, (playerData) => ({
        ...playerData,
        seen: [...new Set(filmCodes)]
      }));
    },

    toggleSeen: (id: string) => {
      const nominee = nominees.find(n => n.id === id);
      if (!nominee) return;

      const playerId = gameData.currentPlayerId || 'default';
      
      updatePlayerData(playerId, (playerData) => {
        const filmCode = nominee.filmCode;
        const seen = new Set(playerData.seen);
        
        if (seen.has(filmCode)) {
          seen.delete(filmCode);
        } else {
          seen.add(filmCode);
        }

        return {
          ...playerData,
          seen: Array.from(seen)
        };
      });
    },

    clearVotes: () => {
      const playerId = gameData.currentPlayerId || 'default';
      
      updatePlayerData(playerId, (playerData) => ({
        ...playerData,
        votes: {}
      }));
      
      toast.success('All votes have been cleared');
    },

    clearWinnerSelections: () => {
      setGameData(prev => ({
        ...prev,
        playerData: {
          ...prev.playerData,
          default: {
            ...prev.playerData.default,
            scorekeeping: { votes: {}, seen: [] }
          }
        }
      }));
      
      toast.success('Winner selections cleared');
    },

    setSyncVotes: (value: boolean) => {
      setGameData(prev => ({
        ...prev,
        syncVotes: value
      }));
    },

    renameGame: (gameId: string, newName: string) => {
      setGameData(prev => ({
        ...prev,
        games: {
          ...prev.games,
          [gameId]: {
            ...prev.games[gameId],
            name: newName
          }
        }
      }));
      
      toast.success('Game name updated');
    },

    setVotingLocked: (value: boolean) => {
      setGameData(prev => ({
        ...prev,
        votingLocked: value
      }));
    },

    createGame: (gameId: string, hostId: string, name?: string) => {
      setGameData(prev => {
        // Get host data and name
        const hostData = prev.playerData.default[hostId] || { votes: {}, seen: [] }; 
        const hostName = prev.hostName || 'Anonymous Host';
        
        return {
          ...prev,
          currentGameId: gameId,
          currentPlayerId: null, // Reset player selection
          games: {
            ...prev.games,
            [gameId]: {
              id: gameId,
              name,
              hostId,
              hostName,
              hostedLocally: true,
              players: [
                { id: hostId, name: hostName, isHost: true },
                { id: 'scorekeeping', name: 'Scorekeeping', isHost: false }
              ],
              created: Date.now()
            }
          },
          playerData: {
            ...prev.playerData,
            [gameId]: {
              [hostId]: { ...hostData },
              scorekeeping: { votes: {}, seen: [] }
            }
          }
        };
      });
    },

    deleteGame: (gameId: string) => {
      setGameData(prev => {
        const { [gameId]: _, ...remainingGames } = prev.games;
        const { [gameId]: __, ...remainingPlayerData } = prev.playerData;
        return {
          ...prev,
          currentGameId: null,
          games: remainingGames,
          playerData: remainingPlayerData
        };
      });
    },

    selectGame: (gameId: string | null) => {
      setGameData(prev => ({
        ...prev,
        currentGameId: gameId || null,
        // When selecting a game, set to host player
        currentPlayerId: gameId ? prev.games[gameId]?.hostId : null
      }));
    },

    addPlayer: (gameId: string, playerId: string, name?: string) => {
      setGameData(prev => ({
        ...prev,
        games: {
          ...prev.games,
          [gameId]: {
            ...prev.games[gameId],
            players: [
              ...prev.games[gameId].players,
              { 
                id: playerId, 
                name: name || `Player ${playerId.slice(0, 4)}`, 
                isHost: false 
              }
            ]
          }
        },
        playerData: {
          ...prev.playerData,
          [gameId]: {
            ...prev.playerData[gameId],
            [playerId]: { votes: {}, seen: [] }
          }
        }
      }));
    },

    deletePlayer: (gameId: string, playerId: string) => {
      setGameData(prev => {
        const game = prev.games[gameId];
        // Don't allow deleting host or scorekeeping
        if (!game || game.hostId === playerId || playerId === 'scorekeeping') return prev;

        const { [playerId]: _, ...remainingPlayerData } = prev.playerData[gameId] || {};
        
        // Find next available player
        const remainingPlayers = game.players.filter(p => 
          p.id !== playerId && !p.isHost && p.id !== 'scorekeeping'
        );
        const nextPlayerId = remainingPlayers[0]?.id || game.hostId;

        return {
          ...prev,
          currentPlayerId: nextPlayerId,
          games: {
            ...prev.games,
            [gameId]: {
              ...game,
              players: game.players.filter(p => p.id !== playerId)
            }
          },
          playerData: {
            ...prev.playerData,
            [gameId]: remainingPlayerData
          }
        };
      });
    },

    selectPlayer: (playerId: string) => {
      setGameData(prev => ({
        ...prev,
        currentPlayerId: playerId
      }));
    },

    clearGameData: (gameId: string) => {
      setGameData(prev => ({
        ...prev,
        playerData: {
          ...prev.playerData,
          [gameId]: {}
        }
      }));
    },

    clearPlayerData: (gameId: string, playerId: string) => {
      setGameData(prev => ({
        ...prev,
        playerData: {
          ...prev.playerData,
          [gameId]: {
            ...prev.playerData[gameId],
            [playerId]: { votes: {}, seen: [] }
          }
        }
      }));
    },

    renamePlayer: (gameId: string, playerId: string, newName: string) => {
      setGameData(prev => ({
        ...prev,
        games: {
          ...prev.games,
          [gameId]: {
            ...prev.games[gameId],
            players: prev.games[gameId].players.map(p =>
              p.id === playerId ? { ...p, name: newName } : p
            )
          }
        }
      }));
      
      toast.success('Player name updated');
    },

    setWinner: (nomineeId: string, catCode: string) => {
      setGameData(prev => ({
        ...prev,
        playerData: {
          ...prev.playerData,
          default: {
            ...prev.playerData.default,
            scorekeeping: {
              ...prev.playerData.default.scorekeeping,
              votes: {
                ...prev.playerData.default.scorekeeping.votes,
                [catCode]: nomineeId || null
              }
            }
          }
        }
      }));
    },

    setHostName: (name: string) => {
      setGameData(prev => ({
        ...prev,
        hostName: name
      }));
    }
  };

  return (
    <GameContext.Provider value={{
      state: gameData,
      nominees,
      stats,
      actions
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}