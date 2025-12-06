import { useState } from 'react';
import { SlideLayout, type LayoutDefinition } from '../types/core';
import { LAYOUT_REGISTRY, getLayoutsForBlockCount } from '../layouts/layoutRegistry';

interface LayoutSelectorProps {
  currentLayout: SlideLayout;
  blockCount: number;
  onLayoutChange: (newLayout: SlideLayout) => void;
}

export function LayoutSelector({ 
  currentLayout, 
  blockCount,
  onLayoutChange 
}: LayoutSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const availableLayouts = getLayoutsForBlockCount(blockCount);
  const currentLayoutDef = LAYOUT_REGISTRY[currentLayout];

  if (blockCount === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center gap-2"
      >
        <span className="text-lg">{currentLayoutDef.icon}</span>
        <span>{currentLayoutDef.name}</span>
        <span className="text-xs text-gray-500">▾</span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 bg-white shadow-xl rounded-lg p-4 w-96 z-50 border border-gray-200"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <h3 className="text-sm font-semibold mb-3 text-gray-700">
            Choose Layout ({blockCount} block{blockCount !== 1 ? 's' : ''})
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {availableLayouts.map(layout => (
              <button
                key={layout.id}
                onClick={() => {
                  onLayoutChange(layout.id);
                  setIsOpen(false);
                }}
                className={`relative p-3 border-2 rounded-lg hover:border-blue-400 transition-colors ${
                  currentLayout === layout.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <LayoutPreview 
                  layout={layout} 
                  blockNumbers={Array.from({length: blockCount}, (_, i) => i + 1)} 
                />
                
                <div className="text-xs font-medium mt-2 text-center text-gray-700">
                  {layout.name}
                </div>

                {currentLayout === layout.id && (
                  <div className="absolute top-2 right-2 text-blue-500 text-sm">✓</div>
                )}
              </button>
            ))}
          </div>

          {availableLayouts.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-4">
              No layouts available for {blockCount} blocks.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LayoutPreview({ 
  layout, 
  blockNumbers 
}: { 
  layout: LayoutDefinition; 
  blockNumbers: number[];
}) {
  return (
    <div className="aspect-video bg-gray-50 rounded relative">
      {layout.slots.map((slot, index) => {
        const blockNum = blockNumbers[index];
        return (
          <div
            key={slot.id}
            className="absolute bg-white border-2 border-gray-300 rounded flex items-center justify-center font-bold text-gray-600 text-sm"
            style={{
              left: `${((slot.column - 1) / 12) * 100}%`,
              top: `${((slot.row - 1) / 6) * 100}%`,
              width: `${(slot.columnSpan / 12) * 100}%`,
              height: `${(slot.rowSpan / 6) * 100}%`,
            }}
          >
            {blockNum || ''}
          </div>
        );
      })}
    </div>
  );
}