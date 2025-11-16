import { useState, useEffect } from 'react';
import type { BlockInstance } from './types/core';
import { BlockCreator } from './components/BlockCreator';
import { BlockLibrary } from './components/BlockLibrary';
import { SlideCanvas } from './components/SlideCanvas';
import { SlideManager } from './components/SlideManager';
import { getAllBlockInstances, deleteBlockInstance } from './storage/storage';

// Simple slide type - just tracks which blocks are on it
interface SimpleSlide {
  id: string;
  blockIds: string[];
}

function App() {
  // All blocks that have been created
  const [allBlocks, setAllBlocks] = useState<BlockInstance[]>([]);
  
  // All slides in the lesson
  const [slides, setSlides] = useState<SimpleSlide[]>([
    { id: 'slide-1', blockIds: [] }
  ]);
  
  // Which slide we're currently viewing/editing
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Load blocks from storage on mount
  useEffect(() => {
    const savedBlocks = getAllBlockInstances();
    setAllBlocks(savedBlocks);
  }, []);

  // Get the current slide
  const currentSlide = slides[currentSlideIndex];
  
  // Get the actual block instances for the current slide
  const currentSlideBlocks = currentSlide.blockIds
    .map(id => allBlocks.find(block => block.id === id))
    .filter((block): block is BlockInstance => block !== undefined);

  const handleBlockCreated = (newBlock: BlockInstance) => {
    setAllBlocks([...allBlocks, newBlock]);
  };

  const handleAddToSlide = (blockId: string) => {
    if (!currentSlide.blockIds.includes(blockId)) {
      const updatedSlides = [...slides];
      updatedSlides[currentSlideIndex] = {
        ...currentSlide,
        blockIds: [...currentSlide.blockIds, blockId]
      };
      setSlides(updatedSlides);
    }
  };

  const handleRemoveFromSlide = (blockId: string) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex] = {
      ...currentSlide,
      blockIds: currentSlide.blockIds.filter(id => id !== blockId)
    };
    setSlides(updatedSlides);
  };

  const handleDeleteBlock = (blockId: string) => {
    // Remove from storage
    deleteBlockInstance(blockId);
    
    // Remove from all blocks
    setAllBlocks(allBlocks.filter(block => block.id !== blockId));
    
    // Remove from ALL slides that contain it
    const updatedSlides = slides.map(slide => ({
      ...slide,
      blockIds: slide.blockIds.filter(id => id !== blockId)
    }));
    setSlides(updatedSlides);
  };

  const handleNewSlide = () => {
    const newSlide: SimpleSlide = {
      id: `slide-${Date.now()}`,
      blockIds: []
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length); // Jump to new slide
  };

  const handleDeleteSlide = () => {
    if (slides.length === 1) return; // Can't delete last slide
    
    const updatedSlides = slides.filter((_, index) => index !== currentSlideIndex);
    setSlides(updatedSlides);
    
    // Adjust current index if needed
    if (currentSlideIndex >= updatedSlides.length) {
      setCurrentSlideIndex(updatedSlides.length - 1);
    }
  };

  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            EduSlides
          </h1>
          <p className="text-gray-600 mt-1">
            Block-based lesson builder for teachers
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Slide Manager */}
        <SlideManager
          currentSlideIndex={currentSlideIndex}
          totalSlides={slides.length}
          onPrevious={handlePreviousSlide}
          onNext={handleNextSlide}
          onNewSlide={handleNewSlide}
          onDeleteSlide={handleDeleteSlide}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Block Creator */}
            <BlockCreator onBlockCreated={handleBlockCreated} />
            
            {/* Block Library */}
            <BlockLibrary
              blocks={allBlocks}
              onAddToSlide={handleAddToSlide}
              onDeleteBlock={handleDeleteBlock}
            />
          </div>

          {/* Right Column: Slide Canvas */}
          <div>
            <SlideCanvas
              blocks={currentSlideBlocks}
              onRemoveBlock={handleRemoveFromSlide}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;