import React, { useState, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUpload, 
  faCog, 
  faPlay, 
  faPause,
  faStepBackward,
  faStepForward,
  faEye,
  faEyeSlash,
  faExpandArrowsAlt,
  faCompress,
  faAdjust,
  faMagic,
  faSync,
  faImage,
  faLayerGroup,
  faSliders,
  faMousePointer,
  faMobile,
  faGamepad,
  faCrosshairs,
  faLock,
  faUnlock,
  faRandom,
  faArrowsAltH,
  faArrowsAltV,
  faVial
} from '@fortawesome/free-solid-svg-icons';
import DepthViewer from './components/DepthViewer.jsx';
import { createTestImages } from './utils/testImages.js';

function App() {
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Depth Controls
  const [depthScale, setDepthScale] = useState(1.0);
  const [sensitivity, setSensitivity] = useState(1.0);
  
  // Display Controls
  const [showDepthMap, setShowDepthMap] = useState(false);
  const [localizedParallax, setLocalizedParallax] = useState(false);
  const [localizeDistance, setLocalizeDistance] = useState(100);
  
  // Drag Controls
  const [symmetricalDrag, setSymmetricalDrag] = useState(false);
  const [invertX, setInvertX] = useState(false);
  const [lockX, setLockX] = useState(false);
  const [invertY, setInvertY] = useState(false);
  const [lockY, setLockY] = useState(false);
  
  // Animation Controls
  const [animateSlideTransitions, setAnimateSlideTransitions] = useState(true);
  const [animationTiming, setAnimationTiming] = useState(500);
  
  // Dampening Controls
  const [backgroundDampening, setBackgroundDampening] = useState(0.5);
  const [midgroundDampening, setMidgroundDampening] = useState(0.8);
  
  // Gyroscope Controls
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const [gyroHorizontal, setGyroHorizontal] = useState(1.0);
  const [gyroVertical, setGyroVertical] = useState(1.0);
  const [gyroInvertX, setGyroInvertX] = useState(false);
  const [gyroLockX, setGyroLockX] = useState(false);
  const [gyroInvertY, setGyroInvertY] = useState(false);
  const [gyroLockY, setGyroLockY] = useState(false);
  
  // Misc Controls
  const [swipeSlideAdvance, setSwipeSlideAdvance] = useState(true);
  const [numpadAnimation, setNumpadAnimation] = useState(false);
  const [invertDepthLogic, setInvertDepthLogic] = useState(false);
  
  // UI State
  const [hasImages, setHasImages] = useState(false);
  const [toast, setToast] = useState(null);
  
  const depthViewerRef = useRef(null);
  const fileInputRef = useRef(null);

  const toggleControls = () => setIsControlsOpen(!isControlsOpen);
  
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const loadTestImages = async () => {
    try {
      showToast('Loading test images...', 'info');
      
      const { getColorBlob, getDepthBlob } = createTestImages();
      const colorBlob = await getColorBlob();
      const depthBlob = await getDepthBlob();
      
      // Create File objects from blobs
      const colorFile = new File([colorBlob], 'test-color.png', { type: 'image/png' });
      const depthFile = new File([depthBlob], 'test-∂map.png', { type: 'image/png' });
      
      console.log('Test files created:', { colorFile, depthFile });
      
      const success = await depthViewerRef.current?.loadImages(colorFile, depthFile);
      if (success) {
        setHasImages(true);
        showToast('Test images loaded successfully!', 'success');
      } else {
        showToast('Failed to load test images', 'error');
      }
    } catch (error) {
      console.error('Error loading test images:', error);
      showToast('Error loading test images', 'error');
    }
  };

  const handleFileChange = useCallback(async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    console.log('Files selected:', files.map(f => f.name));

    // Auto-detect color and depth images
    let colorFile = null;
    let depthFile = null;

    for (const file of files) {
      const name = file.name.toLowerCase();
      if (name.includes('∂map') || name.includes('depth') || name.includes('dmap')) {
        depthFile = file;
      } else if (name.includes('.jpg') || name.includes('.jpeg') || name.includes('.png')) {
        if (!colorFile) colorFile = file;
      }
    }

    // If we have exactly 2 images and couldn't auto-detect, use first as color, second as depth
    if (files.length === 2 && !depthFile) {
      colorFile = files[0];
      depthFile = files[1];
    }

    // Load images into viewer
    if (colorFile && depthFile) {
      showToast(`Loading ${colorFile.name} + ${depthFile.name}...`, 'info');
      
      try {
        const success = await depthViewerRef.current?.loadImages(colorFile, depthFile);
        if (success) {
          setHasImages(true);
          showToast('Images loaded successfully!', 'success');
        } else {
          showToast('Failed to load images', 'error');
        }
      } catch (error) {
        console.error('Error loading images:', error);
        showToast('Error loading images', 'error');
      }
    } else if (colorFile) {
      showToast('Please select both a color image and depth map', 'error');
    } else {
      showToast('Please select image files', 'error');
    }

    // Clear input
    event.target.value = '';
  }, []);

  return (
    <div className="w-full h-screen bg-cyber-bg font-oxanium text-cyber-primary overflow-hidden relative">
      {/* Main Viewer Area */}
      <div className="w-full h-full relative">
        {hasImages ? (
          <DepthViewer
            ref={depthViewerRef}
            width={window.innerWidth}
            height={window.innerHeight}
            depthScale={depthScale}
            sensitivity={sensitivity}
            showDepthMap={showDepthMap}
          />
        ) : (
          <div className="w-full h-full bg-cyber-bg-light grid-bg flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="cyber-glow text-8xl animate-pulse">◈</div>
              <div className="text-cyber-primary cyber-glow text-2xl">DEPTH VIEWER</div>
              <div className="text-cyber-secondary text-lg">Upload color image + depth map</div>
              <button
                onClick={handleFileUpload}
                className="cyber-button cyber-border px-6 py-3 rounded-lg hover:bg-cyber-primary hover:bg-opacity-20 transition-all mt-4"
              >
                <FontAwesomeIcon icon={faUpload} className="mr-2" />
                SELECT FILES
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Top Controls Bar */}
      <div className="absolute top-4 left-4 flex space-x-2 z-50">
        <button
          onClick={handleFileUpload}
          className="cyber-button cyber-border p-3 rounded-lg hover:bg-cyber-primary hover:bg-opacity-20 transition-all"
          title="Upload Images"
        >
          <FontAwesomeIcon icon={faUpload} className="text-cyber-primary" />
        </button>
        
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="cyber-button cyber-border p-3 rounded-lg hover:bg-cyber-primary hover:bg-opacity-20 transition-all"
          title={isPlaying ? "Pause" : "Play"}
          disabled={!hasImages}
        >
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} className={hasImages ? "text-cyber-green" : "text-gray-500"} />
        </button>

        <button
          className="cyber-button cyber-border p-3 rounded-lg hover:bg-cyber-primary hover:bg-opacity-20 transition-all"
          title="Previous Image"
          disabled={!hasImages}
        >
          <FontAwesomeIcon icon={faStepBackward} className={hasImages ? "text-cyber-yellow" : "text-gray-500"} />
        </button>

        <button
          className="cyber-button cyber-border p-3 rounded-lg hover:bg-cyber-primary hover:bg-opacity-20 transition-all"
          title="Next Image"
          disabled={!hasImages}
        >
          <FontAwesomeIcon icon={faStepForward} className={hasImages ? "text-cyber-yellow" : "text-gray-500"} />
        </button>
      </div>

      {/* Controls Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={toggleControls}
          className="cyber-button cyber-border p-3 rounded-lg hover:bg-cyber-primary hover:bg-opacity-20 transition-all"
          title="Settings Console"
        >
          <FontAwesomeIcon icon={faCog} className="text-cyber-accent" />
        </button>
      </div>

      {/* Controls Panel */}
      <div className={`
        absolute top-0 right-0 h-full w-80 bg-cyber-bg-light grid-bg
        transform transition-transform duration-300 z-40
        ${isControlsOpen ? 'translate-x-0' : 'translate-x-full'}
        cyber-border border-l-2
      `}>
        <div className="p-4 overflow-y-auto">
          {/* Panel Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold cyber-glow text-cyber-primary">CONSOLE</h2>
            <button
              onClick={toggleControls}
              className="cyber-button p-2 rounded hover:bg-cyber-primary hover:bg-opacity-20"
            >
              <FontAwesomeIcon icon={faCompress} className="text-cyber-accent" />
            </button>
          </div>

          {/* File Upload Section */}
          <div className="cyber-border p-4 rounded-lg bg-cyber-bg bg-opacity-50 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-cyber-primary cyber-glow flex items-center">
              <FontAwesomeIcon icon={faImage} className="mr-2" />
              LOAD
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={handleFileUpload}
                className="w-full cyber-button cyber-border p-3 rounded-lg hover:bg-cyber-primary hover:bg-opacity-20 transition-all"
              >
                <FontAwesomeIcon icon={faUpload} className="mr-2" />
                Upload Images
              </button>
              
              <button
                onClick={loadTestImages}
                className="w-full cyber-button cyber-border p-2 rounded-lg hover:bg-cyber-green hover:bg-opacity-20 transition-all text-sm"
              >
                <FontAwesomeIcon icon={faVial} className="mr-2" />
                Load Test Images
              </button>
            </div>
            
            <div className="text-xs text-cyber-secondary mt-2">
              Select color image + depth map (∂map)
            </div>
          </div>

          {/* Depth Controls */}
          <div className="space-y-6">
            <div className="cyber-border p-4 rounded-lg bg-cyber-bg bg-opacity-50">
              <h3 className="text-lg font-semibold mb-4 text-cyber-green cyber-glow flex items-center">
                <FontAwesomeIcon icon={faAdjust} className="mr-2" />
                DEPTH
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-cyber-primary mb-2 flex justify-between">
                    <span>Scale</span>
                    <span className="text-cyber-yellow">{depthScale.toFixed(2)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    value={depthScale}
                    onChange={(e) => setDepthScale(parseFloat(e.target.value))}
                    className="w-full h-2 bg-cyber-bg rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-cyber-primary mb-2 flex justify-between">
                    <span>Sensitivity</span>
                    <span className="text-cyber-yellow">{sensitivity.toFixed(2)}</span>
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={sensitivity}
                    onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                    className="w-full h-2 bg-cyber-bg rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div>
                  <label className="block text-sm text-cyber-primary mb-2 flex justify-between">
                    <span>Background Dampening</span>
                    <span className="text-cyber-yellow">{backgroundDampening.toFixed(2)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={backgroundDampening}
                    onChange={(e) => setBackgroundDampening(parseFloat(e.target.value))}
                    className="w-full h-2 bg-cyber-bg rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-cyber-primary mb-2 flex justify-between">
                    <span>Midground Dampening</span>
                    <span className="text-cyber-yellow">{midgroundDampening.toFixed(2)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={midgroundDampening}
                    onChange={(e) => setMidgroundDampening(parseFloat(e.target.value))}
                    className="w-full h-2 bg-cyber-bg rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>

            {/* Display Controls */}
            <div className="cyber-border p-4 rounded-lg bg-cyber-bg bg-opacity-50">
              <h3 className="text-lg font-semibold mb-4 text-cyber-yellow cyber-glow flex items-center">
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                DISPLAY
              </h3>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDepthMap}
                    onChange={(e) => setShowDepthMap(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`
                    w-6 h-6 rounded border-2 flex items-center justify-center transition-all
                    ${showDepthMap ? 'bg-cyber-primary border-cyber-primary' : 'border-cyber-primary bg-transparent'}
                  `}>
                    {showDepthMap && <FontAwesomeIcon icon={faLayerGroup} className="text-cyber-bg text-xs" />}
                  </div>
                  <span className="text-cyber-primary">Show Depth Map</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localizedParallax}
                    onChange={(e) => setLocalizedParallax(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`
                    w-6 h-6 rounded border-2 flex items-center justify-center transition-all
                    ${localizedParallax ? 'bg-cyber-green border-cyber-green' : 'border-cyber-green bg-transparent'}
                  `}>
                    {localizedParallax && <FontAwesomeIcon icon={faExpandArrowsAlt} className="text-cyber-bg text-xs" />}
                  </div>
                  <span className="text-cyber-primary">Localized Parallax</span>
                </label>

                {localizedParallax && (
                  <div className="ml-9 mt-2">
                    <label className="block text-sm text-cyber-primary mb-2 flex justify-between">
                      <span>Distance</span>
                      <span className="text-cyber-yellow">{localizeDistance}px</span>
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="300"
                      step="10"
                      value={localizeDistance}
                      onChange={(e) => setLocalizeDistance(parseInt(e.target.value))}
                      className="w-full h-2 bg-cyber-bg rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                )}

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={animateSlideTransitions}
                    onChange={(e) => setAnimateSlideTransitions(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`
                    w-6 h-6 rounded border-2 flex items-center justify-center transition-all
                    ${animateSlideTransitions ? 'bg-cyber-accent border-cyber-accent' : 'border-cyber-accent bg-transparent'}
                  `}>
                    {animateSlideTransitions && <FontAwesomeIcon icon={faPlay} className="text-cyber-bg text-xs" />}
                  </div>
                  <span className="text-cyber-primary">Animate Transitions</span>
                </label>

                {animateSlideTransitions && (
                  <div className="ml-9 mt-2">
                    <label className="block text-sm text-cyber-primary mb-2 flex justify-between">
                      <span>Timing</span>
                      <span className="text-cyber-yellow">{animationTiming}ms</span>
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      step="100"
                      value={animationTiming}
                      onChange={(e) => setAnimationTiming(parseInt(e.target.value))}
                      className="w-full h-2 bg-cyber-bg rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Drag Controls */}
            <div className="cyber-border p-4 rounded-lg bg-cyber-bg bg-opacity-50">
              <h3 className="text-lg font-semibold mb-4 text-cyber-primary cyber-glow flex items-center">
                <FontAwesomeIcon icon={faMousePointer} className="mr-2" />
                DRAG
              </h3>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={symmetricalDrag}
                    onChange={(e) => setSymmetricalDrag(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`
                    w-6 h-6 rounded border-2 flex items-center justify-center transition-all
                    ${symmetricalDrag ? 'bg-cyber-primary border-cyber-primary' : 'border-cyber-primary bg-transparent'}
                  `}>
                    {symmetricalDrag && <FontAwesomeIcon icon={faRandom} className="text-cyber-bg text-xs" />}
                  </div>
                  <span className="text-cyber-primary">Symmetrical Drag</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={invertDepthLogic}
                    onChange={(e) => setInvertDepthLogic(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`
                    w-6 h-6 rounded border-2 flex items-center justify-center transition-all
                    ${invertDepthLogic ? 'bg-cyber-yellow border-cyber-yellow' : 'border-cyber-yellow bg-transparent'}
                  `}>
                    {invertDepthLogic && <FontAwesomeIcon icon={faSync} className="text-cyber-bg text-xs" />}
                  </div>
                  <span className="text-cyber-primary">Invert Depth Logic</span>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={invertX}
                      onChange={(e) => setInvertX(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                      ${invertX ? 'bg-cyber-green border-cyber-green' : 'border-cyber-green bg-transparent'}
                    `}>
                      {invertX && <FontAwesomeIcon icon={faArrowsAltH} className="text-cyber-bg text-xs" />}
                    </div>
                    <span className="text-cyber-primary text-sm">Invert X</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lockX}
                      onChange={(e) => setLockX(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                      ${lockX ? 'bg-cyber-accent border-cyber-accent' : 'border-cyber-accent bg-transparent'}
                    `}>
                      {lockX && <FontAwesomeIcon icon={faLock} className="text-cyber-bg text-xs" />}
                    </div>
                    <span className="text-cyber-primary text-sm">Lock X</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={invertY}
                      onChange={(e) => setInvertY(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                      ${invertY ? 'bg-cyber-green border-cyber-green' : 'border-cyber-green bg-transparent'}
                    `}>
                      {invertY && <FontAwesomeIcon icon={faArrowsAltV} className="text-cyber-bg text-xs" />}
                    </div>
                    <span className="text-cyber-primary text-sm">Invert Y</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lockY}
                      onChange={(e) => setLockY(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                      ${lockY ? 'bg-cyber-accent border-cyber-accent' : 'border-cyber-accent bg-transparent'}
                    `}>
                      {lockY && <FontAwesomeIcon icon={faLock} className="text-cyber-bg text-xs" />}
                    </div>
                    <span className="text-cyber-primary text-sm">Lock Y</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Device Controls */}
            <div className="cyber-border p-4 rounded-lg bg-cyber-bg bg-opacity-50">
              <h3 className="text-lg font-semibold mb-4 text-cyber-accent cyber-glow flex items-center">
                <FontAwesomeIcon icon={faMobile} className="mr-2" />
                DEVICE
              </h3>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gyroEnabled}
                    onChange={(e) => setGyroEnabled(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`
                    w-6 h-6 rounded border-2 flex items-center justify-center transition-all
                    ${gyroEnabled ? 'bg-cyber-accent border-cyber-accent' : 'border-cyber-accent bg-transparent'}
                  `}>
                    {gyroEnabled && <FontAwesomeIcon icon={faSync} className="text-cyber-bg text-xs" />}
                  </div>
                  <span className="text-cyber-primary">Gyroscope Control</span>
                </label>

                {gyroEnabled && (
                  <div className="ml-9 space-y-3">
                    <div>
                      <label className="block text-sm text-cyber-primary mb-2 flex justify-between">
                        <span>Horizontal</span>
                        <span className="text-cyber-yellow">{gyroHorizontal.toFixed(2)}</span>
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="3"
                        step="0.1"
                        value={gyroHorizontal}
                        onChange={(e) => setGyroHorizontal(parseFloat(e.target.value))}
                        className="w-full h-2 bg-cyber-bg rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-cyber-primary mb-2 flex justify-between">
                        <span>Vertical</span>
                        <span className="text-cyber-yellow">{gyroVertical.toFixed(2)}</span>
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="3"
                        step="0.1"
                        value={gyroVertical}
                        onChange={(e) => setGyroVertical(parseFloat(e.target.value))}
                        className="w-full h-2 bg-cyber-bg rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center space-x-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={gyroInvertX}
                          onChange={(e) => setGyroInvertX(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`
                          w-4 h-4 rounded border flex items-center justify-center transition-all
                          ${gyroInvertX ? 'bg-cyber-green border-cyber-green' : 'border-cyber-green bg-transparent'}
                        `}>
                          {gyroInvertX && <FontAwesomeIcon icon={faArrowsAltH} className="text-cyber-bg text-xs" />}
                        </div>
                        <span className="text-cyber-primary text-xs">Inv X</span>
                      </label>

                      <label className="flex items-center space-x-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={gyroLockX}
                          onChange={(e) => setGyroLockX(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`
                          w-4 h-4 rounded border flex items-center justify-center transition-all
                          ${gyroLockX ? 'bg-cyber-accent border-cyber-accent' : 'border-cyber-accent bg-transparent'}
                        `}>
                          {gyroLockX && <FontAwesomeIcon icon={faLock} className="text-cyber-bg text-xs" />}
                        </div>
                        <span className="text-cyber-primary text-xs">Lock X</span>
                      </label>

                      <label className="flex items-center space-x-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={gyroInvertY}
                          onChange={(e) => setGyroInvertY(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`
                          w-4 h-4 rounded border flex items-center justify-center transition-all
                          ${gyroInvertY ? 'bg-cyber-green border-cyber-green' : 'border-cyber-green bg-transparent'}
                        `}>
                          {gyroInvertY && <FontAwesomeIcon icon={faArrowsAltV} className="text-cyber-bg text-xs" />}
                        </div>
                        <span className="text-cyber-primary text-xs">Inv Y</span>
                      </label>

                      <label className="flex items-center space-x-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={gyroLockY}
                          onChange={(e) => setGyroLockY(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`
                          w-4 h-4 rounded border flex items-center justify-center transition-all
                          ${gyroLockY ? 'bg-cyber-accent border-cyber-accent' : 'border-cyber-accent bg-transparent'}
                        `}>
                          {gyroLockY && <FontAwesomeIcon icon={faLock} className="text-cyber-bg text-xs" />}
                        </div>
                        <span className="text-cyber-primary text-xs">Lock Y</span>
                      </label>
                    </div>

                    <button className="w-full cyber-button cyber-border p-2 rounded-lg hover:bg-cyber-accent hover:bg-opacity-20 transition-all text-sm">
                      <FontAwesomeIcon icon={faCrosshairs} className="mr-2" />
                      Center
                    </button>
                  </div>
                )}

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={swipeSlideAdvance}
                    onChange={(e) => setSwipeSlideAdvance(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`
                    w-6 h-6 rounded border-2 flex items-center justify-center transition-all
                    ${swipeSlideAdvance ? 'bg-cyber-green border-cyber-green' : 'border-cyber-green bg-transparent'}
                  `}>
                    {swipeSlideAdvance && <FontAwesomeIcon icon={faStepForward} className="text-cyber-bg text-xs" />}
                  </div>
                  <span className="text-cyber-primary">Swipe Advance</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={numpadAnimation}
                    onChange={(e) => setNumpadAnimation(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`
                    w-6 h-6 rounded border-2 flex items-center justify-center transition-all
                    ${numpadAnimation ? 'bg-cyber-primary border-cyber-primary' : 'border-cyber-primary bg-transparent'}
                  `}>
                    {numpadAnimation && <FontAwesomeIcon icon={faGamepad} className="text-cyber-bg text-xs" />}
                  </div>
                  <span className="text-cyber-primary">Numpad Control</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Toast Notification */}
      {toast && (
        <div className={`
          fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50
          px-6 py-3 rounded-lg cyber-border max-w-md
          ${toast.type === 'success' ? 'bg-cyber-green bg-opacity-20 border-cyber-green' :
            toast.type === 'error' ? 'bg-red-500 bg-opacity-20 border-red-500' :
            'bg-cyber-primary bg-opacity-20 border-cyber-primary'}
        `}>
          <div className="text-center">{toast.message}</div>
        </div>
      )}
    </div>
  );
}

export default App;
