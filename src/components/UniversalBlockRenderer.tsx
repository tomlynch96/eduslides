import { useState } from 'react';
import { blockRegistry } from '../block-registry';
import type { BlockInstance } from '../types/core';
import { ScalingBlockWrapper } from './ScalingBlockWrapper';
import { BlockEditModal } from './BlockEditModal';

interface UniversalBlockRendererProps {
  block: BlockInstance;
  onUpdate?: (block: BlockInstance) => void;
  onRemove?: () => void;
  isEditable: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export function UniversalBlockRenderer({
  block,
  onUpdate,
  onRemove,
  isEditable,
  isFullscreen = false,
  onToggleFullscreen,
}: UniversalBlockRendererProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const blockDef = blockRegistry.get(block.type);

  if (!blockDef) {
    return (
      <div className="p-4 bg-red-50 border-2 border-red-300 rounded">
        <p className="text-red-700 font-semibold">
          ⚠️ Unknown block type: {block.type}
        </p>
      </div>
    );
  }

  const Component = blockDef.component;

  const handleContentChange = (newContent: typeof block.content) => {
    if (onUpdate) {
      onUpdate({
        ...block,
        content: newContent,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <>
      <div 
        className={`relative h-full w-full group ${isEditable ? 'cursor-pointer hover:ring-2 hover:ring-blue-400 rounded transition-all' : ''}`}
        onClick={() => isEditable && setIsEditModalOpen(true)}
      >
        <ScalingBlockWrapper>
          <Component
            block={block}
            mode="view"
            onContentChange={handleContentChange}
            isFullscreen={isFullscreen}
          />
        </ScalingBlockWrapper>
        
        {/* Fullscreen button - shows on hover */}
        {onToggleFullscreen && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFullscreen();
            }}
            className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? '↙' : '↗'}
          </button>
        )}
        
        {/* Remove button */}
        {isEditable && onRemove && !isFullscreen && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        )}
      </div>

      {/* Edit Modal */}
      {isEditable && isEditModalOpen && (
        <BlockEditModal
          block={block}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={(updatedBlock) => {
            onUpdate?.(updatedBlock);
          }}
        />
      )}
    </>
  );
}