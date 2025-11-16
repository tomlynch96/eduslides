import { useState, useEffect } from 'react';
import type { BlockInstance } from './types/core';
import { BlockCreator } from './components/BlockCreator';
import { BlockLibrary } from './components/BlockLibrary.tsx';
import { SlideCanvas } from './components/SlideCanvas';
import { getAllBlockInstances, deleteBlockInstance } from './storage/storage';

function App() {
  // All blocks that have been created
  const [allBlocks, setAllBlocks] = useState<BlockInstance[]>([]);
  
  // Block IDs currently on the slide
  const [slideBlockIds, setSlideBlockIds] = useState<string[]>([]);

  // Load blocks from storage on mount
  useEffect(() => {
    const savedBlocks = getAllBlockInstances();
    setAllBlocks(savedBlocks);
  }, []);

  // Get the actual block instances for the current slide
  const slideBlocks = slideBlockIds
    .map(id => allBlocks.find(block => block.id === id))
    .filter((block): block is BlockInstance => block !== undefined);

  const handleBlockCreated = (newBlock: BlockInstance) => {
    setAllBlocks([...allBlocks, newBlock]);
  };

  const handleAddToSlide = (blockId: string) => {
    if (!slideBlockIds.includes(blockId)) {
      setSlideBlockIds([...slideBlockIds, blockId]);
    }
  };

  const handleRemoveFromSlide = (blockId: string) => {
    setSlideBlockIds(slideBlockIds.filter(id => id !== blockId));
  };

  const handleDeleteBlock = (blockId: string) => {
    // Remove from storage
    deleteBlockInstance(blockId);
    
    // Remove from state
    setAllBlocks(allBlocks.filter(block => block.id !== blockId));
    
    // Remove from slide if present
    setSlideBlockIds(slideBlockIds.filter(id => id !== blockId));
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
              blocks={slideBlocks}
              onRemoveBlock={handleRemoveFromSlide}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;