# 🖼️ Image Format Converter

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)

A powerful, secure, and modern web application for converting images directly in your browser. Built with performance and privacy in mind, **Image Format Converter** processes all files locally using Web Assembly and the Canvas API—no files are ever uploaded to a server.

## ✨ Features

- **🔒 Privacy First**: All conversions happen 100% client-side. Your photos never leave your device.
- **⚡ High Performance**: Optimized for speed using modern browser capabilities.
- **🔄 Multi-Format Support**:
  - **Input**: JPG, PNG, GIF, WEBP, BMP
  - **Output**: JPG, PNG, WEBP, GIF, BMP
- **🎛️ Advanced Controls**:
  - **JPG**: Quality adjustment, Progressive encoding, Color space (RGB/Grayscale)
  - **PNG**: Compression levels, Transparency preservation
  - **WEBP**: Quality control, Lossless mode
  - **GIF**: Color palette optimization, Dithering options
- **📦 Batch Processing**: Convert dozens of images simultaneously with a queue system.
- **👁️ Smart Preview**: Real-time before/after comparison slider with zoom and pan.
- **📱 Fully Responsive**: Beautiful, touch-friendly interface that works on Desktop, Tablet, and Mobile.
- **📥 Flexible Downloads**: Download converted images individually or as a ZIP archive.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Gurutejareddy9/Imgify.git
    cd Imgify/image-format-converter
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or the next available port).

4.  **Build for production**
    ```bash
    npm run build
    ```

## 📂 Project Structure

```
src/
├── components/
│   ├── common/       # Reusable UI components (Buttons, Cards, etc.)
│   ├── converter/    # Core converter components (Upload, Settings, Preview)
│   ├── layout/       # Layout components (Header, Footer)
│   └── ui/           # Base UI elements (Sliders, Toggles)
├── hooks/            # Custom React hooks
│   ├── useFileUpload.js     # Manages file drag-and-drop
│   └── useImageConverter.js # Manages conversion logic & queue
├── pages/            # Route pages (Home, Converter)
├── utils/            # Helper functions
│   ├── imageConverter.js    # Canvas-based conversion logic
│   └── fileHelpers.js       # File validation and formatting
└── styles/           # Global styles and Tailwind directives
```

## 🛠️ Tech Stack

- **Frontend Framework**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **File Handling**: 
  - `react-dropzone` for drag-and-drop
  - `jszip` for batch downloading
  - `file-saver` for saving files

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
