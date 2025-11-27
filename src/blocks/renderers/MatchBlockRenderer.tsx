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
  const { terms, descriptions, shuffled } = block.content;
  
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
      
      console.log('Creating shuffle:', shuffledIndices);
      setLocalShuffle(shuffledIndices);
    }
  }, [mode, localShuffle, pairs.length]);
  
  // When all matched, rearrange the matches map to align with original order
  useEffect(() => {
    if (matches.size === pairs.length && matches.size > 0) {
      console.log('All matched! Rearranging to original order');
      const newMatches = new Map<number, number>();
      // Each term i should now point to position i (since we're showing original order)
      for (let i = 0; i < pairs.length; i++) {
        newMatches.set(i, i);
      }
      setMatches(newMatches);
    }
  }, [matches.size, pairs.length]);
  
  const handleTermClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Prevent triggering edit mode
    
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
  
  const handleDescClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Prevent triggering edit mode
    
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
  
  const checkMatch = (termIdx: number, descDisplayPos: number) => {
    // termIdx = which term (0, 1, 2, 3...)
    // descDisplayPos = which position on screen the description is shown (0, 1, 2, 3...)
    // shuffledDescIndices[descDisplayPos] = which original description this is
    
    const originalDescIdx = shuffledDescIndices[descDisplayPos];
    
    if (termIdx === originalDescIdx) {
      // Correct match!
      setMatches(new Map(matches).set(termIdx, descDisplayPos));
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
  
  const resetGame = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering edit mode
    setMatches(new Map());
    setSelectedTerm(null);
    setSelectedDesc(null);
    setFeedback(null);
    
    // Reshuffle
    const shuffledIndices = Array.from({ length: pairs.length }, (_, i) => i)
      .sort(() => Math.random() - 0.5);
    
    console.log('Reshuffle:', shuffledIndices);
    setLocalShuffle(shuffledIndices);
  };
  
  const revealAll = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering edit mode
    const allMatches = new Map<number, number>();
    
    // For each term, find which display position shows its matching description
    pairs.forEach((_, termIdx) => {
      // Find where this term's description appears in the shuffled list
      const descDisplayPos = shuffledDescIndices.findIndex(originalIdx => originalIdx === termIdx);
      if (descDisplayPos !== -1) {
        allMatches.set(termIdx, descDisplayPos);
      }
    });
    
    setMatches(allMatches);
    setFeedback(null);
  };

  // EDIT MODE
  if (mode === 'edit') {
    const termsText = terms.join('\n');
    const descriptionsText = descriptions.join('\n');

    return (
      <div className="p-6 border-2 border-blue-500 bg-blue-50 rounded space-y-4">
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
                  shuffled: undefined, // Reset shuffle when content changes
                });
              }}
              placeholder={`Photosynthesis
Mitosis
Osmosis
Respiration`}
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
              Definitions (one per line, matching order)
            </label>
            <textarea
              value={descriptionsText}
              onChange={(e) => {
                const newDescriptions = e.target.value.split('\n');
                onContentChange?.({
                  ...block.content,
                  descriptions: newDescriptions,
                  shuffled: undefined, // Reset shuffle when content changes
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

        <div className="flex items-center gap-2">
          <p className="text-xs text-blue-600 font-medium">
            💡 Definitions will be shuffled randomly for students
          </p>
        </div>

        {pairs.length > 0 && (
          <div className="p-4 bg-white rounded border border-gray-200">
            <p className="text-sm font-medium text-green-700 mb-2">
              ✓ {pairs.length} valid pairs
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

        {terms.filter(t => t.trim()).length !== descriptions.filter(d => d.trim()).length && (
          <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-sm text-yellow-800">
              ⚠️ Number of terms ({terms.filter(t => t.trim()).length}) must match number of definitions ({descriptions.filter(d => d.trim()).length})
            </p>
          </div>
        )}
      </div>
    );
  }

  // VIEW MODE - Interactive matching game
  if (pairs.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No match pairs defined yet</p>
      </div>
    );
  }

  const allMatched = matches.size === pairs.length;
  
  // Get the shuffled description indices - use local state instead of block content
  // BUT: when all matched, show in original order for easy review
  const shuffledDescIndices = allMatched 
    ? Array.from({ length: pairs.length }, (_, i) => i)  // Original order when complete
    : (localShuffle || Array.from({ length: pairs.length }, (_, i) => i));  // Shuffled during game
  
  console.log('View mode - localShuffle:', localShuffle);
  console.log('View mode - allMatched:', allMatched);
  console.log('View mode - shuffledDescIndices:', shuffledDescIndices);

  // Color palette for matched pairs - vibrant and distinct colors
  const pairColors = [
    { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-900' },
    { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-900' },
    { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-900' },
    { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-900' },
    { bg: 'bg-red-100', border: 'border-red-400', text: 'text-red-900' },
    { bg: 'bg-pink-100', border: 'border-pink-400', text: 'text-pink-900' },
    { bg: 'bg-indigo-100', border: 'border-indigo-400', text: 'text-indigo-900' },
    { bg: 'bg-teal-100', border: 'border-teal-400', text: 'text-teal-900' },
    { bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-900' },
    { bg: 'bg-cyan-100', border: 'border-cyan-400', text: 'text-cyan-900' },
  ];

  const getMatchColor = (termIdx: number) => {
    return pairColors[termIdx % pairColors.length];
  };

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
              onClick={(e) => resetGame(e)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded transition-colors"
            >
              Reset
            </button>
          )}
          <button
            onClick={(e) => revealAll(e)}
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
            onClick={(e) => resetGame(e)}
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
            const colors = getMatchColor(i);
            
            return (
              <button
                key={i}
                onClick={(e) => handleTermClick(e, i)}
                disabled={isMatched}
                className={`
                  w-full px-4 py-3 rounded-lg text-left font-medium transition-all
                  ${isMatched 
                    ? `${colors.bg} ${colors.text} border-2 ${colors.border} cursor-default shadow-md` 
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
          {shuffledDescIndices.map((originalIdx, displayPosition) => {
            // originalIdx = which description from pairs[] to show
            // displayPosition = where on screen this appears
            const pair = pairs[originalIdx];
            const isMatched = Array.from(matches.values()).includes(displayPosition);
            const isSelected = selectedDesc === displayPosition;
            
            // Find which term this is matched to (if any) for color
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
                  w-full px-4 py-3 rounded-lg text-left transition-all
                  ${isMatched && colors
                    ? `${colors.bg} ${colors.text} border-2 ${colors.border} cursor-default shadow-md` 
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