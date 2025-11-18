import type { BlockInstance } from '../types/core';
import { TextBlock } from '../blocks/renderers/TextBlock';
import { TimerBlock } from '../blocks/renderers/TimerBlock';
import { ObjectivesBlock } from '../blocks/renderers/ObjectivesBlock';
import { QuestionBlock } from '../blocks/renderers/QuestionBlock';
import { useState } from 'react';

interface SlideCanvasProps {
  blocks: BlockInstance[];
  onRemoveBlock: (blockId: string) => void;
  onUpdateBlock: (updatedBlock: BlockInstance) => void;
  lessonObjectives: Array<{ id: string; text: string }>;
  completedObjectives: string[];
  onToggleObjective: (objectiveId: string) => void;
}

export function SlideCanvas({ 
  blocks, 
  onRemoveBlock,
  onUpdateBlock,
  lessonObjectives, 
  completedObjectives, 
  onToggleObjective 
}: SlideCanvasProps) {
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  if (blocks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg border-2 border-dashed border-gray-300 p-12 text-center min-h-[500px] flex items-center justify-center">
        <div>
          <p className="text-gray-500 text-lg mb-2">
            📄 Empty Slide
          </p>
          <p className="text-gray-400 text-sm">
            Add blocks from your library to build this slide
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 min-h-[500px]">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          📄 Slide Preview ({blocks.length} block{blocks.length !== 1 ? 's' : ''})
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {blocks.map((block) => {
          const handleRemove = () => {
            onRemoveBlock(block.id);
          };
          
          return (
            <div key={block.id} className="relative group">
              {/* Delete button - appears on hover */}
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                Remove
              </button>
              
              {/* Render the appropriate block type */}
              {block.type === 'text' && (
                <TextBlock 
                  block={block as any}
                  isEditing={editingBlockId === block.id}
                  onUpdate={(updatedBlock) => {
                    onUpdateBlock(updatedBlock);
                    setEditingBlockId(null);
                  }}
                  onStartEdit={() => setEditingBlockId(block.id)}
                  onStopEdit={() => setEditingBlockId(null)}
                />
              )}
              {block.type === 'timer' && (
                <TimerBlock 
                  block={block as any}
                  isEditing={editingBlockId === block.id}
                  onUpdate={(updatedBlock) => {
                    onUpdateBlock(updatedBlock);
                    setEditingBlockId(null);
                  }}
                  onStartEdit={() => setEditingBlockId(block.id)}
                  onStopEdit={() => setEditingBlockId(null)}
                />
              )}
              {block.type === 'objectives' && (
                <ObjectivesBlock 
                  block={block as any} 
                  lessonObjectives={lessonObjectives}
                  completedObjectives={completedObjectives}
                  onToggleObjective={onToggleObjective}
                  isEditing={editingBlockId === block.id}
                  onUpdate={(updatedBlock) => {
                    onUpdateBlock(updatedBlock);
                    setEditingBlockId(null);
                  }}
                  onStartEdit={() => setEditingBlockId(block.id)}
                  onStopEdit={() => setEditingBlockId(null)}
                />
              )}
              {block.type === 'question' && (
                <QuestionBlock 
                  block={block as any}
                  isEditing={editingBlockId === block.id}
                  onUpdate={(updatedBlock) => {
                    onUpdateBlock(updatedBlock);
                    setEditingBlockId(null);
                  }}
                  onStartEdit={() => setEditingBlockId(block.id)}
                  onStopEdit={() => setEditingBlockId(null)}
                />
              )}
              {!['text', 'timer', 'objectives', 'question'].includes(block.type) && (
                <div className="p-6 text-gray-500">
                  Block type "{block.type}" not yet implemented
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}