// ============================================
// CLOZE BLOCK RENDERER - REDESIGNED
// Content-First, Bigger Text, Warm Pastels
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
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Edit Cloze (Fill in Blanks)
        </h3>

        {/* Instructions field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instructions (optional)
          </label>
          <input
            type="text"
            value={block.content.instructions || ''}
            onChange={(e) => onContentChange?.({
              ...block.content,
              instructions: e.target.value,
            })}
            placeholder="e.g., Fill in the blanks with the correct words"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave blank to show default "Cloze"
          </p>
        </div>

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
          />
        </div>

        {/* Show word list option */}
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={block.content.showWordList || false}
              onChange={(e) => onContentChange?.({
                ...block.content,
                showWordList: e.target.checked,
              })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span>Show jumbled word list below text</span>
          </label>
          <p className="text-xs text-gray-500 mt-1 ml-6">
            Displays all blanked words in random order at the bottom
          </p>
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

  // VIEW MODE - Content-first, bigger text
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
    <div className="p-4 bg-orange-50 rounded-xl h-full flex flex-col">
      {/* Header with instructions */}
      <div className="flex items-center justify-between mb-3 group">
        <h3 className="text-3xl font-bold text-gray-800">
          {block.content.instructions || 'Cloze'}
        </h3>
        
        {/* Hover controls - only show if there are blanks */}
        {hasBlanks && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            {revealedBlanks.size === blankedIndices.length ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  hideAll();
                }}
                className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                Hide All
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  revealAll();
                }}
                className="px-3 py-1 text-xs text-emerald-700 hover:bg-emerald-100 rounded transition-colors"
              >
                Reveal All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main text - bigger and clearer */}
      <div className="text-3xl leading-relaxed text-gray-800 flex-1">
        {words.map((word, index) => {
          // Skip whitespace
          if (word.trim() === '') {
            return <span key={index}>{word}</span>;
          }

          const isBlank = blankedIndices.includes(index);
          const isRevealed = revealedBlanks.has(index);

          if (isBlank && !isRevealed) {
            // Show as blank - softer colors
            return (
              <span
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleReveal(index);
                }}
                className="inline-block border-b-4 border-amber-400 cursor-pointer hover:bg-amber-50 transition-colors mx-1"
                style={{
                  minWidth: `${Math.max(word.length * 0.6, 3)}em`,
                  height: '1.5em',
                  verticalAlign: 'bottom',
                }}
                title="Click to reveal"
              />
            );
          } else if (isBlank && isRevealed) {
            // Show revealed answer - soft green
            return (
              <span
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleReveal(index);
                }}
                className="bg-emerald-50 text-gray-800 font-semibold px-2 py-1 rounded cursor-pointer hover:bg-emerald-100 transition-colors border-2 border-emerald-300"
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

      {/* Jumbled word list - if enabled */}
      {block.content.showWordList && hasBlanks && (
        <div className="mt-4 pt-4 border-t-2 border-orange-200">
          <div className="text-sm text-gray-600 mb-2">Word bank:</div>
          <div className="flex flex-wrap gap-2">
            {blankedIndices
              .map(idx => words[idx])
              .sort(() => Math.random() - 0.5) // Shuffle
              .map((word, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-amber-100 text-gray-800 rounded-lg text-lg border border-amber-300"
                >
                  {word}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}