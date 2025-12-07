// ============================================
// IMAGE BLOCK RENDERER - REDESIGNED
// Content-First, Clean, Minimal
// ============================================

import type { BlockRendererProps } from '../../block-registry';
import type { ImageBlockInstance } from '../../types/core';

export function ImageBlockRenderer({
  block,
  mode,
  onContentChange,
}: BlockRendererProps<ImageBlockInstance>) {
  const { resourceId, caption } = block.content;

  // EDIT MODE
  if (mode === 'edit') {
    const handlePaste = async (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            // Convert to base64 data URL
            const reader = new FileReader();
            reader.onload = (event) => {
              const dataUrl = event.target?.result as string;
              onContentChange?.({
                ...block.content,
                resourceId: dataUrl,
              });
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    };

    return (
      <div 
        className="p-6 border-2 border-blue-500 bg-blue-50 rounded space-y-4"
        onPaste={handlePaste}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Edit Image
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="text"
            value={resourceId}
            onChange={(e) => onContentChange?.({
              ...block.content,
              resourceId: e.target.value,
            })}
            placeholder="Paste image URL or Ctrl+V to paste image from clipboard"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-1">
            Paste an image URL or press Ctrl+V/Cmd+V anywhere to paste an image from clipboard
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Caption (optional)
          </label>
          <input
            type="text"
            value={caption || ''}
            onChange={(e) => onContentChange?.({
              ...block.content,
              caption: e.target.value,
            })}
            placeholder="Add a caption for the image"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Preview */}
        {resourceId && (
          <div className="p-4 bg-white rounded border border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Preview:</p>
            <img
              src={resourceId}
              alt={caption || 'Preview'}
              className="max-w-full h-auto rounded"
              onError={(e) => {
                e.currentTarget.src = '';
                e.currentTarget.alt = 'Failed to load image';
              }}
            />
          </div>
        )}
      </div>
    );
  }

  // VIEW MODE - Content-first, fills available space
  if (!resourceId) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-6xl mb-2">🖼️</div>
          <p className="text-lg">No image</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white h-full flex flex-col">
      {/* Image - fills available space */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <img
          src={resourceId}
          alt={caption || 'Image'}
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      
      {/* Caption - if provided */}
      {caption && (
        <div className="mt-3 text-center">
          <p className="text-2xl text-gray-800 font-medium">
            {caption}
          </p>
        </div>
      )}
    </div>
  );
}