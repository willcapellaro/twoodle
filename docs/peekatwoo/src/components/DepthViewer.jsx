import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import * as PIXI from 'pixi.js';
import { DepthPerspectiveFilter } from './DepthPerspectiveFilter.js';

/**
 * React component wrapper for PIXI.js depth viewer
 */
const DepthViewer = forwardRef((props, ref) => {
    const containerRef = useRef(null);
    const appRef = useRef(null);
    const viewerRef = useRef(null);
    
    useEffect(() => {
        // Initialize PIXI application
        const app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x141420,
            antialias: true,
            resizeTo: window
        });
        
        appRef.current = app;
        
        // Create viewer instance
        const viewer = new SimpleDepthViewer(app, {
            depthScale: props.depthScale || 1.0,
            sensitivity: props.sensitivity || 1.0,
            hover: props.hover !== false
        });
        
        viewerRef.current = viewer;
        
        // Add canvas to DOM
        if (containerRef.current) {
            containerRef.current.appendChild(app.view);
        }
        
        console.log('DepthViewer initialized', { app, viewer });
        
        // Cleanup on unmount
        return () => {
            if (appRef.current) {
                appRef.current.destroy(true, true);
                appRef.current = null;
            }
        };
    }, []);
    
    // Update viewer settings when props change
    useEffect(() => {
        if (viewerRef.current) {
            viewerRef.current.updateSettings({
                depthScale: props.depthScale,
                sensitivity: props.sensitivity,
                showDepthMap: props.showDepthMap
            });
        }
    }, [props.depthScale, props.sensitivity, props.showDepthMap]);
    
    // Expose viewer methods to parent component
    useImperativeHandle(ref, () => ({
        loadImages: async (colorFile, depthFile) => {
            console.log('DepthViewer.loadImages called', { colorFile: colorFile?.name, depthFile: depthFile?.name });
            if (viewerRef.current) {
                return await viewerRef.current.loadImages(colorFile, depthFile);
            }
            return false;
        },
        destroy: () => {
            if (appRef.current) {
                appRef.current.destroy(true, true);
            }
        }
    }));
    
    return (
        <div 
            ref={containerRef} 
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
        />
    );
});

/**
 * Simple Depth Viewer class for PIXI.js integration
 */
class SimpleDepthViewer {
    constructor(app, options = {}) {
        this.app = app;
        this.options = {
            depthScale: 1.0,
            sensitivity: 1.0,
            focus: 0.5,
            quality: 3,
            hover: true,
            ...options
        };
        
        this.colorTexture = null;
        this.depthTexture = null;
        this.sprite = null;
        this.depthFilter = null;
        this.isReady = false;
        
        this.offset = { x: 0, y: 0 };
        
        console.log('SimpleDepthViewer created with options:', this.options);
        
        this.init();
    }
    
    init() {
        // Add a test graphic to verify PIXI is working
        this.addTestGraphic();
        
        // Setup mouse interaction
        if (this.options.hover) {
            this.setupHover();
        }
    }
    
    addTestGraphic() {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0x00f5ff, 0.3);
        graphics.drawCircle(0, 0, 50);
        graphics.endFill();
        graphics.x = this.app.screen.width / 2;
        graphics.y = this.app.screen.height / 2;
        
        this.app.stage.addChild(graphics);
        this.testGraphic = graphics;
        
        console.log('Test graphic added to stage');
    }
    
    setupHover() {
        const canvas = this.app.view;
        
        const onMouseMove = (event) => {
            if (!this.isReady) return;
            
            const rect = canvas.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            
            // Convert to -1 to 1 range and apply scaling
            const normalizedX = (x * 2 - 1) * this.options.sensitivity;
            const normalizedY = (y * 2 - 1) * this.options.sensitivity;
            
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
        
        console.log('Mouse interaction setup complete');
    }
    
    async loadImages(colorFile, depthFile) {
        try {
            console.log('SimpleDepthViewer.loadImages starting...', { 
                colorFile: colorFile?.name, 
                depthFile: depthFile?.name 
            });
            
            if (colorFile) {
                console.log('Loading color image...');
                await this.loadColorImage(colorFile);
            }
            
            if (depthFile) {
                console.log('Loading depth map...');
                await this.loadDepthMap(depthFile);
            }
            
            if (this.colorTexture && this.depthTexture) {
                console.log('Both textures loaded, setting up depth effect...');
                this.setupDepthEffect();
            } else {
                console.warn('Missing textures:', { 
                    hasColor: !!this.colorTexture, 
                    hasDepth: !!this.depthTexture 
                });
            }
            
            return true;
        } catch (error) {
            console.error('Error in loadImages:', error);
            return false;
        }
    }
    
    async loadColorImage(source) {
        try {
            console.log('loadColorImage starting with source:', source);
            
            let texture;
            
            if (source instanceof File) {
                const url = URL.createObjectURL(source);
                console.log('Created object URL:', url);
                
                texture = await PIXI.Texture.fromURL(url);
                URL.revokeObjectURL(url);
                
                console.log('Color texture loaded from file:', {
                    width: texture.width,
                    height: texture.height,
                    valid: texture.valid
                });
            } else if (typeof source === 'string') {
                texture = await PIXI.Texture.fromURL(source);
                console.log('Color texture loaded from URL');
            } else {
                throw new Error('Invalid source type for color image');
            }
            
            this.colorTexture = texture;
            console.log('Color image set successfully');
            
            return texture;
        } catch (error) {
            console.error('Failed to load color image:', error);
            throw error;
        }
    }
    
    async loadDepthMap(source) {
        try {
            console.log('loadDepthMap starting with source:', source);
            
            let texture;
            
            if (source instanceof File) {
                const url = URL.createObjectURL(source);
                console.log('Created depth map object URL:', url);
                
                texture = await PIXI.Texture.fromURL(url);
                URL.revokeObjectURL(url);
                
                console.log('Depth texture loaded from file:', {
                    width: texture.width,
                    height: texture.height,
                    valid: texture.valid
                });
            } else if (typeof source === 'string') {
                texture = await PIXI.Texture.fromURL(source);
                console.log('Depth texture loaded from URL');
            } else {
                throw new Error('Invalid source type for depth map');
            }
            
            this.depthTexture = texture;
            console.log('Depth map set successfully');
            
            return texture;
        } catch (error) {
            console.error('Failed to load depth map:', error);
            throw error;
        }
    }
    
    setupDepthEffect() {
        try {
            console.log('setupDepthEffect starting...');
            
            // Remove test graphic
            if (this.testGraphic) {
                this.app.stage.removeChild(this.testGraphic);
                this.testGraphic = null;
            }
            
            // Clear existing sprite
            if (this.sprite) {
                this.app.stage.removeChild(this.sprite);
                this.sprite = null;
            }
            
            // Create sprite with color texture
            this.sprite = new PIXI.Sprite(this.colorTexture);
            console.log('Sprite created with texture:', {
                textureWidth: this.colorTexture.width,
                textureHeight: this.colorTexture.height
            });
            
            // Center and scale sprite to fit screen
            this.sprite.anchor.set(0.5);
            this.sprite.x = this.app.screen.width / 2;
            this.sprite.y = this.app.screen.height / 2;
            
            // Scale to fit while maintaining aspect ratio
            const scaleX = this.app.screen.width / this.colorTexture.width;
            const scaleY = this.app.screen.height / this.colorTexture.height;
            const scale = Math.min(scaleX, scaleY) * 0.9; // Slightly smaller to ensure it fits
            this.sprite.scale.set(scale);
            
            console.log('Sprite positioned and scaled:', {
                x: this.sprite.x,
                y: this.sprite.y,
                scale: scale,
                screenWidth: this.app.screen.width,
                screenHeight: this.app.screen.height
            });
            
            // Create depth filter
            this.depthFilter = new DepthPerspectiveFilter(this.depthTexture, this.options.quality);
            this.sprite.filters = [this.depthFilter];
            console.log('Depth filter created and applied');
            
            // Add to stage
            this.app.stage.addChild(this.sprite);
            console.log('Sprite added to stage');
            
            this.isReady = true;
            console.log('Depth effect setup complete, viewer is ready');
            
        } catch (error) {
            console.error('Failed to setup depth effect:', error);
        }
    }
    
    updateDepthEffect() {
        if (!this.depthFilter || !this.isReady) return;
        
        // Update filter uniforms
        this.depthFilter.offset = [this.offset.x, this.offset.y];
        this.depthFilter.scale = this.options.depthScale * 0.015;
        
        // Debug log occasionally
        if (Math.random() < 0.01) {
            console.log('Depth effect updated:', {
                offset: this.offset,
                scale: this.depthFilter.scale
            });
        }
    }
    
    updateSettings(newOptions) {
        console.log('Updating settings:', newOptions);
        this.options = { ...this.options, ...newOptions };
        
        if (this.depthFilter) {
            this.depthFilter.scale = this.options.depthScale * 0.015;
            this.depthFilter.focus = this.options.focus || 0.5;
        }
        
        this.updateDepthEffect();
    }
    
    destroy() {
        if (this.sprite) {
            this.app.stage.removeChild(this.sprite);
            this.sprite = null;
        }
        if (this.testGraphic) {
            this.app.stage.removeChild(this.testGraphic);
            this.testGraphic = null;
        }
        this.isReady = false;
        console.log('SimpleDepthViewer destroyed');
    }
}

DepthViewer.displayName = 'DepthViewer';

export default DepthViewer;