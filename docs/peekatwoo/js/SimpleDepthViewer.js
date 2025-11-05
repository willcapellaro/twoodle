/**
 * Simple Depth Viewer
 * A minimal implementation of depth image viewing with mouse-controlled parallax
 */
class SimpleDepthViewer {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            width: 800,
            height: 600,
            depthScale: 1.0,
            focus: 0.5,
            quality: 3,
            hover: true,
            ...options
        };
        
        this.app = null;
        this.colorTexture = null;
        this.depthTexture = null;
        this.sprite = null;
        this.depthFilter = null;
        this.isReady = false;
        
        this.offset = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        // Create PIXI application with explicit canvas element
        this.app = new PIXI.Application({
            width: this.options.width,
            height: this.options.height,
            backgroundColor: 0x222222,  // Dark gray to see if canvas is working
            antialias: true
        });
        
        console.log('PIXI app created:', this.app);
        console.log('Canvas element:', this.app.view);
        
        // Clear existing content and add canvas
        this.element.innerHTML = '';
        this.element.appendChild(this.app.view);
        
        // Add a test rectangle to verify PIXI is working
        this.testRect = new PIXI.Graphics();
        this.testRect.beginFill(0xFF0000); // Red rectangle
        this.testRect.drawRect(50, 50, 100, 100);
        this.testRect.endFill();
        this.app.stage.addChild(this.testRect);
        console.log('Added test rectangle');
        
        // Setup mouse interaction
        if (this.options.hover) {
            this.setupHover();
        }
    }
    
    setupHover() {
        const canvas = this.app.view;
        
        const onMouseMove = (event) => {
            if (!this.isReady) return;
            
            const rect = canvas.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            
            // Convert to -1 to 1 range and apply scaling
            const normalizedX = (x * 2 - 1) * 0.5;
            const normalizedY = (y * 2 - 1) * 0.5;
            
            this.offset = { x: -normalizedX, y: -normalizedY };
            this.updateDepthEffect();
        };
        
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('touchmove', (event) => {
            event.preventDefault();
            if (event.touches.length > 0) {
                onMouseMove(event.touches[0]);
            }
        });
        
        // Reset position when mouse leaves
        canvas.addEventListener('mouseleave', () => {
            this.offset = { x: 0, y: 0 };
            this.updateDepthEffect();
        });
    }
    
    async loadColorImage(source) {
        try {
            console.log('Loading color image:', source);
            let texture;
            
            if (source instanceof File) {
                // Create a more reliable loading process
                const url = URL.createObjectURL(source);
                console.log('Created blob URL:', url);
                
                // Create image element first to ensure it loads
                const img = new Image();
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = url;
                });
                console.log('Image loaded in DOM:', img.width, 'x', img.height);
                
                // Now create PIXI texture from the loaded image
                texture = PIXI.Texture.from(img);
                console.log('PIXI texture created:', texture);
                URL.revokeObjectURL(url);
            } else if (typeof source === 'string') {
                texture = await PIXI.Texture.fromURL(source);
            } else {
                throw new Error('Invalid source type');
            }
            
            this.colorTexture = texture;
            console.log('Color texture set, calling updateDisplay');
            this.updateDisplay();
            
            return texture;
        } catch (error) {
            console.error('Failed to load color image:', error);
            throw error;
        }
    }
    
    async loadDepthMap(source) {
        try {
            console.log('Loading depth map:', source);
            let texture;
            
            if (source instanceof File) {
                // Create a more reliable loading process
                const url = URL.createObjectURL(source);
                console.log('Created depth blob URL:', url);
                
                // Create image element first to ensure it loads
                const img = new Image();
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = url;
                });
                console.log('Depth image loaded in DOM:', img.width, 'x', img.height);
                
                // Now create PIXI texture from the loaded image
                texture = PIXI.Texture.from(img);
                console.log('PIXI depth texture created:', texture);
                URL.revokeObjectURL(url);
            } else if (typeof source === 'string') {
                texture = await PIXI.Texture.fromURL(source);
            } else {
                throw new Error('Invalid source type');
            }
            
            this.depthTexture = texture;
            console.log('Depth texture set, calling updateDisplay');
            this.updateDisplay();
            
            return texture;
        } catch (error) {
            console.error('Failed to load depth map:', error);
            throw error;
        }
    }
    
    updateDisplay() {
        console.log('updateDisplay called, colorTexture:', !!this.colorTexture, 'depthTexture:', !!this.depthTexture);
        
        // Remove test rectangle if it exists  
        if (this.testRect && this.app.stage.children.includes(this.testRect)) {
            this.app.stage.removeChild(this.testRect);
            this.testRect = null;
        }
        
        // Only remove existing sprite, not all children
        if (this.sprite && this.app.stage.children.includes(this.sprite)) {
            this.app.stage.removeChild(this.sprite);
            this.sprite = null;
        }
        
        // Show color image even if we don't have depth map yet
        if (!this.colorTexture) {
            console.log('No color texture, not updating display');
            return;
        }
        
        // Create sprite from color texture
        this.sprite = new PIXI.Sprite(this.colorTexture);
        console.log('Created sprite:', this.sprite, 'texture size:', this.colorTexture.width, 'x', this.colorTexture.height);
        
        // Scale to fit canvas while maintaining aspect ratio
        const scaleX = this.options.width / this.colorTexture.width;
        const scaleY = this.options.height / this.colorTexture.height;
        const scale = Math.min(scaleX, scaleY);
        
        this.sprite.scale.set(scale);
        console.log('Set scale:', scale);
        
        // Center the sprite
        this.sprite.x = (this.options.width - this.sprite.width) / 2;
        this.sprite.y = (this.options.height - this.sprite.height) / 2;
        console.log('Positioned sprite at:', this.sprite.x, this.sprite.y);
        
        // Only apply depth filter if we have both textures
        if (this.depthTexture) {
            try {
                this.depthFilter = new DepthPerspectiveFilter(this.depthTexture, this.options.quality);
                this.depthFilter.scale = 0.015 * this.options.depthScale;
                this.depthFilter.focus = this.options.focus;
                console.log('Created depth filter:', this.depthFilter);
                
                // Apply filter to sprite
                this.sprite.filters = [this.depthFilter];
                this.isReady = true;
            } catch (filterError) {
                console.warn('Failed to create depth filter, showing image without effect:', filterError);
                this.sprite.filters = [];
            }
        } else {
            console.log('No depth texture yet, showing image without depth effect');
            this.sprite.filters = [];
        }
        
        // Add to stage
        this.app.stage.addChild(this.sprite);
        console.log('Added sprite to stage, stage children:', this.app.stage.children.length);
        
        if (this.depthTexture) {
            this.updateDepthEffect();
        }
    }
    
    updateDepthEffect() {
        if (!this.depthFilter || !this.isReady) {
            return;
        }
        
        this.depthFilter.offset = [this.offset.x, this.offset.y];
    }
    
    setOptions(newOptions) {
        Object.assign(this.options, newOptions);
        
        if (newOptions.depthScale !== undefined && this.depthFilter) {
            this.depthFilter.scale = 0.015 * this.options.depthScale;
        }
        
        if (newOptions.focus !== undefined && this.depthFilter) {
            this.depthFilter.focus = this.options.focus;
        }
        
        if (newOptions.quality !== undefined) {
            // Need to recreate filter for quality changes
            this.updateDisplay();
        }
    }
    
    getOptions() {
        return { ...this.options };
    }
    
    hasColorImage() {
        return !!this.colorTexture;
    }
    
    hasDepthMap() {
        return !!this.depthTexture;
    }
    
    reset() {
        this.colorTexture = null;
        this.depthTexture = null;
        this.isReady = false;
        
        if (this.sprite) {
            this.app.stage.removeChild(this.sprite);
            this.sprite = null;
        }
        
        this.depthFilter = null;
    }
    
    destroy() {
        if (this.app) {
            this.app.destroy(true, true);
            this.app = null;
        }
        
        this.colorTexture = null;
        this.depthTexture = null;
        this.sprite = null;
        this.depthFilter = null;
        this.isReady = false;
    }
}

// Make available globally
window.SimpleDepthViewer = SimpleDepthViewer;