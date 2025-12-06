import { useEffect, useRef } from 'react';
import type { BlockInstance, SimpleSlide } from '../types/core';
import { UniversalBlockRenderer } from './UniversalBlockRenderer';
import { LAYOUT_REGISTRY, assignBlocksToSlots } from '../layouts/layoutRegistry';

interface PresentationViewProps {
  slides: SimpleSlide[];
  allBlocks: BlockInstance[];
  currentSlideIndex: number;
  onNextSlide: () => void;
  onPreviousSlide: () => void;
  onExit: () => void;
  fullscreenBlockId: string | null;
  onToggleBlockFullscreen: (blockId: string) => void;
}

export function PresentationView({
  slides,
  allBlocks,
  currentSlideIndex,
  onNextSlide,
  onPreviousSlide,
  onExit,
  fullscreenBlockId,
  onToggleBlockFullscreen,
}: PresentationViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          onNextSlide();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onPreviousSlide();
          break;
        case 'Escape':
          e.preventDefault();
          if (fullscreenBlockId) {
            onToggleBlockFullscreen(fullscreenBlockId);
          } else {
            onExit();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNextSlide, onPreviousSlide, onExit, fullscreenBlockId, onToggleBlockFullscreen]);

  // ============================================
  // PREPARE CURRENT SLIDE DATA
  // ============================================
  
  const currentSlide = slides[currentSlideIndex];
  const blockIds = currentSlide.blockIds;
  
  // Get all blocks for current slide
  const currentBlocks = allBlocks.filter(block => blockIds.includes(block.id));
  
  // If a block is fullscreened, only show that block
  const displayBlocks = fullscreenBlockId 
    ? currentBlocks.filter(b => b.id === fullscreenBlockId)
    : currentBlocks;
  
  // Get layout definition and slot assignments
  const layoutDef = LAYOUT_REGISTRY[currentSlide.layout];
  const slotAssignment = assignBlocksToSlots(blockIds, layoutDef);
  
  // Determine which slots to render
  const layoutSlots = fullscreenBlockId
    ? [{ id: 'fullscreen', column: 1, columnSpan: 12, row: 1, rowSpan: 6 }]
    : layoutDef.slots;

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div ref={containerRef} className="fixed inset-0 bg-white z-50">
      {/* Navigation Controls (top-right corner) */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
        {/* Slide Counter */}
        <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
          {currentSlideIndex + 1} / {slides.length}
        </div>
        
        {/* Exit Button */}
        <button
          onClick={onExit}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          Exit Presentation
        </button>
      </div>

      {/* Slide Content */}
      {currentBlocks.length === 0 && !currentSlide.title ? (
        // Empty slide state
        <div className="flex items-center justify-center h-full text-gray-400 text-4xl">
          Empty slide
        </div>
      ) : (
        // 16:9 Canvas with Grid Layout
        <div 
          className="relative w-full bg-gray-100"
          style={{
            paddingBottom: '56.25%', // 16:9 aspect ratio
          }}
        >
          <div 
            className="absolute inset-0 bg-white"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gridTemplateRows: 'repeat(6, 1fr)',
              gap: '2rem',
              padding: '2rem',
            }}
          >
            {/* Render title if exists */}
            {!fullscreenBlockId && currentSlide.title && (
              <div
                className="flex items-center justify-center text-4xl font-bold text-gray-800"
                style={{
                  gridColumn: '1 / span 12',
                  gridRow: '1 / span 1',
                }}
              >
                {currentSlide.title}
              </div>
            )}

            {/* Render content blocks */}
            {layoutSlots.map((slot) => {
              const blockId = fullscreenBlockId || slotAssignment.get(slot.id);
              const block = displayBlocks.find(b => b.id === blockId);
              
              if (!block) return null;

              // Adjust slot positions if title exists
              const adjustedRow = fullscreenBlockId 
                ? slot.row 
                : currentSlide.title 
                  ? slot.row + 1 
                  : slot.row;
              
              const adjustedRowSpan = fullscreenBlockId
                ? slot.rowSpan
                : currentSlide.title && slot.row === 1
                  ? Math.min(slot.rowSpan, 5)
                  : slot.rowSpan;

              return (
                <div
                  key={slot.id}
                  className="presentation-block"
                  style={{
                    gridColumn: `${slot.column} / span ${slot.columnSpan}`,
                    gridRow: `${adjustedRow} / span ${adjustedRowSpan}`,
                    height: '100%',
                    overflow: 'hidden'
                  }}
                >
                  <UniversalBlockRenderer
                    block={block}
                    isEditable={false}
                    isFullscreen={fullscreenBlockId === block.id}
                    onToggleFullscreen={() => onToggleBlockFullscreen(block.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Hints (bottom center) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded text-xs flex items-center gap-4">
        <span>← Previous</span>
        <span>•</span>
        <span>Next →</span>
        <span>•</span>
        <span>ESC to exit</span>
      </div>
    </div>
  );
}