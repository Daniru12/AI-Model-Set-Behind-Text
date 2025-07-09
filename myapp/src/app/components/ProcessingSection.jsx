import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  Play,
  Loader2,
  Download,
  Type,
  Palette,
  Move,
  Trash2,
  Eye,
  EyeOff,
  Layers,
  Camera,
} from 'lucide-react';
import { getBodyPixNet, blurBackgroundImage } from '../utils/blurBackground';


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
  onSelectText,
}) {
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [isPlacingText, setIsPlacingText] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [backgroundBlur, setBackgroundBlur] = useState(8);
  const [portraitMode, setPortraitMode] = useState(true);
  const [bodyPixNet, setBodyPixNet] = useState(null);

  useEffect(() => {
    getBodyPixNet().then(setBodyPixNet).catch(console.error);
  }, []);

  const renderTextOnCanvas = useCallback(async () => {
    if (
      !uploadedImage ||
      !previewCanvasRef.current ||
      !imageRef.current ||
      !canvasRef.current ||
      !bodyPixNet
    )
      return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;

      const displayRect = imageRef.current?.getBoundingClientRect();
      if (displayRect) {
        canvas.style.width = `${displayRect.width}px`;
        canvas.style.height = `${displayRect.height}px`;
      }

      let backgroundUrl = uploadedImage;

      if (backgroundBlur > 0) {
        const hiddenCanvas = canvasRef.current;
        hiddenCanvas.width = img.width;
        hiddenCanvas.height = img.height;
        await blurBackgroundImage(img, hiddenCanvas, backgroundBlur, bodyPixNet);
        backgroundUrl = hiddenCanvas.toDataURL();
      }

      const blurredImg = new Image();
      blurredImg.crossOrigin = 'anonymous';
      blurredImg.src = backgroundUrl;
      await new Promise((resolve) => (blurredImg.onload = resolve));

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(blurredImg, 0, 0);

      textPositions.forEach((position) => {
        const x = (position.x / 100) * canvas.width;
        const y = (position.y / 100) * canvas.height;

        ctx.save();
        const massiveSize = Math.max(position.fontSize * (canvas.width / 400), 80);
        ctx.font = `900 ${massiveSize}px "Arial Black", sans-serif`;
        ctx.fillStyle = position.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (position.behindObject) {
          ctx.globalCompositeOperation = 'multiply';
          ctx.globalAlpha = 0.85;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
          ctx.shadowBlur = massiveSize * 0.12;
          ctx.shadowOffsetX = massiveSize * 0.06;
          ctx.shadowOffsetY = massiveSize * 0.06;
          ctx.fillText(position.text, x, y);

          ctx.globalCompositeOperation = 'overlay';
          ctx.globalAlpha = 0.65;
          ctx.shadowBlur = massiveSize * 0.08;
          ctx.fillText(position.text, x, y);

          ctx.globalCompositeOperation = 'soft-light';
          ctx.globalAlpha = 0.55;
          ctx.shadowBlur = massiveSize * 0.06;
          ctx.fillText(position.text, x, y);
        } else {
          ctx.globalAlpha = 0.98;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
          ctx.shadowBlur = massiveSize * 0.1;
          ctx.shadowOffsetX = massiveSize * 0.05;
          ctx.shadowOffsetY = massiveSize * 0.05;

          ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.lineWidth = massiveSize * 0.025;
          ctx.strokeText(position.text, x, y);

          ctx.fillText(position.text, x, y);

          ctx.globalCompositeOperation = 'overlay';
          ctx.globalAlpha = 0.4;
          ctx.fillStyle = '#ffffff';
          ctx.fillText(position.text, x, y);
        }
        ctx.restore();
      });

      setProcessedImageUrl(canvas.toDataURL('image/png', 1.0));
    };

    img.src = uploadedImage;
  }, [uploadedImage, textPositions, backgroundBlur, bodyPixNet]);

  useEffect(() => {
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
    link.download = `portrait-text-background-${Date.now()}.png`;
    link.href = processedImageUrl;
    link.click();
  };

  const selectedText = textPositions.find((pos) => pos.id === selectedTextId);

  const increaseFontSize = () => {
    if (selectedText) {
      onUpdateTextPosition(selectedText.id, {
        fontSize: Math.min(selectedText.fontSize + 12, 200),
      });
    }
  };

  const decreaseFontSize = () => {
    if (selectedText) {
      onUpdateTextPosition(selectedText.id, {
        fontSize: Math.max(selectedText.fontSize - 12, 24),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Camera className="w-6 h-6 mr-2" /> Portrait Text with Background Blur
        </h2>
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/30">
            <h3 className="text-white font-bold mb-4 flex items-center">
              <Layers className="w-5 h-5 mr-2" /> Background Effects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2 font-medium">Portrait Mode</label>
                <button
                  onClick={() => setPortraitMode(!portraitMode)}
                  className={`w-full flex items-center justify-center px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                    portraitMode
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                      : 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg'
                  }`}
                >
                  <Camera className="w-5 h-5 mr-2" />
                  {portraitMode ? 'PORTRAIT ON' : 'PORTRAIT OFF'}
                </button>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2 font-medium">
                  Background Blur: {backgroundBlur}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={backgroundBlur}
                  onChange={(e) => setBackgroundBlur(parseInt(e.target.value))}
                  className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Sharp</span>
                  <span>Very Blurred</span>
                </div>
              </div>
            </div>
            {portraitMode && (
              <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-green-400 text-sm flex items-center">
                  <Camera className="w-4 h-4 mr-2" />
                  Portrait mode creates a focused center with blurred edges
                </p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter text for background integration with blur effect
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={textPrompt}
                onChange={(e) => onPromptChange(e.target.value)}
                placeholder="Enter large text..."
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={() => setIsPlacingText(!isPlacingText)}
                disabled={!textPrompt.trim() || !uploadedImage}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${
                  isPlacingText ? 'bg-green-500 text-white' : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
              >
                {isPlacingText ? (
                  <>
                    <Move className="w-5 h-5 mr-2" />
                    Click Image
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5 mr-2" />
                    Place Text
                  </>
                )}
              </button>
            </div>
            {isPlacingText && (
              <div className="mt-3 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                <p className="text-green-400 font-medium flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  Click anywhere to place text with background blur effect
                </p>
                <p className="text-green-300 text-sm mt-1">
                  Text will integrate naturally with the blurred background
                </p>
              </div>
            )}
          </div>
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
                    min="24"
                    max="200"
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
                    className="w-full h-8 rounded border border-white/20 bg-white/10"
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
                  {selectedText.behindObject ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
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
                  <p className="text-xs text-green-400">✓ Text integrates with the blurred background using blending effects</p>
                </div>
              )}
            </div>
          )}
          {textPositions.length > 0 && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-medium mb-3">Text Elements ({textPositions.length})</h3>
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
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Background</span>
                        ) : (
                          <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded">Overlay</span>
                        )}
                        <span className="text-xs text-gray-400">{position.fontSize}px</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                  Generate
                </>
              )}
            </button>
            <button
              onClick={handleDownloadImage}
              disabled={!processedImageUrl}
              className="flex-1 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Image
            </button>
          </div>
          {selectedText && (
            <div className="flex gap-2 justify-center mt-4">
              <button
                onClick={decreaseFontSize}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl font-bold transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <button
                onClick={increaseFontSize}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl font-bold transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <div className="aspect-video bg-gray-800/50 rounded-xl border border-white/20 flex items-center justify-center relative overflow-hidden">
        {uploadedImage ? (
          <div className="relative w-full h-full">
            <img
              ref={imageRef}
              src={uploadedImage}
              alt="Preview"
              className={`w-full h-full object-cover rounded-xl ${isPlacingText ? 'cursor-crosshair' : 'cursor-default'}`}
              onClick={handleImageClick}
            />
            <canvas
              ref={previewCanvasRef}
              className="absolute inset-0 w-full h-full rounded-xl pointer-events-none"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-12">
            <Type className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Upload an image to start integrating text into background</p>
          </div>
        )}
      </div>
    </div>
  );
}
