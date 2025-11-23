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
  lessonObjectives: Array<{ id: string; text: string }>;
  completedObjectives: string[];
  onToggleObjective: (objectiveId: string) => void;
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
    <div ref={containerRef} className="fixed inset-0 bg-white z-50">
      {/* Just the slides - nothing else */}
      {currentBlocks.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400 text-4xl">
          Empty slide
        </div>
      ) : (
        <div 
          className="h-full p-8"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '2rem',
            alignContent: 'center'
          }}
        >
          {currentBlocks.map((block) => {
            const position = layoutPositions.find(p => p.blockId === block.id);
            if (!position) return null;

            return (
              <div
                key={block.id}
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
  );
}