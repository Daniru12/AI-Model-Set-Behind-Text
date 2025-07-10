'use client';

import React from 'react';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const handleScroll = () => {
    const target = document.getElementById('gallery');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen pt-20 pb-32 overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 z-0 object-cover w-full h-full"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/video/hero-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 z-10 bg-black/60" />

      {/* Optional Gradient blur */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-2xl" />

      {/* Main Content */}
      <div className="relative z-20 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="space-y-8 text-center">
          {/* Announcement badge */}
          <div className="inline-flex items-center px-4 py-2 text-sm text-white border rounded-full bg-white/10 backdrop-blur-sm border-white/20">
            <span className="w-2 h-2 mr-2 bg-green-400 rounded-full animate-pulse" />
            New AI Models Available
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            Create Stunning
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              Blur-Behind-Image
            </span>
            Effects with AI
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
            Transform your images with advanced AI models that intelligently place text behind objects, 
            creating depth-aware compositions that captivate your audience.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="flex items-center px-8 py-4 font-semibold text-white transition-all duration-300 transform rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 group">
              Start Creating
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </button>

            <button className="flex items-center px-8 py-4 font-semibold text-white transition-all duration-300 border rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/20">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Scroll-down Button */}
      <div className="absolute z-20 transform -translate-x-1/2 bottom-10 left-1/2">
        <button
          onClick={handleScroll}
          className="flex flex-col items-center text-white transition-colors duration-300 animate-bounce hover:text-pink-400"
        >
          <ChevronDown className="w-8 h-8" />
          <span className="mt-1 text-sm">Scroll Down</span>
        </button>
      </div>
    </section>
  );
}
