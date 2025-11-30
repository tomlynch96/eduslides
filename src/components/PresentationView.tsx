import { useEffect, useRef } from 'react';
import type { BlockInstance } from '../types/core';
import { UniversalBlockRenderer } from './UniversalBlockRenderer';
import { getCurrentLayout } from '../utils/layoutEngine';

interface PresentationViewProps {
  slides: Array<{
    id: string;
    blockIds: string[];
    layout?: 'auto' | 'vertical-stack';
    layoutPattern?: number;
    hasTitleZone?: boolean;
  }>;
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

  // Enter fullscreen on mount
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (containerRef.current && document.fullscreenEnabled) {
          await containerRef.current.requestFullscreen();
        }
      } catch (err) {
        // Silently fail - browser blocked auto-fullscreen, that's okay
      }
    };

    enterFullscreen();

    // Exit fullscreen on unmount
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => {
          // Silent fail on exit too
        });
      }
    };
  }, []);

  // Handle fullscreen change (e.g., user presses ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        onExit();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [onExit]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
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

  // Get layout positions
  const blockIds = currentBlocks.map(b => b.id);
  
  // If a block is fullscreened, only show that block at full size
  const displayBlocks = fullscreenBlockId 
    ? currentBlocks.filter(b => b.id === fullscreenBlockId)
    : currentBlocks;
  
  const layoutPositions = fullscreenBlockId
    ? [{ blockId: fullscreenBlockId, column: 1, columnSpan: 12, row: 1, rowSpan: 6 }]
    : getCurrentLayout(
        blockIds, 
        currentSlide.layout || 'auto', 
        currentSlide.layoutPattern || 0,
        currentSlide.hasTitleZone || false
      );

  return (
    <div ref={containerRef} className="fixed inset-0 bg-white z-50">
      {currentBlocks.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400 text-4xl">
          Empty slide
        </div>
      ) : (
        <div 
          className="relative w-full bg-gray-100"
          style={{
            paddingBottom: '56.25%',
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
            {layoutPositions.map((position) => {
              const block = displayBlocks.find(b => b.id === position.blockId);
              if (!block) return null;

              return (
                <div
                  key={position.blockId}
                  className="presentation-block"
                  style={{
                    gridColumn: `${position.column} / span ${position.columnSpan}`,
                    gridRow: `${position.row} / span ${position.rowSpan}`,
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
    </div>
  );
}