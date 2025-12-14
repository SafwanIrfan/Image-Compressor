# Online Image Compressor

A modern, user-friendly image compression tool built with React and Vite. Compress your images directly in the browser - no uploads, no server, complete privacy.

## Features

- 🚀 **Fast & Private** - All processing happens in your browser
- 🎨 **Beautiful UI** - Modern, responsive design
- 📊 **Live Preview** - See before/after comparison instantly
- ⚙️ **Customizable** - Adjust quality and max dimensions
- 💾 **Easy Download** - One-click download of compressed images
- 📱 **Mobile Friendly** - Works on all devices

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - The app will be available at `http://localhost:5173` (or the port shown in terminal)
   - Open this URL in your web browser

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` folder. You can preview the production build with:

```bash
npm run preview
```

## How to Use

1. **Upload an Image:**
   - Drag and drop an image onto the drop zone, or
   - Click "Choose a file" to browse and select an image
   - Supported formats: JPG, PNG

2. **Adjust Settings:**
   - **Quality Slider**: Control compression quality (20% - 100%)
     - Lower quality = smaller file size but lower image quality
     - Higher quality = larger file size but better image quality
   - **Max Dimension**: Set maximum width or height (600px - 2400px)
     - Images larger than this will be resized proportionally

3. **Preview Results:**
   - See side-by-side comparison of original and compressed images
   - View file sizes and compression percentage
   - Check image dimensions

4. **Download:**
   - Click "Download compressed" to save your compressed image
   - The file will be saved with "compressed-" prefix

5. **Start Over:**
   - Click "Clear" to remove the current image and start fresh

## Tips for Best Results

- **For photos**: Use quality 70-85% for a good balance
- **For graphics/logos**: Use quality 85-100% to preserve sharpness
- **For web use**: Max dimension of 1200-1600px is usually sufficient
- **For social media**: Check platform requirements and adjust accordingly

## Technical Details

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Image Processing**: HTML5 Canvas API
- **No External Dependencies**: Pure browser-based compression

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

Free to use for personal and commercial projects.

## Troubleshooting

**App won't start:**
- Make sure Node.js is installed: `node --version`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

**Images not compressing:**
- Check browser console for errors
- Make sure the image file is not corrupted
- Try a different image format

**Download not working:**
- Check browser download settings
- Make sure pop-ups are not blocked
- Try a different browser

## Support

If you encounter any issues, please check the browser console for error messages and ensure all dependencies are properly installed.

