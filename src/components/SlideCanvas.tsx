import type { BlockInstance } from '../types/core';
import { TextBlock } from '../blocks/renderers/TextBlock';

interface SlideCanvasProps {
  blocks: BlockInstance[];
}

export function SlideCanvas({ blocks }: SlideCanvasProps) {
  if (blocks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-12 text-center">
        <p className="text-gray-500 text-lg">
          No blocks on this slide yet. Create a block to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 min-h-[500px]">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700">
          Slide Preview ({blocks.length} block{blocks.length !== 1 ? 's' : ''})
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {blocks.map((block) => {
          // Render the appropriate block component based on type
          if (block.type === 'text') {
            return (
              <div key={block.id}>
                <TextBlock block={block as any} />
              </div>
            );
          }
          
          // For other block types (we'll add these later)
          return (
            <div key={block.id} className="p-6 text-gray-500">
              Block type "{block.type}" not yet implemented
            </div>
          );
        })}
      </div>
    </div>
  );
}