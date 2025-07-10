// components/GallerySection.jsx
'use client';

import React from 'react';
import { Download, Share2, Eye } from 'lucide-react';

export default function GallerySection({ processedImages }) {
  if (!processedImages || processedImages.length === 0) {
    return null;
  }

  const handleDownloadImage = (imageUrl) => {
    const link = document.createElement('a');
    link.download = `generated-image-${Date.now()}.png`;
    link.href = imageUrl;
    link.click();
  };

  return (
    <section id="gallery" className="py-20 bg-black/20 backdrop-blur-sm">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Your AI Creations</h2>
          <p className="text-lg text-gray-300">Explore your generated images and download your favorites</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {processedImages.map((image, index) => (
            <div
              key={index}
              className="p-4 transition-all duration-300 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20 group hover:scale-105"
            >
              <div className="mb-4 overflow-hidden aspect-square bg-gray-800/50 rounded-xl">
                <div className="relative w-full h-full">
                  <img
                    src={image.processedImage}
                    alt={`Generated Image ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="font-medium text-white truncate">{image.prompt}</p>
                  <p className="text-sm text-gray-400">
                    {image.model} • {image.textPositions.length} text elements
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {new Date(image.timestamp).toLocaleDateString()}
                  </span>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownloadImage(image.processedImage)}
                      className="p-2 transition-colors rounded-lg bg-white/10 hover:bg-white/20"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-2 transition-colors rounded-lg bg-white/10 hover:bg-white/20">
                      <Share2 className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-2 transition-colors rounded-lg bg-white/10 hover:bg-white/20">
                      <Eye className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}