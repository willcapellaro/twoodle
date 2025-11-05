/**
 * True Depthy Implementation using WebGL
 * This uses the actual Depthy algorithm with per-pixel depth displacement
 */
class DepthyWebGLViewer {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            width: options.width || 800,
            height: options.height || 600,
            depthScale: options.depthScale || 1.0,
            focus: options.focus || 0.5,
            autoFocus: options.autoFocus || false,
            invertDepthLogic: options.invertDepthLogic || false,
            invertX: options.invertX || false,
            invertY: options.invertY || false,
            lockX: options.lockX || false,
            lockY: options.lockY || false,
            displayDepthmap: options.displayDepthmap || false,
            localizedParallax: options.localizedParallax || false,
            localizeDistance: options.localizeDistance || 150,
            backgroundDampening: options.backgroundDampening || 0.3,
            midgroundDampening: options.midgroundDampening || 0.7,
            ...options
        };
        
        this.canvas = null;
        this.gl = null;
        this.program = null;
        this.colorTexture = null;
        this.depthTexture = null;
        this.colorImage = null;
        this.depthImage = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.viewMode = 'fit'; // 'fit' or 'fill'
        this.imageAspectRatio = 1;
        this.canvasAspectRatio = this.options.width / this.options.height;
        
        // Interaction modes
        this.interactionMode = 'drag'; // 'hover' or 'drag'
        this.dragMode = 'sticky'; // 'sticky' or 'rubber-band'
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.currentOffset = { x: 0, y: 0 };
        this.targetOffset = { x: 0, y: 0 };
        
        // Localized parallax properties
        this.clickOrigin = { x: 0.5, y: 0.5 }; // Normalized coordinates of initial click
        this.currentFocusType = 1; // 0=near, 1=middle, 2=far
        
        // Fill mode panning
        this.panOffset = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.backgroundColor = '#000';
        this.canvas.style.touchAction = 'none';
        this.canvas.style.userSelect = 'none';
        
        // Set actual canvas size to match display size
        this.updateCanvasSize();
        
        this.container.innerHTML = '';
        this.container.appendChild(this.canvas);
        
        // Get WebGL context
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        
        if (!this.gl) {
            throw new Error('WebGL not supported');
        }
        
        console.log('🌟 HI THERE! NEW CODE IS LOADED! 🌟');
        console.log('WebGL context created');
        console.log('🚀 TOUCH UPDATE LOADED - Version 1.1');
        this.setupWebGL();
        this.setupEventListeners();
        this.setupResizeHandler();
    }
    
    updateCanvasSize() {
        const rect = this.container.getBoundingClientRect();
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        this.canvas.width = rect.width * devicePixelRatio;
        this.canvas.height = rect.height * devicePixelRatio;
        
        this.options.width = this.canvas.width;
        this.options.height = this.canvas.height;
        this.canvasAspectRatio = this.canvas.width / this.canvas.height;
        
        if (this.gl) {
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    setupResizeHandler() {
        window.addEventListener('resize', () => {
            this.updateCanvasSize();
            if (this.colorTexture && this.depthTexture) {
                this.render();
            }
        });
    }
    
    setupWebGL() {
        const gl = this.gl;
        
        // Vertex shader (simple quad)
        const vertexShaderSource = `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = a_texCoord;
            }
        `;
        
        // Fragment shader - The actual Depthy algorithm with aspect ratio correction!
        const fragmentShaderSource = `
            precision mediump float;
            
            uniform sampler2D u_colorTexture;
            uniform sampler2D u_depthTexture;
            uniform vec2 u_offset;
            uniform float u_depthScale;
            uniform float u_focus;
            uniform vec2 u_resolution;
            uniform vec4 u_imageRect; // x, y, width, height in normalized coords
            uniform int u_viewMode; // 0 = fit, 1 = fill
            uniform vec2 u_panOffset; // pan offset for fill mode
            uniform bool u_localizedParallax;
            uniform vec2 u_clickOrigin;
            uniform float u_localizeDistance;
            uniform float u_backgroundDampening;
            uniform float u_midgroundDampening;
            uniform int u_currentFocusType; // 0=near, 1=middle, 2=far
            
            varying vec2 v_texCoord;
            
            void main() {
                vec2 coord = v_texCoord;
                
                // Apply aspect ratio correction based on view mode
                vec2 imageCoord;
                if (u_viewMode == 0) {
                    // Fit mode - map canvas coords to image rect
                    imageCoord = (coord - u_imageRect.xy) / u_imageRect.zw;
                } else {
                    // Fill mode - scale, center, and apply pan offset
                    imageCoord = coord * u_imageRect.zw + u_imageRect.xy + u_panOffset;
                }
                
                // Check if we're outside the image bounds
                if (imageCoord.x < 0.0 || imageCoord.x > 1.0 || 
                    imageCoord.y < 0.0 || imageCoord.y > 1.0) {
                    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Black bars
                    return;
                }
                
                // Sample depth value (0.0 = far, 1.0 = near)
                float depth = texture2D(u_depthTexture, imageCoord).r;
                
                // Calculate displacement based on depth, focus, and mouse offset
                // This is the core Depthy algorithm
                float depthFactor = (depth - u_focus) * u_depthScale;
                
                // Apply dampening when localized parallax and auto focus are both enabled
                if (u_localizedParallax) {
                    if (u_currentFocusType == 2) {
                        // Far plane (background) - apply background dampening
                        depthFactor *= u_backgroundDampening;
                    } else if (u_currentFocusType == 1) {
                        // Middle plane (midground) - apply midground dampening  
                        depthFactor *= u_midgroundDampening;
                    }
                    // Near plane (u_currentFocusType == 0) - no dampening
                }
                
                vec2 displacement = u_offset * depthFactor * 0.02; // Scale factor
                
                // Apply localized parallax if enabled
                if (u_localizedParallax) {
                    // Convert localizeDistance from pixels to normalized coordinates
                    float normalizedDistance = u_localizeDistance / min(u_resolution.x, u_resolution.y);
                    
                    // Calculate distance from click origin to current pixel
                    vec2 originInImage;
                    if (u_viewMode == 0) {
                        // Fit mode - convert click origin to image space
                        originInImage = u_clickOrigin;
                    } else {
                        // Fill mode - adjust for pan offset
                        originInImage = u_clickOrigin - u_panOffset;
                    }
                    
                    float distanceFromOrigin = length(imageCoord - originInImage);
                    
                    // Create a falloff factor: full effect at origin, fades to 0 at distance
                    float falloff = 1.0 - smoothstep(0.0, normalizedDistance, distanceFromOrigin);
                    
                    // Apply the falloff to the displacement
                    displacement *= falloff;
                }
                
                // Sample color with displacement
                vec2 sampleCoord = imageCoord + displacement;
                
                // Handle edge cases - use original pixel if outside bounds
                if (sampleCoord.x < 0.0 || sampleCoord.x > 1.0 || 
                    sampleCoord.y < 0.0 || sampleCoord.y > 1.0) {
                    gl_FragColor = texture2D(u_colorTexture, imageCoord);
                } else {
                    gl_FragColor = texture2D(u_colorTexture, sampleCoord);
                }
            }
        `;
        
        // Create shaders
        const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
        
        // Create program
        this.program = this.createProgram(vertexShader, fragmentShader);
        
        // Create quad geometry
        this.setupGeometry();
        
        console.log('WebGL shaders compiled successfully');
    }
    
    createShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    createProgram(vertexShader, fragmentShader) {
        const gl = this.gl;
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program linking error:', gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        
        return program;
    }
    
    setupGeometry() {
        const gl = this.gl;
        
        // Create quad vertices (two triangles)
        const vertices = new Float32Array([
            // Position, TexCoord
            -1.0, -1.0,  0.0, 1.0,
             1.0, -1.0,  1.0, 1.0,
            -1.0,  1.0,  0.0, 0.0,
            -1.0,  1.0,  0.0, 0.0,
             1.0, -1.0,  1.0, 1.0,
             1.0,  1.0,  1.0, 0.0
        ]);
        
        // Create buffer
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        
        // Get attribute locations
        this.positionLocation = gl.getAttribLocation(this.program, 'a_position');
        this.texCoordLocation = gl.getAttribLocation(this.program, 'a_texCoord');
        
        // Get uniform locations
        this.colorTextureLocation = gl.getUniformLocation(this.program, 'u_colorTexture');
        this.depthTextureLocation = gl.getUniformLocation(this.program, 'u_depthTexture');
        this.offsetLocation = gl.getUniformLocation(this.program, 'u_offset');
        this.depthScaleLocation = gl.getUniformLocation(this.program, 'u_depthScale');
        this.focusLocation = gl.getUniformLocation(this.program, 'u_focus');
        this.resolutionLocation = gl.getUniformLocation(this.program, 'u_resolution');
        this.imageRectLocation = gl.getUniformLocation(this.program, 'u_imageRect');
        this.viewModeLocation = gl.getUniformLocation(this.program, 'u_viewMode');
        this.panOffsetLocation = gl.getUniformLocation(this.program, 'u_panOffset');
        this.localizedParallaxLocation = gl.getUniformLocation(this.program, 'u_localizedParallax');
        this.clickOriginLocation = gl.getUniformLocation(this.program, 'u_clickOrigin');
        this.localizeDistanceLocation = gl.getUniformLocation(this.program, 'u_localizeDistance');
        this.backgroundDampeningLocation = gl.getUniformLocation(this.program, 'u_backgroundDampening');
        this.midgroundDampeningLocation = gl.getUniformLocation(this.program, 'u_midgroundDampening');
        this.currentFocusTypeLocation = gl.getUniformLocation(this.program, 'u_currentFocusType');
    }
    
    setupEventListeners() {
        // Helper function to get coordinates from mouse or touch event
        const getEventCoords = (event) => {
            const rect = this.canvas.getBoundingClientRect();
            let clientX, clientY;
            
            if (event.touches && event.touches.length > 0) {
                // Touch event
                clientX = event.touches[0].clientX;
                clientY = event.touches[0].clientY;
            } else if (event.changedTouches && event.changedTouches.length > 0) {
                // Touch end event
                clientX = event.changedTouches[0].clientX;
                clientY = event.changedTouches[0].clientY;
            } else {
                // Mouse event
                clientX = event.clientX;
                clientY = event.clientY;
            }
            
            return {
                x: (clientX - rect.left) / rect.width,
                y: (clientY - rect.top) / rect.height
            };
        };
        
        // Start drag (mouse or touch)
        const handleDragStart = (event) => {
            console.log('Drag start:', event.type, event);
            if (!this.colorTexture || !this.depthTexture) return;
            
            event.preventDefault(); // Prevent default touch behaviors
            this.isDragging = true;
            const coords = getEventCoords(event);
            this.dragStart.x = coords.x;
            this.dragStart.y = coords.y;
            
            console.log('Drag start coords:', coords);
            
            // Auto focus detection for rubber band mode
            if (this.dragMode === 'rubber-band' && this.options.autoFocus) {
                const depthValue = this.sampleDepthAtLocation(coords.x, coords.y);
                const focusResult = this.depthToFocusPlane(depthValue, this.options.invertDepthLogic);
                this.options.focus = focusResult.value;
                
                // Store focus type for dampening
                this.currentFocusType = focusResult.type === 'near' ? 0 : focusResult.type === 'middle' ? 1 : 2;
                
                console.log('Auto focus set to:', focusResult.value, focusResult.type, 'type index:', this.currentFocusType);
                
                // Notify about focus type change if callback exists
                if (this.onAutoFocusChange) {
                    this.onAutoFocusChange(focusResult.type);
                }
            }
            
            // Store click origin for localized parallax in rubber-band mode
            if (this.dragMode === 'rubber-band' && this.options.localizedParallax) {
                this.clickOrigin.x = this.dragStart.x;
                this.clickOrigin.y = this.dragStart.y;
            }
            
            this.canvas.style.cursor = 'grabbing';
        };
        
        // Drag move (mouse or touch)
        const handleDragMove = (event) => {
            if (!this.colorTexture || !this.depthTexture) return;
            if (!this.isDragging) return;
            
            event.preventDefault(); // Prevent scrolling on touch devices
            const coords = getEventCoords(event);
            
            console.log('Drag move coords:', coords);
            
            // Calculate drag offset for depth effect
            const sensitivity = this.options.sensitivity || 1.0;
            let deltaX = (coords.x - this.dragStart.x) * sensitivity;
            let deltaY = (coords.y - this.dragStart.y) * sensitivity;
            
            // Apply invert options
            if (this.options.invertX) deltaX *= -1;
            if (this.options.invertY) deltaY *= -1;
            
            // Apply lock options
            if (this.options.lockX) deltaX = 0;
            if (this.options.lockY) deltaY = 0;
            
            this.targetOffset.x = deltaX * -2; // Default invert X for natural movement
            this.targetOffset.y = deltaY * 2;
            
            console.log('Target offset:', this.targetOffset);
            
            this.updateMouseOffset();
            this.render();
        };
        
        // End drag (mouse or touch)
        const handleDragEnd = (event) => {
            if (!this.isDragging) return;
            
            event.preventDefault();
            this.isDragging = false;
            this.canvas.style.cursor = 'grab';
            
            if (this.dragMode === 'sticky') {
                // Keep current position
                this.currentOffset = { ...this.targetOffset };
            } else {
                // Rubber-band back to center
                this.targetOffset = { x: 0, y: 0 };
                this.animateToTarget();
            }
        };
        
        // Mouse events
        this.canvas.addEventListener('mousedown', handleDragStart);
        this.canvas.addEventListener('mousemove', handleDragMove);
        this.canvas.addEventListener('mouseup', handleDragEnd);
        this.canvas.addEventListener('mouseleave', () => {
            if (this.isDragging && this.dragMode === 'rubber-band') {
                this.isDragging = false;
                this.canvas.style.cursor = 'grab';
                this.targetOffset = { x: 0, y: 0 };
                this.animateToTarget();
            }
        });
        
        // Touch events
        this.canvas.addEventListener('touchstart', (e) => {
            console.log('🔥 TOUCH START detected!', e.touches.length, 'touches');
            handleDragStart(e);
        }, { passive: false });
        
        this.canvas.addEventListener('touchmove', (e) => {
            console.log('🔥 TOUCH MOVE detected!');
            handleDragMove(e);
        }, { passive: false });
        
        this.canvas.addEventListener('touchend', (e) => {
            console.log('🔥 TOUCH END detected!');
            handleDragEnd(e);
        }, { passive: false });
        
        // Scroll/pan for fill mode
        this.canvas.addEventListener('wheel', (event) => {
            if (this.viewMode === 'fill' && this.colorTexture) {
                event.preventDefault();
                
                const sensitivity = 0.001;
                this.panOffset.x -= event.deltaX * sensitivity;
                this.panOffset.y -= event.deltaY * sensitivity;
                
                // Clamp pan offset to prevent showing outside image bounds
                this.clampPanOffset();
                this.render();
            }
        }, { passive: false });
        
        // Set cursor
        this.canvas.style.cursor = 'grab';
        
        // Keyboard event for 'D' key (depth map display)
        document.addEventListener('keydown', (event) => {
            if (event.key.toLowerCase() === 'd' && !event.repeat) {
                this.options.displayDepthmap = !this.options.displayDepthmap;
                console.log('Display depthmap:', this.options.displayDepthmap);
                if (this.onDepthmapToggle) {
                    this.onDepthmapToggle(this.options.displayDepthmap);
                }
                this.render();
            }
        });
    }
    
    async loadColorImage(source) {
        try {
            console.log('Loading color image:', source);
            
            const img = new Image();
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                
                if (source instanceof File) {
                    const url = URL.createObjectURL(source);
                    img.src = url;
                } else {
                    img.src = source;
                }
            });
            
            this.colorImage = img;
            this.colorTexture = this.createTexture(img);
            this.imageAspectRatio = img.width / img.height;
            console.log('Color texture created, aspect ratio:', this.imageAspectRatio);
            
            if (this.depthTexture) {
                this.render();
            }
            
        } catch (error) {
            console.error('Failed to load color image:', error);
            throw error;
        }
    }
    
    async loadDepthMap(source) {
        try {
            console.log('Loading depth map:', source);
            
            const img = new Image();
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                
                if (source instanceof File) {
                    const url = URL.createObjectURL(source);
                    img.src = url;
                } else {
                    img.src = source;
                }
            });
            
            this.depthImage = img;
            this.depthTexture = this.createTexture(img);
            console.log('Depth texture created');
            
            if (this.colorTexture) {
                this.render();
            }
            
        } catch (error) {
            console.error('Failed to load depth map:', error);
            throw error;
        }
    }
    
    createTexture(image) {
        const gl = this.gl;
        const texture = gl.createTexture();
        
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        
        // Set texture parameters
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        
        return texture;
    }
    
    calculateImageRect() {
        if (this.viewMode === 'fit') {
            // Fit mode - show entire image with letterboxing
            if (this.imageAspectRatio > this.canvasAspectRatio) {
                // Image is wider - fit to width, letterbox top/bottom
                const height = 1.0 / this.imageAspectRatio * this.canvasAspectRatio;
                const y = (1.0 - height) / 2.0;
                return [0.0, y, 1.0, height];
            } else {
                // Image is taller - fit to height, pillarbox left/right
                const width = this.imageAspectRatio / this.canvasAspectRatio;
                const x = (1.0 - width) / 2.0;
                return [x, 0.0, width, 1.0];
            }
        } else {
            // Fill mode - crop image to fill canvas
            if (this.imageAspectRatio > this.canvasAspectRatio) {
                // Image is wider - crop sides
                const width = this.canvasAspectRatio / this.imageAspectRatio;
                const x = -(1.0 - width) / 2.0;
                return [x, 0.0, width, 1.0];
            } else {
                // Image is taller - crop top/bottom
                const height = this.imageAspectRatio / this.canvasAspectRatio;
                const y = -(1.0 - height) / 2.0;
                return [0.0, y, 1.0, height];
            }
        }
    }
    
    updateMouseOffset() {
        if (this.dragMode === 'sticky') {
            this.mouseX = this.currentOffset.x + this.targetOffset.x;
            this.mouseY = this.currentOffset.y + this.targetOffset.y;
        } else {
            this.mouseX = this.targetOffset.x;
            this.mouseY = this.targetOffset.y;
        }
    }
    
    animateToTarget() {
        const lerp = (start, end, factor) => start + (end - start) * factor;
        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
        
        let startTime = null;
        const duration = 800; // ms
        
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            
            this.mouseX = lerp(this.mouseX, this.targetOffset.x, easedProgress * 0.1);
            this.mouseY = lerp(this.mouseY, this.targetOffset.y, easedProgress * 0.1);
            
            this.render();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.currentOffset = { ...this.targetOffset };
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    clampPanOffset() {
        // Calculate image rect for fill mode
        const imageRect = this.calculateImageRect();
        
        // Clamp pan to prevent showing outside image bounds
        const maxPanX = Math.max(0, (imageRect[2] - 1.0) / 2);
        const maxPanY = Math.max(0, (imageRect[3] - 1.0) / 2);
        
        this.panOffset.x = Math.max(-maxPanX, Math.min(maxPanX, this.panOffset.x));
        this.panOffset.y = Math.max(-maxPanY, Math.min(maxPanY, this.panOffset.y));
    }
    
    setViewMode(mode) {
        this.viewMode = mode;
        this.panOffset = { x: 0, y: 0 }; // Reset pan when switching modes
        if (this.colorTexture && this.depthTexture) {
            this.render();
        }
    }
    
    setInteractionMode(mode, dragMode = 'sticky') {
        this.interactionMode = mode;
        this.dragMode = dragMode;
        
        // Reset offsets when changing modes
        if (mode === 'hover') {
            this.currentOffset = { x: 0, y: 0 };
            this.targetOffset = { x: 0, y: 0 };
            this.mouseX = 0;
            this.mouseY = 0;
            if (this.colorTexture && this.depthTexture) {
                this.render();
            }
        }
    }
    
    render() {
        if (!this.colorTexture || !this.depthTexture) return;
        
        const gl = this.gl;
        
        // Set viewport
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        
        // Clear
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // Use program
        gl.useProgram(this.program);
        
        // Bind textures
        gl.activeTexture(gl.TEXTURE0);
        // Use depth map as color texture if display mode is enabled
        const textureToDisplay = this.options.displayDepthmap ? this.depthTexture : this.colorTexture;
        gl.bindTexture(gl.TEXTURE_2D, textureToDisplay);
        gl.uniform1i(this.colorTextureLocation, 0);
        
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
        gl.uniform1i(this.depthTextureLocation, 1);
        
        // Calculate and set uniforms
        const imageRect = this.calculateImageRect();
        gl.uniform2f(this.offsetLocation, this.mouseX, this.mouseY);
        gl.uniform1f(this.depthScaleLocation, this.options.depthScale);
        gl.uniform1f(this.focusLocation, this.options.focus);
        gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);
        gl.uniform4f(this.imageRectLocation, imageRect[0], imageRect[1], imageRect[2], imageRect[3]);
        gl.uniform1i(this.viewModeLocation, this.viewMode === 'fit' ? 0 : 1);
        gl.uniform2f(this.panOffsetLocation, this.panOffset.x, this.panOffset.y);
        
        // Set localized parallax uniforms
        gl.uniform1i(this.localizedParallaxLocation, this.options.localizedParallax && this.dragMode === 'rubber-band' ? 1 : 0);
        gl.uniform2f(this.clickOriginLocation, this.clickOrigin.x, this.clickOrigin.y);
        gl.uniform1f(this.localizeDistanceLocation, this.options.localizeDistance);
        gl.uniform1f(this.backgroundDampeningLocation, this.options.backgroundDampening);
        gl.uniform1f(this.midgroundDampeningLocation, this.options.midgroundDampening);
        gl.uniform1i(this.currentFocusTypeLocation, this.currentFocusType);
        
        // Setup attributes
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        
        gl.enableVertexAttribArray(this.positionLocation);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 16, 0);
        
        gl.enableVertexAttribArray(this.texCoordLocation);
        gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, 16, 8);
        
        // Draw
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        
        console.log('Rendered with Depthy algorithm, mouse offset:', this.mouseX, this.mouseY);
    }
    
    hasColorImage() {
        return !!this.colorImage;
    }
    
    hasDepthMap() {
        return !!this.depthImage;
    }
    
    sampleDepthAtLocation(normalizedX, normalizedY) {
        if (!this.depthImage) return 0.5; // Default to middle if no depth map
        
        // Create a canvas to sample the depth map
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match depth image
        canvas.width = this.depthImage.width;
        canvas.height = this.depthImage.height;
        
        // Draw the depth image to canvas
        ctx.drawImage(this.depthImage, 0, 0);
        
        // Calculate sample area (10px radius around click point)
        const centerX = Math.floor(normalizedX * canvas.width);
        const centerY = Math.floor(normalizedY * canvas.height);
        const sampleRadius = 10;
        
        // Sample pixels in the area
        let totalValue = 0;
        let sampleCount = 0;
        
        for (let x = centerX - sampleRadius; x <= centerX + sampleRadius; x++) {
            for (let y = centerY - sampleRadius; y <= centerY + sampleRadius; y++) {
                if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
                    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                    if (distance <= sampleRadius) {
                        const imageData = ctx.getImageData(x, y, 1, 1);
                        // Use red channel for grayscale depth value (0-255)
                        const depthValue = imageData.data[0] / 255; // Normalize to 0-1
                        totalValue += depthValue;
                        sampleCount++;
                    }
                }
            }
        }
        
        const averageDepth = sampleCount > 0 ? totalValue / sampleCount : 0.5;
        console.log(`Sampled depth at (${normalizedX.toFixed(2)}, ${normalizedY.toFixed(2)}): ${averageDepth.toFixed(3)}`);
        return averageDepth;
    }
    
    depthToFocusPlane(depthValue, invert = false) {
        // Convert depth value to focus plane setting
        // Dark (low values) = Far, Light (high values) = Near
        let focusValue;
        let focusType;
        
        if (depthValue < 0.33) {
            focusValue = invert ? 0.2 : 0.8; // Dark = Far (unless inverted)
            focusType = invert ? 'near' : 'far';
        } else if (depthValue < 0.66) {
            focusValue = 0.5; // Medium = Middle
            focusType = 'middle';
        } else {
            focusValue = invert ? 0.8 : 0.2; // Light = Near (unless inverted)
            focusType = invert ? 'far' : 'near';
        }
        
        console.log(`Depth ${depthValue.toFixed(3)} mapped to focus ${focusValue} (${focusType}) (invert: ${invert})`);
        return { value: focusValue, type: focusType };
    }
    
    setOptions(options) {
        Object.assign(this.options, options);
        if (this.colorTexture && this.depthTexture) {
            this.render();
        }
    }
    
    reset() {
        this.colorTexture = null;
        this.depthTexture = null;
        this.colorImage = null;
        this.depthImage = null;
        this.mouseX = 0;
        this.mouseY = 0;
        
        if (this.gl) {
            this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        }
    }
}

// Export for use
window.SimpleDepthViewer = DepthyWebGLViewer;