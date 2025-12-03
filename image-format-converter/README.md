# ImageConverter

A modern, fast, and secure image manipulation web application built with React and Vite. Convert, compress, and resize images entirely in your browser - no uploads required.

## 🚀 Features

### 🔄 Format Converter
- Convert images between multiple formats: JPG, PNG, WEBP, GIF, BMP, PDF
- Batch conversion support
- Format-specific settings (quality, compression, transparency)
- Multi-page PDF creation from multiple images
- Extract images from PDF files

### 🗜️ Image Compression
- Smart compression with quality control (10-100%)
- Real-time before/after comparison
- File size reduction statistics
- Multiple output formats
- Batch compression with progress tracking
- PDF support (extract and compress)

### 📏 Image Resize
- Resize by exact dimensions or percentage
- Maintain aspect ratio toggle
- Pre-built presets for social media, print, and standard sizes
- Multiple fit modes (contain, cover, fill, scale-down)
- Side-by-side comparison
- Batch resize support

## 🎨 Design Philosophy

- **Monochromatic Design**: Clean black, gray, and white color scheme
- **Privacy-First**: All processing happens in your browser
- **No Uploads**: Your files never leave your device
- **Fast & Efficient**: Optimized performance with Web Workers
- **Responsive**: Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons
- **jsPDF** - PDF creation
- **pdf-lib** - PDF manipulation
- **pdfjs-dist** - PDF parsing
- **JSZip** - Batch downloads
- **file-saver** - File downloads

## 📦 Installation
```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd image-format-converter

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🏗️ Build for Production
```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure
```
src/
├── components/
│   ├── layout/              # Header, Footer, Navigation
│   ├── common/              # Reusable UI components
│   ├── converter/           # Format converter components
│   ├── compression/         # Compression tool components
│   └── resize/              # Resize tool components
├── pages/
│   ├── Home.jsx            # Landing page
│   ├── Converter.jsx       # Format conversion page
│   ├── Compress.jsx        # Compression page
│   └── Resize.jsx          # Resize page
├── utils/
│   ├── imageConverter.js   # Format conversion logic
│   ├── imageCompression.js # Compression algorithms
│   ├── imageResize.js      # Resize utilities
│   ├── pdfConverter.js     # PDF handling
│   └── fileHelpers.js      # File utilities
├── hooks/
│   ├── useImageConverter.js
│   ├── useImageCompression.js
│   └── useImageResize.js
└── styles/
    └── index.css           # Global styles
```

## 🎯 Usage

### Converting Images
1. Navigate to the Converter page
2. Upload one or more images (or PDF)
3. Select target format
4. Adjust format-specific settings
5. Click "Convert All" or convert individually
6. Download converted files

### Compressing Images
1. Navigate to the Compress page
2. Upload images
3. Adjust quality slider (10-100%)
4. Select output format
5. View before/after comparison
6. Download compressed images

### Resizing Images
1. Navigate to the Resize page
2. Upload images
3. Choose resize mode (dimensions or percentage)
4. Select preset or enter custom dimensions
5. Toggle aspect ratio lock
6. Download resized images

## 🔒 Privacy & Security
- **100% Client-Side**: All image processing happens in your browser using Canvas API
- **No Server Uploads**: Files never leave your device
- **No Tracking**: No analytics or user tracking
- **Open Source**: Transparent code you can inspect

## ⚡ Performance
- Web Workers for heavy processing
- Efficient memory management
- Lazy loading for optimal bundle size
- Optimized Canvas rendering
- Progressive image loading

## 🌐 Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License
MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Known Issues
- PDF extraction quality depends on source PDF resolution
- Very large files (>100MB) may cause memory issues on low-end devices
- Some animated GIFs may lose animation during conversion

## 🔮 Future Enhancements
- Image rotation and flip tool
- Watermark tool
- Advanced filters and effects
- Cloud storage integration
- Batch rename utility
- Image cropping tool
- Background removal
- AI upscaling

## 📧 Support
For issues, questions, or suggestions, please open an issue on GitHub.

Made with ❤️ using React and Vite
