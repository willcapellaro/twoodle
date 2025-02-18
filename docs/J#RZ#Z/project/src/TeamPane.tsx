import React from 'react';
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

  const handleDigitChange = (digit: 'first' | 'second', increment: boolean) => {
    let newFirst = parseInt(firstDigit);
    let newSecond = parseInt(secondDigit);

    if (digit === 'first') {
      newFirst = increment ? (newFirst + 1) % 10 : (newFirst - 1 + 10) % 10;
    } else {
      newSecond = increment ? (newSecond + 1) % 10 : (newSecond - 1 + 10) % 10;
    }

    onNumberChange(`${newFirst}${newSecond}`);
  };

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
      
      <div className="flex gap-8 items-center">
        {[firstDigit, secondDigit].map((digit, index) => (
          <div key={index} className="flex flex-col items-center">
            <button
              onClick={() =>
                handleDigitChange(index === 0 ? 'first' : 'second', true)
              }
              className="p-2 hover:opacity-80"
            >
              <ChevronUp className="w-8 h-8" />
            </button>
            
            <div
              className="text-[12rem] font-bold w-40 h-48 flex items-center justify-center leading-none"
              style={{ fontFamily: 'Jersey 20, sans-serif' }}
            >
              {digit}
            </div>
            
            <button
              onClick={() =>
                handleDigitChange(index === 0 ? 'first' : 'second', false)
              }
              className="p-2 hover:opacity-80"
            >
              <ChevronDown className="w-8 h-8" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center min-h-[120px]">
        <h2 className="text-3xl font-bold mb-2">{currentPlayer ? currentPlayer.Player : "-"}</h2>
        <p className="text-xl">{positionFull}</p>
      </div>
    </div>
  );
}