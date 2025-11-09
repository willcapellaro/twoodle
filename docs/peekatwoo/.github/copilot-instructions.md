# AI Coding Instructions for Simple Depth Viewer

## Project Overview
A WebGL-powered depth image viewer creating parallax effects using color images and depth maps. Built with PIXI.js v7+ and adapted from the Depthy algorithm.

## Core Architecture

### Multi-Viewer Strategy
The project implements **3 distinct viewer classes** for fallback compatibility:
- `DepthyWebGLViewer` - Full Depthy algorithm implementation (primary)
- `SimpleDepthViewer` - PIXI.js-based viewer with custom shaders
- `BasicImageViewer` - HTML5 Canvas fallback

**Pattern**: Main app (`DepthViewerApp`) tries viewers in order until one works, handling WebGL/browser compatibility gracefully.

### Image Pairing Convention
Depth maps use special Unicode character `∂` (partial derivative symbol):
- Color image: `example.jpg`
- Depth map: `example-∂map.png`
- Variants: `example-∂mapL.png` (light), `example-∂mapD.png` (dark)
- Symmetry modes: `example-symH.jpg` (horizontal), `example-symV.jpg` (vertical)

**Critical**: Always preserve `∂map` naming when adding new sample images.

### Shader System
`DepthPerspectiveFilter.js` contains WebGL fragment shader performing:
1. Ray-marching through depth field for parallax
2. Per-pixel displacement based on mouse position and depth value
3. Quality scaling via `MAXSTEPS` defines (1-5 quality levels)

**Pattern**: Shader uniforms controlled via filter properties, not direct GL calls.

## Key Development Workflows

### Adding Sample Images
```bash
# Images auto-discovered from sample-images/ folder
# Place paired files: image.jpg + image-∂map.png
# App scans on startup, builds slideshow automatically
```

### Testing Viewer Compatibility
The app includes a **cheat code system** (4-button sequence) to:
- Switch between viewer implementations
- Debug rendering issues
- Test fallback behavior

**Debug Pattern**: Use browser console to see which viewer loaded successfully.

### Local Development
```bash
npm run dev    # Starts http-server on port 8080
# No build step - pure client-side JavaScript
```

## Critical Patterns

### Mouse/Touch Input Normalization
All viewers expect normalized coordinates (0-1) converted to shader uniforms:
```javascript
const normalizedX = (x * 2 - 1) * 0.5; // [-0.5, 0.5]
const normalizedY = (y * 2 - 1) * 0.5;
```

### Gyroscope Integration
Full device orientation support with per-axis controls:
- Inversion flags (`gyroInvertX`, `gyroInvertY`)
- Lock flags (`gyroLockX`, `gyroLockY`)
- Sensitivity scaling per axis

### Advanced Features
- **Localized Parallax**: Distance-based dampening around cursor
- **Symmetrical Drag**: Mirrored input for symmetrical images
- **Layer Dampening**: Different parallax intensity by depth zones
- **Animation System**: Smooth transitions between images

## File Organization
- `index.html` - Single-page app with embedded styles (914 lines)
- `js/main.js` - Main application logic (2267 lines)
- `js/DepthyWebGLViewer.js` - Primary WebGL implementation (1509 lines)
- `js/SimpleDepthViewer.js` - PIXI.js fallback (305 lines)
- `js/BasicImageViewer.js` - Canvas fallback (246 lines)
- `js/DepthPerspectiveFilter.js` - PIXI shader filter (146 lines)

## External Dependencies
- **PIXI.js v7.3.2** - Primary WebGL framework
- **http-server** - Development server (no bundling needed)

**Note**: No build process - all modules loaded as ES6 classes in browser.