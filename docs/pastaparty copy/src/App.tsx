import React, { useState, useEffect } from 'react';
import { Copy, Briefcase, Github, Linkedin, Link as LinkIcon, Edit2, Eye, Phone, Moon, Sun, Monitor } from 'lucide-react';
import confetti from 'canvas-confetti';
import InputMask from 'react-input-mask';
import odometerStates from './odometerStates.json';

interface LinkData {
  linkedin: string;
  github: string;
  portfolio: string;
  portfolioLinks: string[];
  other: string;
  phone: string;
}

type Theme = 'light' | 'dark' | 'system';
const themes: Theme[] = ['light', 'system', 'dark'];

function App() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [linkData, setLinkData] = useState<LinkData>({
    linkedin: '',
    github: '',
    portfolio: '',
    portfolioLinks: [],
    other: '',
    phone: ''
  });
  const [selectedPortfolioLink, setSelectedPortfolioLink] = useState('');
  const [showCopySuccess, setShowCopySuccess] = useState<string | null>(null);
  const [copyCount, setCopyCount] = useState(0);
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'system';
  });
  const [currentOdometerState, setCurrentOdometerState] = useState(0);

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme cycling
  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  // Calculate current odometer value
  const calculateOdometerValue = () => {
    const state = odometerStates.odometer_states[currentOdometerState];
    const calculation = state.calculation.replace('copies', copyCount.toString());
    return {
      value: Number(eval(calculation)).toFixed(
        state.display.includes('.') ? 
          state.display.split('.')[1].length - 1 : 
          0
      ),
      units: state.units
    };
  };

  // Theme handling
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateTheme = () => {
      const isDark = 
        theme === 'dark' || 
        (theme === 'system' && mediaQuery.matches);
      
      document.documentElement.classList.toggle('dark', isDark);
    };

    updateTheme();
    localStorage.setItem('theme', theme);

    const handleChange = () => {
      if (theme === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem('jobLinksData');
    const savedCount = localStorage.getItem('copyCount');
    
    if (savedData) {
      setLinkData(JSON.parse(savedData));
    }
    if (savedCount) {
      setCopyCount(parseInt(savedCount));
    }
  }, []);

  const saveToLocalStorage = (newData: LinkData) => {
    localStorage.setItem('jobLinksData', JSON.stringify(newData));
    setLinkData(newData);
  };

  const handleInputChange = (field: keyof LinkData, value: string) => {
    if (field === 'portfolioLinks') {
      const links = value.split('\n').filter(link => link.trim());
      saveToLocalStorage({ ...linkData, portfolioLinks: links });
    } else {
      saveToLocalStorage({ ...linkData, [field]: value });
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopySuccess(field);
      
      const newCount = copyCount + 1;
      setCopyCount(newCount);
      localStorage.setItem('copyCount', newCount.toString());

      if (!prefersReducedMotion) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      setTimeout(() => setShowCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getFullUrl = (type: string) => {
    switch (type) {
      case 'linkedin':
        return `https://linkedin.com/in/${linkData.linkedin}`;
      case 'github':
        return `https://github.com/${linkData.github}`;
      case 'portfolio':
        return `https://${linkData.portfolio}${selectedPortfolioLink ? '/' + selectedPortfolioLink : ''}`;
      case 'phone':
        return linkData.phone;
      case 'other':
        return linkData.other;
      default:
        return '';
    }
  };

  const getPlaceholderUrl = (type: string) => {
    switch (type) {
      case 'linkedin':
        return 'https://linkedin.com/in/';
      case 'github':
        return 'https://github.com/';
      case 'portfolio':
        return 'https://';
      case 'phone':
        return '';
      case 'other':
        return 'https://';
      default:
        return '';
    }
  };

  const cycleOdometer = () => {
    setCurrentOdometerState((current) => 
      (current + 1) % odometerStates.odometer_states.length
    );
  };

  const { value: odometerValue, units: odometerUnits } = calculateOdometerValue();

  const inputBaseClasses = `h-14 w-full px-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 dark:text-white transition-all duration-300`;
  const buttonBaseClasses = `h-14 p-4 rounded-lg text-white transition-all duration-300 transform origin-right`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-2xl mx-auto px-0 sm:px-4">
        <div className="bg-white dark:bg-gray-800 rounded-none sm:rounded-xl shadow-lg p-4 sm:p-8 transition-colors duration-200">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white text-center">
              🎉 Paste Party! 🎉
            </h1>
            
            <div className="flex flex-wrap gap-2 justify-center items-center">
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
              >
                {isEditMode ? <Eye size={20} /> : <Edit2 size={20} />}
                <span>{isEditMode ? 'View' : 'Edit'}</span>
              </button>
              
              <button
                onClick={cycleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'light' ? <Sun className="w-5 h-5" /> : 
                 theme === 'dark' ? <Moon className="w-5 h-5" /> : 
                 <Monitor className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-6 mt-8">
            {/* LinkedIn */}
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                  {getPlaceholderUrl('linkedin')}
                </div>
                <input
                  type="text"
                  placeholder="your-linkedin-profile"
                  value={linkData.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  disabled={!isEditMode}
                  className={`${inputBaseClasses} pl-[180px] ${
                    isEditMode ? 'font-normal' : 'font-compressed'
                  }`}
                />
              </div>
              <button
                onClick={() => copyToClipboard(getFullUrl('linkedin'), 'linkedin')}
                className={`${buttonBaseClasses} bg-blue-500 hover:bg-blue-600`}
                style={{
                  width: isEditMode ? '0' : 'auto',
                  padding: isEditMode ? '0' : '1rem',
                  opacity: isEditMode ? '0' : '1',
                  visibility: isEditMode ? 'hidden' : 'visible'
                }}
                disabled={isEditMode}
              >
                <Linkedin className="w-6 h-6" />
              </button>
            </div>

            {/* GitHub */}
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                  {getPlaceholderUrl('github')}
                </div>
                <input
                  type="text"
                  placeholder="your-github-username"
                  value={linkData.github}
                  onChange={(e) => handleInputChange('github', e.target.value)}
                  disabled={!isEditMode}
                  className={`${inputBaseClasses} pl-[160px] ${
                    isEditMode ? 'font-normal' : 'font-compressed'
                  }`}
                />
              </div>
              <button
                onClick={() => copyToClipboard(getFullUrl('github'), 'github')}
                className={`${buttonBaseClasses} bg-gray-800 hover:bg-gray-900`}
                style={{
                  width: isEditMode ? '0' : 'auto',
                  padding: isEditMode ? '0' : '1rem',
                  opacity: isEditMode ? '0' : '1',
                  visibility: isEditMode ? 'hidden' : 'visible'
                }}
                disabled={isEditMode}
              >
                <Github className="w-6 h-6" />
              </button>
            </div>

            {/* Portfolio */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                    {getPlaceholderUrl('portfolio')}
                  </div>
                  <input
                    type="text"
                    placeholder="portfolio.example.com"
                    value={linkData.portfolio}
                    onChange={(e) => handleInputChange('portfolio', e.target.value)}
                    disabled={!isEditMode}
                    className={`${inputBaseClasses} pl-[70px] ${
                      isEditMode ? 'font-normal' : 'font-compressed'
                    }`}
                  />
                </div>
                <select
                  value={selectedPortfolioLink}
                  onChange={(e) => setSelectedPortfolioLink(e.target.value)}
                  className="h-14 px-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 dark:text-white transition-all duration-300"
                >
                  <option value="">Main site</option>
                  {linkData.portfolioLinks.map((link, index) => (
                    <option key={index} value={link}>{link}</option>
                  ))}
                </select>
                <button
                  onClick={() => copyToClipboard(getFullUrl('portfolio'), 'portfolio')}
                  className={`${buttonBaseClasses} bg-purple-500 hover:bg-purple-600`}
                  style={{
                    width: isEditMode ? '0' : 'auto',
                    padding: isEditMode ? '0' : '1rem',
                    opacity: isEditMode ? '0' : '1',
                    visibility: isEditMode ? 'hidden' : 'visible'
                  }}
                  disabled={isEditMode}
                >
                  <Briefcase className="w-6 h-6" />
                </button>
              </div>
              <div
                className="transition-all duration-300 overflow-hidden"
                style={{
                  maxHeight: isEditMode ? '8rem' : '0',
                  opacity: isEditMode ? '1' : '0'
                }}
              >
                <textarea
                  placeholder="Add portfolio sub-links (one per line)"
                  value={linkData.portfolioLinks.join('\n')}
                  onChange={(e) => handleInputChange('portfolioLinks', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 dark:text-white"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <InputMask
                  mask="+1 (999) 999-9999"
                  placeholder="Your phone number"
                  value={linkData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditMode}
                  className={`${inputBaseClasses} ${
                    isEditMode ? 'font-normal' : 'font-compressed'
                  }`}
                />
              </div>
              <button
                onClick={() => copyToClipboard(getFullUrl('phone'), 'phone')}
                className={`${buttonBaseClasses} bg-green-500 hover:bg-green-600`}
                style={{
                  width: isEditMode ? '0' : 'auto',
                  padding: isEditMode ? '0' : '1rem',
                  opacity: isEditMode ? '0' : '1',
                  visibility: isEditMode ? 'hidden' : 'visible'
                }}
                disabled={isEditMode}
              >
                <Phone className="w-6 h-6" />
              </button>
            </div>

            {/* Other Link */}
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                  {getPlaceholderUrl('other')}
                </div>
                <input
                  type="text"
                  placeholder="Any other link"
                  value={linkData.other}
                  onChange={(e) => handleInputChange('other', e.target.value)}
                  disabled={!isEditMode}
                  className={`${inputBaseClasses} pl-[70px] ${
                    isEditMode ? 'font-normal' : 'font-compressed'
                  }`}
                />
              </div>
              <button
                onClick={() => copyToClipboard(getFullUrl('other'), 'other')}
                className={`${buttonBaseClasses} bg-teal-500 hover:bg-teal-600`}
                style={{
                  width: isEditMode ? '0' : 'auto',
                  padding: isEditMode ? '0' : '1rem',
                  opacity: isEditMode ? '0' : '1',
                  visibility: isEditMode ? 'hidden' : 'visible'
                }}
                disabled={isEditMode}
              >
                <LinkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div 
              className="text-center text-gray-600 dark:text-gray-300 cursor-pointer"
              onClick={cycleOdometer}
            >
              <div className="text-2xl font-mono">
                {odometerValue}
              </div>
              <p className="text-sm mt-1">{odometerUnits}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;