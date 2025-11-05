# Sample Images

This directory is for sample color images and depth maps for testing the viewer.

## Getting Sample Images

You can find sample depth image pairs at:

1. **Original Depthy Samples**: Check the [Depthy GitHub repo](https://github.com/panrafal/depthy) samples folder
2. **Google Camera**: Take photos with Portrait mode or Lens Blur
3. **Create Your Own**: Use any image + create a grayscale depth map where:
   - White pixels = objects closer to camera
   - Black pixels = objects further from camera
   - Gray levels = intermediate distances

## File Naming Convention

For organization, consider naming files like:
- `image_color.jpg` - The main color image
- `image_depth.jpg` - The corresponding depth map

## Supported Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)  
- WebP (.webp)
- Any format supported by the browser's Image API