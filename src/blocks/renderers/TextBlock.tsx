import { useState } from 'react';
import type { TextBlockInstance } from '../../types/core';

interface TextBlockProps {
  block: TextBlockInstance;
  isEditing?: boolean;
  onUpdate?: (updatedBlock: TextBlockInstance) => void;
  onStartEdit?: () => void;
  onStopEdit?: () => void;
}

export function TextBlock({ 
  block, 
  isEditing = false,
  onUpdate,
  onStartEdit,
  onStopEdit 
}: TextBlockProps) {
  const { text, fontSize, alignment } = block.content;
  const [editText, setEditText] = useState(text);

  // Map fontSize to actual CSS classes
  const fontSizeClass = {
    small: 'text-base',
    medium: 'text-2xl',
    large: 'text-4xl',
  }[fontSize];

  // Map alignment to CSS classes
  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[alignment];

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...block,
        content: {
          ...block.content,
          text: editText,
        },
        updatedAt: new Date().toISOString(),
      });
    }
    if (onStopEdit) {
      onStopEdit();
    }
  };

  const handleCancel = () => {
    setEditText(text); // Reset to original
    if (onStopEdit) {
      onStopEdit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
    // Don't auto-save on Enter for textarea (allow line breaks)
  };

  // EDIT MODE
  if (isEditing) {
    return (
      <div className="p-6 border-2 border-blue-500 bg-blue-50 rounded">
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Text Content
          </label>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your text here..."
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${fontSizeClass} ${alignmentClass}`}
            rows={4}
            autoFocus
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // VIEW MODE
  return (
    <div 
      className={`p-6 ${alignmentClass} cursor-pointer hover:bg-gray-50 transition-colors`}
      onClick={onStartEdit}
    >
      {text ? (
        <p className={`${fontSizeClass} text-gray-900 whitespace-pre-wrap`}>
          {text}
        </p>
      ) : (
        <p className={`${fontSizeClass} text-gray-400 italic`}>
          Click to add text...
        </p>
      )}
    </div>
  );
}