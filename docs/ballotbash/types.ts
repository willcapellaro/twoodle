export type Nominee = {
  id: string;
  category: string;
  catCode: string;
  names: string[];
  film: string;
  filmCode: string;
  order: number;
  emoji?: string;
  music?: string;
  country?: string;
  posterUrl?: string;
};

export type Vote = 'primary' | 'backup';
export type ViewMode = 'table' | 'card';
export type SortMode = 'category' | 'film' | 'name' | 'seen' | 'vote';

export type Player = {
  id: string;
  name: string;
  isHost: boolean;
  isNetworked?: boolean;
};

export type PlayerData = {
  votes: Record<string, string>; // catCode -> nomineeId
  seen: string[]; // filmCodes
};

export type Game = {
  id: string;
  name?: string;
  hostId: string;
  hostName?: string;
  hostedLocally: boolean; // Track if game was created on this device
  players: Player[];
  created: number;
};

export type GameData = {
  currentGameId: string | null;
  currentPlayerId: string | null;
  syncVotes: boolean;
  votingLocked: boolean;
  hostName: string;
  games: Record<string, Game>;
  playerData: Record<string, Record<string, PlayerData>>; // gameId -> playerId -> data
};

export type Filters = {
  seen: boolean;
  unseen: boolean;
  voted: boolean;
  notVoted: boolean;
};

export type ThemeMode = 'light' | 'dark' | 'system';

export type Theme = {
  mode: ThemeMode;
  highContrast: boolean;
  showScoreBar: boolean;
  showUuids: boolean;
};