// app/components/FooterSection.jsx

import React from 'react';
import { Sparkles, Github, Twitter, Linkedin } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer className="border-t bg-black/40 backdrop-blur-sm border-white/10">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AI Vision</span>
            </div>
            <p className="text-gray-400">
              Create stunning text-behind-image effects with advanced AI models.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/Daniru12" className="text-gray-400 transition-colors hover:text-white">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 transition-colors hover:text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/daniru-punsith-b96288312/" className="text-gray-400 transition-colors hover:text-white">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="transition-colors hover:text-white">Features</a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">Pricing</a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">API</a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">Documentation</a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="https://portfolio-my-daniru.vercel.app/" className="transition-colors hover:text-white">About</a>
              </li>
              <li>
                <a href="https://portfolio-my-daniru.vercel.app/" className="transition-colors hover:text-white">Blog</a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">Careers</a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/daniru-punsith-b96288312/" className="transition-colors hover:text-white">Contact</a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="transition-colors hover:text-white">Help Center</a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">Community</a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">Status</a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">Privacy</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 mt-8 text-center text-gray-400 border-t border-white/10">
          <p>&copy; 2025 AI Vision. All rights reserved. Devoloped by Daniru Using Next.js </p>
        </div>
      </div>
    </footer>
  );
}