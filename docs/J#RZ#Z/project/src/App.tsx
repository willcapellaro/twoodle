import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, MonitorCheck } from 'lucide-react';
import { TeamPane } from './components/TeamPane';
import { RecentPlayers } from './components/RecentPlayers';
import { cn } from './lib/utils';
import chiefsRoster from './data/roster_chiefs.json';
import eaglesRoster from './data/roster_eagles.json';

export default function App() {
  const [selectedNumbers, setSelectedNumbers] = useState({
    chiefs: '00',
    eagles: '00',
  });

  const [recentChiefs, setRecentChiefs] = useState<any[]>([]);
  const [recentEagles, setRecentEagles] = useState<any[]>([]);
  const [keepScreenOn, setKeepScreenOn] = useState(false);
  
  // Track viewing time for each player
  const viewingTimeRef = useRef<{ [key: string]: number }>({});
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const wakeLockRef = useRef<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastUpdateTimeRef.current;
      lastUpdateTimeRef.current = now;

      // Update viewing time for current players
      Object.entries(selectedNumbers).forEach(([team, number]) => {
        const roster = team === 'chiefs' ? chiefsRoster : eaglesRoster;
        const player = roster.find(p => p['#'].toString().padStart(2, '0') === number);
        
        if (player) {
          const key = `${team}-${player['#']}`;
          viewingTimeRef.current[key] = (viewingTimeRef.current[key] || 0) + elapsed;

          // If viewed for 10 seconds, add to recents
          if (viewingTimeRef.current[key] >= 10000) {
            if (team === 'chiefs') {
              setRecentChiefs(prev => 
                prev.some(p => p['#'] === player['#']) 
                  ? prev 
                  : [player, ...prev].slice(0, 11)
              );
            } else {
              setRecentEagles(prev => 
                prev.some(p => p['#'] === player['#']) 
                  ? prev 
                  : [player, ...prev].slice(0, 11)
              );
            }
            // Reset the timer after adding to recents
            delete viewingTimeRef.current[key];
          }
        }
      });
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, [selectedNumbers]);

  // Handle screen wake lock
  useEffect(() => {
    const toggleWakeLock = async () => {
      if (keepScreenOn && !wakeLockRef.current) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        } catch (err) {
          console.error('Failed to enable wake lock:', err);
        }
      } else if (!keepScreenOn && wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
        } catch (err) {
          console.error('Failed to release wake lock:', err);
        }
      }
    };

    toggleWakeLock();

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(console.error);
      }
    };
  }, [keepScreenOn]);

  const handleNumberChange = (team: 'chiefs' | 'eagles', number: string) => {
    setSelectedNumbers(prev => ({ ...prev, [team]: number }));
  };

  const handleTouchdown = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleSelectRecentPlayer = (team: 'chiefs' | 'eagles', player: any) => {
    handleNumberChange(team, player['#'].toString().padStart(2, '0'));
  };

  return (
    <div className="h-screen flex relative overflow-hidden">
      <button
        onClick={() => setKeepScreenOn(!keepScreenOn)}
        className="absolute top-4 right-4 z-20 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all flex items-center gap-2"
      >
        <MonitorCheck className={cn("w-6 h-6", keepScreenOn ? "text-green-400" : "text-white")} />
        <span className="text-sm">{keepScreenOn ? "Screen On" : "Screen Off"}</span>
      </button>

      <div className="w-1/2 relative">
        <TeamPane
          team={{
            name: 'Kansas City Chiefs',
            primaryColor: '#E31837',
            secondaryColor: '#FFB81C',
            logoUrl: '/src/img/chiefs.jpg',
            roster: chiefsRoster
          }}
          selectedNumber={selectedNumbers.chiefs}
          onNumberChange={(number) => handleNumberChange('chiefs', number)}
        />
        <RecentPlayers
          players={recentChiefs}
          side="left"
          onSelectPlayer={(player) => handleSelectRecentPlayer('chiefs', player)}
        />
      </div>

      <button
        onClick={handleTouchdown}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10
          bg-yellow-500 text-white p-4 rounded-full shadow-lg hover:bg-yellow-600 transition-all"
      >
        <Trophy className="w-8 h-8" />
      </button>

      <div className="w-1/2 relative">
        <TeamPane
          team={{
            name: 'Philadelphia Eagles',
            primaryColor: '#004C54',
            secondaryColor: '#A5ACAF',
            logoUrl: '/src/img/eagles.jpg',
            roster: eaglesRoster
          }}
          selectedNumber={selectedNumbers.eagles}
          onNumberChange={(number) => handleNumberChange('eagles', number)}
        />
        <RecentPlayers
          players={recentEagles}
          side="right"
          onSelectPlayer={(player) => handleSelectRecentPlayer('eagles', player)}
        />
      </div>
    </div>
  );
}