// ============================================
// SEQUENCE BLOCK RENDERER - SIMPLIFIED
// No numbers, maximum text size, warm pastels
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

  const handleRevealNext = () => {
    if (revealedCount < items.length) {
      setRevealedCount(revealedCount + 1);
    }
  };

  const handleReset = () => {
    setRevealedCount(0);
  };

  // EDIT MODE
  if (mode === 'edit') {
    const itemsText = items.join('\n');

    return (
      <div className="p-6 border-2 border-blue-500 bg-blue-50 rounded space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Edit Sequence
        </h3>

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
      </div>
    );
  }

  // VIEW MODE - Always click-to-reveal
  return (
    <div className="p-4 bg-white rounded-xl h-full flex flex-col">
      {/* Sequence items - just text, no numbers */}
      <div className="space-y-3 flex-1">
        {items.map((item, index) => {
          const isRevealed = index < revealedCount;
          
          return (
            <div
              key={index}
              className={`rounded-lg px-4 py-3 transition-all border ${
                isRevealed 
                  ? 'bg-amber-50 border-amber-200' 
                  : 'bg-gray-50 border-gray-200 opacity-40'
              }`}
            >
              {/* Just the text - as big as possible */}
              <div className={`text-4xl font-medium leading-tight ${
                isRevealed ? 'text-gray-800' : 'text-gray-400'
              }`}>
                {isRevealed ? item : '•••'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom controls */}
      <div className="mt-4 flex gap-2 justify-center">
        {revealedCount < items.length && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRevealNext();
            }}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Reveal Next ({revealedCount + 1}/{items.length})
          </button>
        )}
        {revealedCount > 0 && revealedCount === items.length && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
            className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}