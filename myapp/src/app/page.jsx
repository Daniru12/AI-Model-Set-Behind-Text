// app/page.jsx

'use client';

import React, { useState } from 'react';

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import UploadSection from './components/UploadSection';
import AIModelSelector from './components/AIModelSelector';
import ProcessingSection from './components/ProcessingSection';
import GallerySection from './components/GallerySection';
import FooterSection from './components/FooterSection';

export default function HomePage() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedModel, setSelectedModel] = useState('depth-aware-text');
  const [textPrompt, setTextPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);
  const [textPositions, setTextPositions] = useState([]);
  const [selectedTextId, setSelectedTextId] = useState(null);

  const handleImageUpload = (imageUrl) => {
    setUploadedImage(imageUrl);
    setTextPositions([]);
    setSelectedTextId(null);
  };

  const handleAddTextPosition = (x, y) => {
    if (!textPrompt.trim()) return;

    const newTextPosition = {
      id: Date.now().toString(),
      text: textPrompt,
      x,
      y,
      fontSize: 24,
      color: '#ffffff',
      behindObject: true,
    };

    setTextPositions((prev) => [...prev, newTextPosition]);
    setSelectedTextId(newTextPosition.id);
  };

  const handleUpdateTextPosition = (id, updates) => {
    setTextPositions((prev) =>
      prev.map((pos) => (pos.id === id ? { ...pos, ...updates } : pos)
    )
  );
  };

  const handleDeleteTextPosition = (id) => {
    setTextPositions((prev) => prev.filter((pos) => pos.id !== id));
    if (selectedTextId === id) {
      setSelectedTextId(null);
    }
  };

  const handleProcessImage = async () => {
    if (!uploadedImage || textPositions.length === 0) return;

    setIsProcessing(true);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      textPositions.forEach((position) => {
        const x = (position.x / 100) * canvas.width;
        const y = (position.y / 100) * canvas.height;

        ctx.save();
        ctx.font = `bold ${position.fontSize}px Arial, sans-serif`;
        ctx.fillStyle = position.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (position.behindObject) {
          ctx.globalCompositeOperation = 'multiply';
          ctx.globalAlpha = 0.8;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
          ctx.shadowBlur = 15;
          ctx.shadowOffsetX = 3;
          ctx.shadowOffsetY = 3;
          ctx.fillText(position.text, x, y);

          ctx.globalCompositeOperation = 'overlay';
          ctx.globalAlpha = 0.4;
          ctx.fillText(position.text, x, y);
        } else {
          ctx.globalAlpha = 1;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          ctx.fillText(position.text, x, y);
        }

        ctx.restore();
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const processedImageDataUrl = canvas.toDataURL('image/png');

      const processedImage = {
        id: Date.now().toString(),
        originalImage: uploadedImage,
        processedImage: processedImageDataUrl,
        prompt: textPositions.map((pos) => pos.text).join(', '),
        model: selectedModel,
        timestamp: new Date(),
        textPositions: [...textPositions],
      };

      setProcessedImages((prev) => [processedImage, ...prev]);
      setIsProcessing(false);
      setTextPositions([]);
      setSelectedTextId(null);
    };

    img.src = uploadedImage;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <main className="relative">
        <HeroSection />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <UploadSection onImageUpload={handleImageUpload} uploadedImage={uploadedImage} />
              <AIModelSelector
                selectedModel={selectedModel}
                onModelSelect={setSelectedModel}
              />
            </div>

            <ProcessingSection
              uploadedImage={uploadedImage}
              textPrompt={textPrompt}
              onPromptChange={setTextPrompt}
              onProcess={handleProcessImage}
              isProcessing={isProcessing}
              selectedModel={selectedModel}
              textPositions={textPositions}
              selectedTextId={selectedTextId}
              onAddTextPosition={handleAddTextPosition}
              onUpdateTextPosition={handleUpdateTextPosition}
              onDeleteTextPosition={handleDeleteTextPosition}
              onSelectText={setSelectedTextId}
            />
          </div>
        </div>

        <GallerySection processedImages={processedImages} />
      </main>

      <FooterSection />
    </div>
  );
}