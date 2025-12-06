// ============================================
// MATCH BLOCK RENDERER - REDESIGNED
// Content-First, Bigger Text, Warm Pastels
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
  const { terms, descriptions, instructions } = block.content;
  
  // Parse terms and descriptions into pairs
  const pairs: MatchPair[] = terms.map((term, i) => ({
    term: term.trim(),
    description: descriptions[i]?.trim() || ''
  })).filter(pair => pair.term && pair.description);
  
  // View mode state
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [selectedDesc, setSelectedDesc] = useState<number | null>(null);
  const [matches, setMatches] = useState<Map<number, number>>(new Map());
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [localShuffle, setLocalShuffle] = useState<number[] | null>(null);
  
  // Shuffle descriptions on first render in view mode
  useEffect(() => {
    if (mode === 'view' && !localShuffle && pairs.length > 0) {
      const shuffledIndices = Array.from({ length: pairs.length }, (_, i) => i)
        .sort(() => Math.random() - 0.5);
      setLocalShuffle(shuffledIndices);
    }
  }, [mode, localShuffle, pairs.length]);
  
  const handleTermClick = (e: React.MouseEvent, termIdx: number) => {
    e.stopPropagation();
    if (selectedTerm === termIdx) {
      setSelectedTerm(null);
    } else {
      setSelectedTerm(termIdx);
      if (selectedDesc !== null) {
        checkMatch(termIdx, selectedDesc);
      }
    }
  };
  
  const handleDescClick = (e: React.MouseEvent, descDisplayPos: number) => {
    e.stopPropagation();
    if (selectedDesc === descDisplayPos) {
      setSelectedDesc(null);
    } else {
      setSelectedDesc(descDisplayPos);
      if (selectedTerm !== null) {
        checkMatch(selectedTerm, descDisplayPos);
      }
    }
  };
  
  const checkMatch = (termIdx: number, descDisplayPos: number) => {
    const shuffledDescIndices = localShuffle || Array.from({ length: pairs.length }, (_, i) => i);
    const descOriginalIdx = shuffledDescIndices[descDisplayPos];
    
    if (termIdx === descOriginalIdx) {
      setMatches(new Map(matches).set(termIdx, descDisplayPos));
      setFeedback('correct');
      setSelectedTerm(null);
      setSelectedDesc(null);
    } else {
      setFeedback('incorrect');
      setTimeout(() => {
        setFeedback(null);
        setSelectedTerm(null);
        setSelectedDesc(null);
      }, 1000);
    }
  };
  
  const resetGame = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMatches(new Map());
    setSelectedTerm(null);
    setSelectedDesc(null);
    setFeedback(null);
    
    const shuffledIndices = Array.from({ length: pairs.length }, (_, i) => i)
      .sort(() => Math.random() - 0.5);
    setLocalShuffle(shuffledIndices);
  };

  // EDIT MODE
  if (mode === 'edit') {
    const termsText = terms.join('\n');
    const descriptionsText = descriptions.join('\n');

    return (
      <div className="p-6 border-2 border-blue-500 bg-blue-50 rounded space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Edit Match Block
        </h3>

        {/* Instructions field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instructions (optional)
          </label>
          <input
            type="text"
            value={instructions || ''}
            onChange={(e) => onContentChange?.({
              ...block.content,
              instructions: e.target.value,
            })}
            placeholder="e.g., Match each term with its definition"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave blank to show default "Match"
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Terms (one per line)
            </label>
            <textarea
              value={termsText}
              onChange={(e) => {
                const newTerms = e.target.value.split('\n');
                onContentChange?.({
                  ...block.content,
                  terms: newTerms,
                });
              }}
              placeholder={`Photosynthesis
Mitosis
Osmosis
Cellular respiration`}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              rows={12}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              {terms.filter(t => t.trim()).length} term(s)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Definitions (one per line, matching terms)
            </label>
            <textarea
              value={descriptionsText}
              onChange={(e) => {
                const newDescriptions = e.target.value.split('\n');
                onContentChange?.({
                  ...block.content,
                  descriptions: newDescriptions,
                });
              }}
              placeholder={`Process where plants convert light to energy
Cell division creating two identical daughter cells
Movement of water across a semipermeable membrane
Process of breaking down glucose to release energy`}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              rows={12}
            />
            <p className="text-xs text-gray-500 mt-1">
              {descriptions.filter(d => d.trim()).length} definition(s)
            </p>
          </div>
        </div>

        {pairs.length > 0 && (
          <div className="p-4 bg-white rounded border border-gray-200">
            <p className="text-sm font-medium text-green-700 mb-2">
              ✓ {pairs.length} valid pairs
            </p>
          </div>
        )}

        {terms.filter(t => t.trim()).length !== descriptions.filter(d => d.trim()).length && (
          <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-sm text-yellow-800">
              ⚠️ Number of terms must match number of definitions
            </p>
          </div>
        )}
      </div>
    );
  }

  // VIEW MODE - Content-first design
  if (pairs.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No match pairs defined yet</p>
      </div>
    );
  }

  const allMatched = matches.size === pairs.length;
  const shuffledDescIndices = localShuffle || Array.from({ length: pairs.length }, (_, i) => i);

  // Soft pastel colors for matched pairs
  const pairColors = [
    { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-gray-800' },
    { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-gray-800' },
    { bg: 'bg-green-50', border: 'border-green-200', text: 'text-gray-800' },
    { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-gray-800' },
    { bg: 'bg-red-50', border: 'border-red-200', text: 'text-gray-800' },
    { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-gray-800' },
    { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-gray-800' },
    { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-gray-800' },
  ];

  const getMatchColor = (termIdx: number) => {
    return pairColors[termIdx % pairColors.length];
  };

  return (
    <div className="p-4 bg-rose-50 rounded-xl h-full flex flex-col">
      {/* Header with instructions */}
      <div className="flex items-center justify-between mb-4 group">
        <h3 className="text-3xl font-bold text-gray-800">
          {instructions || 'Match'}
        </h3>
        
        {/* Hover button */}
        {matches.size > 0 && !allMatched && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => resetGame(e)}
              className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Feedback messages */}
      {feedback === 'correct' && (
        <div className="mb-3 p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-700 text-sm text-center">
          ✓ Correct!
        </div>
      )}
      {feedback === 'incorrect' && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm text-center">
          ✗ Try again
        </div>
      )}

      {/* Victory message */}
      {allMatched && (
        <div className="mb-4 p-4 bg-emerald-50 border-2 border-emerald-300 rounded-lg text-center">
          <p className="text-2xl font-bold text-emerald-700 mb-2">🎉 Complete!</p>
          <button
            onClick={(e) => resetGame(e)}
            className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
          >
            Play Again
          </button>
        </div>
      )}

      {/* The matching interface - bigger text */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {/* Terms column */}
        <div className="space-y-2">
          {pairs.map((pair, i) => {
            const isMatched = matches.has(i);
            const isSelected = selectedTerm === i;
            const colors = getMatchColor(i);
            
            return (
              <button
                key={i}
                onClick={(e) => handleTermClick(e, i)}
                disabled={isMatched}
                className={`
                  w-full px-3 py-2 rounded-lg text-left font-medium transition-all text-xl
                  ${isMatched 
                    ? `${colors.bg} ${colors.text} border-2 ${colors.border} cursor-default` 
                    : isSelected
                    ? 'bg-blue-500 text-white border-2 border-blue-600'
                    : 'bg-white border-2 border-gray-200 hover:border-blue-400 cursor-pointer'
                  }
                `}
              >
                {pair.term}
              </button>
            );
          })}
        </div>

        {/* Descriptions column (shuffled) */}
        <div className="space-y-2">
          {shuffledDescIndices.map((originalIdx, displayPosition) => {
            const pair = pairs[originalIdx];
            const isMatched = Array.from(matches.values()).includes(displayPosition);
            const isSelected = selectedDesc === displayPosition;
            
            let matchedTermIdx: number | null = null;
            for (const [termIdx, descDisplayPos] of matches.entries()) {
              if (descDisplayPos === displayPosition) {
                matchedTermIdx = termIdx;
                break;
              }
            }
            
            const colors = matchedTermIdx !== null ? getMatchColor(matchedTermIdx) : null;
            
            return (
              <button
                key={displayPosition}
                onClick={(e) => handleDescClick(e, displayPosition)}
                disabled={isMatched}
                className={`
                  w-full px-3 py-2 rounded-lg text-left font-medium transition-all text-xl
                  ${isMatched && colors
                    ? `${colors.bg} ${colors.text} border-2 ${colors.border} cursor-default` 
                    : isSelected
                    ? 'bg-blue-500 text-white border-2 border-blue-600'
                    : 'bg-white border-2 border-gray-200 hover:border-blue-400 cursor-pointer'
                  }
                `}
              >
                {pair.description}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}