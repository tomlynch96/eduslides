import type { BlockInstance } from '../types/core';
import { UniversalBlockRenderer } from './UniversalBlockRenderer';
import { getCurrentLayout, getLayoutOptions } from '../utils/layoutEngine';

interface SlideCanvasProps {
  blocks: BlockInstance[];
  onRemoveBlock: (blockId: string) => void;
  onUpdateBlock: (updatedBlock: BlockInstance) => void;
  layout: 'auto' | 'vertical-stack';
  layoutPattern: number;
  hasTitleZone: boolean;
  onChangeLayout: (pattern: number) => void;
  onToggleLayoutMode: () => void;
  onToggleTitleZone: () => void;
}

export function SlideCanvas({ 
  blocks, 
  onRemoveBlock,
  onUpdateBlock,
  layout,
  layoutPattern,
  hasTitleZone,
  onChangeLayout,
  onToggleLayoutMode,
  onToggleTitleZone
}: SlideCanvasProps) {
  if (blocks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg border-2 border-dashed border-gray-300 p-12 text-center min-h-[500px] flex items-center justify-center">
        <div>
          <p className="text-gray-500 text-lg mb-2">
            📄 Empty Slide
          </p>
          <p className="text-gray-400 text-sm">
            Use Insert menu to add blocks to this slide
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
      </div>
      
      {/* Canvas content - using grid layout */}
      <div 
        className="p-6"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '1rem',
          minHeight: '500px'
        }}
      >
        {layoutPositions.map((position) => {
          const block = blocks.find(b => b.id === position.blockId);
          if (!block) return null;

          return (
            <div
              key={position.blockId}
              style={{
                gridColumn: `${position.column} / span ${position.columnSpan}`,
                gridRow: `${position.row} / span ${position.rowSpan}`,
              }}
              className={position.isTitle ? 'border-b-2 border-purple-200 pb-4' : ''}
            >
              <UniversalBlockRenderer
                block={block}
                onUpdate={onUpdateBlock}
                onRemove={() => onRemoveBlock(block.id)}
                isEditable={true}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}