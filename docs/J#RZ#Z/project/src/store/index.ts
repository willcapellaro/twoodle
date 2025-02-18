import { create } from 'zustand';
import { Player, Team } from '../types';

interface AppState {
  selectedTeam: 'chiefs' | 'eagles' | null;
  selectedPlayer: Player | null;
  recentPlayers: Player[];
  isExpanded: boolean;
  setSelectedTeam: (team: 'chiefs' | 'eagles' | null) => void;
  setSelectedPlayer: (player: Player | null) => void;
  addRecentPlayer: (player: Player) => void;
  setIsExpanded: (expanded: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  selectedTeam: null,
  selectedPlayer: null,
  recentPlayers: [],
  isExpanded: false,
  setSelectedTeam: (team) => set({ selectedTeam: team }),
  setSelectedPlayer: (player) => set({ selectedPlayer: player }),
  addRecentPlayer: (player) =>
    set((state) => ({
      recentPlayers: [
        player,
        ...state.recentPlayers.filter((p) => p.id !== player.id),
      ].slice(0, 11),
    })),
  setIsExpanded: (expanded) => set({ isExpanded: expanded }),
}));