import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import positionTranslations from '../data/position_translation_table.json';

interface TeamPaneProps {
  team: {
    name: string;
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
    roster: any[];
  };
  selectedNumber: string;
  onNumberChange: (number: string) => void;
}

export const TeamPane: React.FC<TeamPaneProps> = ({
  team,
  selectedNumber,
  onNumberChange,
}) => {
  const [firstDigit, secondDigit] = selectedNumber.padStart(2, '0').split('');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDigitChange = (increment: boolean) => {
    const current = parseInt(selectedNumber);
    const newNumber = increment 
      ? (current + 1) % 100 
      : (current - 1 + 100) % 100;
    onNumberChange(newNumber.toString().padStart(2, '0'));
  };

  const handleSingleDigitChange = (digit: 'first' | 'second', increment: boolean) => {
    const current = selectedNumber.padStart(2, '0');
    const [first, second] = current.split('');
    let newFirst = parseInt(first);
    let newSecond = parseInt(second);

    if (digit === 'first') {
      newFirst = increment ? (newFirst + 1) % 10 : (newFirst - 1 + 10) % 10;
    } else {
      newSecond = increment ? (newSecond + 1) % 10 : (newSecond - 1 + 10) % 10;
    }

    onNumberChange(`${newFirst}${newSecond}`);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isFocused) return;

    if (/^\d$/.test(e.key)) {
      const newNumber = (selectedNumber + e.key).slice(-2);
      onNumberChange(newNumber.padStart(2, '0'));
    } else {
      e.preventDefault();
      
      switch (e.key) {
        case 'ArrowUp':
          handleSingleDigitChange('second', true);
          break;
        case 'ArrowDown':
          handleSingleDigitChange('second', false);
          break;
        case 'ArrowLeft':
          handleSingleDigitChange('first', false);
          break;
        case 'ArrowRight':
          handleSingleDigitChange('first', true);
          break;
      }
    }
  };

  useEffect(() => {
    if (isFocused) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFocused, selectedNumber]);

  const currentPlayer = team.roster.find(p => p['#'].toString().padStart(2, '0') === selectedNumber);
  const positionFull = currentPlayer ? positionTranslations[currentPlayer.Pos as keyof typeof positionTranslations] || currentPlayer.Pos : "-";

  return (
    <div
      className="flex flex-col items-center justify-center p-8 h-full"
      style={{
        backgroundColor: team.primaryColor,
        color: team.secondaryColor,
      }}
    >
      <img
        src={team.logoUrl}
        alt={`${team.name} logo`}
        className="w-24 h-24 mb-8 object-contain"
      />
      
      {/* Individual digit increment buttons */}
      <div className="flex gap-8 mb-4">
        {[firstDigit, secondDigit].map((_, index) => (
          <button
            key={`inc-${index}`}
            onClick={() => handleSingleDigitChange(index === 0 ? 'first' : 'second', true)}
            className="p-2 hover:opacity-80 bg-black bg-opacity-20 rounded-lg"
            tabIndex={-1}
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        ))}
      </div>

      {/* Main number input with focus */}
      <div 
        ref={containerRef}
        className={cn(
          "flex gap-8 items-center p-4 rounded-lg transition-all",
          isFocused && "ring-4 ring-white ring-opacity-50"
        )}
        tabIndex={0}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <button
          onClick={() => handleDigitChange(true)}
          className="p-2 hover:opacity-80"
          tabIndex={-1}
        >
          <ChevronUp className="w-8 h-8" />
        </button>
        
        <div className="flex">
          {[firstDigit, secondDigit].map((digit, index) => (
            <div
              key={index}
              className="text-[12rem] font-bold w-40 h-48 flex items-center justify-center leading-none select-none jersey-25-regular"
            >
              {digit}
            </div>
          ))}
        </div>
        
        <button
          onClick={() => handleDigitChange(false)}
          className="p-2 hover:opacity-80"
          tabIndex={-1}
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </div>

      {/* Individual digit decrement buttons */}
      <div className="flex gap-8 mt-4">
        {[firstDigit, secondDigit].map((_, index) => (
          <button
            key={`dec-${index}`}
            onClick={() => handleSingleDigitChange(index === 0 ? 'first' : 'second', false)}
            className="p-2 hover:opacity-80 bg-black bg-opacity-20 rounded-lg"
            tabIndex={-1}
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        ))}
      </div>

      <div className="mt-8 text-center min-h-[120px]">
        <h2 className="text-3xl font-bold mb-2">{currentPlayer ? currentPlayer.Player : "-"}</h2>
        <p className="text-xl">{positionFull}</p>
      </div>
    </div>
  );
}