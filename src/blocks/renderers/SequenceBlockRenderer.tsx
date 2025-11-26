// ============================================
// SEQUENCE BLOCK RENDERER (Registry-Compatible)
// ============================================

import { useState } from 'react';
import type { BlockRendererProps } from '../../block-registry';
import type { SequenceBlockInstance } from '../../types/core';

export function SequenceBlockRenderer({
  block,
  mode,
  onContentChange,
}: BlockRendererProps<SequenceBlockInstance>) {
  const { items, revealMode } = block.content;
  const [revealedCount, setRevealedCount] = useState(revealMode === 'all' ? items.length : 0);

  // EDIT MODE
  if (mode === 'edit') {
    const itemsText = items.join('\n');

    return (
      <div className="p-6 border-2 border-blue-500 bg-blue-50 rounded space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sequence Items (one per line)
          </label>
          <textarea
            value={itemsText}
            onChange={(e) => {
              const lines = e.target.value.split('\n');
              onContentChange?.({
                ...block.content,
                items: lines,
              });
            }}
            placeholder="Enter items, one per line:
Mix dry ingredients
Add wet ingredients
Stir until combined
Bake at 180°C"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            rows={8}
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-1">
            {items.filter(i => i.trim()).length} item(s)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reveal Mode
          </label>
          <select
            value={revealMode}
            onChange={(e) => onContentChange?.({
              ...block.content,
              revealMode: e.target.value as 'all' | 'one-by-one' | 'click-to-reveal',
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Show All (no reveal)</option>
            <option value="one-by-one">One by One (auto reveal)</option>
            <option value="click-to-reveal">Click to Reveal (manual)</option>
          </select>
        </div>
      </div>
    );
  }

  // VIEW MODE
  const handleRevealNext = () => {
    if (revealedCount < items.length) {
      setRevealedCount(revealedCount + 1);
    }
  };

  const handleReset = () => {
    setRevealedCount(0);
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Sequence
      </h3>

      <div className="space-y-3">
        {items.map((item, index) => {
          const isRevealed = index < revealedCount || revealMode === 'all';
          
          return (
            <div
              key={index}
              className={`flex items-start gap-3 p-4 rounded-lg transition-all ${
                isRevealed 
                  ? 'bg-blue-50 border-2 border-blue-300' 
                  : 'bg-gray-100 border-2 border-gray-200 opacity-50'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                isRevealed ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <div className="flex-1 text-gray-800">
                {isRevealed ? item : '•••'}
              </div>
            </div>
          );
        })}
      </div>

      {revealMode === 'click-to-reveal' && (
        <div className="mt-6 flex gap-3 justify-center">
          {revealedCount < items.length && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRevealNext();
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Reveal Next ({revealedCount + 1}/{items.length})
            </button>
          )}
          {revealedCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      )}
    </div>
  );
}