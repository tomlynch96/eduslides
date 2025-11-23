// ============================================
// INSERT BLOCK MENU
// ============================================
// Reads available blocks from registry and creates them with defaults

import { useState, useRef, useEffect } from 'react';
import { blockRegistry } from '../block-registry';

interface InsertBlockMenuProps {
  onInsertBlock: (blockType: string) => void;
}

export function InsertBlockMenu({ onInsertBlock }: InsertBlockMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Get all registered blocks
  const blocks = blockRegistry.getAll();

  // Group by category
  const blocksByCategory = blocks.reduce((acc, block) => {
    const category = block.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(block);
    return acc;
  }, {} as Record<string, typeof blocks>);

  const categoryLabels: Record<string, string> = {
    content: 'Content',
    interactive: 'Interactive',
    assessment: 'Assessment',
    media: 'Media',
    other: 'Other',
  };

  const categoryOrder = ['content', 'media', 'interactive', 'assessment', 'other'];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
      >
        Insert
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {categoryOrder.map((category) => {
            const categoryBlocks = blocksByCategory[category];
            if (!categoryBlocks || categoryBlocks.length === 0) return null;

            return (
              <div key={category}>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {categoryLabels[category]}
                </div>
                {categoryBlocks.map((block) => (
                  <button
                    key={block.id}
                    onClick={() => {
                      onInsertBlock(block.id);
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors flex items-start gap-3"
                  >
                    <span className="text-2xl">{block.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        {block.label}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {block.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}