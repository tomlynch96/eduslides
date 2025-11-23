import type { BlockInstance } from '../types/core';
import { TextBlock } from '../blocks/renderers/TextBlock';
import { TimerBlock } from '../blocks/renderers/TimerBlock';
import { ObjectivesBlock } from '../blocks/renderers/ObjectivesBlock';
import { QuestionBlock } from '../blocks/renderers/QuestionBlock';
import { useState } from 'react';
import { getCurrentLayout, getLayoutOptions } from '../utils/layoutEngine';

interface SlideCanvasProps {
  blocks: BlockInstance[];
  onRemoveBlock: (blockId: string) => void;
  onUpdateBlock: (updatedBlock: BlockInstance) => void;
  lessonObjectives: Array<{ id: string; text: string }>;
  completedObjectives: string[];
  onToggleObjective: (objectiveId: string) => void;
  layout: 'auto' | 'vertical-stack';
  layoutPattern: number;
  hasTitleZone: boolean;                        // NEW
  onChangeLayout: (pattern: number) => void;
  onToggleLayoutMode: () => void;
  onToggleTitleZone: () => void;                // NEW
}

export function SlideCanvas({ 
  blocks, 
  onRemoveBlock,
  onUpdateBlock,
  lessonObjectives, 
  completedObjectives, 
  onToggleObjective,
  layout,
  layoutPattern,
  hasTitleZone,           // NEW
  onChangeLayout,
  onToggleLayoutMode,
  onToggleTitleZone       // NEW
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

  const blockIds = blocks.map(b => b.id);
  const layoutPositions = getCurrentLayout(blockIds, layout, layoutPattern, hasTitleZone);
  const layoutOptions = getLayoutOptions(blockIds, hasTitleZone);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 min-h-[500px]">
      {/* Header with layout controls */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          📄 Slide Preview ({blocks.length} block{blocks.length !== 1 ? 's' : ''})
        </h3>
        
        {blocks.length > 0 && (
          <div className="flex items-center gap-2">
            {/* Title Zone toggle */}
            <button
              onClick={onToggleTitleZone}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                hasTitleZone 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {hasTitleZone ? '📋 Has Title' : '📋 Add Title'}
            </button>

            <span className="text-xs text-gray-300">|</span>

            {/* Layout mode toggle */}
            <button
              onClick={onToggleLayoutMode}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                layout === 'auto' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {layout === 'auto' ? 'Auto Layout' : 'Vertical Stack'}
            </button>

            {/* Layout pattern selector (only in auto mode) */}
            {layout === 'auto' && layoutOptions.length > 1 && (
              <>
                <span className="text-xs text-gray-500">|</span>
                <span className="text-xs text-gray-600">
                  {layoutOptions[layoutPattern]?.name || 'Layout'}
                </span>
                <button
                  onClick={() => onChangeLayout((layoutPattern + 1) % layoutOptions.length)}
                  className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                >
                  Try Different Layout
                </button>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Canvas content */}
      {blocks.length === 0 ? (
        <div className="p-12 text-center min-h-[500px] flex items-center justify-center">
          <div>
            <p className="text-gray-500 text-lg mb-2">📄 Empty Slide</p>
            <p className="text-gray-400 text-sm">
              Click Insert → Block Type to add content
            </p>
          </div>
        </div>
      ) : (
        <div 
          className="p-6"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '1rem',
            minHeight: '500px',
            alignContent: 'start'
          }}
        >
          {blocks.map((block) => {
            const position = layoutPositions.find(p => p.blockId === block.id);
            if (!position) return null;

            return (
              <div
                key={block.id}
                className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden"
                style={{
                  gridColumn: `${position.column} / span ${position.columnSpan}`,
                  gridRow: `${position.row} / span ${position.rowSpan}`,
                }}
              >
                {/* Delete button */}
                <button
                  onClick={() => onRemoveBlock(block.id)}
                  className="absolute top-2 right-2 px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  Remove
                </button>

                {/* Render block */}
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
      )}
    </div>
  );
}
