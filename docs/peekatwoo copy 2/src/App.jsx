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
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
import DepthViewer from './components/DepthViewer.jsx';

function App() {
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [depthScale, setDepthScale] = useState(1.0);
  const [sensitivity, setSensitivity] = useState(1.0);
  const [showDepthMap, setShowDepthMap] = useState(false);
  const [localizedParallax, setLocalizedParallax] = useState(false);
  const [gyroEnabled, setGyroEnabled] = useState(false);
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
            
            <button
              onClick={handleFileUpload}
              className="w-full cyber-button cyber-border p-3 rounded-lg hover:bg-cyber-primary hover:bg-opacity-20 transition-all"
            >
              <FontAwesomeIcon icon={faUpload} className="mr-2" />
              Upload Images
            </button>
            
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
              </div>
            </div>

            {/* Device Controls */}
            <div className="cyber-border p-4 rounded-lg bg-cyber-bg bg-opacity-50">
              <h3 className="text-lg font-semibold mb-4 text-cyber-accent cyber-glow flex items-center">
                <FontAwesomeIcon icon={faMagic} className="mr-2" />
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
