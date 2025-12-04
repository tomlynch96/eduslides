import { blockRegistry } from '../block-registry';
import type { BlockInstance } from '../types/core';

interface BlockEditModalProps {
  block: BlockInstance;
  onClose: () => void;
  onUpdate: (block: BlockInstance) => void;
}

export function BlockEditModal({ block, onClose, onUpdate }: BlockEditModalProps) {
  const blockDef = blockRegistry.get(block.type);

  if (!blockDef) return null;

  const Component = blockDef.component;

  const handleContentChange = (newContent: typeof block.content) => {
    onUpdate({
      ...block,
      content: newContent,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {blockDef.icon} Edit {blockDef.label}
            </h2>
            <p className="text-sm text-gray-500">{blockDef.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Modal Content - Edit Mode Renderer */}
        <div className="p-6">
          <Component
            block={block}
            mode="edit"
            onContentChange={handleContentChange}
          />
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}