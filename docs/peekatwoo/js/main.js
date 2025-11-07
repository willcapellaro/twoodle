/**
 * Main application logic for Simple Depth Viewer
 */
class DepthViewerApp {
    constructor() {
        this.viewer = null;
        this.colorFile = null;
        this.depthFile = null;
        
        this.initializeElements();
        this.setupEventListeners();
    }
    
    initializeElements() {
        // UI elements
        this.imageInput = document.getElementById('imageInput');
        this.viewerElement = document.getElementById('viewerElement');
        this.toastContainer = document.getElementById('toastContainer');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.viewModeBtn = document.getElementById('viewModeBtn');
        this.controlsToggle = document.getElementById('controlsToggle');
        this.controlsPanel = document.getElementById('controlsPanel');
        this.closePanelBtn = document.getElementById('closePanelBtn');
        this.dragOverlay = document.getElementById('dragOverlay');
        
        // Control inputs
        this.depthScaleSlider = document.getElementById('depthScale');
        this.depthScaleValue = document.getElementById('depthScaleValue');
        this.sensitivitySlider = document.getElementById('sensitivity');
        this.sensitivityValue = document.getElementById('sensitivityValue');
        
        // Localized parallax controls
        this.localizedParallaxCheckbox = document.getElementById('localizedParallax');
        this.localizeDistanceSlider = document.getElementById('localizeDistance');
        this.localizeDistanceValue = document.getElementById('localizeDistanceValue');
        this.distanceCircle = document.getElementById('distanceCircle');
        
        // Symmetrical drag controls
        this.symmetricalDragCheckbox = document.getElementById('symmetricalDrag');
        
        // Slideshow controls
        this.prevImageBtn = document.getElementById('prevImageBtn');
        this.nextImageBtn = document.getElementById('nextImageBtn');
        
        // Auto focus controls
        this.invertDepthLogicCheckbox = document.getElementById('invertDepthLogic');
        
        // Drag controls
        this.invertXCheckbox = document.getElementById('invertX');
        this.lockXCheckbox = document.getElementById('lockX');
        this.invertYCheckbox = document.getElementById('invertY');
        this.lockYCheckbox = document.getElementById('lockY');
        
        // Display controls
        this.displayDepthmapCheckbox = document.getElementById('displayDepthmap');
        
        // Swipe controls
        this.swipeSlideAdvanceCheckbox = document.getElementById('swipeSlideAdvance');
        
        // Animation controls
        this.animateSlideTransitionsCheckbox = document.getElementById('animateSlideTransitions');
        this.animationTimingSlider = document.getElementById('animationTiming');
        this.animationTimingValue = document.getElementById('animationTimingValue');
        
        // Dampening controls
        this.backgroundDampeningSlider = document.getElementById('backgroundDampening');
        this.backgroundDampeningValue = document.getElementById('backgroundDampeningValue');
        this.midgroundDampeningSlider = document.getElementById('midgroundDampening');
        this.midgroundDampeningValue = document.getElementById('midgroundDampeningValue');
        
        // Gyroscope controls
        this.gyroscopeEnabledCheckbox = document.getElementById('gyroscopeEnabled');
        this.gyroHorizontalSlider = document.getElementById('gyroHorizontal');
        this.gyroHorizontalValue = document.getElementById('gyroHorizontalValue');
        this.gyroVerticalSlider = document.getElementById('gyroVertical');
        this.gyroVerticalValue = document.getElementById('gyroVerticalValue');
        this.gyroInvertXCheckbox = document.getElementById('gyroInvertX');
        this.gyroLockXCheckbox = document.getElementById('gyroLockX');
        this.gyroInvertYCheckbox = document.getElementById('gyroInvertY');
        this.gyroLockYCheckbox = document.getElementById('gyroLockY');
        this.gyroCenterBtn = document.getElementById('gyroCenterBtn');
        
        // Numpad controls
        this.numpadAnimationCheckbox = document.getElementById('numpadAnimation');
        
        // Gyroscope debug display elements
        this.gyroDebugInfo = document.getElementById('gyroDebugInfo');
        this.gyroAlphaValue = document.getElementById('gyroAlphaValue');
        this.gyroBetaValue = document.getElementById('gyroBetaValue');
        this.gyroGammaValue = document.getElementById('gyroGammaValue');
        this.gyroProcessedX = document.getElementById('gyroProcessedX');
        this.gyroProcessedY = document.getElementById('gyroProcessedY');
        
        // Cheat code elements
        this.cheatBtn1 = document.getElementById('cheatBtn1');
        this.cheatBtn2 = document.getElementById('cheatBtn2');
        this.cheatBtn3 = document.getElementById('cheatBtn3');
        this.cheatBtn4 = document.getElementById('cheatBtn4');
        this.cheatDisplay = document.getElementById('cheatDisplay');
        
        // Control sync elements
        this.checkSyncBtn = document.getElementById('checkSyncBtn');
        this.forceSyncBtn = document.getElementById('forceSyncBtn');
        this.syncStatus = document.getElementById('syncStatus');
        
        // Zoom control
        this.trackpadZoomCheckbox = document.getElementById('trackpadZoom');
        
        // Toast opacity control
        this.toastOpacitySlider = document.getElementById('toastOpacity');
        this.toastOpacityValue = document.getElementById('toastOpacityValue');
        
        // Depth map selector controls
        this.depthMapSelectorGroup = document.getElementById('depthMapSelectorGroup');
        this.depthMapSelector = document.getElementById('depthMapSelector');
        
        // Dynamic image loading
        this.sampleImages = [];
        this.hiddenImages = [];
        this.currentImageSet = 'sample'; // 'sample' or 'hidden'
        this.currentImageIndex = 0;
        
        // Cheat code system
        this.cheatSequence = [];
        this.maxCheatLength = 8;
        
        // Mode buttons
        this.stickyBtn = document.querySelector('[data-drag-mode="sticky"]');
        this.rubberBandBtn = document.querySelector('[data-drag-mode="rubber-band"]');
        
        // Initialize viewer with fullscreen dimensions
        this.viewer = new SimpleDepthViewer(this.viewerElement, {
            depthScale: 1.0,
            focus: 0.5,
            quality: 3
        });
        
        this.sensitivity = 1.0;
        this.currentViewMode = 'fit';
        this.currentDragMode = 'sticky';
        
        // Zoom properties
        this.trackpadZoomEnabled = false;
        this.zoomScale = 1.0;
        this.minZoom = 0.5;
        this.maxZoom = 3.0;
        
        // Animation properties
        this.animateSlideTransitions = true;
        this.animationTiming = 500;
        this.isSlideAnimating = false;
        
        // Symmetrical drag property
        this.symmetricalDrag = false;
        
        // Load saved settings
        this.loadSettings();
        
        // Initialize localized parallax state
        this.updateLocalizedParallaxState();
        
        // Set up viewer callbacks
        this.viewer.onAutoFocusChange = (focusType) => {
            this.highlightAutoFocus(focusType);
        };
        
        this.viewer.onDepthmapToggle = (enabled) => {
            this.displayDepthmapCheckbox.checked = enabled;
        };
        
        this.viewer.onSlideChange = (direction) => {
            if (direction === 'next') {
                this.nextImage();
            } else if (direction === 'previous') {
                this.previousImage();
            }
        };
        
        this.viewer.onGyroscopeData = (alpha, beta, gamma, processedX, processedY) => {
            this.updateGyroscopeDebugDisplay(alpha, beta, gamma, processedX, processedY);
        };
        
        // Initialize image loading
        this.loadImageSets();
        
        console.log('DepthViewerApp initialized with dynamic image loading');
        console.log(' Mobile improvements: Better scrolling, close button, tap-to-dismiss');
        console.log('🌐 Server URL: http://127.0.0.1:5501/index.html should work!');
        console.log('Cache-busting: v4.3 - Removed darkening scrim/backdrop completely'); // Cache buster
    }
    
    setupEventListeners() {
        // File upload
        this.imageInput.addEventListener('change', (event) => {
            this.handleImageUploads(Array.from(event.target.files));
        });
        
        this.uploadBtn.addEventListener('click', () => {
            this.imageInput.click();
        });
        
        // View mode toggle
        this.viewModeBtn.addEventListener('click', () => {
            this.toggleViewMode();
        });
        
        // Controls panel toggle
        this.controlsToggle.addEventListener('click', () => {
            this.toggleControlsPanel();
        });
        
        // Close panel button
        this.closePanelBtn.addEventListener('click', () => {
            this.toggleControlsPanel();
        });
        
        // Collapsible section handlers
        this.setupCollapsibleSections();
        
        // Panel backdrop - no auto-dismiss, just visual overlay
        
        // Depth controls
        this.depthScaleSlider.addEventListener('input', (e) => {
            this.viewer.setOptions({ depthScale: parseFloat(e.target.value) });
            this.depthScaleValue.textContent = parseFloat(e.target.value).toFixed(1);
            
            // Deactivate preset buttons when manually changing depth scale
            document.querySelectorAll('[data-preset]').forEach(b => b.classList.remove('active'));
            
            this.saveSettings();
        });
        
        this.sensitivitySlider.addEventListener('input', (e) => {
            this.sensitivity = parseFloat(e.target.value);
            this.sensitivityValue.textContent = this.sensitivity.toFixed(1);
            this.viewer.setOptions({ sensitivity: this.sensitivity });
            this.saveSettings();
        });
        
        // Focus buttons
        document.querySelectorAll('[data-focus]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-focus]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const focusValue = e.target.dataset.focus;
                if (focusValue === 'auto') {
                    this.viewer.setOptions({ autoFocus: true });
                } else {
                    this.viewer.setOptions({ 
                        autoFocus: false,
                        focus: parseFloat(focusValue) 
                    });
                }
                this.updateLocalizedParallaxState();
                this.saveSettings();
            });
        });
        
        // Drag mode buttons
        document.querySelectorAll('[data-drag-mode]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-drag-mode]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentDragMode = e.target.dataset.dragMode;
                this.viewer.setInteractionMode('drag', e.target.dataset.dragMode);
                this.updateLocalizedParallaxState();
                this.saveSettings();
            });
        });
        
        // Localized parallax controls
        this.localizedParallaxCheckbox.addEventListener('change', (e) => {
            this.viewer.setOptions({ localizedParallax: e.target.checked });
            this.updateLocalizedParallaxState();
            
            // Update symmetry compatibility when localized parallax changes
            const images = this.getCurrentImages();
            const imageSet = images[this.currentImageIndex];
            if (imageSet) {
                this.updateSymmetryCompatibility(imageSet.name);
            }
            
            this.saveSettings();
        });
        
        this.localizeDistanceSlider.addEventListener('input', (e) => {
            const distance = parseInt(e.target.value);
            this.localizeDistanceValue.textContent = distance + 'px';
            this.viewer.setOptions({ localizeDistance: distance });
            this.showDistanceCircle(distance);
            this.saveSettings();
        });
        
        this.localizeDistanceSlider.addEventListener('mousedown', () => {
            this.showDistanceCircle(parseInt(this.localizeDistanceSlider.value));
        });
        
        this.localizeDistanceSlider.addEventListener('mouseup', () => {
            this.hideDistanceCircle();
        });
        
        this.localizeDistanceSlider.addEventListener('mouseleave', () => {
            this.hideDistanceCircle();
        });
        
        // Add additional circle clearing events to prevent stuck circles
        this.localizeDistanceSlider.addEventListener('blur', () => {
            this.hideDistanceCircle();
        });
        
        // Hide circle when clicking elsewhere
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#localizeDistance') && !e.target.closest('#distanceCircle')) {
                this.hideDistanceCircle();
            }
        });
        
        // Symmetrical drag control
        this.symmetricalDragCheckbox.addEventListener('change', (e) => {
            // Re-check current image compatibility when toggling
            const images = this.getCurrentImages();
            const imageSet = images[this.currentImageIndex];
            if (imageSet) {
                this.updateSymmetryCompatibility(imageSet.name);
            }
            this.saveSettings();
            console.log(`🪞 Symmetrical drag ${e.target.checked ? 'enabled' : 'disabled'}`);
        });
        
        // Numpad animation control
        this.numpadAnimationCheckbox.addEventListener('change', (e) => {
            this.numpadAnimationEnabled = e.target.checked;
            this.saveSettings();
            console.log(`🎮 Numpad animation ${e.target.checked ? 'enabled' : 'disabled'}`);
        });
        
        // Control sync checker
        this.checkSyncBtn.addEventListener('click', () => {
            this.checkControlSync();
        });
        
        this.forceSyncBtn.addEventListener('click', () => {
            this.forceSynchronizeControls();
        });
        
        // Trackpad zoom control
        this.trackpadZoomCheckbox.addEventListener('change', (e) => {
            this.trackpadZoomEnabled = e.target.checked;
            if (this.trackpadZoomEnabled) {
                this.setupZoomListeners();
                this.showStatus('Trackpad zoom enabled. Use trackpad scroll to zoom in/out.', 'info');
            } else {
                this.removeZoomListeners();
                this.resetZoom();
                this.showStatus('Trackpad zoom disabled.', 'info');
            }
            this.saveSettings();
        });
        
        // Slideshow controls
        this.prevImageBtn.addEventListener('click', () => {
            this.previousImage();
        });
        
        this.nextImageBtn.addEventListener('click', () => {
            this.nextImage();
        });
        
        // Auto focus controls
        this.invertDepthLogicCheckbox.addEventListener('change', (e) => {
            this.viewer.setOptions({ invertDepthLogic: e.target.checked });
            this.saveSettings();
        });
        
        // Drag controls
        this.invertXCheckbox.addEventListener('change', (e) => {
            this.viewer.setOptions({ invertX: e.target.checked });
            this.saveSettings();
        });
        
        this.lockXCheckbox.addEventListener('change', (e) => {
            this.viewer.setOptions({ lockX: e.target.checked });
            this.saveSettings();
        });
        
        this.invertYCheckbox.addEventListener('change', (e) => {
            this.viewer.setOptions({ invertY: e.target.checked });
            this.saveSettings();
        });
        
        this.lockYCheckbox.addEventListener('change', (e) => {
            this.viewer.setOptions({ lockY: e.target.checked });
            this.saveSettings();
        });
        
        // Display controls
        this.displayDepthmapCheckbox.addEventListener('change', (e) => {
            this.viewer.setOptions({ displayDepthmap: e.target.checked });
            this.saveSettings();
        });
        
        // Swipe controls
        this.swipeSlideAdvanceCheckbox.addEventListener('change', (e) => {
            this.viewer.setOptions({ swipeSlideAdvance: e.target.checked });
            this.saveSettings();
        });
        
        // Animation controls
        this.animateSlideTransitionsCheckbox.addEventListener('change', (e) => {
            this.animateSlideTransitions = e.target.checked;
            this.saveSettings();
            console.log(`🎬 Slide animations ${e.target.checked ? 'enabled' : 'disabled'}`);
        });
        
        this.animationTimingSlider.addEventListener('input', (e) => {
            const timing = parseInt(e.target.value);
            this.animationTimingValue.textContent = timing + 'ms';
            this.animationTiming = timing;
            this.saveSettings();
        });
        
        // Dampening controls
        this.backgroundDampeningSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.backgroundDampeningValue.textContent = value.toFixed(1);
            this.viewer.setOptions({ backgroundDampening: value });
            this.saveSettings();
        });
        
        this.midgroundDampeningSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.midgroundDampeningValue.textContent = value.toFixed(1);
            this.viewer.setOptions({ midgroundDampening: value });
            this.saveSettings();
        });
        
        // Gyroscope controls
        this.gyroscopeEnabledCheckbox.addEventListener('change', async (e) => {
            const enabled = e.target.checked;
            if (enabled) {
                const result = await this.viewer.enableGyroscope();
                if (!result) {
                    // Revert checkbox if gyroscope failed to enable
                    this.gyroscopeEnabledCheckbox.checked = false;
                    this.gyroDebugInfo.style.display = 'none';
                } else {
                    // Show debug info when gyroscope is successfully enabled
                    this.gyroDebugInfo.style.display = 'block';
                }
            } else {
                this.viewer.disableGyroscope();
                this.gyroDebugInfo.style.display = 'none';
            }
            this.saveSettings();
        });
        
        this.gyroHorizontalSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.gyroHorizontalValue.textContent = value.toFixed(1);
            this.viewer.setOptions({ gyroHorizontal: value });
            this.saveSettings();
        });
        
        this.gyroVerticalSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.gyroVerticalValue.textContent = value.toFixed(1);
            this.viewer.setOptions({ gyroVertical: value });
            this.saveSettings();
        });
        
        this.gyroInvertXCheckbox.addEventListener('change', (e) => {
            this.viewer.setOptions({ gyroInvertX: e.target.checked });
            this.saveSettings();
        });
        
        this.gyroLockXCheckbox.addEventListener('change', (e) => {
            this.viewer.setOptions({ gyroLockX: e.target.checked });
            this.saveSettings();
        });
        
        this.gyroInvertYCheckbox.addEventListener('change', (e) => {
            this.viewer.setOptions({ gyroInvertY: e.target.checked });
            this.saveSettings();
        });
        
        this.gyroLockYCheckbox.addEventListener('change', (e) => {
            this.viewer.setOptions({ gyroLockY: e.target.checked });
            this.saveSettings();
        });
        
        this.gyroCenterBtn.addEventListener('click', () => {
            this.viewer.centerGyroscope();
        });
        
        // Toast opacity control
        this.toastOpacitySlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.toastOpacityValue.textContent = value.toFixed(1);
            // Update toast container opacity
            this.toastContainer.style.opacity = value;
            this.saveSettings();
        });
        
        // Depth map selector
        document.querySelectorAll('[data-depth-map]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active button
                document.querySelectorAll('[data-depth-map]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Switch depth map
                this.switchDepthMap(e.target.dataset.depthMap);
            });
        });
        
        // Preset buttons
        document.querySelectorAll('[data-preset]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-preset]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.applyPreset(e.target.dataset.preset);
                this.saveSettings();
            });
        });
        
        // Cheat code button listeners
        this.cheatBtn1.addEventListener('click', () => this.addCheatInput(1));
        this.cheatBtn2.addEventListener('click', () => this.addCheatInput(2));
        this.cheatBtn3.addEventListener('click', () => this.addCheatInput(3));
        this.cheatBtn4.addEventListener('click', () => this.addCheatInput(4));
        
        // Cheat sequence submit (click the display)
        this.cheatDisplay.parentElement.addEventListener('click', () => this.submitCheatSequence());
        
        // Keyboard controls
        this.setupKeyboardControls();
        
        // Drag and drop
        this.setupDragAndDrop();
        
        // Auto-load test images on page load (now dynamic)
        setTimeout(() => {
            this.loadCurrentImageSet();
        }, 500);
    }
    
    setupCollapsibleSections() {
        // Handle section toggles
        document.querySelectorAll('.section-header[data-toggle]').forEach(header => {
            header.addEventListener('click', () => {
                const targetId = header.getAttribute('data-toggle');
                const content = document.getElementById(targetId);
                const arrow = header.querySelector('span');
                
                if (content) {
                    const isExpanded = content.style.display !== 'none';
                    content.style.display = isExpanded ? 'none' : 'block';
                    arrow.textContent = isExpanded ? '▶ ' + arrow.textContent.substring(2) : '▼ ' + arrow.textContent.substring(2);
                    
                    // Save state to localStorage
                    this.saveSectionStates();
                }
            });
        });
        
        // Load section states from localStorage
        this.loadSectionStates();
    }
    
    loadSectionStates() {
        const sectionStates = JSON.parse(localStorage.getItem('sectionStates')) || {};
        
        // Default all sections to expanded on first load
        const defaultSections = {
            'main-section': true,
            'interactions-section': true,
            'gyroscope-section': true,
            'cheat-section': true
        };
        
        // Merge with saved states
        const finalStates = { ...defaultSections, ...sectionStates };
        
        // Apply states to sections
        Object.entries(finalStates).forEach(([sectionId, isExpanded]) => {
            const content = document.getElementById(sectionId);
            const header = document.querySelector(`[data-toggle="${sectionId}"]`);
            
            if (content && header) {
                const arrow = header.querySelector('span');
                content.style.display = isExpanded ? 'block' : 'none';
                if (arrow) {
                    const sectionName = arrow.textContent.substring(2);
                    arrow.textContent = (isExpanded ? '▼ ' : '▶ ') + sectionName;
                }
            }
        });
    }
    
    saveSectionStates() {
        const sectionStates = {};
        
        document.querySelectorAll('.section-content').forEach(content => {
            sectionStates[content.id] = content.style.display !== 'none';
        });
        
        localStorage.setItem('sectionStates', JSON.stringify(sectionStates));
    }
    
    setupKeyboardControls() {
        // Track key states
        this.keysPressed = new Set();
        this.isSpaceHeld = false;
        this.numpadAnimationEnabled = true; // Default enabled
        
        // Keydown handler
        document.addEventListener('keydown', (e) => {
            // Prevent default for keys we handle
            if (['Space', 'KeyC', 'ArrowLeft', 'ArrowRight', 'Numpad1', 'Numpad2', 'Numpad3', 'Numpad4', 'Numpad5', 'Numpad6', 'Numpad7', 'Numpad8', 'Numpad9'].includes(e.code)) {
                e.preventDefault();
            }
            
            this.keysPressed.add(e.code);
            
            // Handle space key for temporary localized parallax toggle
            if (e.code === 'Space' && !this.isSpaceHeld) {
                this.isSpaceHeld = true;
                this.handleSpaceToggle(true);
            }
            
            // Handle single-press keys
            if (!e.repeat) {
                switch(e.code) {
                    case 'KeyC':
                        console.log('🎛️ C key pressed - toggling controls panel');
                        this.toggleControlsPanel();
                        break;
                    case 'ArrowLeft':
                        this.previousImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                    case 'Numpad1':
                        this.handleNumpadDrag(-1, 1); // Bottom-left
                        break;
                    case 'Numpad2':
                        this.handleNumpadDrag(0, 1); // Bottom
                        break;
                    case 'Numpad3':
                        this.handleNumpadDrag(1, 1); // Bottom-right
                        break;
                    case 'Numpad4':
                        this.handleNumpadDrag(-1, 0); // Left
                        break;
                    case 'Numpad5':
                        this.handleNumpadCenter(); // Center
                        break;
                    case 'Numpad6':
                        this.handleNumpadDrag(1, 0); // Right
                        break;
                    case 'Numpad7':
                        this.handleNumpadDrag(-1, -1); // Top-left
                        break;
                    case 'Numpad8':
                        this.handleNumpadDrag(0, -1); // Top
                        break;
                    case 'Numpad9':
                        this.handleNumpadDrag(1, -1); // Top-right
                        break;
                }
            }
        });
        
        // Keyup handler
        document.addEventListener('keyup', (e) => {
            this.keysPressed.delete(e.code);
            
            // Handle space key release
            if (e.code === 'Space' && this.isSpaceHeld) {
                this.isSpaceHeld = false;
                this.handleSpaceToggle(false);
            }
        });
        
        // Handle window blur to reset key states
        window.addEventListener('blur', () => {
            this.keysPressed.clear();
            if (this.isSpaceHeld) {
                this.isSpaceHeld = false;
                this.handleSpaceToggle(false);
            }
        });
    }
    
    handleSpaceToggle(isPressed) {
        // Temporarily toggle localized parallax setting for pointer events
        if (this.viewer) {
            const currentSetting = this.localizedParallaxCheckbox.checked;
            const tempSetting = isPressed ? !currentSetting : currentSetting;
            
            // Apply temporary setting without updating UI checkbox
            this.viewer.setOptions({ 
                localizedParallax: tempSetting,
                tempParallaxOverride: isPressed
            });
            
            console.log(`🎯 Space ${isPressed ? 'pressed' : 'released'}: Localized parallax temporarily ${tempSetting ? 'enabled' : 'disabled'}`);
        }
    }
    
    handleNumpadDrag(x, y) {
        if (!this.viewer) return;
        
        // Get drag mode setting
        const dragMode = document.querySelector('[data-drag-mode].active')?.dataset.dragMode || 'sticky';
        
        // Calculate drag amount (from center to direction)
        const dragAmount = 100; // Base drag distance
        const dragX = x * dragAmount;
        const dragY = y * dragAmount;
        
        console.log(`🎮 Numpad drag: (${x}, ${y}) -> (${dragX}, ${dragY}), mode: ${dragMode}, localized: NEVER`);
        
        // Apply numpad drag with animation - NEVER use localized parallax for numpad
        this.viewer.setNumpadDrag(dragX, dragY, {
            dragMode: dragMode,
            localizedParallax: false, // Numpad should never use localized parallax
            animate: this.numpadAnimationEnabled,
            animationDuration: 500
        });
    }
    
    handleNumpadCenter() {
        if (!this.viewer) return;
        
        const dragMode = document.querySelector('[data-drag-mode].active')?.dataset.dragMode || 'sticky';
        
        // Only center if in sticky mode
        if (dragMode === 'sticky') {
            console.log('🎮 Numpad center: Resetting to center position');
            this.viewer.setNumpadDrag(0, 0, {
                dragMode: dragMode,
                animate: this.numpadAnimationEnabled,
                animationDuration: 500
            });
        }
    }
    
    // Dynamic image loading methods
    async loadImageSets() {
        try {
            console.log('🔄 Starting image set loading...');
            
            // Load sample images
            this.sampleImages = await this.scanImageFolder('./sample-images/');
            console.log(`✅ Loaded ${this.sampleImages.length} sample image pairs:`, this.sampleImages);
            
            // Load hidden images
            this.hiddenImages = await this.scanImageFolder('./sample-images/hidden-images/');
            console.log(`✅ Loaded ${this.hiddenImages.length} hidden image pairs:`, this.hiddenImages);
            
        } catch (error) {
            console.error('Error loading image sets:', error);
            // Fallback to hardcoded landing-pig
            console.log('🔄 Using fallback hardcoded images...');
            this.sampleImages = [
                {
                    name: 'Landing Pig',
                    colorImage: './sample-images/landing-pig.jpeg',
                    depthMap: './sample-images/landing-pig-∂map.png'
                }
            ];
            this.hiddenImages = [];
        }
    }
    
    async scanImageFolder(folderPath) {
        const images = [];
        
        try {
            // Define image sets based on actual file structure
            if (folderPath.includes('hidden-images')) {
                // Hidden images set with symmetry and alternative depth maps
                const hiddenImagePairs = [
                    { base: 'astrobutt-color-symH', colorExt: '.jpeg', depthExt: '.jpg' },
                    { base: 'basketballcard', colorExt: '.jpeg', depthExt: '.jpg' },
                    { base: 'bennalee-symH', colorExt: '.jpeg', depthExt: '.png' },
                    { base: 'callawile-symH', colorExt: '.jpeg', depthExt: '.png' },
                    { base: 'clerra-symH', colorExt: '.jpeg', depthExt: '.png' },
                    { base: 'eeleeen-symH', colorExt: '.jpeg', depthExt: '.png' },
                    { base: 'ellatan-symH', colorExt: '.png', depthExt: '.png' }, // Has alternative depth maps
                    { base: 'glassbutt2', colorExt: '.jpeg', depthExt: '.png' },
                    { base: 'green-garbage', colorExt: '.jpeg', depthExt: '.png' },
                    { base: 'pulpa-symV', colorExt: '.jpeg', depthExt: '.png' },
                    { base: 'purple-spreader', colorExt: '.jpeg', depthExt: '.png' },
                    { base: 'shoi-symV', colorExt: '.jpeg', depthExt: '.png' },
                    { base: 'swimma', colorExt: '.jpeg', depthExt: '.png' } // Has alternative depth maps
                ];
                
                for (const pair of hiddenImagePairs) {
                    const colorImage = `${folderPath}${pair.base}${pair.colorExt}`;
                    const depthMap = `${folderPath}${pair.base}-∂map${pair.depthExt}`;
                    
                    if (await this.imageExists(colorImage) && await this.imageExists(depthMap)) {
                        // Check for alternative depth maps
                        const depthMapL = `${folderPath}${pair.base}-∂mapL${pair.depthExt}`;
                        const depthMapD = `${folderPath}${pair.base}-∂mapD${pair.depthExt}`;
                        
                        const alternativeMaps = {};
                        if (await this.imageExists(depthMapL)) alternativeMaps.light = depthMapL;
                        if (await this.imageExists(depthMapD)) alternativeMaps.dark = depthMapD;
                        
                        images.push({
                            name: this.formatImageName(pair.base),
                            colorImage: colorImage,
                            depthMap: depthMap,
                            alternativeMaps: alternativeMaps
                        });
                    }
                }
            } else {
                // Sample images set (landing-pig is the landing/default image)
                const sampleImagePairs = [
                    { base: 'landing-pig', colorExt: '.jpeg', depthExt: '.png' },
                    { base: 'boar2', colorExt: '.jpeg', depthExt: '.png' },
                    { base: 'boar3', colorExt: '.jpeg', depthExt: '.png' },
                    { base: 'boar4', colorExt: '.jpeg', depthExt: '.png' },
                    { base: 'boar5-symH', colorExt: '.jpeg', depthExt: '.png' }
                ];
                
                for (const pair of sampleImagePairs) {
                    const colorImage = `${folderPath}${pair.base}${pair.colorExt}`;
                    const depthMap = `${folderPath}${pair.base}-∂map${pair.depthExt}`;
                    
                    if (await this.imageExists(colorImage) && await this.imageExists(depthMap)) {
                        // Check for alternative depth maps
                        const depthMapL = `${folderPath}${pair.base}-∂mapL${pair.depthExt}`;
                        const depthMapD = `${folderPath}${pair.base}-∂mapD${pair.depthExt}`;
                        
                        const alternativeMaps = {};
                        if (await this.imageExists(depthMapL)) alternativeMaps.light = depthMapL;
                        if (await this.imageExists(depthMapD)) alternativeMaps.dark = depthMapD;
                        
                        images.push({
                            name: this.formatImageName(pair.base),
                            colorImage: colorImage,
                            depthMap: depthMap,
                            alternativeMaps: alternativeMaps
                        });
                    }
                }
            }
            
            return images;
            
        } catch (error) {
            console.error(`Error scanning folder ${folderPath}:`, error);
            return [];
        }
    }
    
    async imageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }
    
    formatImageName(baseName) {
        return baseName
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }
    
    addCheatInput(value) {
        this.cheatSequence.push(value);
        console.log('Cheat input added:', value, 'Current sequence:', this.cheatSequence.join(''));
        
        if (this.cheatSequence.length > this.maxCheatLength) {
            this.cheatSequence = this.cheatSequence.slice(-this.maxCheatLength);
        }
        
        this.updateCheatDisplay();
        
        // Auto-validate when we have 8 digits
        if (this.cheatSequence.length === this.maxCheatLength) {
            console.log('Full sequence entered, validating...');
            this.validateCheatSequence();
        }
    }
    
    submitCheatSequence() {
        console.log('Manual submit clicked, current sequence:', this.cheatSequence.join(''));
        if (this.cheatSequence.length > 0) {
            this.validateCheatSequence();
        }
    }
    
    updateCheatDisplay() {
        const display = Array(this.maxCheatLength).fill('-');
        for (let i = 0; i < this.cheatSequence.length; i++) {
            const pos = Math.max(0, this.maxCheatLength - this.cheatSequence.length) + i;
            display[pos] = this.cheatSequence[i].toString();
        }
        this.cheatDisplay.textContent = display.join(' ');
    }
    
    // Obfuscated validation system
    validateCheatSequence() {
        const currentSeq = this.cheatSequence.join('');
        console.log('Validating sequence:', currentSeq);
        
        if (this.cheatSequence.length < 4) {
            console.log('Sequence too short, need at least 4 digits');
            return;
        }
        
        // Multiple hash functions to obfuscate the actual code
        const hash1 = this.simpleHash(currentSeq);
        const hash2 = this.cyrb53(this.cheatSequence.slice().reverse().join(''));
        const hash3 = this.djb2Hash(this.cheatSequence.map(x => x * 3).join(''));
        
        console.log('Hash values:', { hash1, hash2, hash3 });
        
        // Check against multiple validation paths
        const check1 = hash1 === 2049; // Hash of actual code
        const check2 = hash2 === 1398154073947; // Reverse hash  
        const check3 = hash3 === 193496974; // Modified hash
        const patternCheck = this.validatePattern();
        
        console.log('Validation checks:', { check1, check2, check3, patternCheck });
        
        // Also check for exact sequence match as fallback
        const exactMatch = currentSeq === '12411241';
        
        if (check1 || (check2 && patternCheck) || check3 || exactMatch) {
            console.log('Cheat code validated!');
            this.toggleImageSet();
            this.cheatSequence = [];
            this.updateCheatDisplay();
        } else {
            console.log('Validation failed');
        }
    }
    
    validatePattern() {
        // Additional pattern validation as decoy
        const sum = this.cheatSequence.reduce((a, b) => a + b, 0);
        return sum === 20; // Sum of 12411241
    }
    
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0xffffffff;
        }
        return Math.abs(hash) % 10000;
    }
    
    cyrb53(str, seed = 0) {
        let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
        for (let i = 0, ch; i < str.length; i++) {
            ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
        h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
        return 4294967296 * (2097151 & h2) + (h1>>>0);
    }
    
    djb2Hash(str) {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
        }
        return hash & 0xffffffff;
    }
    
    toggleImageSet() {
        if (this.currentImageSet === 'sample') {
            this.currentImageSet = 'hidden';
            const hiddenCount = this.hiddenImages.length;
            this.showStatus(`Image set changed (${hiddenCount} available)`, 'success');
        } else {
            this.currentImageSet = 'sample';
            const sampleCount = this.sampleImages.length;
            this.showStatus(`Image set changed (${sampleCount} available)`, 'info');
        }
        
        this.currentImageIndex = 0;
        this.loadCurrentImageSet();
    }
    
    getCurrentImages() {
        return this.currentImageSet === 'hidden' ? this.hiddenImages : this.sampleImages;
    }
    
    loadCurrentImageSet() {
        console.log(`🎯 Loading current image set: ${this.currentImageSet}`);
        const images = this.getCurrentImages();
        console.log(`📂 Available images in ${this.currentImageSet} set:`, images);
        
        if (images.length > 0) {
            console.log(`🚀 Loading first image: ${images[0].name}`);
            this.loadTestImages();
        } else {
            console.warn(`⚠️ No images found in ${this.currentImageSet} set`);
            console.log('� Loading hardcoded landing-pig as emergency fallback...');
            
            // Emergency fallback - load landing-pig directly
            this.loadHardcodedLandingPig();
        }
    }
    
    async loadHardcodedLandingPig() {
        try {
            console.log('🐷 Loading hardcoded landing-pig...');
            this.showStatus('Loading Landing Pig...', 'info');
            
            await this.viewer.loadColorImage('./sample-images/landing-pig.jpeg');
            await this.viewer.loadDepthMap('./sample-images/landing-pig-∂map.png');
            
            this.showStatus('Landing Pig loaded! Touch or drag to see the parallax depth effect.', 'success');
            console.log('✅ Hardcoded landing-pig loaded successfully');
            
        } catch (error) {
            console.error('❌ Failed to load hardcoded landing-pig:', error);
            this.showStatus(`Failed to load images: ${error.message}`, 'error');
        }
    }
    
    updateGyroscopeDebugDisplay(alpha, beta, gamma, processedX, processedY) {
        if (this.gyroDebugInfo.style.display === 'block') {
            this.gyroAlphaValue.textContent = alpha ? alpha.toFixed(1) : '--';
            this.gyroBetaValue.textContent = beta ? beta.toFixed(1) : '--';
            this.gyroGammaValue.textContent = gamma ? gamma.toFixed(1) : '--';
            this.gyroProcessedX.textContent = processedX ? processedX.toFixed(3) : '--';
            this.gyroProcessedY.textContent = processedY ? processedY.toFixed(3) : '--';
        }
    }
    
    async handleImageUploads(files) {
        if (files.length !== 2) {
            this.showStatus(`Please select exactly 2 files. You selected ${files.length}.`, 'error');
            return;
        }
        
        // Detect which file has ∂map in the name
        let colorFile = null;
        let depthFile = null;
        
        for (const file of files) {
            if (file.name.includes('∂map')) {
                depthFile = file;
            } else {
                colorFile = file;
            }
        }
        
        if (!depthFile) {
            this.showStatus('No depth map found. One file must have "∂map" in the filename.', 'error');
            return;
        }
        
        if (!colorFile) {
            this.showStatus('Please select a color image (without "∂map" in filename) and a depth map.', 'error');
            return;
        }
        
        this.showStatus('Loading images...', 'info');
        
        try {
            // Load color image first
            this.showStatus(`Loading color image: ${colorFile.name}...`, 'info');
            await this.viewer.loadColorImage(colorFile);
            
            // Then load depth map
            this.showStatus(`Loading depth map: ${depthFile.name}...`, 'info');
            await this.viewer.loadDepthMap(depthFile);
            
            this.showStatus(`Images loaded successfully! Move your mouse over the image to see the depth effect.`, 'success');
        } catch (error) {
            this.showStatus(`Failed to load images: ${error.message}`, 'error');
            console.error('Upload error:', error);
        }
    }
    

    
    async loadTestImages() {
        // Load the default landing image set
        await this.loadCurrentSampleImage();
    }
    
    toggleViewMode() {
        this.currentViewMode = this.currentViewMode === 'fit' ? 'fill' : 'fit';
        
        // Update button icon and tooltip
        if (this.currentViewMode === 'fit') {
            this.viewModeBtn.textContent = '🔳';
            this.viewModeBtn.title = 'Switch to Fill Mode';
            this.showStatus('Fit mode: Showing full image with letterboxing', 'info');
        } else {
            this.viewModeBtn.textContent = '⛶';
            this.viewModeBtn.title = 'Switch to Fit Mode';
            this.showStatus('Fill mode: Scroll with trackpad/mouse wheel to pan', 'info');
        }
        
        // Update viewer
        this.viewer.setViewMode(this.currentViewMode);
    }
    
    toggleControlsPanel() {
        const isOpen = this.controlsPanel.classList.toggle('open');
        this.controlsToggle.textContent = isOpen ? '× Debug' : '⚙️ Debug';
        
        // Backdrop disabled - no darkening scrim
        
        // Add/remove class from body to adjust toast positioning
        document.body.classList.toggle('controls-open', isOpen);
    }
    
    applyPreset(preset) {
        const presets = {
            calm: { depthScale: 0.5, focus: 0.5 },
            normal: { depthScale: 1.0, focus: 0.5 },
            dramatic: { depthScale: 2.0, focus: 0.3 }
        };
        
        const settings = presets[preset];
        if (settings) {
            this.viewer.setOptions(settings);
            this.depthScaleSlider.value = settings.depthScale;
            this.depthScaleValue.textContent = settings.depthScale.toFixed(1);
        }
    }
    
    setupDragAndDrop() {
        let dragCounter = 0;
        
        document.addEventListener('dragenter', (e) => {
            e.preventDefault();
            dragCounter++;
            this.dragOverlay.classList.add('active');
        });
        
        document.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dragCounter--;
            if (dragCounter === 0) {
                this.dragOverlay.classList.remove('active');
            }
        });
        
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        document.addEventListener('drop', (e) => {
            e.preventDefault();
            dragCounter = 0;
            this.dragOverlay.classList.remove('active');
            
            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                this.handleImageUploads(files);
            }
        });
    }
    
    setDragMode(mode) {
        this.currentDragMode = mode;
        
        // Update button states based on mode
        this.stickyBtn.classList.toggle('active', mode === 'sticky');
        this.rubberBandBtn.classList.toggle('active', mode === 'rubber-band');
        
        // Update viewer drag mode
        this.viewer.setDragMode(mode);
        
        // Show status message
        if (mode === 'sticky') {
            this.showStatus('Sticky mode: Drag to set depth position', 'info');
        } else {
            this.showStatus('Rubber-band mode: Drag temporarily, snaps back on release', 'info');
        }
    }
    
    showStatus(message, type = 'info', duration = null) {
        // Set default durations based on message type
        if (duration === null) {
            switch (type) {
                case 'error':
                    duration = 8000; // Errors stay longer
                    break;
                case 'success':
                    duration = 4000; // Success messages shorter
                    break;
                case 'info':
                default:
                    duration = 6000; // Default duration
                    break;
            }
        }
        this.showToast(message, type, duration);
    }
    
    showToast(message, type = 'info', duration = 5000) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Create message span
        const messageSpan = document.createElement('span');
        messageSpan.textContent = message;
        toast.appendChild(messageSpan);
        
        // Create dismiss button
        const dismissBtn = document.createElement('button');
        dismissBtn.className = 'toast-dismiss';
        dismissBtn.innerHTML = '×';
        dismissBtn.title = 'Dismiss';
        toast.appendChild(dismissBtn);
        
        // Add to container
        this.toastContainer.appendChild(toast);
        
        // Auto-dismiss after duration (if duration > 0)
        let autoTimeout;
        if (duration > 0) {
            autoTimeout = setTimeout(() => {
                this.dismissToast(toast);
            }, duration);
        }
        
        // Handle manual dismiss
        dismissBtn.addEventListener('click', () => {
            if (autoTimeout) clearTimeout(autoTimeout);
            this.dismissToast(toast);
        });
        
        // Make clicking the toast itself also dismiss it
        toast.addEventListener('click', (e) => {
            // Only if not clicking the dismiss button
            if (e.target !== dismissBtn) {
                if (autoTimeout) clearTimeout(autoTimeout);
                this.dismissToast(toast);
            }
        });
        
        return toast;
    }
    
    dismissToast(toast) {
        if (toast.classList.contains('dismissing')) return;
        
        toast.classList.add('dismissing');
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300); // Match animation duration
    }
    
    clearAllToasts() {
        const toasts = this.toastContainer.querySelectorAll('.toast');
        toasts.forEach(toast => this.dismissToast(toast));
    }
    
    updateLocalizedParallaxState() {
        // Enable localized parallax controls only in rubber-band mode
        const isRubberBand = this.currentDragMode === 'rubber-band';
        const isLocalizedEnabled = this.localizedParallaxCheckbox.checked;
        const isAutoFocus = this.getCurrentAutoFocus();
        const isDampeningEnabled = isRubberBand && isLocalizedEnabled && isAutoFocus;
        
        this.localizedParallaxCheckbox.disabled = !isRubberBand;
        this.localizeDistanceSlider.disabled = !isRubberBand || !isLocalizedEnabled;
        
        // Enable dampening controls only when localized parallax + auto focus are both enabled
        this.backgroundDampeningSlider.disabled = !isDampeningEnabled;
        this.midgroundDampeningSlider.disabled = !isDampeningEnabled;
        
        // Update opacity for disabled state
        this.localizeDistanceValue.style.opacity = (!isRubberBand || !isLocalizedEnabled) ? '0.6' : '1';
        this.backgroundDampeningValue.style.opacity = !isDampeningEnabled ? '0.6' : '1';
        this.midgroundDampeningValue.style.opacity = !isDampeningEnabled ? '0.6' : '1';
        
        // If switching away from rubber-band mode, disable localized parallax
        if (!isRubberBand && isLocalizedEnabled) {
            this.localizedParallaxCheckbox.checked = false;
            this.viewer.setOptions({ localizedParallax: false });
        }
    }
    
    showDistanceCircle(distance) {
        const viewerRect = this.viewerElement.getBoundingClientRect();
        const centerX = viewerRect.width / 2;
        const centerY = viewerRect.height / 2;
        
        this.distanceCircle.style.left = centerX + 'px';
        this.distanceCircle.style.top = centerY + 'px';
        this.distanceCircle.style.width = (distance * 2) + 'px';
        this.distanceCircle.style.height = (distance * 2) + 'px';
        this.distanceCircle.style.display = 'block';
    }
    
    hideDistanceCircle() {
        this.distanceCircle.style.display = 'none';
    }
    
    saveSettings() {
        const settings = {
            depthScale: parseFloat(this.depthScaleSlider.value),
            sensitivity: parseFloat(this.sensitivitySlider.value),
            dragMode: this.currentDragMode,
            focus: this.getCurrentFocus(),
            autoFocus: this.getCurrentAutoFocus(),
            invertDepthLogic: this.invertDepthLogicCheckbox.checked,
            invertX: this.invertXCheckbox.checked,
            lockX: this.lockXCheckbox.checked,
            invertY: this.invertYCheckbox.checked,
            lockY: this.lockYCheckbox.checked,
            displayDepthmap: this.displayDepthmapCheckbox.checked,
            swipeSlideAdvance: this.swipeSlideAdvanceCheckbox.checked,
            localizedParallax: this.localizedParallaxCheckbox.checked,
            localizeDistance: parseInt(this.localizeDistanceSlider.value),
            backgroundDampening: parseFloat(this.backgroundDampeningSlider.value),
            midgroundDampening: parseFloat(this.midgroundDampeningSlider.value),
            gyroscopeEnabled: this.gyroscopeEnabledCheckbox.checked,
            gyroHorizontal: parseFloat(this.gyroHorizontalSlider.value),
            gyroVertical: parseFloat(this.gyroVerticalSlider.value),
            gyroInvertX: this.gyroInvertXCheckbox.checked,
            gyroLockX: this.gyroLockXCheckbox.checked,
            gyroInvertY: this.gyroInvertYCheckbox.checked,
            gyroLockY: this.gyroLockYCheckbox.checked,
            toastOpacity: parseFloat(this.toastOpacitySlider.value),
            numpadAnimation: this.numpadAnimationCheckbox.checked,
            animateSlideTransitions: this.animateSlideTransitions,
            animationTiming: this.animationTiming,
            symmetricalDrag: this.symmetricalDragCheckbox.checked,
            trackpadZoom: this.trackpadZoomEnabled
        };
        localStorage.setItem('depthViewerSettings', JSON.stringify(settings));
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('depthViewerSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                
                // Apply depth scale
                if (settings.depthScale !== undefined) {
                    this.depthScaleSlider.value = settings.depthScale;
                    this.depthScaleValue.textContent = settings.depthScale.toFixed(1);
                    this.viewer.setOptions({ depthScale: settings.depthScale });
                }
                
                // Apply sensitivity
                if (settings.sensitivity !== undefined) {
                    this.sensitivitySlider.value = settings.sensitivity;
                    this.sensitivityValue.textContent = settings.sensitivity.toFixed(1);
                    this.sensitivity = settings.sensitivity;
                    this.viewer.setOptions({ sensitivity: settings.sensitivity });
                }
                
                // Apply drag mode
                if (settings.dragMode) {
                    this.currentDragMode = settings.dragMode;
                    document.querySelectorAll('[data-drag-mode]').forEach(b => b.classList.remove('active'));
                    document.querySelector(`[data-drag-mode="${settings.dragMode}"]`)?.classList.add('active');
                    this.viewer.setInteractionMode('drag', settings.dragMode);
                }
                
                // Apply focus
                if (settings.autoFocus !== undefined && settings.autoFocus) {
                    document.querySelectorAll('[data-focus]').forEach(b => b.classList.remove('active'));
                    document.querySelector('[data-focus="auto"]')?.classList.add('active');
                    this.viewer.setOptions({ autoFocus: true });
                } else if (settings.focus !== undefined) {
                    document.querySelectorAll('[data-focus]').forEach(b => b.classList.remove('active'));
                    document.querySelector(`[data-focus="${settings.focus}"]`)?.classList.add('active');
                    this.viewer.setOptions({ autoFocus: false, focus: settings.focus });
                }
                
                // Apply invert depth logic
                if (settings.invertDepthLogic !== undefined) {
                    this.invertDepthLogicCheckbox.checked = settings.invertDepthLogic;
                    this.viewer.setOptions({ invertDepthLogic: settings.invertDepthLogic });
                }
                
                // Apply drag controls
                if (settings.invertX !== undefined) {
                    this.invertXCheckbox.checked = settings.invertX;
                    this.viewer.setOptions({ invertX: settings.invertX });
                }
                
                if (settings.lockX !== undefined) {
                    this.lockXCheckbox.checked = settings.lockX;
                    this.viewer.setOptions({ lockX: settings.lockX });
                }
                
                if (settings.invertY !== undefined) {
                    this.invertYCheckbox.checked = settings.invertY;
                    this.viewer.setOptions({ invertY: settings.invertY });
                }
                
                if (settings.lockY !== undefined) {
                    this.lockYCheckbox.checked = settings.lockY;
                    this.viewer.setOptions({ lockY: settings.lockY });
                }
                
                // Apply display controls
                if (settings.displayDepthmap !== undefined) {
                    this.displayDepthmapCheckbox.checked = settings.displayDepthmap;
                    this.viewer.setOptions({ displayDepthmap: settings.displayDepthmap });
                }
                
                // Apply swipe controls
                if (settings.swipeSlideAdvance !== undefined) {
                    this.swipeSlideAdvanceCheckbox.checked = settings.swipeSlideAdvance;
                    this.viewer.setOptions({ swipeSlideAdvance: settings.swipeSlideAdvance });
                }
                
                // Apply localized parallax settings
                if (settings.localizedParallax !== undefined) {
                    this.localizedParallaxCheckbox.checked = settings.localizedParallax;
                    this.viewer.setOptions({ localizedParallax: settings.localizedParallax });
                }
                
                if (settings.localizeDistance !== undefined) {
                    this.localizeDistanceSlider.value = settings.localizeDistance;
                    this.localizeDistanceValue.textContent = settings.localizeDistance + 'px';
                    this.viewer.setOptions({ localizeDistance: settings.localizeDistance });
                }
                
                // Apply dampening settings
                if (settings.backgroundDampening !== undefined) {
                    this.backgroundDampeningSlider.value = settings.backgroundDampening;
                    this.backgroundDampeningValue.textContent = settings.backgroundDampening.toFixed(1);
                    this.viewer.setOptions({ backgroundDampening: settings.backgroundDampening });
                }
                
                if (settings.midgroundDampening !== undefined) {
                    this.midgroundDampeningSlider.value = settings.midgroundDampening;
                    this.midgroundDampeningValue.textContent = settings.midgroundDampening.toFixed(1);
                    this.viewer.setOptions({ midgroundDampening: settings.midgroundDampening });
                }
                
                // Apply gyroscope settings
                if (settings.gyroscopeEnabled !== undefined) {
                    this.gyroscopeEnabledCheckbox.checked = settings.gyroscopeEnabled;
                    // Don't auto-enable gyroscope on load, let user manually enable
                }
                
                if (settings.gyroHorizontal !== undefined) {
                    this.gyroHorizontalSlider.value = settings.gyroHorizontal;
                    this.gyroHorizontalValue.textContent = settings.gyroHorizontal.toFixed(1);
                    this.viewer.setOptions({ gyroHorizontal: settings.gyroHorizontal });
                }
                
                if (settings.gyroVertical !== undefined) {
                    this.gyroVerticalSlider.value = settings.gyroVertical;
                    this.gyroVerticalValue.textContent = settings.gyroVertical.toFixed(1);
                    this.viewer.setOptions({ gyroVertical: settings.gyroVertical });
                }
                
                if (settings.gyroInvertX !== undefined) {
                    this.gyroInvertXCheckbox.checked = settings.gyroInvertX;
                    this.viewer.setOptions({ gyroInvertX: settings.gyroInvertX });
                }
                
                if (settings.gyroLockX !== undefined) {
                    this.gyroLockXCheckbox.checked = settings.gyroLockX;
                    this.viewer.setOptions({ gyroLockX: settings.gyroLockX });
                }
                
                if (settings.gyroInvertY !== undefined) {
                    this.gyroInvertYCheckbox.checked = settings.gyroInvertY;
                    this.viewer.setOptions({ gyroInvertY: settings.gyroInvertY });
                }
                
                if (settings.gyroLockY !== undefined) {
                    this.gyroLockYCheckbox.checked = settings.gyroLockY;
                    this.viewer.setOptions({ gyroLockY: settings.gyroLockY });
                }
                
                // Apply toast opacity
                if (settings.toastOpacity !== undefined) {
                    this.toastOpacitySlider.value = settings.toastOpacity;
                    this.toastOpacityValue.textContent = settings.toastOpacity.toFixed(1);
                    this.toastContainer.style.opacity = settings.toastOpacity;
                }
                
                // Apply numpad animation setting
                if (settings.numpadAnimation !== undefined) {
                    this.numpadAnimationCheckbox.checked = settings.numpadAnimation;
                    this.numpadAnimationEnabled = settings.numpadAnimation;
                }
                
                // Apply slide animation settings
                if (settings.animateSlideTransitions !== undefined) {
                    this.animateSlideTransitionsCheckbox.checked = settings.animateSlideTransitions;
                    this.animateSlideTransitions = settings.animateSlideTransitions;
                }
                
                if (settings.animationTiming !== undefined) {
                    this.animationTimingSlider.value = settings.animationTiming;
                    this.animationTimingValue.textContent = settings.animationTiming + 'ms';
                    this.animationTiming = settings.animationTiming;
                }
                
                // Apply symmetrical drag setting
                if (settings.symmetricalDrag !== undefined) {
                    this.symmetricalDragCheckbox.checked = settings.symmetricalDrag;
                    this.viewer.setOptions({ symmetricalDrag: settings.symmetricalDrag });
                }
                
                // Apply trackpad zoom setting
                if (settings.trackpadZoom !== undefined) {
                    this.trackpadZoomCheckbox.checked = settings.trackpadZoom;
                    this.trackpadZoomEnabled = settings.trackpadZoom;
                    if (this.trackpadZoomEnabled) {
                        this.setupZoomListeners();
                    }
                }
            }
        } catch (error) {
            console.warn('Failed to load saved settings:', error);
        }
    }
    
    getCurrentFocus() {
        const activeBtn = document.querySelector('[data-focus].active');
        if (!activeBtn || activeBtn.dataset.focus === 'auto') return 0.5;
        return parseFloat(activeBtn.dataset.focus);
    }
    
    getCurrentAutoFocus() {
        const activeBtn = document.querySelector('[data-focus].active');
        return activeBtn ? activeBtn.dataset.focus === 'auto' : false;
    }
    
    highlightAutoFocus(focusType) {
        // Remove any existing auto-focus highlighting
        document.querySelectorAll('[data-focus]').forEach(btn => {
            btn.classList.remove('auto-focus-highlight');
        });
        
        // Add highlighting to the detected focus type
        if (focusType === 'near') {
            document.querySelector('[data-focus="0.2"]')?.classList.add('auto-focus-highlight');
        } else if (focusType === 'middle') {
            document.querySelector('[data-focus="0.5"]')?.classList.add('auto-focus-highlight');
        } else if (focusType === 'far') {
            document.querySelector('[data-focus="0.8"]')?.classList.add('auto-focus-highlight');
        }
        
        // Remove highlight after a short delay
        setTimeout(() => {
            document.querySelectorAll('[data-focus]').forEach(btn => {
                btn.classList.remove('auto-focus-highlight');
            });
        }, 2000);
    }
    
    previousImage() {
        const images = this.getCurrentImages();
        if (images.length === 0) return;
        
        if (this.isSlideAnimating) return; // Prevent multiple animations
        
        if (this.animateSlideTransitions && this.viewer) {
            this.animateSlideTransition(-1); // -1 for backward
        } else {
            this.currentImageIndex = (this.currentImageIndex - 1 + images.length) % images.length;
            this.loadCurrentSampleImage();
        }
    }
    
    nextImage() {
        const images = this.getCurrentImages();
        if (images.length === 0) return;
        
        if (this.isSlideAnimating) return; // Prevent multiple animations
        
        if (this.animateSlideTransitions && this.viewer) {
            this.animateSlideTransition(1); // 1 for forward
        } else {
            this.currentImageIndex = (this.currentImageIndex + 1) % images.length;
            this.loadCurrentSampleImage();
        }
    }
    
    async loadCurrentSampleImage() {
        const images = this.getCurrentImages();
        const imageSet = images[this.currentImageIndex];
        if (!imageSet) {
            console.log('No image set found at index:', this.currentImageIndex);
            return;
        }
        
        console.log(`Loading image set from ${this.currentImageSet}:`, imageSet);
        this.showStatus(`Loading ${imageSet.name}...`, 'info');
        
        try {
            console.log('Loading color image:', imageSet.colorImage);
            await this.viewer.loadColorImage(imageSet.colorImage);
            console.log('Loading depth map:', imageSet.depthMap);
            await this.viewer.loadDepthMap(imageSet.depthMap);
            
            // Check for symmetry compatibility based on filename
            this.updateSymmetryCompatibility(imageSet.name);
            
            // Update depth map selector based on available alternatives
            this.updateDepthMapSelector(imageSet);
            
            this.showStatus(`${imageSet.name} loaded! Touch or drag to see the parallax depth effect.`, 'success');
        } catch (error) {
            this.showStatus(`Failed to load ${imageSet.name}: ${error.message}`, 'error');
            console.error('Sample image load error:', error);
        }
    }
    
    updateSymmetryCompatibility(imageName) {
        // Check for symmetry markers in filename
        const hasHorizontalSymmetry = imageName.toLowerCase().includes('symh');
        const hasVerticalSymmetry = imageName.toLowerCase().includes('symv');
        const isSymmetryCompatible = hasHorizontalSymmetry || hasVerticalSymmetry;
        
        // Enable/disable the symmetry checkbox based only on image compatibility
        this.symmetricalDragCheckbox.disabled = !isSymmetryCompatible;
        
        // Update the viewer with symmetry modes if compatible and checkbox enabled
        if (isSymmetryCompatible && this.symmetricalDragCheckbox.checked) {
            this.viewer.setOptions({ 
                symmetricalDrag: true,
                symmetryMode: hasHorizontalSymmetry && hasVerticalSymmetry ? 'both' : 
                             hasHorizontalSymmetry ? 'horizontal' : 'vertical'
            });
        } else {
            // Disable symmetry if not compatible or checkbox off
            this.viewer.setOptions({ 
                symmetricalDrag: false,
                symmetryMode: isSymmetryCompatible ? 
                             (hasHorizontalSymmetry && hasVerticalSymmetry ? 'both' : 
                              hasHorizontalSymmetry ? 'horizontal' : 'vertical') : 'none'
            });
        }
        
        console.log(`🪞 Symmetry check for "${imageName}": H=${hasHorizontalSymmetry}, V=${hasVerticalSymmetry}, Compatible=${isSymmetryCompatible}, Checkbox=${this.symmetricalDragCheckbox.checked ? 'on' : 'off'}, Disabled=${this.symmetricalDragCheckbox.disabled}`);
    }
    
    async switchDepthMap(mapType) {
        const images = this.getCurrentImages();
        const imageSet = images[this.currentImageIndex];
        if (!imageSet) return;
        
        let newDepthMap;
        if (mapType === 'default') {
            newDepthMap = imageSet.depthMap;
        } else if (mapType === 'light' && imageSet.alternativeMaps.light) {
            newDepthMap = imageSet.alternativeMaps.light;
        } else if (mapType === 'dark' && imageSet.alternativeMaps.dark) {
            newDepthMap = imageSet.alternativeMaps.dark;
        } else {
            console.warn(`Depth map type "${mapType}" not available`);
            return;
        }
        
        try {
            console.log(`🔄 Switching depth map to ${mapType}:`, newDepthMap);
            await this.viewer.loadDepthMap(newDepthMap);
            this.showStatus(`Switched to ${mapType} depth map`, 'info');
        } catch (error) {
            this.showStatus(`Failed to load ${mapType} depth map: ${error.message}`, 'error');
            console.error('Depth map switch error:', error);
        }
    }
    
    updateDepthMapSelector(imageSet) {
        const hasAlternatives = imageSet.alternativeMaps && 
                               (imageSet.alternativeMaps.light || imageSet.alternativeMaps.dark);
        
        // Show/hide the selector group
        this.depthMapSelectorGroup.style.display = hasAlternatives ? 'block' : 'none';
        
        if (hasAlternatives) {
            // Show/hide individual buttons based on availability
            const lightBtn = document.querySelector('[data-depth-map="light"]');
            const darkBtn = document.querySelector('[data-depth-map="dark"]');
            
            lightBtn.style.display = imageSet.alternativeMaps.light ? 'inline-block' : 'none';
            darkBtn.style.display = imageSet.alternativeMaps.dark ? 'inline-block' : 'none';
            
            // Reset to default
            document.querySelectorAll('[data-depth-map]').forEach(b => b.classList.remove('active'));
            document.querySelector('[data-depth-map="default"]').classList.add('active');
            
            console.log(`🎛️ Depth map selector updated - Light: ${!!imageSet.alternativeMaps.light}, Dark: ${!!imageSet.alternativeMaps.dark}`);
        }
    }
    
    async animateSlideTransition(direction) {
        if (!this.viewer || this.isSlideAnimating) return;
        
        this.isSlideAnimating = true;
        const timing = this.animationTiming;
        
        console.log(`🎬 Starting animated slide transition: direction=${direction}, timing=${timing}ms`);
        
        try {
            // Phase 1: Animate current slide from center to exit position
            const exitX = direction > 0 ? -1 : 1; // Left for next, right for previous
            console.log(`Phase 1: Animating current slide to exit (${exitX}, 0)`);
            
            await new Promise(resolve => {
                // Use setMousePosition instead of setNumpadDrag to preserve parallax settings
                this.viewer.setMousePosition(exitX, 0, true, timing / 2);
                setTimeout(resolve, timing / 2);
            });
            
            // Phase 2: Change to next/previous image
            const images = this.getCurrentImages();
            if (direction > 0) {
                this.currentImageIndex = (this.currentImageIndex + 1) % images.length;
            } else {
                this.currentImageIndex = (this.currentImageIndex - 1 + images.length) % images.length;
            }
            
            console.log(`Phase 2: Loading new image (index ${this.currentImageIndex})`);
            
            // Load new image
            await this.loadCurrentSampleImage();
            
            // Phase 3: Set new slide to enter position (opposite side) and animate to center
            const enterX = direction > 0 ? 1 : -1; // Right for next, left for previous
            console.log(`Phase 3: Setting new slide at enter position (${enterX}, 0) and animating to center`);
            
            // Set initial position instantly (off-screen) without affecting parallax settings
            this.viewer.setMousePosition(enterX, 0, false);
            
            // Small delay to ensure the position is set
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // Animate to center without affecting parallax settings
            this.viewer.setMousePosition(0, 0, true, timing / 2);
            
            // Wait for animation to complete
            await new Promise(resolve => setTimeout(resolve, timing / 2 + 50));
            
            console.log('🎬 Slide transition completed - parallax settings preserved');
            
        } catch (error) {
            console.error('Slide animation error:', error);
            // Fallback to instant transition
            await this.loadCurrentSampleImage();
        } finally {
            this.isSlideAnimating = false;
        }
    }

    synchronizeUIWithViewer() {
        // Ensure all UI controls reflect the actual viewer state after transitions
        if (!this.viewer) return;
        
        const viewerOptions = this.viewer.getOptions();
        let syncChanges = 0;
        
        // Synchronize checkbox states
        if (this.localizedParallaxCheckbox) {
            const shouldBeChecked = Boolean(viewerOptions.localizedParallax);
            if (this.localizedParallaxCheckbox.checked !== shouldBeChecked) {
                console.log(`🔄 Synchronizing localizedParallax: UI=${this.localizedParallaxCheckbox.checked} -> Viewer=${shouldBeChecked}`);
                this.localizedParallaxCheckbox.checked = shouldBeChecked;
                syncChanges++;
            }
        }
        
        if (this.symmetricalDragCheckbox) {
            const shouldBeChecked = Boolean(viewerOptions.symmetricalDrag);
            if (this.symmetricalDragCheckbox.checked !== shouldBeChecked) {
                console.log(`🔄 Synchronizing symmetricalDrag: UI=${this.symmetricalDragCheckbox.checked} -> Viewer=${shouldBeChecked}`);
                this.symmetricalDragCheckbox.checked = shouldBeChecked;
                syncChanges++;
            }
        }
        
        // Synchronize slider values
        if (this.depthScaleSlider && viewerOptions.depthScale !== undefined) {
            const currentValue = parseFloat(this.depthScaleSlider.value);
            if (Math.abs(currentValue - viewerOptions.depthScale) > 0.01) {
                console.log(`🔄 Synchronizing depthScale: UI=${currentValue} -> Viewer=${viewerOptions.depthScale}`);
                this.depthScaleSlider.value = viewerOptions.depthScale;
                this.depthScaleValue.textContent = viewerOptions.depthScale.toFixed(1);
                syncChanges++;
            }
        }
        
        // Force re-evaluation of dependent settings
        this.updateLocalizedParallaxState();
        
        // Re-check symmetry compatibility after state sync
        const images = this.getCurrentImages();
        const imageSet = images[this.currentImageIndex];
        if (imageSet) {
            this.updateSymmetryCompatibility(imageSet.name);
        }
        
        console.log(`🔄 UI state synchronized with viewer (${syncChanges} changes made)`);
    }

    checkControlSync() {
        if (!this.viewer) {
            this.syncStatus.innerHTML = '<div style="color: #ff6666;">❌ No viewer instance found</div>';
            return;
        }

        const viewerOptions = this.viewer.getOptions();
        const timestamp = new Date().toLocaleTimeString();
        let syncReport = `<div style="color: #66ff66; margin-bottom: 8px;">🔄 Sync Check - ${timestamp}</div>`;
        let issues = 0;

        // Check each control against viewer state
        const checks = [
            {
                name: 'Localized Parallax',
                ui: this.localizedParallaxCheckbox?.checked || false,
                viewer: viewerOptions.localizedParallax || false
            },
            {
                name: 'Symmetrical Drag',
                ui: this.symmetricalDragCheckbox?.checked || false,
                viewer: viewerOptions.symmetricalDrag || false
            },
            {
                name: 'Depth Scale',
                ui: parseFloat(this.depthScaleSlider?.value || 0),
                viewer: viewerOptions.depthScale || 0
            },
            {
                name: 'Sensitivity',
                ui: parseFloat(this.sensitivitySlider?.value || 0),
                viewer: viewerOptions.sensitivity || 0
            },
            {
                name: 'Invert Depth Logic',
                ui: this.invertDepthLogicCheckbox?.checked || false,
                viewer: viewerOptions.invertDepthLogic || false
            },
            {
                name: 'Display Depthmap',
                ui: this.displayDepthmapCheckbox?.checked || false,
                viewer: viewerOptions.displayDepthmap || false
            }
        ];

        checks.forEach(check => {
            const isSync = check.ui === check.viewer;
            const icon = isSync ? '✅' : '❌';
            const color = isSync ? '#66ff66' : '#ff6666';
            
            if (!isSync) issues++;
            
            syncReport += `<div style="color: ${color}; font-size: 11px; margin: 2px 0;">
                ${icon} ${check.name}: UI=${check.ui} | Viewer=${check.viewer}
            </div>`;
        });

        // Add summary
        if (issues === 0) {
            syncReport += '<div style="color: #66ff66; margin-top: 8px; font-weight: bold;">🎉 All controls in sync!</div>';
        } else {
            syncReport += `<div style="color: #ff6666; margin-top: 8px; font-weight: bold;">⚠️ Found ${issues} sync issue${issues > 1 ? 's' : ''}</div>`;
            syncReport += '<div style="color: #ffcc00; font-size: 11px; margin-top: 4px;">💡 Try synchronizing manually or check after slide transitions</div>';
        }

        this.syncStatus.innerHTML = syncReport;
        
        // Auto-clear after 10 seconds
        setTimeout(() => {
            if (this.syncStatus.innerHTML === syncReport) {
                this.syncStatus.innerHTML = '<div style="color: #888;">Click "Check Control Sync" to verify UI/viewer state alignment</div>';
            }
        }, 10000);

        console.log('🔍 Control sync check completed:', { issues, checks });
    }

    forceSynchronizeControls() {
        if (!this.viewer) {
            this.syncStatus.innerHTML = '<div style="color: #ff6666;">❌ No viewer instance found</div>';
            return;
        }

        const timestamp = new Date().toLocaleTimeString();
        this.syncStatus.innerHTML = '<div style="color: #ffcc00;">🔧 Force synchronizing controls...</div>';

        // Force viewer to match UI state
        try {
            const uiState = {
                localizedParallax: this.localizedParallaxCheckbox?.checked || false,
                symmetricalDrag: this.symmetricalDragCheckbox?.checked || false,
                depthScale: parseFloat(this.depthScaleSlider?.value || 1),
                sensitivity: parseFloat(this.sensitivitySlider?.value || 1),
                invertDepthLogic: this.invertDepthLogicCheckbox?.checked || false,
                displayDepthmap: this.displayDepthmapCheckbox?.checked || false,
                localizeDistance: parseInt(this.localizeDistanceSlider?.value || 150),
                backgroundDampening: parseFloat(this.backgroundDampeningSlider?.value || 0.8),
                midgroundDampening: parseFloat(this.midgroundDampeningSlider?.value || 0.5)
            };

            // Apply all UI settings to viewer
            this.viewer.setOptions(uiState);

            // Re-evaluate dependent states
            this.updateLocalizedParallaxState();
            
            // Re-check symmetry compatibility
            const images = this.getCurrentImages();
            const imageSet = images[this.currentImageIndex];
            if (imageSet) {
                this.updateSymmetryCompatibility(imageSet.name);
            }

            // Show success
            this.syncStatus.innerHTML = `<div style="color: #66ff66;">✅ Force sync completed - ${timestamp}</div>
                <div style="color: #ccc; font-size: 11px; margin-top: 4px;">All UI controls forced to viewer. Check sync again to verify.</div>`;

            console.log('🔧 Force synchronization completed:', uiState);

        } catch (error) {
            console.error('Force sync error:', error);
            this.syncStatus.innerHTML = `<div style="color: #ff6666;">❌ Force sync failed: ${error.message}</div>`;
        }

        // Auto-clear after 8 seconds
        setTimeout(() => {
            this.syncStatus.innerHTML = '<div style="color: #888;">Click "Check Sync" to verify UI/viewer state alignment</div>';
        }, 8000);
    }

    setupZoomListeners() {
        // Add wheel event listener for trackpad zoom
        this.zoomHandler = (event) => {
            if (!this.trackpadZoomEnabled) return;
            
            event.preventDefault();
            
            const zoomFactor = 1 + (event.deltaY * -0.01); // Negative for natural scroll direction
            this.zoomScale = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoomScale * zoomFactor));
            
            this.viewer.setOptions({ zoomScale: this.zoomScale });
            
            // Show zoom level briefly
            this.showStatus(`Zoom: ${Math.round(this.zoomScale * 100)}%`, 'info', 1000);
        };
        
        this.viewerElement.addEventListener('wheel', this.zoomHandler, { passive: false });
    }

    removeZoomListeners() {
        if (this.zoomHandler) {
            this.viewerElement.removeEventListener('wheel', this.zoomHandler);
            this.zoomHandler = null;
        }
    }

    resetZoom() {
        this.zoomScale = 1.0;
        this.viewer.setOptions({ zoomScale: 1.0 });
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 APP STARTING - Touch Version 1.1');
    new DepthViewerApp();
});