'use client';

import { useState, useEffect } from 'react';
import { X, Download, ZoomIn, ZoomOut, ExternalLink, Loader } from 'lucide-react';

export default function FileViewer({ fileUrl, fileName, format, onClose }) {
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
  }, [fileUrl]);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'download';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(fileUrl, '_blank');
  };

  // Determine viewer URL based on format
  const getViewerUrl = () => {
    if (format === 'PDF') {
      return `${fileUrl}#zoom=${zoom}`;
    } else if (format === 'DOCX' || format === 'DOC') {
      // Google Docs Viewer for Word documents
      return `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
    } else if (format === 'Images') {
      return fileUrl;
    }
    return fileUrl;
  };

  const isPDF = format === 'PDF';
  const isImage = format === 'Images';
  const isDocument = format === 'DOCX' || format === 'DOC';

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-3 sm:p-4 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <h3 className="truncate text-sm sm:text-base font-medium">{fileName}</h3>
          <span className="px-2 py-1 bg-gray-800 rounded text-xs shrink-0">
            {format}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Zoom controls for PDFs */}
          {isPDF && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-lg">
              <button
                onClick={() => setZoom(z => Math.max(z - 10, 50))}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm min-w-[3rem] text-center">{zoom}%</span>
              <button
                onClick={() => setZoom(z => Math.min(z + 10, 200))}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Open in new tab */}
          <button
            onClick={handleOpenInNewTab}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Viewer Content */}
      <div className="flex-1 relative bg-gray-800 overflow-hidden">
        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3" />
              <p className="text-white text-sm">Loading {format}...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center px-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">Failed to load file</h3>
              <p className="text-gray-400 text-sm mb-6">
                The file viewer couldn't load this document. Try opening it in a new tab or downloading it.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleOpenInNewTab}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in New Tab
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Viewer */}
        {isImage ? (
          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src={fileUrl}
              alt={fileName}
              onLoad={handleLoad}
              onError={handleError}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ) : (
          /* PDF/Document Viewer */
          <iframe
            src={getViewerUrl()}
            className="w-full h-full border-0"
            title={fileName}
            onLoad={handleLoad}
            onError={handleError}
            allow="fullscreen"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        )}
      </div>

      {/* Mobile Zoom Controls (for PDFs) */}
      {isPDF && (
        <div className="sm:hidden bg-gray-900 p-3 flex items-center justify-center gap-4">
          <button
            onClick={() => setZoom(z => Math.max(z - 10, 50))}
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-white min-w-[4rem] text-center">{zoom}%</span>
          <button
            onClick={() => setZoom(z => Math.min(z + 10, 200))}
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}