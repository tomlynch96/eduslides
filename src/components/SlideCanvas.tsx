import type { BlockInstance } from '../types/core';
import { SlideLayout } from '../types/core';
import { UniversalBlockRenderer } from './UniversalBlockRenderer';
import { LayoutSelector } from './LayoutSelector';
import { LAYOUT_REGISTRY, assignBlocksToSlots } from '../layouts/layoutRegistry';

interface SlideCanvasProps {
  blocks: BlockInstance[];
  currentLayout: SlideLayout;
  onLayoutChange: (newLayout: SlideLayout) => void;
  onRemoveBlock: (blockId: string) => void;
  onUpdateBlock: (updatedBlock: BlockInstance) => void;
  fullscreenBlockId: string | null;
  onToggleBlockFullscreen: (blockId: string) => void;
}

export function SlideCanvas({
  blocks,
  currentLayout,
  onLayoutChange,
  onRemoveBlock,
  onUpdateBlock,
  fullscreenBlockId,
  onToggleBlockFullscreen,
}: SlideCanvasProps) {
  
  if (blocks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg border-2 border-dashed border-gray-300 p-12 text-center min-h-[500px] flex items-center justify-center">
        <div>
          <p className="text-gray-500 text-lg mb-2">📄 Empty Slide</p>
          <p className="text-gray-400 text-sm">Use Insert menu to add blocks</p>
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

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          📄 Slide Preview ({blocks.length} block{blocks.length !== 1 ? 's' : ''})
        </h3>

        <LayoutSelector
          currentLayout={currentLayout}
          blockCount={blocks.length}
          onLayoutChange={onLayoutChange}
        />
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
          {displaySlots.map((slot) => {
            const blockId = fullscreenBlockId || slotAssignment.get(slot.id);
            const block = blocks.find(b => b.id === blockId);
            
            if (!block) return null;

            return (
              <div
                key={slot.id}
                className="overflow-hidden"
                style={{
                  gridColumn: `${slot.column} / span ${slot.columnSpan}`,
                  gridRow: `${slot.row} / span ${slot.rowSpan}`,
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