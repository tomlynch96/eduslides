import type { BlockInstance } from '../types/core';
import { SlideLayout } from '../types/core';
import { UniversalBlockRenderer } from './UniversalBlockRenderer';
import { LayoutSelector } from './LayoutSelector';
import { LAYOUT_REGISTRY, assignBlocksToSlots } from '../layouts/layoutRegistry';

interface SlideCanvasProps {
  blocks: BlockInstance[];
  currentLayout: SlideLayout;
  slideTitle?: string;
  onLayoutChange: (newLayout: SlideLayout) => void;
  onToggleTitle: () => void;
  onRemoveBlock: (blockId: string) => void;
  onUpdateBlock: (updatedBlock: BlockInstance) => void;
  fullscreenBlockId: string | null;
  onToggleBlockFullscreen: (blockId: string) => void;
}

export function SlideCanvas({
  blocks,
  currentLayout,
  slideTitle,
  onLayoutChange,
  onToggleTitle,
  onRemoveBlock,
  onUpdateBlock,
  fullscreenBlockId,
  onToggleBlockFullscreen,
}: SlideCanvasProps) {
  
  if (blocks.length === 0 && !slideTitle) {
    return (
      <div className="bg-white rounded-lg shadow-lg border-2 border-dashed border-gray-300 p-12 text-center min-h-[500px] flex items-center justify-center">
        <div>
          <p className="text-gray-500 text-lg mb-2">📄 Empty Slide</p>
          <p className="text-gray-400 text-sm">Use Insert menu to add blocks or add a title</p>
        </div>
      </div>
    );
  }

  const layoutDef = LAYOUT_REGISTRY[currentLayout];
  const blockIds = blocks.map(b => b.id);
  const slotAssignment = assignBlocksToSlots(blockIds, layoutDef);

  const displaySlots = fullscreenBlockId
    ? [{ id: 'fullscreen', column: 1, columnSpan: 12, row: 1, rowSpan: 6 }]
    : layoutDef.slots;

  // Adjust row positions if title exists
  const titleRowSpan = 1;
  const contentStartRow = slideTitle ? 2 : 1;
  const contentRowSpan = slideTitle ? 5 : 6;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          📄 Slide Preview ({blocks.length} block{blocks.length !== 1 ? 's' : ''})
          {slideTitle && <span className="text-xs text-gray-500 ml-2">• "{slideTitle}"</span>}
        </h3>

        <div className="flex items-center gap-2">
          {/* Title Toggle */}
          <button
            onClick={onToggleTitle}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              slideTitle 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {slideTitle ? '📋 Edit Title' : '📋 Add Title'}
          </button>

          <span className="text-xs text-gray-300">|</span>

          <LayoutSelector
            currentLayout={currentLayout}
            blockCount={blocks.length}
            onLayoutChange={onLayoutChange}
          />
        </div>
      </div>

      <div
        className="relative w-full bg-gray-100"
        style={{ paddingBottom: '56.25%' }}
      >
        <div
          className="absolute inset-0 bg-white"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridTemplateRows: 'repeat(6, 1fr)',
            gap: '1rem',
            padding: '2rem',
          }}
        >
          {/* Render title if exists */}
          {!fullscreenBlockId && slideTitle && (
            <div
              className="flex items-center justify-center text-2xl font-bold text-gray-800 bg-gray-50 rounded border-2 border-dashed border-gray-300"
              style={{
                gridColumn: '1 / span 12',
                gridRow: '1 / span 1',
              }}
            >
              {slideTitle}
            </div>
          )}

          {/* Render content blocks */}
          {displaySlots.map((slot) => {
            const blockId = fullscreenBlockId || slotAssignment.get(slot.id);
            const block = blocks.find(b => b.id === blockId);
            
            if (!block) return null;

            // Adjust slot positions if title exists
            const adjustedRow = fullscreenBlockId 
              ? slot.row 
              : slideTitle 
                ? slot.row + 1 
                : slot.row;
            
            const adjustedRowSpan = fullscreenBlockId
              ? slot.rowSpan
              : slideTitle && slot.row === 1
                ? Math.min(slot.rowSpan, contentRowSpan)
                : slot.rowSpan;

            return (
              <div
                key={slot.id}
                className="overflow-hidden"
                style={{
                  gridColumn: `${slot.column} / span ${slot.columnSpan}`,
                  gridRow: `${adjustedRow} / span ${adjustedRowSpan}`,
                }}
              >
                <UniversalBlockRenderer
                  block={block}
                  onUpdate={onUpdateBlock}
                  onRemove={() => onRemoveBlock(block.id)}
                  isEditable={true}
                  isFullscreen={fullscreenBlockId === block.id}
                  onToggleFullscreen={() => onToggleBlockFullscreen(block.id)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}