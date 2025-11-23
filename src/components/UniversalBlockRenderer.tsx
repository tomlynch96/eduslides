// ============================================
// UNIVERSAL BLOCK RENDERER
// ============================================
// This component can render ANY block type automatically
// You never need to modify this file when adding new blocks

import { useState } from 'react';
import { blockRegistry } from '../block-registry';
import type { BlockInstance } from '../types/core';

interface UniversalBlockRendererProps {
  block: BlockInstance;
  onUpdate?: (block: BlockInstance) => void;
  onRemove?: () => void;
  isEditable?: boolean;
}

export function UniversalBlockRenderer({
  block,
  onUpdate,
  onRemove,
  isEditable = true,
}: UniversalBlockRendererProps) {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [editContent, setEditContent] = useState(block.content);

  // Get the block definition from registry
  const definition = blockRegistry.get(block.type);

  if (!definition) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-red-700">
          ⚠️ Unknown block type: <code className="font-mono">{block.type}</code>
        </p>
      </div>
    );
  }

  // Get the component from the definition
  const BlockComponent = definition.component;

  const handleSave = () => {
    const updatedBlock = {
      ...block,
      content: editContent,
      updatedAt: new Date().toISOString(),
    };

    // Validate before saving
    const validationError = definition.validate?.(updatedBlock);
    if (validationError) {
      alert(validationError);
      return;
    }

    onUpdate?.(updatedBlock);
    setMode('view');
  };

  const handleCancel = () => {
    setEditContent(block.content);
    setMode('view');
  };

  const handleContentChange = (newContent: any) => {
    setEditContent(newContent);
  };

  const handleStartEdit = () => {
    if (isEditable) {
      setEditContent(block.content);
      setMode('edit');
    }
  };

  return (
    <div className="relative group">
      {/* Delete button - appears on hover in view mode */}
      {isEditable && mode === 'view' && onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title="Remove from slide"
        >
          Remove
        </button>
      )}

      {/* The actual block content */}
      <div
        onClick={mode === 'view' ? handleStartEdit : undefined}
        className={mode === 'view' && isEditable ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}
      >
        <BlockComponent
          block={mode === 'edit' ? { ...block, content: editContent } : block}
          mode={mode}
          onContentChange={handleContentChange}
        />
      </div>

      {/* Edit controls - only shown in edit mode */}
      {mode === 'edit' && (
        <div className="flex gap-2 mt-4 p-4 bg-gray-50 border-t">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}