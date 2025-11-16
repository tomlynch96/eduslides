import { useEffect } from 'react';
import type { BlockInstance } from '../types/core';
import { TextBlock } from '../blocks/renderers/TextBlock';

interface PresentationViewProps {
  slides: Array<{
    id: string;
    blockIds: string[];
  }>;
  allBlocks: BlockInstance[];
  currentSlideIndex: number;
  onNextSlide: () => void;
  onPreviousSlide: () => void;
  onExit: () => void;
}

export function PresentationView({
  slides,
  allBlocks,
  currentSlideIndex,
  onNextSlide,
  onPreviousSlide,
  onExit,
}: PresentationViewProps) {
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onExit();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          onNextSlide();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          onPreviousSlide();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNextSlide, onPreviousSlide, onExit]);

  // Get current slide blocks
  const currentSlide = slides[currentSlideIndex];
  const currentBlocks = currentSlide.blockIds
    .map(id => allBlocks.find(block => block.id === id))
    .filter((block): block is BlockInstance => block !== undefined);

  const isFirstSlide = currentSlideIndex === 0;
  const isLastSlide = currentSlideIndex === slides.length - 1;

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Top bar - subtle controls */}
      <div className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm"
          >
            ← Exit Presentation
          </button>
          
          <div className="text-sm text-gray-300">
            Press <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">ESC</kbd> to exit
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm">
            Slide <span className="font-bold">{currentSlideIndex + 1}</span> of <span className="font-bold">{slides.length}</span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onPreviousSlide}
              disabled={isFirstSlide}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 rounded transition-colors text-sm"
            >
              ← Prev
            </button>
            <button
              onClick={onNextSlide}
              disabled={isLastSlide}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 rounded transition-colors text-sm"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Main slide content - centered and scaled */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-2xl min-h-[600px]">
          {currentBlocks.length === 0 ? (
            <div className="flex items-center justify-center h-[600px] text-gray-400 text-xl">
              Empty slide
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {currentBlocks.map((block) => (
                <div key={block.id} className="presentation-block">
                  {block.type === 'text' ? (
                    <TextBlock block={block as any} />
                  ) : (
                    <div className="p-6 text-gray-500">
                      Block type "{block.type}" not yet implemented
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom hint bar */}
      <div className="bg-gray-800 text-gray-400 px-6 py-2 text-xs text-center">
        Use <kbd className="px-2 py-1 bg-gray-700 rounded">Space</kbd>, <kbd className="px-2 py-1 bg-gray-700 rounded">→</kbd> to advance • 
        <kbd className="px-2 py-1 bg-gray-700 rounded ml-2">←</kbd> to go back
      </div>
    </div>
  );
}