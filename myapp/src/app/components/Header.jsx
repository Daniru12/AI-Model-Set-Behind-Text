// app/components/Header.jsx

import React from 'react';
import { Sparkles, Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="relative z-50 border-b bg-black/20 backdrop-blur-md border-white/10">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">AI Vision</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="items-center hidden space-x-8 md:flex">
            
            <a href="https://portfolio-my-daniru.vercel.app/">
            <button className="px-6 py-2 text-white transition-all rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            Portfolio
            </button></a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="p-2 text-white md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute left-0 right-0 border-b md:hidden top-16 bg-black/90 backdrop-blur-md border-white/10">
            <nav className="flex flex-col p-4 space-y-4">
              <a href="#models" className="text-gray-300 transition-colors hover:text-white">
                Models
              </a>
              <a href="#gallery" className="text-gray-300 transition-colors hover:text-white">
                Gallery
              </a>
              <a href="#pricing" className="text-gray-300 transition-colors hover:text-white">
                Pricing
              </a>
              <button className="w-full px-6 py-2 text-white transition-all rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Get Started
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}