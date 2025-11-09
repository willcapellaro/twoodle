// Test if we can load sample images from URLs
// This file is for testing image loading functionality

export const sampleImages = [
  {
    name: "Test Color Image",
    color: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    depth: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGAkTxZjAAAAABJRU5ErkJggg=="
  }
];

// Function to create sample color and depth images programmatically  
export function createTestImages() {
  // Create a simple gradient color image
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = 400;
  colorCanvas.height = 300;
  const colorCtx = colorCanvas.getContext('2d');
  
  // Create a gradient
  const gradient = colorCtx.createLinearGradient(0, 0, 400, 300);
  gradient.addColorStop(0, '#00f5ff');
  gradient.addColorStop(0.5, '#39ff14'); 
  gradient.addColorStop(1, '#ff00ff');
  
  colorCtx.fillStyle = gradient;
  colorCtx.fillRect(0, 0, 400, 300);
  
  // Create a depth map (simple radial gradient)
  const depthCanvas = document.createElement('canvas');
  depthCanvas.width = 400;
  depthCanvas.height = 300;
  const depthCtx = depthCanvas.getContext('2d');
  
  const depthGradient = depthCtx.createRadialGradient(200, 150, 0, 200, 150, 150);
  depthGradient.addColorStop(0, '#ffffff'); // Near (white)
  depthGradient.addColorStop(1, '#000000'); // Far (black)
  
  depthCtx.fillStyle = depthGradient;
  depthCtx.fillRect(0, 0, 400, 300);
  
  return {
    colorCanvas,
    depthCanvas,
    getColorBlob: () => new Promise(resolve => colorCanvas.toBlob(resolve, 'image/png')),
    getDepthBlob: () => new Promise(resolve => depthCanvas.toBlob(resolve, 'image/png'))
  };
}