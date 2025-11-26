// ============================================
// TEXT BLOCK RENDERER (Registry-Compatible)
// ============================================
// Notice: No state management, just pure rendering!

import type { BlockRendererProps } from '../../block-registry';
import type { TextBlockInstance } from '../../types/core';

export function TextBlockRenderer({
  block,
  mode,
  onContentChange,
}: BlockRendererProps<TextBlockInstance>) {
  const { text, fontSize, alignment } = block.content;

  // Map fontSize to CSS classes
  const fontSizeClass: Record<'small' | 'medium' | 'large', string> = {
    small: 'text-base',
    medium: 'text-2xl',
    large: 'text-4xl',
  };

  // Map alignment to CSS classes
  const alignmentClass: Record<'left' | 'center' | 'right', string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  // EDIT MODE
  if (mode === 'edit') {
    return (
      <div className="p-6 border-2 border-blue-500 bg-blue-50 rounded space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Text Content
          </label>
          <textarea
            value={text}
            onChange={(e) => onContentChange?.({
              ...block.content,
              text: e.target.value,
            })}
            placeholder="Type your text here..."
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${fontSizeClass[fontSize]} ${alignmentClass[alignment]}`}
            rows={4}
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Font Size
            </label>
            <select
              value={fontSize}
              onChange={(e) => onContentChange?.({
                ...block.content,
                fontSize: e.target.value as 'small' | 'medium' | 'large',
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Alignment
            </label>
            <select
              value={alignment}
              onChange={(e) => onContentChange?.({
                ...block.content,
                alignment: e.target.value as 'left' | 'center' | 'right',
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  // VIEW MODE
  return (
    <div className={`p-6 ${alignmentClass[alignment]}`}>
      {text ? (
        <div className={`${fontSizeClass[fontSize]} text-gray-900 whitespace-pre-wrap`}>
          {text}
        </div>
      ) : (
        <div className="text-gray-400 italic">
          Click to add text content
        </div>
      )}
    </div>
  );
}