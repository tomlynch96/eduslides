// ============================================
// IMAGE BLOCK RENDERER (Registry-Compatible)
// ============================================

import type { BlockRendererProps } from '../../block-registry';
import type { ImageBlockInstance } from '../../types/core';

export function ImageBlockRenderer({
  block,
  mode,
  onContentChange,
}: BlockRendererProps<ImageBlockInstance>) {
  const { resourceId, caption, width } = block.content;

  // EDIT MODE
  if (mode === 'edit') {
    return (
      <div className="p-6 border-2 border-blue-500 bg-blue-50 rounded space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL or Resource ID
          </label>
          <input
            type="text"
            value={resourceId}
            onChange={(e) => onContentChange?.({
              ...block.content,
              resourceId: e.target.value,
            })}
            placeholder="Enter image URL or paste image"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-1">
            Paste an image URL or use copy/paste for images
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Width (%)
          </label>
          <input
            type="number"
            value={width || 100}
            onChange={(e) => onContentChange?.({
              ...block.content,
              width: parseInt(e.target.value) || 100,
            })}
            min="10"
            max="100"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            How wide should the image be? (10-100%)
          </p>
        </div>
      </div>
    );
  }

  // VIEW MODE
  if (!resourceId) {
    return (
      <div className="p-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <div className="text-4xl mb-2">🖼️</div>
          <p className="text-gray-500">No image selected</p>
          <p className="text-xs text-gray-400 mt-1">Click to add an image</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col items-center">
        <img
          src={resourceId}
          alt={caption || 'Image'}
          style={{ width: `${width || 100}%` }}
          className="rounded-lg shadow-md"
        />
        {caption && (
          <p className="mt-3 text-sm text-gray-600 text-center italic">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}