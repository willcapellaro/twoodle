export interface Player {
  id: string;
  name: string;
  number: string;
  position: string;
  seasonsWithTeam: number;
  playedForOpponent: boolean;
  imageUrl: string;
  team: 'chiefs' | 'eagles';
}

export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  players: Player[];
}