import { useState, useRef, useEffect } from 'react';
import { blockRegistry } from '../block-registry';
import type { BlockTypeName, BlockInstance } from '../types/core';
import { getTemplatesForBlockType } from '../services/templateManager';
import { createBlockFromTemplate } from '../services/templateManager';

interface InsertBlockMenuProps {
  onInsertBlock: (block: BlockInstance) => void;
}

export function InsertBlockMenu({ onInsertBlock }: InsertBlockMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredBlockType, setHoveredBlockType] = useState<BlockTypeName | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const allBlockTypes = blockRegistry.getAll();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHoveredBlockType(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleCreateNew = (blockType: BlockTypeName) => {
    const newBlock = blockRegistry.createDefaultBlock(blockType);
    if (newBlock) {
      onInsertBlock(newBlock);
      setIsOpen(false);
      setHoveredBlockType(null);
    }
  };

  const handleCreateFromTemplate = (blockType: BlockTypeName, templateId: string) => {
    const templates = getTemplatesForBlockType(blockType);
    const template = templates.find(t => t.id === templateId);
    
    if (template) {
      const newBlock = createBlockFromTemplate(
        template,
        blockRegistry.createDefaultBlock.bind(blockRegistry)
      );
      
      if (newBlock) {
        onInsertBlock(newBlock);
        setIsOpen(false);
        setHoveredBlockType(null);
      }
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
      >
        + Insert Block
      </button>

      {isOpen && (
        <div 
          className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          onMouseLeave={() => setHoveredBlockType(null)}
        >
          {allBlockTypes.map((blockDef) => {
            const templates = getTemplatesForBlockType(blockDef.id as BlockTypeName);
            const isHovered = hoveredBlockType === blockDef.id;

            return (
              <div
                key={blockDef.id}
                className="relative"
                onMouseEnter={() => setHoveredBlockType(blockDef.id as BlockTypeName)}
              >
                <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{blockDef.icon}</span>
                      <span className="text-sm text-gray-700">{blockDef.label}</span>
                    </div>
                    {templates.length > 0 && (
                      <span className="text-xs text-gray-400">
                        {templates.length} template{templates.length !== 1 ? 's' : ''} →
                      </span>
                    )}
                  </div>
                </div>

                {/* Submenu on hover - appears to the RIGHT */}
                {isHovered && (
                  <div className="absolute left-full top-0 ml-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {/* New block option */}
                    <button
                      onClick={() => handleCreateNew(blockDef.id as BlockTypeName)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 border-b border-gray-100"
                    >
                      ✨ New {blockDef.label}
                    </button>

                    {/* Template options */}
                    {templates.length > 0 ? (
                      <>
                        <div className="px-4 py-1 text-xs text-gray-500 bg-gray-50 border-b border-gray-100">
                          From Template:
                        </div>
                        {templates.map((template) => (
                          <button
                            key={template.id}
                            onClick={() => handleCreateFromTemplate(blockDef.id as BlockTypeName, template.id)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium">{template.name}</div>
                            {template.description && (
                              <div className="text-xs text-gray-500 truncate">
                                {template.description}
                              </div>
                            )}
                          </button>
                        ))}
                      </>
                    ) : (
                      <div className="px-4 py-2 text-xs text-gray-400 italic">
                        No templates yet
                      </div>
                    )}
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