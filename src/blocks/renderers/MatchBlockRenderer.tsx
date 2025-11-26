// ============================================
// MATCH BLOCK RENDERER (Registry-Compatible)
// ============================================

import { useState, useEffect } from 'react';
import type { BlockRendererProps } from '../../block-registry';
import type { MatchBlockInstance } from '../../types/core';

interface MatchPair {
  term: string;
  description: string;
}

export function MatchBlockRenderer({
  block,
  mode,
  onContentChange,
}: BlockRendererProps<MatchBlockInstance>) {
  const { rawInput, shuffled } = block.content;
  
  // Parse the raw input into pairs
  const parsePairs = (input: string): MatchPair[] => {
    const lines = input.trim().split('\n').filter(line => line.trim());
    
    // Find the divider (look for a line that's just dashes or equals)
    const dividerIndex = lines.findIndex(line => /^[-=]{3,}$/.test(line.trim()));
    
    if (dividerIndex === -1 || dividerIndex === 0) {
      return [];
    }
    
    const terms = lines.slice(0, dividerIndex).map(l => l.trim());
    const descriptions = lines.slice(dividerIndex + 1).map(l => l.trim());
    
    // Match them up (must be equal length)
    if (terms.length !== descriptions.length) {
      return [];
    }
    
    return terms.map((term, i) => ({
      term,
      description: descriptions[i]
    }));
  };
  
  const pairs = parsePairs(rawInput);
  
  // View mode state
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [selectedDesc, setSelectedDesc] = useState<number | null>(null);
  const [matches, setMatches] = useState<Map<number, number>>(new Map());
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  
  // Shuffle on mount if needed
  useEffect(() => {
    if (mode === 'view' && !shuffled && pairs.length > 0) {
      const shuffledIndices = Array.from({ length: pairs.length }, (_, i) => i)
        .sort(() => Math.random() - 0.5);
      
      onContentChange?.({
        ...block.content,
        shuffled: shuffledIndices,
      });
    }
  }, [mode, pairs.length]);
  
  const handleTermClick = (index: number) => {
    if (matches.has(index)) return; // Already matched
    
    setFeedback(null);
    
    if (selectedTerm === index) {
      setSelectedTerm(null);
    } else {
      setSelectedTerm(index);
      
      // If we also have a description selected, try to match
      if (selectedDesc !== null) {
        checkMatch(index, selectedDesc);
      }
    }
  };
  
  const handleDescClick = (index: number) => {
    if (Array.from(matches.values()).includes(index)) return; // Already matched
    
    setFeedback(null);
    
    if (selectedDesc === index) {
      setSelectedDesc(null);
    } else {
      setSelectedDesc(index);
      
      // If we also have a term selected, try to match
      if (selectedTerm !== null) {
        checkMatch(selectedTerm, index);
      }
    }
  };
  
  const checkMatch = (termIdx: number, descIdx: number) => {
    const shuffledDescIdx = shuffled?.[descIdx] ?? descIdx;
    
    if (termIdx === shuffledDescIdx) {
      // Correct match!
      setMatches(new Map(matches).set(termIdx, descIdx));
      setFeedback('correct');
      setSelectedTerm(null);
      setSelectedDesc(null);
    } else {
      // Incorrect
      setFeedback('incorrect');
      setTimeout(() => {
        setFeedback(null);
        setSelectedTerm(null);
        setSelectedDesc(null);
      }, 1000);
    }
  };
  
  const resetGame = () => {
    setMatches(new Map());
    setSelectedTerm(null);
    setSelectedDesc(null);
    setFeedback(null);
    
    // Reshuffle
    const shuffledIndices = Array.from({ length: pairs.length }, (_, i) => i)
      .sort(() => Math.random() - 0.5);
    
    onContentChange?.({
      ...block.content,
      shuffled: shuffledIndices,
    });
  };
  
  const revealAll = () => {
    const allMatches = new Map<number, number>();
    pairs.forEach((_, i) => {
      const shuffledIdx = shuffled?.findIndex(idx => idx === i) ?? i;
      allMatches.set(i, shuffledIdx);
    });
    setMatches(allMatches);
    setFeedback(null);
  };

  // EDIT MODE
  if (mode === 'edit') {
    const exampleText = `Photosynthesis
Mitosis
Osmosis
---
Process where plants convert light to energy
Cell division creating two identical daughter cells
Movement of water across a semipermeable membrane`;

    return (
      <div className="p-6 border-2 border-blue-500 bg-blue-50 rounded space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Match Pairs
          </label>
          <textarea
            value={rawInput}
            onChange={(e) => onContentChange?.({
              rawInput: e.target.value,
              shuffled: undefined, // Reset shuffle when content changes
            })}
            placeholder={exampleText}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            rows={12}
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-2">
            Format: List terms, add a divider line (---), then list descriptions in matching order.
          </p>
        </div>

        {pairs.length > 0 && (
          <div className="p-4 bg-white rounded border border-gray-200">
            <p className="text-sm font-medium text-green-700 mb-2">
              ✓ {pairs.length} pairs detected
            </p>
            <div className="space-y-1 text-xs text-gray-600">
              {pairs.map((pair, i) => (
                <div key={i} className="flex gap-2">
                  <span className="font-semibold min-w-[120px]">{pair.term}</span>
                  <span className="text-gray-400">→</span>
                  <span>{pair.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {rawInput && pairs.length === 0 && (
          <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-sm text-yellow-800">
              ⚠️ Invalid format. Make sure to include a divider line (---) and equal numbers of terms and descriptions.
            </p>
          </div>
        )}
      </div>
    );
  }

  // VIEW MODE
  if (pairs.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No match pairs defined yet</p>
      </div>
    );
  }

  const allMatched = matches.size === pairs.length;
  const shuffledPairs = shuffled 
    ? shuffled.map(idx => pairs[idx]) 
    : pairs;

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Match the terms with their definitions
        </h3>
        <div className="flex gap-2">
          {matches.size > 0 && !allMatched && (
            <button
              onClick={resetGame}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded transition-colors"
            >
              Reset
            </button>
          )}
          <button
            onClick={revealAll}
            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded transition-colors"
          >
            Reveal All
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 text-sm">
        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${(matches.size / pairs.length) * 100}%` }}
          />
        </div>
        <span className="text-gray-600 font-medium whitespace-nowrap">
          {matches.size} / {pairs.length}
        </span>
      </div>

      {/* Feedback */}
      {feedback === 'correct' && (
        <div className="p-3 bg-green-100 border border-green-300 rounded text-green-800 text-sm font-medium animate-pulse">
          ✓ Correct match!
        </div>
      )}
      {feedback === 'incorrect' && (
        <div className="p-3 bg-red-100 border border-red-300 rounded text-red-800 text-sm font-medium animate-pulse">
          ✗ Try again
        </div>
      )}

      {/* Victory message */}
      {allMatched && (
        <div className="p-4 bg-green-100 border-2 border-green-300 rounded-lg text-center">
          <p className="text-lg font-bold text-green-800 mb-2">🎉 All matched!</p>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
          >
            Play Again
          </button>
        </div>
      )}

      {/* The matching interface */}
      <div className="grid grid-cols-2 gap-4">
        {/* Terms column */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Terms</h4>
          {pairs.map((pair, i) => {
            const isMatched = matches.has(i);
            const isSelected = selectedTerm === i;
            
            return (
              <button
                key={i}
                onClick={() => handleTermClick(i)}
                disabled={isMatched}
                className={`
                  w-full px-4 py-3 rounded-lg text-left font-medium transition-all
                  ${isMatched 
                    ? 'bg-green-100 text-green-800 border-2 border-green-400 cursor-default' 
                    : isSelected
                    ? 'bg-blue-500 text-white border-2 border-blue-600 shadow-lg'
                    : 'bg-white border-2 border-gray-300 hover:border-blue-400 hover:shadow-md cursor-pointer'
                  }
                `}
              >
                {isMatched && <span className="mr-2">✓</span>}
                {pair.term}
              </button>
            );
          })}
        </div>

        {/* Descriptions column (shuffled) */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Definitions</h4>
          {shuffledPairs.map((pair, i) => {
            const isMatched = Array.from(matches.values()).includes(i);
            const isSelected = selectedDesc === i;
            
            return (
              <button
                key={i}
                onClick={() => handleDescClick(i)}
                disabled={isMatched}
                className={`
                  w-full px-4 py-3 rounded-lg text-left transition-all
                  ${isMatched 
                    ? 'bg-green-100 text-green-800 border-2 border-green-400 cursor-default' 
                    : isSelected
                    ? 'bg-blue-500 text-white border-2 border-blue-600 shadow-lg'
                    : 'bg-white border-2 border-gray-300 hover:border-blue-400 hover:shadow-md cursor-pointer'
                  }
                `}
              >
                {isMatched && <span className="mr-2">✓</span>}
                {pair.description}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}