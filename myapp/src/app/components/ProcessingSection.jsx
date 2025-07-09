// app/components/ProcessingSection.jsx

import React, { useRef, useState, useCallback } from 'react';
import { 
  Play, Loader2, Download, Type, Palette, Move, Trash2, Eye, EyeOff 
} from 'lucide-react';

export default function ProcessingSection({
  uploadedImage,
  textPrompt,
  onPromptChange,
  onProcess,
  isProcessing,
  selectedModel,
  textPositions,
  selectedTextId,
  onAddTextPosition,
  onUpdateTextPosition,
  onDeleteTextPosition,
  onSelectText
}) {
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const [isPlacingText, setIsPlacingText] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);

  const renderTextOnCanvas = useCallback(() => {
    if (!uploadedImage || !canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas to match image dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Draw all text positions
      textPositions.forEach((position) => {
        const x = (position.x / 100) * canvas.width;
        const y = (position.y / 100) * canvas.height;

        ctx.save();

        // Set font and color
        ctx.font = `bold ${position.fontSize}px Arial, sans-serif`;
        ctx.fillStyle = position.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Background integration style
        if (position.behindObject) {
          ctx.globalCompositeOperation = 'multiply';
          ctx.globalAlpha = 0.7;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
        } else {
          ctx.globalAlpha = 1;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
        }

        // Draw main text
        ctx.fillText(position.text, x, y);

        // Optional overlay blending for background effect
        if (position.behindObject) {
          ctx.globalCompositeOperation = 'overlay';
          ctx.globalAlpha = 0.3;
          ctx.fillText(position.text, x, y);
        }

        ctx.restore();
      });

      // Generate final image URL
      setProcessedImageUrl(canvas.toDataURL('image/png'));
    };

    img.src = uploadedImage;
  }, [uploadedImage, textPositions]);

  React.useEffect(() => {
    renderTextOnCanvas();
  }, [renderTextOnCanvas]);

  const handleImageClick = (event) => {
    if (!textPrompt.trim() || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    onAddTextPosition(x, y);
    setIsPlacingText(false);
  };

  const handleDownloadImage = () => {
    if (!processedImageUrl) return;

    const link = document.createElement('a');
    link.download = 'text-behind-image.png';
    link.href = processedImageUrl;
    link.click();
  };

  const selectedText = textPositions.find(pos => pos.id === selectedTextId);

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Type className="w-6 h-6 mr-2" />
          Text Background Integration
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter text to integrate into image background
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={textPrompt}
                onChange={(e) => onPromptChange(e.target.value)}
                placeholder="Enter your text here..."
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={() => setIsPlacingText(!isPlacingText)}
                disabled={!textPrompt.trim() || !uploadedImage}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${
                  isPlacingText ? 'bg-green-500 text-white' : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
              >
                {isPlacingText ? (
                  <>
                    <Move className="w-4 h-4 mr-1" />
                    Click Image
                  </>
                ) : (
                  <>
                    <Type className="w-4 h-4 mr-1" />
                    Place Text
                  </>
                )}
              </button>
            </div>
            {isPlacingText && (
              <p className="text-sm text-green-400 mt-2">
                Click on the image where you want to integrate the text into the background
              </p>
            )}
          </div>

          {/* Selected Text Settings */}
          {selectedText && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-medium mb-3 flex items-center">
                <Palette className="w-4 h-4 mr-2" />
                Text Integration Settings
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Font Size</label>
                  <input
                    type="range"
                    min="12"
                    max="72"
                    value={selectedText.fontSize}
                    onChange={(e) =>
                      onUpdateTextPosition(selectedText.id, {
                        fontSize: parseInt(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{selectedText.fontSize}px</span>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Text Color</label>
                  <input
                    type="color"
                    value={selectedText.color}
                    onChange={(e) =>
                      onUpdateTextPosition(selectedText.id, {
                        color: e.target.value,
                      })
                    }
                    className="w-full h-8 rounded border border-white/20"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() =>
                    onUpdateTextPosition(selectedText.id, {
                      behindObject: !selectedText.behindObject,
                    })
                  }
                  className={`flex items-center px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedText.behindObject
                      ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/40'
                  }`}
                >
                  {selectedText.behindObject ? (
                    <Eye className="w-3 h-3 mr-1" />
                  ) : (
                    <EyeOff className="w-3 h-3 mr-1" />
                  )}
                  {selectedText.behindObject ? 'Background Integration' : 'Text Overlay'}
                </button>
                <button
                  onClick={() => onDeleteTextPosition(selectedText.id)}
                  className="flex items-center px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-colors border border-red-500/40"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </button>
              </div>
              {selectedText.behindObject && (
                <div className="mt-3 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                  <p className="text-xs text-green-400">
                    ✓ Text will be integrated into the image background using blend modes and opacity effects
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Text Positions List */}
          {textPositions.length > 0 && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-medium mb-3">
                Text Elements ({textPositions.length})
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {textPositions.map((position) => (
                  <div
                    key={position.id}
                    onClick={() => onSelectText(position.id)}
                    className={`p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedTextId === position.id
                        ? 'bg-purple-500/20 border border-purple-500/40'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm truncate">{position.text}</span>
                      <div className="flex items-center space-x-2">
                        {position.behindObject ? (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                            Background
                          </span>
                        ) : (
                          <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded">
                            Overlay
                          </span>
                        )}
                        <span className="text-xs text-gray-400">{position.fontSize}px</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onProcess}
              disabled={!uploadedImage || textPositions.length === 0 || isProcessing}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Generate Final Image ({textPositions.length} texts)
                </>
              )}
            </button>
            <button
              onClick={handleDownloadImage}
              disabled={!processedImageUrl || isProcessing}
              className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Hidden Canvas for Rendering */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Preview Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">
          Live Preview with Background Integration
        </h3>
        <div className="aspect-video bg-gray-800/50 rounded-xl border border-white/20 flex items-center justify-center relative overflow-hidden">
          {uploadedImage ? (
            <div className="relative w-full h-full">
              {/* Original Image */}
              <img
                ref={imageRef}
                src={uploadedImage}
                alt="Preview"
                className={`w-full h-full object-cover rounded-xl ${
                  isPlacingText ? 'cursor-crosshair' : 'cursor-default'
                }`}
                onClick={handleImageClick}
              />
              {/* Processed Image Overlay */}
              {processedImageUrl && textPositions.length > 0 && (
                <img
                  src={processedImageUrl}
                  alt="Processed Preview"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-90"
                />
              )}
              {/* Text Position Markers */}
              {textPositions.map((position) => (
                <div
                  key={position.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectText(position.id);
                  }}
                  className={`absolute cursor-pointer border-2 border-dashed rounded px-2 py-1 transition-all ${
                    selectedTextId === position.id
                      ? 'border-purple-400 bg-purple-400/20'
                      : 'border-white/40 bg-black/20'
                  }`}
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <span className="text-xs text-white font-medium">
                    {position.text} ({position.behindObject ? 'BG' : 'OV'})
                  </span>
                </div>
              ))}
              {/* Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
                    <p className="text-white text-sm">
                      Integrating text into background with {selectedModel}...
                    </p>
                  </div>
                </div>
              )}
              {/* Placing Mode Overlay */}
              {isPlacingText && (
                <div className="absolute inset-0 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <div className="bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
                    Click to place: "{textPrompt}"
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <Type className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Upload an image to start integrating text into background</p>
            </div>
          )}
        </div>
        {/* Success Message */}
        {processedImageUrl && (
          <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <p className="text-green-400 text-sm flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Text has been integrated into the image background using canvas processing
            </p>
          </div>
        )}
      </div>
    </div>
  );
}