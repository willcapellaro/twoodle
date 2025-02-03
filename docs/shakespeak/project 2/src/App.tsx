import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';

// Full script data
const scriptData = {
  title: "Hamlet",
  scene: 2,
  act: 5,
  lines: [
    {
      speaker: "Hamlet",
      original: "So much for this, sir: now shall you see the other;",
      alternate: [
        "That's enough of that. Now let's talk about something else.",
        "So that's settled. Now, onto the next thing."
      ]
    },
    {
      speaker: "Hamlet",
      original: "You do remember all the circumstance?",
      alternate: [
        "You remember all the details, right?",
        "You recall everything that happened?"
      ]
    },
    {
      speaker: "Horatio",
      original: "Remember it, my lord!",
      alternate: [
        "Of course I remember!",
        "Yes, my lord, I do."
      ]
    },
    {
      speaker: "Hamlet",
      original: "Sir, in my heart there was a kind of fighting,",
      alternate: [
        "Sir, I had a war raging inside me,",
        "I felt like there was a battle in my heart,"
      ]
    },
    {
      speaker: "Hamlet",
      original: "That would not let me sleep: methought I lay",
      alternate: [
        "That kept me from sleeping. It felt like I was",
        "That wouldn't let me rest. I felt like I was"
      ]
    },
    {
      speaker: "Hamlet",
      original: "Worse than the mutines in the bilboes.",
      alternate: [
        "Worse off than prisoners in shackles.",
        "More trapped than a prisoner in chains."
      ]
    },
    {
      speaker: "Osric",
      original: "Sweet lord, if your lordship were at leisure, I should impart a thing to you from his majesty.",
      alternate: [
        "My good lord, if you have a moment, I have a message from the king.",
        "My lord, if you have time, I bring news from His Majesty."
      ]
    },
    {
      speaker: "Hamlet",
      original: "I will receive it with all diligence of spirit.",
      alternate: [
        "I'll listen carefully.",
        "I'll hear it with my full attention."
      ]
    },
    {
      speaker: "Osric",
      original: "The King, sir, hath wager'd with Laertes that in a dozen passes between yourself and him, he shall not exceed you three hits:",
      alternate: [
        "The King has placed a bet on you against Laertes: in twelve hits, he won't beat you by more than three.",
        "The King has wagered that Laertes won't score more than three extra hits against you in a match of twelve."
      ]
    },
    {
      speaker: "Hamlet",
      original: "How if I answer no?",
      alternate: [
        "And what if I say no?",
        "What if I refuse?"
      ]
    },
    {
      speaker: "Osric",
      original: "I mean, my lord, the opposition of your person in trial.",
      alternate: [
        "I mean, my lord, if you refuse to fight.",
        "I mean if you decline the challenge, my lord."
      ]
    },
    {
      speaker: "Horatio",
      original: "You will lose, my lord.",
      alternate: [
        "You're going to lose, my lord.",
        "You're at a disadvantage, my lord."
      ]
    },
    {
      speaker: "Hamlet",
      original: "Not a whit, we defy augury: there's a special providence in the fall of a sparrow.",
      alternate: [
        "Not at all. I don't believe in omens. Everything happens for a reason.",
        "No, I reject fate. Even something as small as a bird falling is part of a greater plan."
      ]
    },
    {
      speaker: "Hamlet",
      original: "If it be now, 'tis not to come; if it be not to come, it will be now; if it be not now, yet it will come: the readiness is all.",
      alternate: [
        "If it happens now, then it's meant to happen. If not now, then later. But it will come eventually. Being ready is what matters.",
        "If my time is now, then so be it. If not, it will come. All that matters is being prepared."
      ]
    },
    {
      speaker: "King Claudius",
      original: "Give me the cups; and let the kettle to the trumpet speak, The trumpet to the cannoneer without, The cannons to the heavens, the heaven to earth, 'Now the king drinks to Hamlet.'",
      alternate: [
        "Bring me the goblets! Let the drums call the trumpets, the trumpets call the cannons, and the cannons roar to the sky! 'The King drinks to Hamlet!'",
        "Bring forth the wine! Let the drums sound the trumpets, the trumpets signal the cannons, and the cannons shake the heavens! 'The King toasts Hamlet!'"
      ]
    },
    {
      speaker: "Laertes",
      original: "Come, my lord.",
      alternate: [
        "Let's do this, my lord.",
        "Come, let's begin."
      ]
    },
    {
      speaker: "Hamlet",
      original: "Come on, sir.",
      alternate: [
        "Bring it on, sir.",
        "Let's go, sir."
      ]
    },
    {
      speaker: "Laertes",
      original: "Have at you now!",
      alternate: [
        "Here I come!",
        "Take this!"
      ]
    },
    {
      speaker: "Horatio",
      original: "They bleed on both sides.",
      alternate: [
        "They're both wounded!",
        "They're both bleeding!"
      ]
    },
    {
      speaker: "Hamlet",
      original: "Then, venom, to thy work.",
      alternate: [
        "Then let this poison do its job.",
        "Then, poison, finish what you started."
      ]
    },
    {
      speaker: "Hamlet",
      original: "Here, thou incestuous, murderous, damned Dane, Drink off this potion! Is thy union here? Follow my mother!",
      alternate: [
        "Here, you incestuous, murderous, cursed Dane! Drink this poison! Is your treachery here? Go join my mother!",
        "Here, you evil, incestuous murderer! Drink this! Do you see your 'loyalty' now? Go where my mother went!"
      ]
    },
    {
      speaker: "Horatio",
      original: "Now cracks a noble heart. Good night, sweet prince, And flights of angels sing thee to thy rest!",
      alternate: [
        "A great man's heart has broken. Good night, sweet prince. May angels carry you to your rest.",
        "A noble soul departs. Sleep well, dear prince, and let the angels guide you to peace."
      ]
    }
  ]
};

function App() {
  const [currentLine, setCurrentLine] = useState(0);
  const [showAlternate, setShowAlternate] = useState(false);
  const [alternateVersion, setAlternateVersion] = useState(0);
  const [crankPosition, setCrankPosition] = useState(0);
  
  // Simulate crank movement with mouse wheel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      setCrankPosition(prev => {
        const newPos = prev + e.deltaY;
        if (Math.abs(newPos - prev) > 50) {
          setCurrentLine(curr => 
            e.deltaY > 0 
              ? Math.min(curr + 1, scriptData.lines.length - 1)
              : Math.max(curr - 1, 0)
          );
          return 0;
        }
        return newPos;
      });
    };
    
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Handle keyboard navigation (simulating D-pad)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setCurrentLine(curr => Math.max(curr - 1, 0));
          break;
        case 'ArrowDown':
          setCurrentLine(curr => Math.min(curr + 1, scriptData.lines.length - 1));
          break;
        case 'a':
        case 'A':
          if (showAlternate) {
            setAlternateVersion(prev => (prev + 1) % 2);
          } else {
            setShowAlternate(true);
          }
          break;
        case 'b':
        case 'B':
          setShowAlternate(false);
          setAlternateVersion(0);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAlternate]);

  const getContextLines = () => {
    const previousLines = [];
    for (let i = Math.max(0, currentLine - 3); i < currentLine; i++) {
      previousLines.push(scriptData.lines[i]);
    }
    return previousLines;
  };

  const currentScript = scriptData.lines[currentLine];
  const nextScript = currentLine < scriptData.lines.length - 1 ? scriptData.lines[currentLine + 1] : null;
  const contextLines = getContextLines();
  
  return (
    <div className="min-h-screen bg-[#E5E6E1] flex flex-col items-center p-4 font-mono">
      {/* Title */}
      <h1 className="text-xl font-bold mb-4">
        {scriptData.title} - Act {scriptData.act}, Scene {scriptData.scene}
      </h1>
      
      {/* Playdate-style screen */}
      <div className="w-full max-w-[400px] h-[240px] bg-white border-4 border-black rounded-lg p-4 relative overflow-hidden">
        {/* Script content */}
        <div className="absolute inset-0 flex flex-col p-4 overflow-y-auto">
          {/* Previous context lines */}
          {contextLines.map((line, index) => (
            <div key={`context-${index}`} className="text-xs text-gray-500 mb-1">
              <span className="font-bold">{line.speaker}:</span>{" "}
              {showAlternate ? line.alternate[alternateVersion] : line.original}
            </div>
          ))}
          
          {/* Current line */}
          <div className="text-sm font-bold my-2 border-l-4 border-black pl-2">
            <span className="font-bold">{currentScript.speaker}:</span>{" "}
            {showAlternate ? currentScript.alternate[alternateVersion] : currentScript.original}
          </div>

          {/* Next line preview */}
          {nextScript && (
            <div className="text-xs text-gray-400">
              <span className="font-bold">{nextScript.speaker}:</span>{" "}
              {(showAlternate ? nextScript.alternate[alternateVersion] : nextScript.original).substring(0, 30)}...
            </div>
          )}
          
          {/* Navigation indicators */}
          <div className="absolute bottom-2 left-2">
            <ChevronUp className="w-4 h-4" />
            <ChevronDown className="w-4 h-4" />
          </div>
          
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            <span className="text-xs">{showAlternate ? `A (${alternateVersion + 1}/2)` : 'A'}</span>
            <RotateCcw className="w-4 h-4" />
          </div>
        </div>
      </div>
      
      {/* Line counter */}
      <div className="mt-2 text-sm">
        Line {currentLine + 1}/{scriptData.lines.length}
      </div>
      
      {/* Instructions */}
      <div className="mt-8 text-sm text-center">
        <p className="mb-2">Controls:</p>
        <ul>
          <li>↑/↓ or Mouse Wheel: Scroll through lines</li>
          <li>A key: Toggle/cycle alternate text</li>
          <li>B key: Return to original text</li>
        </ul>
      </div>
    </div>
  );
}

export default App;