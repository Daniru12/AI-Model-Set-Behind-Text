// app/components/AIModelSelector.jsx

import React from 'react';
import { Brain, Layers, Sparkles, Zap } from 'lucide-react';

const models = [
  {
    id: 'depth-aware-text',
    name: 'Depth-Aware Text',
    description: 'Places text behind objects using depth estimation',
    icon: Layers,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'semantic-placement',
    name: 'Semantic Placement',
    description: 'Intelligently positions text based on scene understanding',
    icon: Brain,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'style-transfer',
    name: 'Style Transfer',
    description: 'Applies artistic styles while maintaining depth',
    icon: Sparkles,
    color: 'from-green-500 to-teal-500'
  },
  {
    id: 'real-time-processing',
    name: 'Real-time Processing',
    description: 'Ultra-fast processing for instant results',
    icon: Zap,
    color: 'from-orange-500 to-red-500'
  }
];

export default function AIModelSelector({ selectedModel, onModelSelect }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Brain className="w-6 h-6 mr-2" />
        AI Models
      </h2>
      
      <div className="grid gap-4">
        {models.map((model) => {
          const Icon = model.icon;
          return (
            <button
              key={model.id}
              onClick={() => onModelSelect(model.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 text-left group hover:scale-105 ${
                selectedModel === model.id
                  ? 'border-purple-400 bg-purple-500/20'
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${model.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{model.name}</h3>
                  <p className="text-gray-300 text-sm">{model.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}