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
        
        // Toast opacity control
        this.toastOpacitySlider = document.getElementById('toastOpacity');
        this.toastOpacityValue = document.getElementById('toastOpacityValue');
        
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
                // Hidden images set
                const hiddenImagePairs = [
                    { base: 'astrobutt-color', colorExt: '.jpeg', depthExt: '.jpg' },
                    { base: 'basketballcard', colorExt: '.jpeg', depthExt: '.jpg' },
                    { base: 'glassbutt2', colorExt: '.jpeg', depthExt: '.png' },
                    { base: 'green-garbage', colorExt: '.jpeg', depthExt: '.png' }
                ];
                
                for (const pair of hiddenImagePairs) {
                    const colorImage = `${folderPath}${pair.base}${pair.colorExt}`;
                    const depthMap = `${folderPath}${pair.base}-∂map${pair.depthExt}`;
                    
                    if (await this.imageExists(colorImage) && await this.imageExists(depthMap)) {
                        images.push({
                            name: this.formatImageName(pair.base),
                            colorImage: colorImage,
                            depthMap: depthMap
                        });
                    }
                }
            } else {
                // Sample images set (landing-pig is the landing/default image)
                const sampleImagePairs = [
                    { base: 'landing-pig', colorExt: '.jpeg', depthExt: '.png' },
                    { base: 'boar4', colorExt: '.jpeg', depthExt: '.png' }
                ];
                
                for (const pair of sampleImagePairs) {
                    const colorImage = `${folderPath}${pair.base}${pair.colorExt}`;
                    const depthMap = `${folderPath}${pair.base}-∂map${pair.depthExt}`;
                    
                    if (await this.imageExists(colorImage) && await this.imageExists(depthMap)) {
                        images.push({
                            name: this.formatImageName(pair.base),
                            colorImage: colorImage,
                            depthMap: depthMap
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
            toastOpacity: parseFloat(this.toastOpacitySlider.value)
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
        this.currentImageIndex = (this.currentImageIndex - 1 + images.length) % images.length;
        this.loadCurrentSampleImage();
    }
    
    nextImage() {
        const images = this.getCurrentImages();
        if (images.length === 0) return;
        this.currentImageIndex = (this.currentImageIndex + 1) % images.length;
        this.loadCurrentSampleImage();
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
            
            this.showStatus(`${imageSet.name} loaded! Touch or drag to see the parallax depth effect.`, 'success');
        } catch (error) {
            this.showStatus(`Failed to load ${imageSet.name}: ${error.message}`, 'error');
            console.error('Sample image load error:', error);
        }
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 APP STARTING - Touch Version 1.1');
    new DepthViewerApp();
});