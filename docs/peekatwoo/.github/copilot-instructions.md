# Simple Depth Viewer - AI Coding Agent Instructions

## Project Overview
A modern React-based WebGL depth image viewer with cyberpunk aesthetic, creating mouse-controlled parallax effects using color images and depth maps. Built with React 18, Vite, Tailwind CSS, PIXI.js v7+, and FontAwesome icons.

## Architecture Components

### React Application Structure
- **`App.jsx`**: Main application component with cyberpunk UI and state management
- **`DepthViewer.jsx`**: React wrapper component for PIXI.js integration
- **`DepthPerspectiveFilter.js`**: Custom WebGL shader for depth-based parallax effects

### UI Design System
- **Theme**: Cyberpunk/80s monochrome aesthetic with bright cyan, neon accents
- **Colors**: `cyber-primary` (#00f5ff), `cyber-green` (#39ff14), `cyber-yellow` (#ffff00), `cyber-accent` (#ff00ff)
- **Typography**: Oxanium font family for futuristic monospace appearance
- **Layout**: Icon-only buttons, sliding console panel, grid backgrounds

### Core Classes
- **`DepthViewer`**: React component wrapping PIXI.js application lifecycle
- **`SimpleDepthViewer`**: Core viewer class handling texture loading and mouse interaction
- **`DepthPerspectiveFilter`**: WebGL shader implementing ray-marching parallax algorithm

## Development Workflow

### Local Development
```bash
npm run dev    # Starts Vite dev server on port 5173
npm run build  # Production build
npm run preview # Preview production build
```

### File Upload Conventions
- **Auto-detection**: Files containing `∂map`, `depth`, or `dmap` are treated as depth maps
- **Fallback**: With 2 files, first is color image, second is depth map
- **Supported**: JPG, JPEG, PNG formats
- **UI**: Drag-and-drop or click-to-upload interface

## React Integration Patterns

### PIXI.js Lifecycle Management
```jsx
useEffect(() => {
  // PIXI app initialization
  const app = new PIXI.Application({...});
  
  return () => {
    app.destroy(true, true); // Cleanup on unmount
  };
}, []);
```

### State Synchronization
- React state controls (`depthScale`, `sensitivity`) sync to PIXI filter uniforms
- `useImperativeHandle` exposes PIXI methods to parent components
- Real-time slider updates trigger shader uniform changes

### File Handling
- FileReader API for local file processing
- URL.createObjectURL for temporary texture loading
- Automatic cleanup with URL.revokeObjectURL

## Cyberpunk UI Components

### Icon System
- FontAwesome React components for all controls
- Color-coded by function: `cyber-primary` (upload), `cyber-green` (play), `cyber-yellow` (navigation)
- Hover effects with glow and scale transforms

### Console Panel
- Sliding right panel with grid background pattern
- Grouped controls: LOAD, DEPTH, DISPLAY, DEVICE
- Custom range sliders with cyberpunk styling

### Toast Notifications
- Bottom-center positioning with auto-dismiss
- Color-coded: success (green), error (red), info (cyan)
- CSS transitions for smooth appearance/disappearance

## WebGL Shader Architecture
- **Quality levels** (1-5): Control shader complexity via `MAXSTEPS`, `ENLARGE`, `CONFIDENCE_MAX`
- **Ray-marching**: Depth-based pixel displacement with occlusion handling
- **Uniforms**: `scale`, `offset`, `focus`, `enlarge` parameters for real-time control

## Build and Deploy
- **Vite**: Fast HMR development with React Fast Refresh
- **Tailwind**: Utility-first CSS with custom cyberpunk color palette
- **PostCSS**: Autoprefixer for cross-browser compatibility
- **ESLint**: Code quality with React-specific rules

When implementing new features, follow the established patterns of icon-based controls, cyberpunk color theming, and React-to-PIXI state synchronization.