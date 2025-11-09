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
            width: props.width || 800,
            height: props.height || 600,
            backgroundColor: 0x0a0a0f,
            antialias: true,
            resizeTo: containerRef.current
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
        
        // Cleanup on unmount
        return () => {
            if (appRef.current) {
                appRef.current.destroy(true, true);
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
        loadImages: (colorFile, depthFile) => {
            if (viewerRef.current) {
                return viewerRef.current.loadImages(colorFile, depthFile);
            }
        },
        destroy: () => {
            if (appRef.current) {
                appRef.current.destroy(true, true);
            }
        }
    }));
    
    return <div ref={containerRef} className="w-full h-full" />;
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
        
        this.init();
    }
    
    init() {
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
    }
    
    async loadImages(colorFile, depthFile) {
        try {
            console.log('Loading images...', { colorFile: colorFile?.name, depthFile: depthFile?.name });
            
            if (colorFile) {
                await this.loadColorImage(colorFile);
            }
            
            if (depthFile) {
                await this.loadDepthMap(depthFile);
            }
            
            if (this.colorTexture && this.depthTexture) {
                this.setupDepthEffect();
            }
            
            return true;
        } catch (error) {
            console.error('Error loading images:', error);
            return false;
        }
    }
    
    async loadColorImage(source) {
        try {
            let texture;
            
            if (source instanceof File) {
                const url = URL.createObjectURL(source);
                texture = await PIXI.Texture.fromURL(url);
                URL.revokeObjectURL(url);
            } else if (typeof source === 'string') {
                texture = await PIXI.Texture.fromURL(source);
            } else {
                throw new Error('Invalid source type');
            }
            
            this.colorTexture = texture;
            console.log('Color image loaded:', texture.width, 'x', texture.height);
            
            return texture;
        } catch (error) {
            console.error('Failed to load color image:', error);
            throw error;
        }
    }
    
    async loadDepthMap(source) {
        try {
            let texture;
            
            if (source instanceof File) {
                const url = URL.createObjectURL(source);
                texture = await PIXI.Texture.fromURL(url);
                URL.revokeObjectURL(url);
            } else if (typeof source === 'string') {
                texture = await PIXI.Texture.fromURL(source);
            } else {
                throw new Error('Invalid source type');
            }
            
            this.depthTexture = texture;
            console.log('Depth map loaded:', texture.width, 'x', texture.height);
            
            return texture;
        } catch (error) {
            console.error('Failed to load depth map:', error);
            throw error;
        }
    }
    
    setupDepthEffect() {
        try {
            // Clear existing sprite
            if (this.sprite) {
                this.app.stage.removeChild(this.sprite);
            }
            
            // Create sprite with color texture
            this.sprite = new PIXI.Sprite(this.colorTexture);
            
            // Center and scale sprite to fit screen
            this.sprite.anchor.set(0.5);
            this.sprite.x = this.app.screen.width / 2;
            this.sprite.y = this.app.screen.height / 2;
            
            // Scale to fit while maintaining aspect ratio
            const scaleX = this.app.screen.width / this.colorTexture.width;
            const scaleY = this.app.screen.height / this.colorTexture.height;
            const scale = Math.min(scaleX, scaleY);
            this.sprite.scale.set(scale);
            
            // Create depth filter
            this.depthFilter = new DepthPerspectiveFilter(this.depthTexture, this.options.quality);
            this.sprite.filters = [this.depthFilter];
            
            // Add to stage
            this.app.stage.addChild(this.sprite);
            
            this.isReady = true;
            console.log('Depth effect setup complete');
            
        } catch (error) {
            console.error('Failed to setup depth effect:', error);
        }
    }
    
    updateDepthEffect() {
        if (!this.depthFilter || !this.isReady) return;
        
        // Update filter uniforms
        this.depthFilter.offset = [this.offset.x, this.offset.y];
        this.depthFilter.scale = this.options.depthScale * 0.015;
    }
    
    updateSettings(newOptions) {
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
        }
        this.isReady = false;
    }
}

DepthViewer.displayName = 'DepthViewer';

export default DepthViewer;