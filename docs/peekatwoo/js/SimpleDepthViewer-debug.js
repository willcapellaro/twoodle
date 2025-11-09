/**
 * Simple Depth Viewer - Debug Version
 * Testing basic functionality without complex filters
 */
class SimpleDepthViewer {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            width: 800,
            height: 600,
            ...options
        };
        
        this.app = null;
        this.colorTexture = null;
        this.depthTexture = null;
        this.sprite = null;
        this.isReady = false;
        
        this.offset = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        console.log('Initializing SimpleDepthViewer...');
        
        // Create PIXI application
        this.app = new PIXI.Application({
            width: this.options.width,
            height: this.options.height,
            backgroundColor: 0x222222,
            antialias: true
        });
        
        console.log('PIXI app created');
        
        // Clear existing content and add canvas
        this.element.innerHTML = '';
        this.element.appendChild(this.app.view);
        
        // Add test rectangle
        this.addTestGraphics();
        
        // Setup mouse interaction
        this.setupHover();
    }
    
    addTestGraphics() {
        this.testRect = new PIXI.Graphics();
        this.testRect.beginFill(0xFF0000);
        this.testRect.drawRect(50, 50, 100, 100);
        this.testRect.endFill();
        this.app.stage.addChild(this.testRect);
        console.log('Added test rectangle');
    }
    
    setupHover() {
        const canvas = this.app.view;
        
        canvas.addEventListener('mousemove', (event) => {
            if (!this.isReady) return;
            
            const rect = canvas.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            
            const normalizedX = (x * 2 - 1) * 0.5;
            const normalizedY = (y * 2 - 1) * 0.5;
            
            this.offset = { x: -normalizedX, y: -normalizedY };
            console.log('Mouse offset:', this.offset);
        });
        
        canvas.addEventListener('mouseleave', () => {
            this.offset = { x: 0, y: 0 };
            console.log('Mouse left, reset offset');
        });
    }
    
    async loadColorImage(file) {
        try {
            console.log('Loading color image:', file.name);
            
            // Create blob URL
            const url = URL.createObjectURL(file);
            console.log('Blob URL created:', url);
            
            // Load with Image element first
            const img = new Image();
            await new Promise((resolve, reject) => {
                img.onload = () => {
                    console.log('Image loaded:', img.width, 'x', img.height);
                    resolve();
                };
                img.onerror = reject;
                img.src = url;
            });
            
            // Create PIXI texture
            this.colorTexture = PIXI.Texture.from(img);
            console.log('PIXI texture created from image');
            
            URL.revokeObjectURL(url);
            
            this.showImage();
            
        } catch (error) {
            console.error('Failed to load color image:', error);
            throw error;
        }
    }
    
    async loadDepthMap(file) {
        try {
            console.log('Loading depth map:', file.name);
            
            const url = URL.createObjectURL(file);
            const img = new Image();
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = url;
            });
            
            this.depthTexture = PIXI.Texture.from(img);
            console.log('Depth texture created');
            
            URL.revokeObjectURL(url);
            
            // For now, just mark as ready without applying effects
            this.isReady = true;
            
        } catch (error) {
            console.error('Failed to load depth map:', error);
            throw error;
        }
    }
    
    showImage() {
        if (!this.colorTexture) {
            console.log('No color texture to show');
            return;
        }
        
        console.log('Showing image...');
        
        // Remove test rectangle
        if (this.testRect) {
            this.app.stage.removeChild(this.testRect);
            this.testRect = null;
        }
        
        // Remove old sprite
        if (this.sprite) {
            this.app.stage.removeChild(this.sprite);
        }
        
        // Create new sprite
        this.sprite = new PIXI.Sprite(this.colorTexture);
        
        // Scale to fit
        const scaleX = this.options.width / this.colorTexture.width;
        const scaleY = this.options.height / this.colorTexture.height;
        const scale = Math.min(scaleX, scaleY);
        
        this.sprite.scale.set(scale);
        
        // Center
        this.sprite.x = (this.options.width - this.sprite.width) / 2;
        this.sprite.y = (this.options.height - this.sprite.height) / 2;
        
        console.log('Sprite positioned at:', this.sprite.x, this.sprite.y, 'scale:', scale);
        
        // Add to stage
        this.app.stage.addChild(this.sprite);
        
        console.log('Sprite added to stage, children count:', this.app.stage.children.length);
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
        
        this.addTestGraphics();
    }
    
    destroy() {
        if (this.app) {
            this.app.destroy(true, true);
            this.app = null;
        }
    }
}

window.SimpleDepthViewer = SimpleDepthViewer;