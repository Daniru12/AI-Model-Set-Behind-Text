// components/ProcessingSection.jsx
'use client';

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
  const [isGeneratingBlur, setIsGeneratingBlur] = useState(false);

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

    setIsGeneratingBlur(true);
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      try {
        // Use actual image size to prevent distortion
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        let backgroundUrl = uploadedImage;
        if (backgroundBlur > 0) {
          const hiddenCanvas = canvasRef.current;
          hiddenCanvas.width = img.naturalWidth;
          hiddenCanvas.height = img.naturalHeight;
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
      } catch (error) {
        console.error('Error rendering canvas:', error);
      } finally {
        setIsGeneratingBlur(false);
      }
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
    link.download = `portrait-text-${Date.now()}.png`;
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
      <div className="p-6 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20">
        <h2 className="flex items-center mb-6 text-2xl font-bold text-white">
          <Camera className="w-6 h-6 mr-2" /> Portrait Text with Background Blur
        </h2>
        <div className="space-y-6">
          <div className="p-4 border bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border-blue-500/30">
            <h3 className="flex items-center mb-4 font-bold text-white">
              <Layers className="w-5 h-5 mr-2" /> Background Effects
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Portrait Mode</label>
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
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Background Blur: {backgroundBlur}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={backgroundBlur}
                  onChange={(e) => setBackgroundBlur(parseInt(e.target.value))}
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-white/20"
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>Sharp</span>
                  <span>Very Blurred</span>
                </div>
              </div>
            </div>
            {portraitMode && (
              <div className="p-3 mt-4 border rounded-lg bg-green-500/10 border-green-500/20">
                <p className="flex items-center text-sm text-green-400">
                  <Camera className="w-4 h-4 mr-2" />
                  Portrait mode creates a focused center with blurred edges
                </p>
              </div>
            )}
          </div>

          {textPositions.length > 0 && (
            <div className="p-4 border bg-white/5 rounded-xl border-white/10">
              <h3 className="mb-3 font-medium text-white">Text Elements ({textPositions.length})</h3>
              <div className="space-y-2 overflow-y-auto max-h-32">
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
                      <span className="text-sm text-white truncate">{position.text}</span>
                      <div className="flex items-center space-x-2">
                        {position.behindObject ? (
                          <span className="px-2 py-1 text-xs text-green-400 rounded bg-green-500/20">Background</span>
                        ) : (
                          <span className="px-2 py-1 text-xs text-gray-400 rounded bg-gray-500/20">Overlay</span>
                        )}
                        <span className="text-xs text-gray-400">{position.fontSize}px</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleDownloadImage}
              disabled={!processedImageUrl}
              className="flex items-center justify-center flex-1 px-6 py-3 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Image
            </button>
          </div>

          {selectedText && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={decreaseFontSize}
                className="px-4 py-2 font-bold text-white transition-colors bg-gray-700 hover:bg-gray-600 rounded-xl"
              >
                -
              </button>
              <button
                onClick={increaseFontSize}
                className="px-4 py-2 font-bold text-white transition-colors bg-gray-700 hover:bg-gray-600 rounded-xl"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="relative flex items-center justify-center overflow-hidden border min-h-[70vh] bg-gray-800/50 rounded-xl border-white/20">
        {uploadedImage ? (
          <div className="relative w-full h-full">
            {(isGeneratingBlur || isProcessing) && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70 rounded-xl">
                <div className="flex flex-col items-center">
                  <Loader2 className="w-12 h-12 mb-4 text-white animate-spin" />
                  <div className="text-xl font-bold text-white">
                    {isGeneratingBlur ? 'Applying blur effect...' : 'Processing image...'}
                  </div>
                  <div className="w-64 h-2 mt-4 overflow-hidden bg-gray-700 rounded-full">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
            <img
              ref={imageRef}
              src={uploadedImage}
              alt="Preview"
              onClick={handleImageClick}
              onLoad={(e) => {
                const img = e.target;
                const canvas = previewCanvasRef.current;
                if (canvas) {
                  canvas.width = img.naturalWidth;
                  canvas.height = img.naturalHeight;
                }
              }}
              className={`w-full h-full object-contain rounded-xl ${isPlacingText ? 'cursor-crosshair' : 'cursor-default'}`}
            />
            <canvas
              ref={previewCanvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-xl"
            />
          </div>
        ) : (
          <div className="p-12 text-center">
            <Type className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-400">Upload an image to start integrating text into background</p>
          </div>
        )}
      </div>
    </div>
  );
}