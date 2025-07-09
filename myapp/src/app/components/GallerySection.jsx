// app/components/GallerySection.jsx

import React from 'react';
import { Download, Share2, Eye } from 'lucide-react';

export default function GallerySection({ processedImages }) {
  if (processedImages.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className="bg-black/20 backdrop-blur-sm py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Your AI Creations</h2>
          <p className="text-gray-300 text-lg">
            Explore your generated images and download your favorites
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedImages.map((image) => (
            <div
              key={image.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 group hover:scale-105 transition-all duration-300"
            >
              <div className="aspect-square bg-gray-800/50 rounded-xl mb-4 overflow-hidden">
                <div className="relative w-full h-full">
                  <img
                    src={image.processedImage}
                    alt="Generated with background text integration"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-white font-medium truncate">{image.prompt}</p>
                  <p className="text-gray-400 text-sm">
                    {image.model} • {image.textPositions?.length || 0} text elements
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">
                    {new Date(image.timestamp).toLocaleDateString()}
                  </span>

                  <div className="flex space-x-2">
                    <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                      <Eye className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                      <Download className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                      <Share2 className="w-4 h-4 text-white" />
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