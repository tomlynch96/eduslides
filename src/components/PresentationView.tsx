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
}

export function PresentationView({
  slides,
  allBlocks,
  currentSlideIndex,
  onNextSlide,
  onPreviousSlide,
  onExit,
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
        console.error('Error entering fullscreen:', err);
      }
    };

    enterFullscreen();

    // Exit fullscreen on unmount
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => {
          console.error('Error exiting fullscreen:', err);
        });
      }
    };
  }, []);

  // Handle fullscreen change (e.g., user presses ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        // User exited fullscreen (pressed ESC or clicked browser button)
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
          // Exit fullscreen and presentation mode
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
  const layoutPositions = getCurrentLayout(
    blockIds, 
    currentSlide.layout || 'auto', 
    currentSlide.layoutPattern || 0,
    currentSlide.hasTitleZone || false
  );

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* 16:9 Container centered in fullscreen */}
      <div 
        className="relative w-full h-full max-w-[177.78vh] max-h-[56.25vw] bg-white"
      >
        {currentBlocks.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-4xl">
            Empty slide
          </div>
        ) : (
          <div 
            className="h-full w-full"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: '2rem',
              padding: '2rem',
              alignContent: 'start'
            }}
          >
            {layoutPositions.map((position) => {
              const block = currentBlocks.find(b => b.id === position.blockId);
              if (!block) return null;

              return (
                <div
                  key={position.blockId}
                  className="presentation-block"
                  style={{
                    gridColumn: `${position.column} / span ${position.columnSpan}`,
                    gridRow: `${position.row} / span ${position.rowSpan}`,
                  }}
                >
                  <UniversalBlockRenderer
                    block={block}
                    isEditable={false}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}