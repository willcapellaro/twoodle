import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { ScoreDrawer } from './ScoreDrawer';
import { ScoreTable } from './ScoreTable';
import { Menu, ChevronDown, Trophy, Clock, Wifi, Lock, Unlock, ArrowLeft, AlertTriangle, Bell } from 'lucide-react';
import { cn } from '../utils';
import anime from 'animejs/lib/anime.es.js';
import { Dialog, Transition } from '@headlessui/react';

function calculateTimeUntil() {
  const targetDate = new Date('2025-03-02T14:00:00-08:00'); // 2pm PST on March 2
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const isBeforeStart = diff > 0;
  return { days, hours, minutes, seconds, isBeforeStart };
}

function DebugMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { actions, nominees } = useGame();

  const handleRandomWinners = () => {
    // Group nominees by category
    const categorizedNominees = nominees.reduce((acc, nominee) => {
      if (!acc[nominee.catCode]) {
        acc[nominee.catCode] = [];
      }
      acc[nominee.catCode].push(nominee);
      return acc;
    }, {} as Record<string, Nominee[]>);

    // For each category, pick a random winner
    Object.entries(categorizedNominees).forEach(([catCode, categoryNominees]) => {
      const randomIndex = Math.floor(Math.random() * categoryNominees.length);
      actions.setWinner(categoryNominees[randomIndex].id, catCode);
    });
    setIsOpen(false);
  };

  const handleFirstInCategory = () => {
    const categories = new Map();
    nominees.forEach(nominee => {
      if (!categories.has(nominee.catCode)) {
        categories.set(nominee.catCode, nominee.id);
      }
    });
    categories.forEach((nomineeId, catCode) => {
      actions.setWinner(nomineeId, catCode);
    });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 100)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--color-hover)]"
      >
        <Menu className="w-5 h-5" />
        <span>Debug</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-[var(--color-border)] p-2 min-w-[200px] z-50">
          <button
            onClick={handleRandomWinners}
            className="flex items-center gap-2 w-full p-2 rounded hover:bg-[var(--color-hover)] text-primary"
          >
            Pick Random Winners
          </button>
          <button
            onClick={handleFirstInCategory}
            className="flex items-center gap-2 w-full p-2 rounded hover:bg-[var(--color-hover)] text-primary"
          >
            Pick First in Category
          </button>
          <button
            className="flex items-center gap-2 w-full p-2 rounded hover:bg-[var(--color-hover)] text-primary"
            onClick={() => actions.clearWinnerSelections()}
          >
            Clear All Selections
          </button>
        </div>
      )}
    </div>
  );
}

export function ScoringView() {
  const [showScoring, setShowScoring] = useState(false);
  const [countdown, setCountdown] = useState(calculateTimeUntil());
  const [showVoteWatcherModal, setShowVoteWatcherModal] = useState(false);
  const [showRemindMeModal, setShowRemindMeModal] = useState(false);
  const [prefersReducedMotion] = useState(() => 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const { state, actions } = useGame();

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateTimeUntil());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const animateTitle = () => {
    if (prefersReducedMotion) return;
    
    const textWrapper = document.querySelector('.scoring-title');
    if (!textWrapper) return;
    
    // Store original text
    const originalText = textWrapper.textContent;
    // Only proceed if we have text to animate
    if (!originalText) return;
    
    // Create and insert spans only if they don't exist
    if (!textWrapper.querySelector('.letter')) {
      textWrapper.innerHTML = originalText.replace(/\S/g, "<span class='letter inline-block leading-none'>$&</span>");
    }

    anime.timeline({ loop: false })
      .add({
        targets: '.scoring-title .letter',
        translateY: ["1.2em", 0],
        translateZ: 0,
        duration: 1000,
        delay: (el, i) => 30 * i,
        easing: 'easeOutExpo'
      });
  };

  React.useEffect(() => {
    animateTitle();
  }, []);

  return (
    <div className="min-h-screen bg-primary">
      {/* Scoring Lock Banner - Always at top */}
      <div className={cn(
        "w-full py-3 px-4 flex items-center justify-center gap-4 text-white",
        countdown.isBeforeStart
          ? state.votingLocked
            ? "bg-[#722F37]" // merlot for locked before event (bad)
            : "bg-[#1B365D]" // navy for unlocked before event (ok)
          : state.votingLocked
            ? "bg-[#2E8B57]" // kelly green for locked after event (ok)
            : "bg-[#1B365D]" // navy for unlocked after event (bad)
      )}>
        <div className="container mx-auto flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={state.votingLocked}
              onChange={(e) => actions.setVotingLocked(e.target.checked)}
              className="rounded border-white/20 text-white focus:ring-white/20"
            />
            <span>Lock scoring (recommended at showtime)</span>
            {countdown.isBeforeStart ? (
              state.votingLocked && (
                <div className="group relative">
                  <AlertTriangle className="w-5 h-5" />
                  <div className="absolute left-0 top-full mt-2 w-64 p-2 bg-white text-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 text-sm pointer-events-none">
                   Your player games can't vote
                  </div>
                </div>
              )
            ) : (
              !state.votingLocked && (
                <div className="group relative">
                  <AlertTriangle className="w-5 h-5" />
                  <div className="absolute left-0 top-full mt-2 w-64 p-2 bg-white text-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 text-sm pointer-events-none">
                    Players in your hosted games probably cheating right now
                  </div>
                </div>
              )
            )}
          </label>
          <button
            onClick={() => setShowRemindMeModal(true)}
            className="flex items-center gap-2 px-3 py-1 rounded-lg border border-white/20 hover:bg-white/10"
          >
            <span>Remind Me</span>
          </button>
        </div>
      </div>

      {showScoring ? (
        <div className="container mx-auto px-4 py-8 mt-4">
          <div className="grid grid-cols-2 gap-8">
            {/* Back button and header */}
            <div className="col-span-2 mb-6">
              <button
                onClick={() => setShowScoring(false)}
                className="flex items-center gap-2 text-secondary hover:text-primary mb-4"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to scoring overview</span>
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light dark:text-gray-100">Keep Score</h2>
                <DebugMenu />
              </div>
              <ScoreDrawer
                isOpen={true}
                onClose={() => {}}
                embedded={true}
              />
            </div>

            {/* Right column: Score table */}
            <div>
              <h2 className="text-2xl font-light mb-6 dark:text-gray-100">Leaderboard</h2>
              <ScoreTable />
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 mt-4 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="flex justify-center mb-4">
              <button
                onClick={animateTitle}
                className="p-2 rounded-full hover:bg-[var(--color-hover)] transition-colors"
              >
                <Trophy className="w-16 h-16 text-[#A69764]" />
              </button>
            </div>
            
            <h1 
              className="scoring-title relative cursor-pointer mb-2"
              onClick={animateTitle}
              data-text="Watch & score here!"
            >
              Watch & score here!
            </h1>

            <div className="flex items-center justify-center gap-2 text-xl text-secondary mb-12">
              <Clock className="w-5 h-5" />
              <div>
                <span>
                  {countdown.days} Days, {countdown.hours} Hours, {countdown.minutes} Minutes, {countdown.seconds} Seconds
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-12">
              <div className="text-left">
                <div className="flex items-start gap-4">
                  <Wifi className="w-16 h-16 text-[#A69764]" />
                  <div>
                    <p className="text-secondary mb-4">
                      We are working on auto-scoring right now! This will crowdsource scores in real time, and allow you to chill out and just watch.
                    </p>
                    <button
                      className="px-4 py-2 rounded-lg border border-[#A69764] text-[#A69764] hover:bg-[#A69764] hover:text-white transition-colors"
                      onClick={() => {
                        setShowVoteWatcherModal(true);
                      }}
                    >
                      Be a vote watcher
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-left">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {state.votingLocked ? (
                      <Trophy className="w-8 h-8 text-[#A69764]" />
                    ) : (
                      <Trophy className="w-8 h-8 text-[#A69764]" />
                    )}
                  </div>
                  <div>
                    <p className="text-secondary mb-4">
                      As a backup (sync problems, internet outage) you will always be able to score manually.
                    </p>
                    <button
                      className="px-4 py-2 rounded-lg bg-[#A69764] text-white hover:bg-[#95875A] transition-colors"
                      onClick={() => setShowScoring(true)}
                    >
                      Score manually
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vote Watcher Modal */}
      <Transition appear show={showVoteWatcherModal} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowVoteWatcherModal(false)}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="bg-white dark:bg-black rounded-lg max-w-md w-full p-6">
                <div className="text-center">
                  <Wifi className="w-12 h-12 text-[#A69764] mx-auto mb-4" />
                  <Dialog.Title className="text-xl font-medium mb-4 text-primary">
                    Coming Soon!
                  </Dialog.Title>
                  <p className="text-secondary mb-6">
                    Auto-scoring is currently in development. We'll notify you when this feature becomes available.
                  </p>
                  <button
                    onClick={() => setShowVoteWatcherModal(false)}
                    className="px-4 py-2 rounded-lg bg-[#A69764] text-white hover:bg-[#95875A]"
                  >
                    Got it
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Remind Me Modal */}
      <Transition appear show={showRemindMeModal} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowRemindMeModal(false)}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="bg-white dark:bg-black rounded-lg max-w-md w-full p-6">
                <div className="text-center">
                  <Bell className="w-12 h-12 text-[#A69764] mx-auto mb-4" />
                  <Dialog.Title className="text-xl font-medium mb-4 text-primary">
                    Coming Soon!
                  </Dialog.Title>
                  <p className="text-secondary mb-6">
                    Reminders are coming soon. We'll notify you when this feature becomes available.
                  </p>
                  <button
                    onClick={() => setShowRemindMeModal(false)}
                    className="px-4 py-2 rounded-lg bg-[#A69764] text-white hover:bg-[#95875A]"
                  >
                    Got it
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}