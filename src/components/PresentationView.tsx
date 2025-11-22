import { useEffect, useRef } from 'react';
import type { BlockInstance } from '../types/core';
import { TextBlock } from '../blocks/renderers/TextBlock';
import { TimerBlock } from '../blocks/renderers/TimerBlock';
import { ObjectivesBlock } from '../blocks/renderers/ObjectivesBlock';
import { QuestionBlock } from '../blocks/renderers/QuestionBlock';

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
  lessonObjectives,
  completedObjectives,
  onToggleObjective,
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

  return (
    <div ref={containerRef} className="fixed inset-0 bg-white z-50">
      {/* Just the slides - nothing else */}
      {currentBlocks.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400 text-4xl">
          Empty slide
        </div>
      ) : (
        <div className="h-full divide-y divide-gray-200">
          {currentBlocks.map((block) => (
            <div key={block.id} className="presentation-block">
              {block.type === 'text' && <TextBlock block={block as any} />}
              {block.type === 'timer' && <TimerBlock block={block as any} />}
              {block.type === 'objectives' && (
                <ObjectivesBlock 
                  block={block as any}
                  lessonObjectives={lessonObjectives}
                  completedObjectives={completedObjectives}
                  onToggleObjective={onToggleObjective}
                />
              )}
              {block.type === 'question' && <QuestionBlock block={block as any} />}
              {!['text', 'timer', 'objectives', 'question'].includes(block.type) && (
                <div className="p-6 text-gray-500">
                  Block type "{block.type}" not yet implemented
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}