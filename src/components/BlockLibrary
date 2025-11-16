import type { BlockInstance } from '../types/core';
import { getTopic } from '../data/topics';

interface BlockLibraryProps {
  blocks: BlockInstance[];
  onAddToSlide: (blockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
}

export function BlockLibrary({ blocks, onAddToSlide, onDeleteBlock }: BlockLibraryProps) {
  if (blocks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          📚 Block Library
        </h2>
        <p className="text-gray-500 text-sm">
          No blocks created yet. Create a block above to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        📚 Block Library ({blocks.length})
      </h2>
      
      <div className="space-y-3">
        {blocks.map((block) => {
          const topic = getTopic(block.topic);
          
          const handleAdd = () => {
            onAddToSlide(block.id);
          };
          
          const handleDelete = () => {
            if (window.confirm('Delete this block?')) {
              onDeleteBlock(block.id);
            }
          };
          
          return (
            <div
              key={block.id}
              className="border border-gray-200 rounded-lg p-3 hover:border-blue-400 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{block.type === 'text' ? '📝' : '❓'}</span>
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      {block.type}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-700 truncate mb-1">
                    {block.type === 'text' && (block as any).content.text}
                  </div>
                  
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>{topic?.name || block.topic}</span>
                    <span>•</span>
                    <span>{block.difficulty}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleAdd}
                    className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  >
                    Add to Slide
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}