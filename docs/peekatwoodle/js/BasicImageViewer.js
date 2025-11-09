/**
 * Ultra-Simple Image Viewer - Basic HTML5 Canvas Version
 * This will help us isolate if the issue is with PIXI.js or something else
 */
class BasicImageViewer {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            width: 800,
            height: 600,
            ...options
        };
        
        this.canvas = null;
        this.ctx = null;
        this.colorImage = null;
        this.depthImage = null;
        this.mouseOffset = { x: 0, y: 0 };
        this.isReady = false;
        
        this.init();
    }
    
    init() {
        console.log('Initializing BasicImageViewer...');
        
        // Create HTML5 canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;
        this.canvas.style.border = '1px solid #ddd';
        this.canvas.style.backgroundColor = '#222';
        
        this.ctx = this.canvas.getContext('2d');
        
        // Clear existing content and add canvas
        this.element.innerHTML = '';
        this.element.appendChild(this.canvas);
        
        // Setup mouse interaction
        this.setupMouseInteraction();
        
        console.log('Canvas created and added to DOM');
    }
    
    setupMouseInteraction() {
        this.canvas.addEventListener('mousemove', (event) => {
            if (!this.isReady) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            
            // Convert to -1 to 1 range with reduced sensitivity
            this.mouseOffset.x = (x * 2 - 1) * 0.3;
            this.mouseOffset.y = (y * 2 - 1) * 0.3;
            
            this.drawImageWithDepth();
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mouseOffset.x = 0;
            this.mouseOffset.y = 0;
            if (this.isReady) {
                this.drawImageWithDepth();
            }
        });
    }
    
    async loadColorImage(file) {
        try {
            console.log('Loading color image:', file.name || file);
            
            const img = new Image();
            
            await new Promise((resolve, reject) => {
                img.onload = () => {
                    console.log('Image loaded successfully:', img.width, 'x', img.height);
                    resolve();
                };
                img.onerror = (e) => {
                    console.error('Image load error:', e);
                    reject(e);
                };
                
                if (file instanceof File) {
                    const url = URL.createObjectURL(file);
                    img.src = url;
                } else {
                    img.src = file; // URL string
                }
            });
            
            this.colorImage = img;
            
            // If we have depth map too, enable interactive mode
            if (this.depthImage) {
                this.isReady = true;
                this.drawImageWithDepth();
            } else {
                this.drawImage();
            }
            
            console.log('Color image loaded and drawn');
            
        } catch (error) {
            console.error('Failed to load color image:', error);
            throw error;
        }
    }
    
    async loadDepthMap(file) {
        try {
            console.log('Loading depth map:', file.name || file);
            
            const img = new Image();
            
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                
                if (file instanceof File) {
                    const url = URL.createObjectURL(file);
                    img.src = url;
                } else {
                    img.src = file; // URL string
                }
            });
            
            this.depthImage = img;
            console.log('Depth map loaded');
            
            // Enable depth effect if we have both images
            if (this.colorImage && this.depthImage) {
                this.isReady = true;
                this.drawImageWithDepth();
            }
            
        } catch (error) {
            console.error('Failed to load depth map:', error);
            throw error;
        }
    }
    
    drawImage() {
        if (!this.colorImage) {
            console.log('No color image to draw');
            return;
        }
        
        console.log('Drawing image on canvas...');
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#222';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Calculate scale to fit
        const scaleX = this.canvas.width / this.colorImage.width;
        const scaleY = this.canvas.height / this.colorImage.height;
        const scale = Math.min(scaleX, scaleY);
        
        const drawWidth = this.colorImage.width * scale;
        const drawHeight = this.colorImage.height * scale;
        const x = (this.canvas.width - drawWidth) / 2;
        const y = (this.canvas.height - drawHeight) / 2;
        
        console.log('Drawing at:', x, y, 'size:', drawWidth, 'x', drawHeight);
        
        // Draw image
        this.ctx.drawImage(this.colorImage, x, y, drawWidth, drawHeight);
        
        console.log('Image drawn successfully');
    }
    
    drawImageWithDepth() {
        if (!this.colorImage || !this.depthImage) {
            this.drawImage();
            return;
        }
        
        console.log('Drawing with depth effect, offset:', this.mouseOffset);
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#222';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Calculate image dimensions
        const scaleX = this.canvas.width / this.colorImage.width;
        const scaleY = this.canvas.height / this.colorImage.height;
        const scale = Math.min(scaleX, scaleY);
        
        const drawWidth = this.colorImage.width * scale;
        const drawHeight = this.colorImage.height * scale;
        const baseX = (this.canvas.width - drawWidth) / 2;
        const baseY = (this.canvas.height - drawHeight) / 2;
        
        // Apply parallax offset based on mouse position
        const maxOffset = 20; // Maximum pixel offset
        const offsetX = this.mouseOffset.x * maxOffset;
        const offsetY = this.mouseOffset.y * maxOffset;
        
        // Draw image with offset
        this.ctx.drawImage(
            this.colorImage, 
            baseX + offsetX, 
            baseY + offsetY, 
            drawWidth, 
            drawHeight
        );
        
        // Add subtle depth visualization (optional)
        if (this.mouseOffset.x !== 0 || this.mouseOffset.y !== 0) {
            this.ctx.globalAlpha = 0.1;
            this.ctx.drawImage(
                this.depthImage, 
                baseX - offsetX * 0.5, 
                baseY - offsetY * 0.5, 
                drawWidth, 
                drawHeight
            );
            this.ctx.globalAlpha = 1.0;
        }
    }
    
    hasColorImage() {
        return !!this.colorImage;
    }
    
    hasDepthMap() {
        return !!this.depthImage;
    }
    
    reset() {
        this.colorImage = null;
        this.depthImage = null;
        this.isReady = false;
        this.mouseOffset = { x: 0, y: 0 };
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#222';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

window.SimpleDepthViewer = BasicImageViewer;