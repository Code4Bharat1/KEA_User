'use client';

import { useState } from 'react';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';

export default function DocumentViewer({ fileUrl, fileName, onClose }) {
  const [zoom, setZoom] = useState(100);

  const ext = fileName?.split('.').pop()?.toLowerCase();
  const isPDF = ext === 'pdf';

  const viewerUrl = isPDF
    ? `${fileUrl}#zoom=${zoom}`
    : `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;

  const handleDownload = () => {
    window.open(fileUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h3 className="truncate max-w-md">{fileName}</h3>

        <div className="flex items-center gap-2">
          {isPDF && (
            <>
              <button onClick={() => setZoom(z => Math.max(z - 10, 50))}>
                <ZoomOut />
              </button>
              <span>{zoom}%</span>
              <button onClick={() => setZoom(z => Math.min(z + 10, 200))}>
                <ZoomIn />
              </button>
            </>
          )}

          <button
            onClick={handleDownload}
            className="px-3 py-1 bg-blue-600 rounded"
          >
            <Download size={16} />
          </button>

          <button onClick={onClose}>
            <X />
          </button>
        </div>
      </div>

      {/* Viewer */}
      <div className="flex-1 bg-gray-800">
        <iframe
          src={viewerUrl}
          className="w-full h-full"
          title={fileName}
        />
      </div>
    </div>
  );
}
