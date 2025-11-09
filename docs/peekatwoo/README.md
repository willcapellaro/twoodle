# Simple Depth Viewer

A minimal web-based depth image viewer that creates parallax effects using a color image and depth map. Move your mouse over the image to see the depth effect in action.

## Features

- Load color images and depth maps via file upload
- Real-time mouse-controlled parallax effects using WebGL shaders
- Clean, minimal interface
- Built with PIXI.js for high-performance WebGL rendering
- Adapted from the excellent [Depthy project](https://github.com/panrafal/depthy)

## Getting Started

### Prerequisites

- Modern web browser with WebGL support
- Node.js (for development server)

### Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:8080`

### Usage

1. **Load Images**: Use the file inputs to load:
   - A **color image** (the main image you want to view)
   - A **depth map** (a grayscale image where white = near, black = far)

2. **View Effect**: Once both images are loaded, move your mouse over the viewer to see the parallax depth effect

### Creating Depth Maps

You can create depth maps using:
- **Google Camera**: Use Portrait mode or Lens Blur feature
- **Photoshop**: Create a grayscale map manually
- **AI tools**: Use depth estimation models
- **3D software**: Render depth passes from 3D scenes

### Technical Details

This viewer uses a WebGL fragment shader to:
1. Sample the depth map to determine pixel depth
2. Offset pixels based on mouse position and depth value  
3. Create smooth parallax motion with depth-based displacement

The core algorithm performs ray-marching through the depth field to create realistic parallax with proper occlusion.

## Project Structure

```
simple-depth-viewer/
├── index.html              # Main HTML file
├── package.json            # Dependencies
├── js/
│   ├── DepthPerspectiveFilter.js  # WebGL shader filter
│   ├── SimpleDepthViewer.js       # Main viewer class
│   └── main.js                    # Application logic
└── samples/                       # Sample images (optional)
```

## API Reference

### SimpleDepthViewer Class

```javascript
const viewer = new SimpleDepthViewer(element, options);

// Load images
await viewer.loadColorImage(file);  // File or URL
await viewer.loadDepthMap(file);    // File or URL

// Configure viewer
viewer.setOptions({
    depthScale: 1.0,    // Intensity of depth effect
    focus: 0.5,         // Focus plane (0.0 = far, 1.0 = near) 
    quality: 3          // Quality level (1-5)
});

// Check state
viewer.hasColorImage();  // Boolean
viewer.hasDepthMap();    // Boolean
```

## Credits

- Original algorithm and shader code: [Depthy](https://github.com/panrafal/depthy) by Rafał Lindemann
- WebGL rendering: [PIXI.js](https://pixijs.com/)
- Adapted for modern browsers and simplified API

## License

MIT License - see the original Depthy project for full license details.