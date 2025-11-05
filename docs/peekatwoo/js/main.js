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
        
        // Sample image sets
        this.sampleImages = [
            {
                name: 'Landing Pig',
                colorImage: './sample-images/landing-pig.jpeg',
                depthMap: './sample-images/landing-pig-∂map.png'
            },
            {
                name: 'Glass Butt 2',
                colorImage: './sample-images/glassbutt2.jpeg',
                depthMap: './sample-images/glassbutt2-∂map.png'
            },
            {
                name: 'Astro Butt',
                colorImage: './sample-images/astrobutt-color.jpeg',
                depthMap: './sample-images/astrobutt-color-∂map.jpg'
            },
            {
                name: 'Basketball Card',
                colorImage: './sample-images/basketballcard.jpeg',
                depthMap: './sample-images/basketballcard-∂map.jpg'
            },
            {
                name: 'Green Garbage',
                colorImage: './sample-images/green-garbage.jpeg',
                depthMap: './sample-images/green-garbage-∂map.png'
            }
        ];
        this.currentImageIndex = 0;
        
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
        
        // Depth controls
        this.depthScaleSlider.addEventListener('input', (e) => {
            this.viewer.setOptions({ depthScale: parseFloat(e.target.value) });
            this.depthScaleValue.textContent = parseFloat(e.target.value).toFixed(1);
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
                this.viewer.setOptions({ focus: parseFloat(e.target.dataset.focus) });
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
        
        // Preset buttons
        document.querySelectorAll('[data-preset]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-preset]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.applyPreset(e.target.dataset.preset);
                this.saveSettings();
            });
        });
        
        // Drag and drop
        this.setupDragAndDrop();
        
        // Auto-load test images on page load
        setTimeout(() => {
            this.loadTestImages();
        }, 500);
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
        
        this.localizedParallaxCheckbox.disabled = !isRubberBand;
        this.localizeDistanceSlider.disabled = !isRubberBand || !isLocalizedEnabled;
        
        // Update the slider value display disabled state
        this.localizeDistanceValue.style.opacity = (!isRubberBand || !isLocalizedEnabled) ? '0.6' : '1';
        
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
            localizedParallax: this.localizedParallaxCheckbox.checked,
            localizeDistance: parseInt(this.localizeDistanceSlider.value)
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
                if (settings.focus !== undefined) {
                    document.querySelectorAll('[data-focus]').forEach(b => b.classList.remove('active'));
                    document.querySelector(`[data-focus="${settings.focus}"]`)?.classList.add('active');
                    this.viewer.setOptions({ focus: settings.focus });
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
            }
        } catch (error) {
            console.warn('Failed to load saved settings:', error);
        }
    }
    
    getCurrentFocus() {
        const activeBtn = document.querySelector('[data-focus].active');
        return activeBtn ? parseFloat(activeBtn.dataset.focus) : 0.5;
    }
    
    previousImage() {
        if (this.sampleImages.length === 0) return;
        this.currentImageIndex = (this.currentImageIndex - 1 + this.sampleImages.length) % this.sampleImages.length;
        this.loadCurrentSampleImage();
    }
    
    nextImage() {
        if (this.sampleImages.length === 0) return;
        this.currentImageIndex = (this.currentImageIndex + 1) % this.sampleImages.length;
        this.loadCurrentSampleImage();
    }
    
    async loadCurrentSampleImage() {
        const imageSet = this.sampleImages[this.currentImageIndex];
        if (!imageSet) return;
        
        this.showStatus(`Loading ${imageSet.name}...`, 'info');
        
        try {
            await this.viewer.loadColorImage(imageSet.colorImage);
            await this.viewer.loadDepthMap(imageSet.depthMap);
            
            this.showStatus(`${imageSet.name} loaded! Move your mouse over the image to see the parallax depth effect.`, 'success');
        } catch (error) {
            this.showStatus(`Failed to load ${imageSet.name}: ${error.message}`, 'error');
            console.error('Sample image load error:', error);
        }
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DepthViewerApp();
});