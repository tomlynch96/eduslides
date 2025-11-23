// ============================================
// OBJECTIVES BLOCK RENDERER (Registry-Compatible)
// ============================================
// NOTE: This block is special - it displays lesson-level objectives
// not content stored in the block itself

import type { BlockRendererProps } from '../../block-registry';
import type { ObjectivesBlockInstance } from '../../types/core';

export function ObjectivesBlockRenderer({
  block,
  mode,
  onContentChange,
}: BlockRendererProps<ObjectivesBlockInstance>) {
  const { showCheckboxes } = block.content;

  // EDIT MODE
  if (mode === 'edit') {
    return (
      <div className="p-6 border-2 border-blue-500 bg-blue-50 rounded">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Edit Objectives Block Settings
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700 mb-2">
              This block displays the lesson-level objectives you set in the top menu bar.
            </p>
            <p className="text-xs text-gray-600">
              Use the "Objectives" button in the menu to edit the actual objective list.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="editShowCheckboxes"
              checked={showCheckboxes}
              onChange={(e) => onContentChange?.({
                ...block.content,
                showCheckboxes: e.target.checked,
              })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="editShowCheckboxes" className="text-sm text-gray-700">
              Show interactive checkboxes (allow ticking off during lesson)
            </label>
          </div>
        </div>
      </div>
    );
  }

  // VIEW MODE
  // TODO: This needs access to lessonObjectives and completedObjectives
  // For now, show a placeholder
  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Learning Objectives
      </h3>
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-gray-700">
          Objectives block needs special handling - will be fixed in next iteration.
          Use the "Objectives" button in the top menu to set lesson objectives.
        </p>
      </div>
    </div>
  );
}

// NOTE TO TOM: ObjectivesBlock is special because it needs lesson-level data
// We'll need to pass lessonObjectives and handlers through context or props
// For now this is a placeholder so the app doesn't crash