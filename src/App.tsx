import { useState, useEffect } from 'react';
import type { BlockInstance } from './types/core';
import { BlockCreator } from './components/BlockCreator';
import { SlideCanvas } from './components/SlideCanvas';
import { getAllBlockInstances } from './storage/storage';

function App() {
  const [blocks, setBlocks] = useState<BlockInstance[]>([]);

  // Load blocks from storage on mount
  useEffect(() => {
    const savedBlocks = getAllBlockInstances();
    setBlocks(savedBlocks);
  }, []);

  const handleBlockCreated = (newBlock: BlockInstance) => {
    setBlocks([...blocks, newBlock]);
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
          {/* Left: Block Creator */}
          <div>
            <BlockCreator onBlockCreated={handleBlockCreated} />
          </div>

          {/* Right: Slide Canvas */}
          <div>
            <SlideCanvas blocks={blocks} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;