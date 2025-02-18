import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { cn } from '../utils';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { stats } = useGame();
  const percentage = stats.totalCategories ? Math.round((stats.votedCategories / stats.totalCategories) * 100) : 0;

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'fixed bottom-8 right-8 px-6 py-3 rounded-full bg-[var(--color-brand)] text-white shadow-lg',
        'min-w-[208px] min-h-[56px]',
        'hover:bg-[var(--color-brand-hover)] transition-all duration-300',
        'transform translate-y-2 opacity-0',
        isVisible && 'translate-y-0 opacity-100',
        'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:ring-opacity-50',
        'z-50 flex items-center gap-3'
      )}
      aria-label="Back to top"
    >
      <ArrowUp className="w-6 h-6" />
      <div className="relative flex-1 flex items-center">
        <div
          className="relative h-[40px] flex items-center justify-center w-full"
        >
          <div className={cn(
            'flex items-center absolute inset-0 transition-all duration-300 justify-start',
            isHovered ? 'opacity-0 translate-y-full' : 'opacity-100 translate-y-0'
          )}>
            <span className="text-3xl font-light leading-none">{percentage}</span>
            <span className="text-sm opacity-75 leading-none">%</span>
            <span className="text-xs opacity-75 ml-1 leading-none">complete</span>
          </div>
          <div className={cn(
            'absolute inset-0 flex items-center justify-start transition-all duration-300',
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
          )}>
            <span className="text-lg font-medium">back to top</span>
          </div>
        </div>
      </div>
    </button>
  );
}