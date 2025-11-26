// ============================================
// CLOZE BLOCK RENDERER (Registry-Compatible)
// ============================================

import { useState } from 'react';
import type { BlockRendererProps } from '../../block-registry';
import type { ClozeBlockInstance } from '../../types/core';

export function ClozeBlockRenderer({
  block,
  mode,
  onContentChange,
}: BlockRendererProps<ClozeBlockInstance>) {
  const { text, blankedIndices } = block.content;
  
  // Parse text into words
  const words = text.split(/(\s+)/); // Keeps whitespace
  
  // View mode state - track which blanks are revealed
  const [revealedBlanks, setRevealedBlanks] = useState<Set<number>>(new Set());

  const toggleBlank = (index: number) => {
    const newBlankedIndices = new Set(blankedIndices);
    if (newBlankedIndices.has(index)) {
      newBlankedIndices.delete(index);
    } else {
      newBlankedIndices.add(index);
    }
    
    onContentChange?.({
      ...block.content,
      blankedIndices: Array.from(newBlankedIndices),
    });
  };

  const toggleReveal = (index: number) => {
    const newRevealed = new Set(revealedBlanks);
    if (newRevealed.has(index)) {
      newRevealed.delete(index);
    } else {
      newRevealed.add(index);
    }
    setRevealedBlanks(newRevealed);
  };

  const revealAll = () => {
    setRevealedBlanks(new Set(blankedIndices));
  };

  const hideAll = () => {
    setRevealedBlanks(new Set());
  };

  // EDIT MODE
  if (mode === 'edit') {
    return (
      <div className="p-6 border-2 border-blue-500 bg-blue-50 rounded space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Text Content
          </label>
          <textarea
            value={text}
            onChange={(e) => onContentChange?.({
              ...block.content,
              text: e.target.value,
              blankedIndices: [], // Reset blanks when text changes
            })}
            placeholder="Enter your text here. After saving, click on words to turn them into blanks."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={6}
            autoFocus
          />
        </div>

        {text.trim() && (
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Click words to turn into blanks:
            </div>
            <div className="text-lg leading-relaxed">
              {words.map((word, index) => {
                // Skip whitespace
                if (word.trim() === '') {
                  return <span key={index}>{word}</span>;
                }

                const isBlank = blankedIndices.includes(index);
                
                return (
                  <span
                    key={index}
                    onClick={() => toggleBlank(index)}
                    className={`cursor-pointer transition-all rounded px-1 ${
                      isBlank
                        ? 'bg-yellow-200 text-yellow-900 font-semibold'
                        : 'hover:bg-blue-100'
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              {blankedIndices.length} word(s) selected as blanks
            </p>
          </div>
        )}
      </div>
    );
  }

  // VIEW MODE
  if (!text.trim()) {
    return (
      <div className="p-6">
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <p className="text-gray-500">No text content</p>
        </div>
      </div>
    );
  }

  const hasBlanks = blankedIndices.length > 0;

  return (
    <div className="p-6">
      {hasBlanks && (
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            {revealedBlanks.size} of {blankedIndices.length} revealed
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                revealAll();
              }}
              className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
            >
              Reveal All
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                hideAll();
              }}
              className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
            >
              Hide All
            </button>
          </div>
        </div>
      )}

      <div className="text-xl leading-relaxed">
        {words.map((word, index) => {
          // Skip whitespace
          if (word.trim() === '') {
            return <span key={index}>{word}</span>;
          }

          const isBlank = blankedIndices.includes(index);
          const isRevealed = revealedBlanks.has(index);

          if (isBlank && !isRevealed) {
            // Show as blank
            return (
              <span
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleReveal(index);
                }}
                className="inline-block border-b-2 border-blue-600 cursor-pointer hover:bg-blue-50 transition-colors mx-1"
                style={{
                  minWidth: `${Math.max(word.length * 0.6, 3)}em`,
                  height: '1.5em',
                  verticalAlign: 'bottom',
                }}
                title="Click to reveal"
              />
            );
          } else if (isBlank && isRevealed) {
            // Show revealed answer
            return (
              <span
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleReveal(index);
                }}
                className="bg-green-100 text-green-900 font-semibold px-2 py-1 rounded cursor-pointer hover:bg-green-200 transition-colors"
              >
                {word}
              </span>
            );
          } else {
            // Normal word
            return <span key={index}>{word}</span>;
          }
        })}
      </div>
    </div>
  );
}