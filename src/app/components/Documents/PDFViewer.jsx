'use client';

import { useState } from 'react';
import { X, Download, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export default function PDFViewer({ fileUrl, fileName, onClose }) {
  const [zoom, setZoom] = useState(100);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold truncate max-w-md">{fileName}</h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-sm px-3">{zoom}%</span>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          <div className="w-px h-6 bg-gray-700 mx-2"></div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-hidden bg-gray-800">
        <iframe
          src={`${fileUrl}#zoom=${zoom}`}
          className="w-full h-full border-0"
          title={fileName}
        />
      </div>
    </div>
  );
}