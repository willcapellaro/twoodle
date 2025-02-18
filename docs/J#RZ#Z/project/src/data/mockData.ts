import { Team } from '../types';
import playerData from '../lib/super_bowl_lix_players.json';

// Convert JSON data to our Team type format
const createTeamPlayers = (teamData: any[]) => {
  return teamData.map(player => ({
    id: player.name.toLowerCase().replace(/\s+/g, '-'),
    name: player.name,
    number: player.jersey_number.toString().padStart(2, '0'),
    position: player.position,
    seasonsWithTeam: player.seasons_with_team,
    playedForOpponent: false, // We'll need to determine this based on history
    imageUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=200',
    team: player.name.includes('Kelce') ? 'chiefs' : 'eagles' as 'chiefs' | 'eagles'
  }));
};

export const teams: Team[] = [
  {
    id: 'chiefs',
    name: 'Kansas City Chiefs',
    abbreviation: 'KC',
    logoUrl: 'https://cdn.theapidb.com/nfl/kansas-city-chiefs-logo.png',
    primaryColor: '#E31837',
    secondaryColor: '#FFB81C',
    players: createTeamPlayers(playerData['Kansas City Chiefs'])
  },
  {
    id: 'eagles',
    name: 'Philadelphia Eagles',
    abbreviation: 'PHI',
    logoUrl: 'https://cdn.theapidb.com/nfl/philadelphia-eagles-logo.png',
    primaryColor: '#004C54',
    secondaryColor: '#A5ACAF',
    players: createTeamPlayers(playerData['Philadelphia Eagles'])
  }
];